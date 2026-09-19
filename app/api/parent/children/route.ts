import { NextResponse } from "next/server";
import {
  getGuardianId,
  unauthorizedParentResponse,
} from "../../../../lib/parent-access";
import Student from "../../../../models/Student";
import Guardian from "../../../../models/Guardian";
import Enrollment from "../../../../models/Enrollment";
import Attendance from "../../../../models/Attendance";
import Assessment from "../../../../models/Assessment";
import Invoice from "../../../../models/Invoice";
import Term from "../../../../models/Term";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export async function GET(request: Request) {
  try {
    const guardianId = await getGuardianId(request);
    if (!guardianId) return unauthorizedParentResponse();

    const [parent, children] = await Promise.all([
      Guardian.findById(guardianId)
        .select("fullName user")
        .populate("user", "email")
        .lean(),
      Student.find({ guardian: guardianId })
        .select("_id fullName admissionNumber guardian")
        .lean(),
    ]);
    const childIds = children.map((child) => child._id);
    const publishedTerms = await Term.find({ resultsPublished: true })
      .select("_id")
      .lean();
    const publishedTermIds = publishedTerms.map((term) => term._id);
    const [enrollments, attendanceRecords, assessments, invoices] =
      await Promise.all([
        Enrollment.find({ student: { $in: childIds }, status: "ACTIVE" })
          .populate({
            path: "classSection",
            select: "name classLevel",
            populate: { path: "classLevel", select: "name" },
          })
          .lean(),
        Attendance.find({ student: { $in: childIds } })
          .select("student status")
          .lean(),
        Assessment.find({
          student: { $in: childIds },
          term: { $in: publishedTermIds },
        })
          .select("student score")
          .lean(),
        Invoice.find({ student: { $in: childIds } })
          .sort({ dueDate: -1 })
          .select("student amount status dueDate")
          .lean(),
      ]);

    const summaries = children.map((child) => {
      const childId = child._id.toString();
      const enrollment = enrollments.find(
        (item) => item.student.toString() === childId,
      );
      const classSection = enrollment?.classSection as
        | {
            name?: string;
            classLevel?: { name?: string };
          }
        | undefined;
      const childAttendance = attendanceRecords.filter(
        (item) => item.student.toString() === childId,
      );
      const present = childAttendance.filter(
        (item) => item.status === "PRESENT",
      ).length;
      const childAssessments = assessments.filter(
        (item) => item.student.toString() === childId,
      );
      const latestInvoice = invoices.find(
        (item) => item.student.toString() === childId,
      );
      const balance = latestInvoice?.status === "PAID"
        ? 0
        : (latestInvoice?.amount ?? 0);

      return {
        id: childId,
        _id: childId,
        name: child.fullName,
        fullName: child.fullName,
        admissionNumber: child.admissionNumber,
        classSection: classSection
          ? `${classSection.classLevel?.name ?? ""} ${classSection.name ?? ""}`.trim()
          : "Not assigned",
        attendance: childAttendance.length
          ? `${Math.round((present / childAttendance.length) * 100)}%`
          : "0%",
        average: childAssessments.length
          ? `${Math.round(
              childAssessments.reduce((sum, item) => sum + item.score, 0) /
                childAssessments.length,
            )}%`
          : "-",
        balance,
        dueDate: latestInvoice?.dueDate
          ? new Date(latestInvoice.dueDate).toLocaleDateString()
          : "No due date",
        avatar: initials(child.fullName),
      };
    });

    return NextResponse.json({
      parent: parent
        ? {
            fullName: parent.fullName,
            email: (parent.user as { email?: string } | undefined)?.email ?? "",
          }
        : null,
      children: summaries,
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to load children." },
      { status: 500 },
    );
  }
}
