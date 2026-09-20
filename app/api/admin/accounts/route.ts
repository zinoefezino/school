import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import { hashPassword } from "../../../../lib/auth";
import { getSession } from "../../../../lib/session";
import { writeAuditLog } from "../../../../lib/audit";
import User, { type UserRole } from "../../../../models/User";
import Staff from "../../../../models/Staff";
import Guardian from "../../../../models/Guardian";
import Student from "../../../../models/Student";

const provisionableRoles: UserRole[] = ["STAFF", "PARENT", "STUDENT"];

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN")
    return NextResponse.json(
      { error: "Admin authentication is required." },
      { status: 401 },
    );

  try {
    const body = (await request.json()) as {
      role?: UserRole;
      email?: string;
      temporaryPassword?: string;
      fullName?: string;
      phone?: string;
      department?: string;
      admissionNumber?: string;
      dateOfBirth?: string;
      gender?: "male" | "female";
      guardianId?: string;
    };
    const { role, email, temporaryPassword, fullName } = body;
    if (
      !role ||
      !provisionableRoles.includes(role) ||
      !email ||
      !temporaryPassword ||
      temporaryPassword.length < 8 ||
      !fullName
    )
      return NextResponse.json(
        {
          error:
            "Role, full name, email, and a password of at least 8 characters are required.",
        },
        { status: 400 },
      );
    if (role === "STUDENT" && (!body.admissionNumber || !body.dateOfBirth))
      return NextResponse.json(
        { error: "Student admission number and date of birth are required." },
        { status: 400 },
      );

    await connectDB();
    if (await User.exists({ email: email.toLowerCase().trim() }))
      return NextResponse.json(
        { error: "An account already exists with that email." },
        { status: 409 },
      );
    const user = await User.create({
      email: email.toLowerCase().trim(),
      passwordHash: await hashPassword(temporaryPassword),
      role,
      mustChangePassword: true,
    });

    let profileId = "";
    try {
      if (role === "STAFF")
        profileId = (
          await Staff.create({
            user: user._id,
            fullName,
            phone: body.phone,
            department: body.department,
            subjects: [],
          })
        )._id.toString();
      if (role === "PARENT")
        profileId = (
          await Guardian.create({ user: user._id, fullName, phone: body.phone })
        )._id.toString();
      if (role === "STUDENT") {
        profileId = (
          await Student.create({
            user: user._id,
            fullName,
            admissionNumber: body.admissionNumber,
            dateOfBirth: body.dateOfBirth,
            gender: body.gender,
            guardian: body.guardianId || undefined,
          })
        )._id.toString();
      }
    } catch (profileError) {
      await User.deleteOne({ _id: user._id });
      throw profileError;
    }

    await writeAuditLog({
      session,
      action: "admin.account.create",
      targetType: role,
      targetId: profileId,
      metadata: { userId: user._id.toString(), email: user.email },
    });

    return NextResponse.json(
      { id: user._id.toString(), profileId, role, mustChangePassword: true },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof Error && error.message.includes("E11000"))
      return NextResponse.json(
        { error: "A profile with one of these unique values already exists." },
        { status: 409 },
      );
    return NextResponse.json(
      { error: "Unable to create account." },
      { status: 500 },
    );
  }
}
