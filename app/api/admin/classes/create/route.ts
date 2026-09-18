import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/mongodb";
import { getSession } from "../../../../../lib/session";
import ClassLevel from "../../../../../models/ClassLevel";
import ClassSection from "../../../../../models/ClassSection";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN")
    return NextResponse.json(
      { error: "Admin authentication is required." },
      { status: 401 },
    );
  try {
    const body = (await request.json()) as {
      classLevel?: string;
      section?: string;
      classTeacher?: string;
    };
    if (!body.classLevel?.trim() || !body.section?.trim())
      return NextResponse.json(
        { error: "Class level and section are required." },
        { status: 400 },
      );
    await connectDB();
    const level = await ClassLevel.findOneAndUpdate(
      { name: body.classLevel.trim() },
      { name: body.classLevel.trim() },
      { upsert: true, new: true },
    );
    const created = await ClassSection.create({
      name: body.section.trim(),
      classLevel: level._id,
      classTeacher: body.classTeacher || undefined,
    });
    return NextResponse.json({ class: created }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message.includes("E11000"))
      return NextResponse.json(
        { error: "That class section already exists." },
        { status: 409 },
      );
    return NextResponse.json(
      { error: "Unable to create class." },
      { status: 500 },
    );
  }
}
