import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/mongodb";
import { getSession } from "../../../../../lib/session";
import Student from "../../../../../models/Student";
import Enrollment from "../../../../../models/Enrollment";
import Subject from "../../../../../models/Subject";

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

  const [enrollment, subjects] = await Promise.all([
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
    Subject.find().sort({ name: 1 }).select("name code").lean(),
  ]);

  return NextResponse.json({ enrollment, subjects });
}
