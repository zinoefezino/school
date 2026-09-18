import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import {
  createSessionToken,
  sessionCookieName,
  sessionCookieOptions,
  verifyPassword,
} from "../../../../lib/auth";
import User, { type UserRole } from "../../../../models/User";
import Student from "../../../../models/Student";

const roles: UserRole[] = ["ADMIN", "STAFF", "PARENT", "STUDENT"];

export async function POST(request: Request) {
  try {
    const { identifier, password, role } = (await request.json()) as {
      identifier?: string;
      password?: string;
      role?: UserRole;
    };
    if (!identifier || !password || !role || !roles.includes(role))
      return NextResponse.json(
        { error: "Identifier, password, and portal role are required." },
        { status: 400 },
      );
    await connectDB();
    let user = await User.findOne({
      email: identifier.toLowerCase().trim(),
      role,
      isActive: true,
    });
    if (!user && role === "STUDENT") {
      const student = await Student.findOne({
        admissionNumber: identifier.trim(),
      }).select("user");
      if (student)
        user = await User.findOne({ _id: student.user, role, isActive: true });
    }
    if (!user || !(await verifyPassword(password, user.passwordHash)))
      return NextResponse.json(
        { error: "Invalid login details." },
        { status: 401 },
      );
    const token = createSessionToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });
    const response = NextResponse.json({
      role: user.role,
      mustChangePassword: user.mustChangePassword,
    });
    response.cookies.set(sessionCookieName, token, sessionCookieOptions());
    return response;
  } catch {
    return NextResponse.json(
      {
        error:
          "Unable to sign in. Check AUTH_SECRET and database configuration.",
      },
      { status: 500 },
    );
  }
}
