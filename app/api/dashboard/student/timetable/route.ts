import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/mongodb";
import { getSession } from "../../../../../lib/session";
import Student from "../../../../../models/Student";
import Enrollment from "../../../../../models/Enrollment";
import TimetableEntry from "../../../../../models/TimetableEntry";

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
  if (!enrollment) return NextResponse.json({ timetable: [] });

  const timetable = await TimetableEntry.find({
    classSection: enrollment.classSection,
    $or: [{ term: enrollment.term }, { term: { $exists: false } }, { term: null }],
  })
    .populate("subject", "name")
    .populate("teacher", "fullName")
    .sort({ day: 1, startTime: 1 })
    .lean();

  return NextResponse.json({ timetable });
}
