import { NextResponse } from "next/server";
import { Types } from "mongoose";
import { connectDB } from "../../../../lib/mongodb";
import { getSession } from "../../../../lib/session";
import Term from "../../../../models/Term";

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
  const terms = await Term.find()
    .populate("session", "name")
    .sort({ _id: -1 })
    .lean();
  return NextResponse.json({ terms });
}

export async function POST(request: Request) {
  if (!(await requireAdmin()))
    return NextResponse.json(
      { error: "Admin authentication is required." },
      { status: 401 },
    );
  const body = await request.json();
  if (
    typeof body.name !== "string" ||
    !body.name.trim() ||
    typeof body.sessionId !== "string" ||
    !Types.ObjectId.isValid(body.sessionId)
  )
    return NextResponse.json(
      { error: "Term name and session are required." },
      { status: 400 },
    );
  try {
    await connectDB();
    const term = await Term.create({
      name: body.name.trim(),
      session: body.sessionId,
      resultsPublished: body.resultsPublished === true,
    });
    return NextResponse.json({ term }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message.includes("E11000"))
      return NextResponse.json(
        { error: "That term already exists for this session." },
        { status: 409 },
      );
    return NextResponse.json(
      { error: "Unable to create term." },
      { status: 500 },
    );
  }
}
