import { NextResponse } from "next/server";
import { Types } from "mongoose";
import { connectDB } from "../../../../../lib/mongodb";
import { getSession } from "../../../../../lib/session";
import Staff from "../../../../../models/Staff";
import TeachingAssignment from "../../../../../models/TeachingAssignment";
import TimetableEntry, {
  type TimetableDay,
} from "../../../../../models/TimetableEntry";
import "../../../../../models/Subject";
import "../../../../../models/ClassSection";
import "../../../../../models/ClassLevel";

const days: TimetableDay[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

async function getStaff(userId: string) {
  return Staff.findOne({ user: userId }).select("_id").lean();
}

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "STAFF")
    return NextResponse.json(
      { error: "Staff authentication is required." },
      { status: 401 },
    );

  await connectDB();
  const staff = await getStaff(session.userId);
  if (!staff) return NextResponse.json({ timetable: [] });
  const timetable = await TimetableEntry.find({ teacher: staff._id })
    .populate("subject", "name")
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
  const session = await getSession();
  if (!session || session.role !== "STAFF")
    return NextResponse.json(
      { error: "Staff authentication is required." },
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
  const staff = await getStaff(session.userId);
  if (!staff)
    return NextResponse.json(
      { error: "Staff profile not found." },
      { status: 404 },
    );
  const teachingAssignment = await TeachingAssignment.findOne({
    classSection: body.classSectionId,
    subject: body.subjectId,
    teacher: staff._id,
  }).lean();
  if (!teachingAssignment)
    return NextResponse.json(
      {
        error:
          "Only the assigned subject teacher can create timetable entries for this class and subject.",
      },
      { status: 403 },
    );

  const entry = await TimetableEntry.create({
    classSection: body.classSectionId,
    term: Types.ObjectId.isValid(body.termId) ? body.termId : undefined,
    subject: body.subjectId,
    teacher: staff._id,
    day: body.day,
    startTime: body.startTime,
    endTime: body.endTime,
    room: typeof body.room === "string" ? body.room.trim() : "",
  });
  return NextResponse.json({ entry }, { status: 201 });
}
