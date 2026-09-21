import { NextResponse } from "next/server";
import { Types } from "mongoose";
import { connectDB } from "../../../../lib/mongodb";
import { getSession } from "../../../../lib/session";
import ClassLevel from "../../../../models/ClassLevel";
import ClassSection from "../../../../models/ClassSection";
import Staff from "../../../../models/Staff";
import Subject from "../../../../models/Subject";
import TeachingAssignment from "../../../../models/TeachingAssignment";

async function requireAdmin() {
  const session = await getSession();
  return session?.role === "ADMIN" ? session : null;
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function GET(request: Request) {
  const session = await requireAdmin();
  if (!session)
    return NextResponse.json(
      { error: "Admin authentication is required." },
      { status: 401 },
    );

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search")?.trim() ?? "";
  const requestedPage = Number(searchParams.get("page") ?? "1");
  const requestedLimit = Number(searchParams.get("limit") ?? "25");
  const page =
    Number.isFinite(requestedPage) && requestedPage > 0
      ? Math.floor(requestedPage)
      : 1;
  const limit =
    Number.isFinite(requestedLimit) && requestedLimit > 0
      ? Math.min(Math.floor(requestedLimit), 100)
      : 25;

  await connectDB();
  let query = {};

  if (search) {
    const regex = new RegExp(escapeRegex(search), "i");
    const [subjects, teachers, classLevels] = await Promise.all([
      Subject.find({ $or: [{ name: regex }, { code: regex }] })
        .select("_id")
        .lean(),
      Staff.find({ fullName: regex }).select("_id").lean(),
      ClassLevel.find({ name: regex }).select("_id").lean(),
    ]);
    const classSections = await ClassSection.find({
      $or: [
        { name: regex },
        { classLevel: { $in: classLevels.map((item) => item._id) } },
      ],
    })
      .select("_id")
      .lean();

    query = {
      $or: [
        { subject: { $in: subjects.map((item) => item._id) } },
        { teacher: { $in: teachers.map((item) => item._id) } },
        { classSection: { $in: classSections.map((item) => item._id) } },
      ],
    };
  }

  const [teachingAssignments, total] = await Promise.all([
    TeachingAssignment.find(query)
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
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    TeachingAssignment.countDocuments(query),
  ]);

  return NextResponse.json({
    teachingAssignments,
    total,
    page,
    limit,
    pages: Math.max(Math.ceil(total / limit), 1),
  });
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
