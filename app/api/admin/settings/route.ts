import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import { getSession } from "../../../../lib/session";
import SchoolSettings from "../../../../models/SchoolSettings";

function requireAdmin() {
  return getSession().then((session) => session?.role === "ADMIN");
}

export async function GET() {
  if (!(await requireAdmin()))
    return NextResponse.json(
      { error: "Admin authentication is required." },
      { status: 401 },
    );
  await connectDB();
  const settings = await SchoolSettings.findOneAndUpdate(
    { key: "default" },
    { $setOnInsert: { key: "default" } },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  ).lean();
  return NextResponse.json({ settings });
}

export async function PUT(request: Request) {
  if (!(await requireAdmin()))
    return NextResponse.json(
      { error: "Admin authentication is required." },
      { status: 401 },
    );
  try {
    const body = (await request.json()) as {
      schoolName?: string;
      currentSession?: string;
      notifyResultsReview?: boolean;
    };
    if (!body.schoolName?.trim() || !body.currentSession?.trim())
      return NextResponse.json(
        { error: "School name and current session are required." },
        { status: 400 },
      );
    await connectDB();
    const settings = await SchoolSettings.findOneAndUpdate(
      { key: "default" },
      {
        schoolName: body.schoolName.trim(),
        currentSession: body.currentSession.trim(),
        notifyResultsReview: body.notifyResultsReview === true,
      },
      { upsert: true, new: true, runValidators: true },
    ).lean();
    return NextResponse.json({ settings });
  } catch {
    return NextResponse.json(
      { error: "Unable to save settings." },
      { status: 500 },
    );
  }
}
