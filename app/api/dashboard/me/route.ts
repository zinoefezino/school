import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import { getSession } from "../../../../lib/session";
import User from "../../../../models/User";
import Student from "../../../../models/Student";
import Staff from "../../../../models/Staff";
import Guardian from "../../../../models/Guardian";

function initials(name: string) {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "U"
  );
}

export async function GET() {
  const session = await getSession();
  if (!session)
    return NextResponse.json(
      { error: "Authentication is required." },
      { status: 401 },
    );

  await connectDB();
  const user = await User.findById(session.userId).select("email role").lean();
  if (!user)
    return NextResponse.json(
      { error: "User account not found." },
      { status: 404 },
    );

  let displayName = user.email;
  if (session.role === "STUDENT") {
    const student = await Student.findOne({ user: session.userId })
      .select("fullName")
      .lean();
    displayName = student?.fullName ?? displayName;
  }
  if (session.role === "STAFF") {
    const staff = await Staff.findOne({ user: session.userId })
      .select("fullName")
      .lean();
    displayName = staff?.fullName ?? displayName;
  }
  if (session.role === "PARENT") {
    const guardian = await Guardian.findOne({ user: session.userId })
      .select("fullName")
      .lean();
    displayName = guardian?.fullName ?? displayName;
  }

  return NextResponse.json({
    user: {
      role: session.role,
      email: user.email,
      displayName,
      initials: initials(displayName),
    },
  });
}
