import { NextResponse } from "next/server";
import { Types } from "mongoose";
import { connectDB } from "../../../../lib/mongodb";
import { getSession } from "../../../../lib/session";
import TeachingAssignment from "../../../../models/TeachingAssignment";
import TimetableEntry, {
  type TimetableDay,
} from "../../../../models/TimetableEntry";

const days: TimetableDay[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

async function requireAdmin() {
  const session = await getSession();
  return session?.role === "ADMIN";
}

export async function GET() {
  if (!(await requireAdmin()))
    return NextResponse.json(
      { error: "Admin authentication is required." },
      { status: 401 },
    );
  await connectDB();
  const timetable = await TimetableEntry.find()
    .populate("subject", "name")
    .populate("teacher", "fullName")
    .populate({
      path: "classSection",
      select: "name classLevel",
      populate: { path: "classLevel", select: "name" },
    })
    .sort({ day: 1, startTime: 1 })
    .lean();
  return NextResponse.json({ timetable });
}

export async function POST(request: Request) {
  if (!(await requireAdmin()))
    return NextResponse.json(
      { error: "Admin authentication is required." },
      { status: 401 },
    );
  const body = await request.json();
  if (
    typeof body.classSectionId !== "string" ||
    typeof body.subjectId !== "string" ||
    typeof body.day !== "string" ||
    typeof body.startTime !== "string" ||
    typeof body.endTime !== "string" ||
    !days.includes(body.day as TimetableDay) ||
    !Types.ObjectId.isValid(body.classSectionId) ||
    !Types.ObjectId.isValid(body.subjectId)
  )
    return NextResponse.json(
      { error: "Class, subject, day, start time, and end time are required." },
      { status: 400 },
    );
  await connectDB();
  const teachingAssignment = await TeachingAssignment.findOne({
    classSection: body.classSectionId,
    subject: body.subjectId,
  })
    .select("teacher")
    .lean();
  const teacher =
    typeof body.teacherId === "string" && Types.ObjectId.isValid(body.teacherId)
      ? body.teacherId
      : teachingAssignment?.teacher;
  const entry = await TimetableEntry.create({
    classSection: body.classSectionId,
    term: Types.ObjectId.isValid(body.termId) ? body.termId : undefined,
    subject: body.subjectId,
    teacher,
    day: body.day,
    startTime: body.startTime,
    endTime: body.endTime,
    room: typeof body.room === "string" ? body.room.trim() : "",
  });
  return NextResponse.json({ entry }, { status: 201 });
}
