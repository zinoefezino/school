import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/mongodb";
import { getSession } from "../../../../../lib/session";
import Student from "../../../../../models/Student";
import Attendance from "../../../../../models/Attendance";

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

  const records = await Attendance.find({ student: student._id })
    .sort({ date: -1 })
    .populate("term", "name")
    .lean();
  const present = records.filter((record) => record.status === "PRESENT").length;
  const absent = records.filter((record) => record.status === "ABSENT").length;

  return NextResponse.json({
    summary: {
      total: records.length,
      present,
      absent,
      rate: records.length ? Math.round((present / records.length) * 100) : 0,
    },
    records,
  });
}
