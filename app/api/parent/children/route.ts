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
import Payment from "../../../../models/Payment";
import "../../../../models/User";
import "../../../../models/ClassSection";
import "../../../../models/ClassLevel";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export async function GET() {
  try {
    const guardianId = await getGuardianId();
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
        Enrollment.find({ student: { $in: childIds } })
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
    const payments = await Payment.find({
      invoice: { $in: invoices.map((invoice) => invoice._id) },
    })
      .select("invoice amount")
      .lean();
    const paymentsByInvoice = new Map<string, number>();
    payments.forEach((payment) => {
      const key = payment.invoice.toString();
      paymentsByInvoice.set(
        key,
        (paymentsByInvoice.get(key) ?? 0) + payment.amount,
      );
    });

    const summaries = children.map((child) => {
      const childId = child._id.toString();
      const activeEnrollment = enrollments.find(
        (item) =>
          item.student.toString() === childId && item.status === "ACTIVE",
      );
      const previousEnrollment = enrollments
        .filter(
          (item) =>
            item.student.toString() === childId && item.status === "COMPLETED",
        )
        .at(-1);
      const classSection = activeEnrollment?.classSection as
        | {
            name?: string;
            classLevel?: { name?: string };
          }
        | undefined;
      const previousClassSection = previousEnrollment?.classSection as
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
      const paidAmount = latestInvoice
        ? (paymentsByInvoice.get(latestInvoice._id.toString()) ?? 0)
        : 0;
      const balance = latestInvoice
        ? latestInvoice.status === "PAID"
          ? 0
          : Math.max(latestInvoice.amount - paidAmount, 0)
        : null;
      const billPaid = latestInvoice
        ? latestInvoice.status === "PAID" ||
          (latestInvoice.amount > 0 && paidAmount >= latestInvoice.amount)
        : false;
      const previousClassName = previousClassSection
        ? `${previousClassSection.classLevel?.name ?? ""} ${
            previousClassSection.name ?? ""
          }`.trim()
        : "";
      const academicStatus = activeEnrollment
        ? previousEnrollment
          ? "PROMOTED"
          : "ACTIVE"
        : previousEnrollment
          ? "COMPLETED"
          : "UNASSIGNED";

      return {
        id: childId,
        _id: childId,
        name: child.fullName,
        fullName: child.fullName,
        admissionNumber: child.admissionNumber,
        classSection: classSection
          ? `${classSection.classLevel?.name ?? ""} ${classSection.name ?? ""}`.trim()
          : "Not assigned",
        academicStatus,
        previousClassName,
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
        hasBill: Boolean(latestInvoice),
        billPaid,
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
