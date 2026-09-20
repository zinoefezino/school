import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import {
  createSessionToken,
  sessionCookieName,
  sessionCookieOptions,
  verifyPassword,
} from "../../../../lib/auth";
import {
  getClientIp,
  rateLimit,
  rateLimitResponse,
} from "../../../../lib/rateLimit";
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
    const normalizedIdentifier = identifier?.toLowerCase().trim() ?? "missing";
    const limit = rateLimit({
      key: `login:${getClientIp(request)}:${role ?? "unknown"}:${normalizedIdentifier}`,
      limit: 8,
      windowMs: 15 * 60 * 1000,
    });
    if (limit.limited) return rateLimitResponse(limit.resetAt);
    if (!identifier || !password || !role || !roles.includes(role))
      return NextResponse.json(
        { error: "Identifier, password, and portal role are required." },
        { status: 400 },
      );
    await connectDB();
    let user = await User.findOne({
      email: normalizedIdentifier,
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
    await User.updateOne(
      { _id: user._id },
      { $set: { lastLoginAt: new Date() } },
    );
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
