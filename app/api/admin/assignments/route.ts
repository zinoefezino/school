import { NextResponse } from "next/server";
import { Types } from "mongoose";
import { connectDB } from "../../../../lib/mongodb";
import { getSession } from "../../../../lib/session";
import Assignment from "../../../../models/Assignment";
import TeachingAssignment from "../../../../models/TeachingAssignment";

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
  const assignments = await Assignment.find()
    .populate("subject", "name")
    .populate("teacher", "fullName")
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
  if (!(await requireAdmin()))
    return NextResponse.json(
      { error: "Admin authentication is required." },
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
  const assignment = await Assignment.create({
    title: body.title.trim(),
    description:
      typeof body.description === "string" ? body.description.trim() : "",
    classSection: body.classSectionId,
    subject: body.subjectId,
    term: body.termId,
    teacher,
    dueDate: new Date(`${body.dueDate}T00:00:00.000Z`),
    status: "PUBLISHED",
    submittedBy: [],
  });
  return NextResponse.json({ assignment }, { status: 201 });
}
