import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/mongodb";
import { getSession } from "../../../../../lib/session";
import ClassSection from "../../../../../models/ClassSection";
import Enrollment from "../../../../../models/Enrollment";

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
  const classSection = await ClassSection.findByIdAndUpdate(
    id,
    { name: body.name, classTeacher: body.classTeacher || undefined },
    { new: true, runValidators: true },
  );
  if (!classSection)
    return NextResponse.json({ error: "Class not found." }, { status: 404 });
  return NextResponse.json({ class: classSection });
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
    .lean();
  if (!classSection)
    return NextResponse.json({ error: "Class not found." }, { status: 404 });
  return NextResponse.json({ class: classSection });
}
