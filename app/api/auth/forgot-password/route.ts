import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import { hashResetToken, resetTokenLifetimeMs } from "../../../../lib/auth";
import {
  getClientIp,
  rateLimit,
  rateLimitResponse,
} from "../../../../lib/rateLimit";
import User from "../../../../models/User";
import PasswordResetToken from "../../../../models/PasswordResetToken";

export async function POST(request: Request) {
  const genericMessage =
    "If an account matches that email, a password reset link will be sent.";
  try {
    const { email } = (await request.json()) as { email?: string };
    const limit = rateLimit({
      key: `forgot-password:${getClientIp(request)}:${email?.toLowerCase().trim() ?? "missing"}`,
      limit: 5,
      windowMs: 15 * 60 * 1000,
    });
    if (limit.limited) return rateLimitResponse(limit.resetAt);
    if (!email) return NextResponse.json({ message: genericMessage });
    await connectDB();
    const user = await User.findOne({
      email: email.trim().toLowerCase(),
      isActive: true,
    })
      .select("_id email")
      .lean();
    if (!user) return NextResponse.json({ message: genericMessage });
    const rawToken = randomBytes(32).toString("hex");
    await PasswordResetToken.deleteMany({
      user: user._id,
      usedAt: { $exists: false },
    });
    await PasswordResetToken.create({
      user: user._id,
      tokenHash: hashResetToken(rawToken),
      expiresAt: new Date(Date.now() + resetTokenLifetimeMs),
    });
    const resetUrl = `${new URL(request.url).origin}/portal/reset-password?token=${rawToken}`;
    if (process.env.NODE_ENV !== "production")
      console.info(`[password-reset] ${resetUrl}`);
    return NextResponse.json({ message: genericMessage });
  } catch {
    return NextResponse.json({ message: genericMessage });
  }
}
