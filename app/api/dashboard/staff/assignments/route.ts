import { NextResponse } from "next/server";
import { Types } from "mongoose";
import { connectDB } from "../../../../../lib/mongodb";
import { getSession } from "../../../../../lib/session";
import Staff from "../../../../../models/Staff";
import Assignment from "../../../../../models/Assignment";
import TeachingAssignment from "../../../../../models/TeachingAssignment";

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
  if (!staff) return NextResponse.json({ assignments: [] });
  const assignments = await Assignment.find({ teacher: staff._id })
    .populate("subject", "name")
    .populate({
      path: "classSection",
      select: "name classLevel",
      populate: { path: "classLevel", select: "name" },
    })
    .sort({ dueDate: 1 })
    .lean();
  return NextResponse.json({ assignments });
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
    typeof body.title !== "string" ||
    !body.title.trim() ||
    typeof body.classSectionId !== "string" ||
    typeof body.subjectId !== "string" ||
    typeof body.termId !== "string" ||
    typeof body.dueDate !== "string" ||
    !Types.ObjectId.isValid(body.classSectionId) ||
    !Types.ObjectId.isValid(body.subjectId) ||
    !Types.ObjectId.isValid(body.termId)
  )
    return NextResponse.json(
      { error: "Title, class, subject, term, and due date are required." },
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
          "Only the assigned subject teacher can create assignments for this class and subject.",
      },
      { status: 403 },
    );

  const assignment = await Assignment.create({
    title: body.title.trim(),
    description:
      typeof body.description === "string" ? body.description.trim() : "",
    classSection: body.classSectionId,
    subject: body.subjectId,
    term: body.termId,
    teacher: staff._id,
    dueDate: new Date(`${body.dueDate}T00:00:00.000Z`),
    status: "PUBLISHED",
    submittedBy: [],
  });
  return NextResponse.json({ assignment }, { status: 201 });
}
