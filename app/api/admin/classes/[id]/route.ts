import { NextResponse } from "next/server";
import { Types } from "mongoose";
import { connectDB } from "../../../../../lib/mongodb";
import { getSession } from "../../../../../lib/session";
import ClassSection from "../../../../../models/ClassSection";
import Enrollment from "../../../../../models/Enrollment";
import Staff from "../../../../../models/Staff";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN")
    return NextResponse.json(
      { error: "Admin authentication is required." },
      { status: 401 },
    );
  const { id } = await context.params;
  const body = await request.json();
  await connectDB();
  if (body.action === "delete") {
    const activeEnrollment = await Enrollment.exists({
      classSection: id,
      status: "ACTIVE",
    });
    if (activeEnrollment)
      return NextResponse.json(
        { error: "Cannot delete a class with active students." },
        { status: 409 },
      );
    await ClassSection.findByIdAndDelete(id);
    return NextResponse.json({ message: "Class deleted." });
  }
  try {
    const name = typeof body.name === "string" ? body.name.trim() : "";
    if (!name)
      return NextResponse.json(
        { error: "Class section name is required." },
        { status: 400 },
      );
    const classTeacher =
      typeof body.classTeacher === "string" ? body.classTeacher.trim() : "";
    if (classTeacher && !Types.ObjectId.isValid(classTeacher))
      return NextResponse.json(
        { error: "Select a valid class teacher." },
        { status: 400 },
      );
    if (classTeacher) {
      const staffExists = await Staff.exists({ _id: classTeacher });
      if (!staffExists)
        return NextResponse.json(
          { error: "Selected class teacher was not found." },
          { status: 404 },
        );
    }
    const update = classTeacher
      ? { name, classTeacher }
      : { name, $unset: { classTeacher: "" } };
    const classSection = await ClassSection.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });
    if (!classSection)
      return NextResponse.json({ error: "Class not found." }, { status: 404 });
    return NextResponse.json({ class: classSection });
  } catch {
    return NextResponse.json(
      { error: "Unable to update class." },
      { status: 500 },
    );
  }
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN")
    return NextResponse.json(
      { error: "Admin authentication is required." },
      { status: 401 },
    );
  await connectDB();
  const { id } = await context.params;
  const classSection = await ClassSection.findById(id)
    .select("name classTeacher")
    .populate("classTeacher", "_id fullName")
    .lean();
  if (!classSection)
    return NextResponse.json({ error: "Class not found." }, { status: 404 });
  return NextResponse.json({ class: classSection });
}
