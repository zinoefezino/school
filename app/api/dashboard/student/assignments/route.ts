import { NextResponse } from "next/server";
import { Types } from "mongoose";
import { connectDB } from "../../../../../lib/mongodb";
import { getSession } from "../../../../../lib/session";
import Student from "../../../../../models/Student";
import Enrollment from "../../../../../models/Enrollment";
import Assignment from "../../../../../models/Assignment";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "STUDENT")
    return NextResponse.json(
      { error: "Student authentication is required." },
      { status: 401 },
    );

  await connectDB();
  const student = await Student.findOne({ user: session.userId })
    .select("_id")
    .lean();
  if (!student)
    return NextResponse.json(
      { error: "Student profile not found." },
      { status: 404 },
    );

  const enrollment = await Enrollment.findOne({
    student: student._id,
    status: "ACTIVE",
  })
    .select("classSection term")
    .lean();
  if (!enrollment) return NextResponse.json({ assignments: [] });

  const assignments = await Assignment.find({
    classSection: enrollment.classSection,
    term: enrollment.term,
    status: "PUBLISHED",
  })
    .populate("subject", "name")
    .populate("teacher", "fullName")
    .sort({ dueDate: 1 })
    .lean();

  return NextResponse.json({
    assignments: assignments.map((assignment) => ({
      ...assignment,
      studentStatus: (assignment.submittedBy as Types.ObjectId[]).some(
        (studentId) => studentId.equals(student._id),
      )
        ? "Submitted"
        : "Pending",
    })),
  });
}
