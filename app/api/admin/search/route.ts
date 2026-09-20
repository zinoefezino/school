import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import { getSession } from "../../../../lib/session";
import Announcement from "../../../../models/Announcement";
import ClassSection from "../../../../models/ClassSection";
import Guardian from "../../../../models/Guardian";
import Invoice from "../../../../models/Invoice";
import NewsPost from "../../../../models/NewsPost";
import Staff from "../../../../models/Staff";
import Student from "../../../../models/Student";
import "../../../../models/AcademicSession";
import "../../../../models/ClassLevel";
import "../../../../models/Term";

type SearchResult = {
  id: string;
  type: string;
  title: string;
  subtitle: string;
  href: string;
};

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function classLabel(item?: {
  name?: string;
  classLevel?: { name?: string } | null;
}) {
  return [item?.classLevel?.name, item?.name].filter(Boolean).join(" ");
}

export async function GET(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN")
    return NextResponse.json(
      { error: "Admin authentication is required." },
      { status: 401 },
    );

  const params = new URL(request.url).searchParams;
  const query = params.get("q")?.trim() ?? "";
  if (query.length < 2) return NextResponse.json({ results: [] });

  const regex = new RegExp(escapeRegex(query), "i");
  await connectDB();

  const [students, staff, parents, classes, announcements, news] =
    await Promise.all([
      Student.find({
        $or: [{ fullName: regex }, { admissionNumber: regex }],
      })
        .select("_id fullName admissionNumber")
        .sort({ fullName: 1 })
        .limit(5)
        .lean(),
      Staff.find({
        $or: [{ fullName: regex }, { department: regex }, { phone: regex }],
      })
        .select("_id fullName department")
        .sort({ fullName: 1 })
        .limit(5)
        .lean(),
      Guardian.find({ $or: [{ fullName: regex }, { phone: regex }] })
        .select("_id fullName phone")
        .sort({ fullName: 1 })
        .limit(5)
        .lean(),
      ClassSection.find({ name: regex })
        .select("_id name classLevel classTeacher")
        .populate("classLevel", "name")
        .populate("classTeacher", "fullName")
        .sort({ name: 1 })
        .limit(5)
        .lean(),
      Announcement.find({ $or: [{ title: regex }, { body: regex }] })
        .select("_id title audiences publishedAt")
        .sort({ publishedAt: -1 })
        .limit(5)
        .lean(),
      NewsPost.find({
        $or: [{ title: regex }, { excerpt: regex }, { category: regex }],
      })
        .select("_id title slug status category")
        .sort({ publishedAt: -1, createdAt: -1 })
        .limit(5)
        .lean(),
    ]);

  const invoiceStudents = await Student.find({
    $or: [{ fullName: regex }, { admissionNumber: regex }],
  })
    .select("_id")
    .limit(20)
    .lean();
  const invoiceClasses = await ClassSection.find({ name: regex })
    .select("_id")
    .limit(20)
    .lean();
  const invoices = await Invoice.find({
    $or: [
      { student: { $in: invoiceStudents.map((student) => student._id) } },
      { classSection: { $in: invoiceClasses.map((item) => item._id) } },
      ...(query.toUpperCase() === "PAID" ||
      query.toUpperCase() === "PENDING" ||
      query.toUpperCase() === "OVERDUE"
        ? [{ status: query.toUpperCase() }]
        : []),
    ],
  })
    .select("_id amount status student classSection")
    .populate("student", "fullName")
    .populate({
      path: "classSection",
      select: "name classLevel",
      populate: { path: "classLevel", select: "name" },
    })
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  const results: SearchResult[] = [
    ...students.map((student) => ({
      id: student._id.toString(),
      type: "Student",
      title: student.fullName,
      subtitle: `Admission no. ${student.admissionNumber}`,
      href: `/dashboard/admin/students/${student._id}/edit`,
    })),
    ...staff.map((member) => ({
      id: member._id.toString(),
      type: "Staff",
      title: member.fullName,
      subtitle: member.department ?? "Staff profile",
      href: `/dashboard/admin/staff/${member._id}/edit`,
    })),
    ...parents.map((parent) => ({
      id: parent._id.toString(),
      type: "Parent",
      title: parent.fullName,
      subtitle: parent.phone ?? "Parent or guardian",
      href: "/dashboard/admin/students",
    })),
    ...classes.map((item) => ({
      id: item._id.toString(),
      type: "Class",
      title: classLabel(item) || item.name,
      subtitle:
        (item.classTeacher as { fullName?: string } | undefined)?.fullName ??
        "Class teacher unassigned",
      href: `/dashboard/admin/classes/${item._id}/edit`,
    })),
    ...invoices.map((invoice) => ({
      id: invoice._id.toString(),
      type: "Invoice",
      title:
        (invoice.student as { fullName?: string } | undefined)?.fullName ??
        "Student invoice",
      subtitle: `${invoice.status} · ₦${invoice.amount.toLocaleString("en-NG")} · ${classLabel(invoice.classSection as Parameters<typeof classLabel>[0])}`,
      href: "/dashboard/admin/finance/invoices",
    })),
    ...announcements.map((announcement) => ({
      id: announcement._id.toString(),
      type: "Announcement",
      title: announcement.title,
      subtitle: announcement.audiences.join(", "),
      href: "/dashboard/admin/communications/announcements",
    })),
    ...news.map((post) => ({
      id: post._id.toString(),
      type: "News",
      title: post.title,
      subtitle: [post.status, post.category].filter(Boolean).join(" · "),
      href: "/dashboard/admin/communications/news",
    })),
  ].slice(0, 12);

  return NextResponse.json({ results });
}
