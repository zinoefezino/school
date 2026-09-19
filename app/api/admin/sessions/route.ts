import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import { getSession } from "../../../../lib/session";
import AcademicSession from "../../../../models/AcademicSession";

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
  const sessions = await AcademicSession.find().sort({ name: -1 }).lean();
  return NextResponse.json({ sessions });
}

export async function POST(request: Request) {
  if (!(await requireAdmin()))
    return NextResponse.json(
      { error: "Admin authentication is required." },
      { status: 401 },
    );
  const body = await request.json();
  if (typeof body.name !== "string" || !body.name.trim())
    return NextResponse.json(
      { error: "Session name is required." },
      { status: 400 },
    );
  try {
    await connectDB();
    const session = await AcademicSession.create({ name: body.name.trim() });
    return NextResponse.json({ session }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message.includes("E11000"))
      return NextResponse.json(
        { error: "That academic session already exists." },
        { status: 409 },
      );
    return NextResponse.json(
      { error: "Unable to create academic session." },
      { status: 500 },
    );
  }
}
