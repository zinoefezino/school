import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/mongodb";
import { getSession } from "../../../../../lib/session";
import Student from "../../../../../models/Student";
import Attendance from "../../../../../models/Attendance";
import Invoice from "../../../../../models/Invoice";
import Payment from "../../../../../models/Payment";
import Assessment from "../../../../../models/Assessment";
import Term from "../../../../../models/Term";
import Enrollment from "../../../../../models/Enrollment";
import "../../../../../models/Guardian";
import "../../../../../models/User";
import "../../../../../models/ClassSection";
import "../../../../../models/ClassLevel";
import "../../../../../models/AcademicSession";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "STUDENT")
    return NextResponse.json(
      { error: "Student authentication is required." },
      { status: 401 },
    );
  try {
    await connectDB();
    const student = await Student.findOne({ user: session.userId })
      .select("fullName admissionNumber dateOfBirth gender photoUrl guardian")
      .populate({
        path: "guardian",
        select: "fullName phone user",
        populate: { path: "user", select: "email" },
      })
      .lean();
    if (!student)
      return NextResponse.json(
        {
          error:
            "Student profile not found. Link this login account to a student record.",
        },
        { status: 404 },
      );
    const [
      attendance,
      totalAttendance,
      invoice,
      resultTerm,
      enrollment,
      previousEnrollment,
    ] =
      await Promise.all([
        Attendance.countDocuments({ student: student._id, status: "PRESENT" }),
        Attendance.countDocuments({ student: student._id }),
        Invoice.findOne({ student: student._id })
          .sort({ dueDate: -1 })
          .select("amount status")
          .lean(),
        Term.findOne({ resultsPublished: true })
          .sort({ _id: -1 })
          .select("name session")
          .populate("session", "name")
          .lean(),
        Enrollment.findOne({ student: student._id, status: "ACTIVE" })
          .populate({
            path: "classSection",
            select: "name classLevel",
            populate: { path: "classLevel", select: "name" },
          })
          .populate({
            path: "term",
            select: "name session",
            populate: { path: "session", select: "name" },
          })
          .lean(),
        Enrollment.findOne({ student: student._id, status: "COMPLETED" })
          .sort({ _id: -1 })
          .populate({
            path: "classSection",
            select: "name classLevel",
            populate: { path: "classLevel", select: "name" },
          })
          .lean(),
      ]);
    const displayTerm =
      (enrollment?.term as
        | { _id?: unknown; name?: string; session?: { name?: string } }
        | undefined) ?? resultTerm;
    const assessments = resultTerm
      ? await Assessment.find({ student: student._id, term: resultTerm._id })
          .select("score")
          .lean()
      : [];
    const paidAmount = invoice
      ? await Payment.find({ invoice: invoice._id }).then((payments) =>
          payments.reduce((sum, payment) => sum + payment.amount, 0),
        )
      : 0;
    const feesBalance = invoice
      ? Math.max(invoice.amount - paidAmount, 0)
      : null;
    return NextResponse.json({
      student,
      fullName: student.fullName,
      admissionNumber: student.admissionNumber,
      dateOfBirth: student.dateOfBirth,
      gender: student.gender,
      photoUrl: student.photoUrl,
      guardian: student.guardian,
      enrollment,
      previousEnrollment,
      academicStatus: enrollment
        ? previousEnrollment
          ? "PROMOTED"
          : "ACTIVE"
        : previousEnrollment
          ? "COMPLETED"
          : "UNASSIGNED",
      term: displayTerm,
      attendance: totalAttendance
        ? Math.round((attendance / totalAttendance) * 100)
        : 0,
      feesBalance,
      pendingAssignments: null,
      average: assessments.length
        ? Math.round(
            assessments.reduce((sum, item) => sum + item.score, 0) /
              assessments.length,
          )
        : null,
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to load student dashboard overview." },
      { status: 500 },
    );
  }
}
