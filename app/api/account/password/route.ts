import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import { getSession } from "../../../../lib/session";
import { hashPassword, verifyPassword } from "../../../../lib/auth";
import User from "../../../../models/User";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session)
    return NextResponse.json(
      { error: "Authentication is required." },
      { status: 401 },
    );

  try {
    const { currentPassword, newPassword } = (await request.json()) as {
      currentPassword?: string;
      newPassword?: string;
    };

    if (!currentPassword || !newPassword || newPassword.length < 8)
      return NextResponse.json(
        {
          error:
            "Current password and a new password of at least 8 characters are required.",
        },
        { status: 400 },
      );

    if (currentPassword === newPassword)
      return NextResponse.json(
        { error: "New password must be different from current password." },
        { status: 400 },
      );

    await connectDB();
    const user = await User.findOne({
      _id: session.userId,
      isActive: true,
    });

    if (!user || !(await verifyPassword(currentPassword, user.passwordHash)))
      return NextResponse.json(
        { error: "Current password is incorrect." },
        { status: 400 },
      );

    user.passwordHash = await hashPassword(newPassword);
    user.mustChangePassword = false;
    await user.save();

    return NextResponse.json({ message: "Password changed successfully." });
  } catch {
    return NextResponse.json(
      { error: "Unable to change password." },
      { status: 500 },
    );
  }
}
