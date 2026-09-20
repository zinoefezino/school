import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import { hashPassword, hashResetToken } from "../../../../lib/auth";
import {
  getClientIp,
  rateLimit,
  rateLimitResponse,
} from "../../../../lib/rateLimit";
import User from "../../../../models/User";
import PasswordResetToken from "../../../../models/PasswordResetToken";

export async function POST(request: Request) {
  try {
    const { token, password } = (await request.json()) as {
      token?: string;
      password?: string;
    };
    const limit = rateLimit({
      key: `reset-password:${getClientIp(request)}:${token?.slice(0, 16) ?? "missing"}`,
      limit: 6,
      windowMs: 15 * 60 * 1000,
    });
    if (limit.limited) return rateLimitResponse(limit.resetAt);
    if (!token || !password || password.length < 8)
      return NextResponse.json(
        {
          error:
            "A valid token and password of at least 8 characters are required.",
        },
        { status: 400 },
      );
    await connectDB();
    const resetToken = await PasswordResetToken.findOne({
      tokenHash: hashResetToken(token),
      usedAt: { $exists: false },
      expiresAt: { $gt: new Date() },
    });
    if (!resetToken)
      return NextResponse.json(
        { error: "This reset link is invalid or has expired." },
        { status: 400 },
      );
    await User.updateOne(
      { _id: resetToken.user },
      { passwordHash: await hashPassword(password), mustChangePassword: false },
    );
    await PasswordResetToken.updateOne(
      { _id: resetToken._id },
      { usedAt: new Date() },
    );
    return NextResponse.json({ message: "Password reset successfully." });
  } catch {
    return NextResponse.json(
      { error: "Unable to reset password." },
      { status: 500 },
    );
  }
}
