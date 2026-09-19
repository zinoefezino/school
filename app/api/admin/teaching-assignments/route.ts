import { NextResponse } from "next/server";
import { Types } from "mongoose";
import { connectDB } from "../../../../lib/mongodb";
import { getSession } from "../../../../lib/session";
import TeachingAssignment from "../../../../models/TeachingAssignment";

async function requireAdmin() {
  const session = await getSession();
  return session?.role === "ADMIN" ? session : null;
}

export async function GET() {
  const session = await requireAdmin();
  if (!session)
    return NextResponse.json(
      { error: "Admin authentication is required." },
      { status: 401 },
    );

  await connectDB();
  const teachingAssignments = await TeachingAssignment.find()
    .populate("subject", "name code")
    .populate("teacher", "fullName")
    .populate({
      path: "classSection",
      select: "name classLevel classTeacher",
      populate: [
        { path: "classLevel", select: "name" },
        { path: "classTeacher", select: "fullName" },
      ],
    })
    .sort({ updatedAt: -1 })
    .lean();

  return NextResponse.json({ teachingAssignments });
}

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session)
    return NextResponse.json(
      { error: "Admin authentication is required." },
      { status: 401 },
    );

  const body = await request.json();
  if (
    typeof body.classSectionId !== "string" ||
    typeof body.subjectId !== "string" ||
    typeof body.teacherId !== "string" ||
    !Types.ObjectId.isValid(body.classSectionId) ||
    !Types.ObjectId.isValid(body.subjectId) ||
    !Types.ObjectId.isValid(body.teacherId)
  )
    return NextResponse.json(
      { error: "Class, subject, and teacher are required." },
      { status: 400 },
    );

  await connectDB();
  const teachingAssignment = await TeachingAssignment.findOneAndUpdate(
    {
      classSection: body.classSectionId,
      subject: body.subjectId,
    },
    {
      $set: {
        classSection: body.classSectionId,
        subject: body.subjectId,
        teacher: body.teacherId,
        assignedBy: session.userId,
      },
    },
    { new: true, upsert: true, runValidators: true },
  ).lean();

  return NextResponse.json({ teachingAssignment }, { status: 201 });
}
