import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import { getSession } from "../../../../lib/session";
import Student from "../../../../models/Student";
import Enrollment from "../../../../models/Enrollment";

export async function GET(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN")
    return NextResponse.json(
      { error: "Admin authentication is required." },
      { status: 401 },
    );
  const params = new URL(request.url).searchParams;
  const search = params.get("search")?.trim();
  const page = Math.max(Number(params.get("page") ?? 1), 1);
  const limit = Math.min(Math.max(Number(params.get("limit") ?? 25), 1), 100);
  await connectDB();
  const query = search
    ? {
        $or: [
          { fullName: { $regex: search, $options: "i" } },
          { admissionNumber: { $regex: search, $options: "i" } },
        ],
      }
    : {};
  const [students, total] = await Promise.all([
    Student.find(query)
      .select("fullName admissionNumber guardian")
      .populate("guardian", "fullName")
      .sort({ fullName: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Student.countDocuments(query),
  ]);
  const studentIds = students.map((student) => student._id);
  const enrollments = await Enrollment.find({
    student: { $in: studentIds },
    status: "ACTIVE",
  })
    .populate({
      path: "classSection",
      populate: { path: "classLevel", select: "name" },
      select: "name classLevel",
    })
    .lean();
  const rows = students.map((student) => {
    const enrollment = enrollments.find(
      (item) => item.student.toString() === student._id.toString(),
    );
    const section = enrollment?.classSection as
      | { name?: string; classLevel?: { name?: string } }
      | undefined;
    return {
      ...student,
      classSection: section
        ? `${section.classLevel?.name ?? ""} ${section.name ?? ""}`.trim()
        : "Unassigned",
      guardianName:
        (student.guardian as { fullName?: string } | null)?.fullName ??
        "Not linked",
      status: "Active",
    };
  });
  return NextResponse.json({
    students: rows,
    page,
    limit,
    total,
    pages: Math.ceil(total / limit),
  });
}
