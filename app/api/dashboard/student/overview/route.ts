import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/mongodb";
import { getSession } from "../../../../../lib/session";
import Student from "../../../../../models/Student";
import Attendance from "../../../../../models/Attendance";
import Invoice from "../../../../../models/Invoice";
import Assessment from "../../../../../models/Assessment";
import Term from "../../../../../models/Term";
import Enrollment from "../../../../../models/Enrollment";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "STUDENT")
    return NextResponse.json(
      { error: "Student authentication is required." },
      { status: 401 },
    );
  await connectDB();
  const student = await Student.findOne({ user: session.userId })
    .select("fullName admissionNumber dateOfBirth gender photoUrl")
    .lean();
  if (!student)
    return NextResponse.json(
      { error: "Student profile not found." },
      { status: 404 },
    );
  const [attendance, totalAttendance, invoice, term, enrollment] =
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
        .lean(),
    ]);
  const assessments = term
    ? await Assessment.find({ student: student._id, term: term._id })
        .select("score")
        .lean()
    : [];
  return NextResponse.json({
    student,
    fullName: student.fullName,
    admissionNumber: student.admissionNumber,
    dateOfBirth: student.dateOfBirth,
    gender: student.gender,
    photoUrl: student.photoUrl,
    enrollment,
    term,
    attendance: totalAttendance
      ? Math.round((attendance / totalAttendance) * 100)
      : 0,
    feesBalance: invoice?.status === "PAID" ? 0 : (invoice?.amount ?? 0),
    pendingAssignments: null,
    average: assessments.length
      ? Math.round(
          assessments.reduce((sum, item) => sum + item.score, 0) /
            assessments.length,
        )
      : null,
  });
}
