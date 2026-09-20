import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/mongodb";
import { getSession } from "../../../../../lib/session";
import { writeAuditLog } from "../../../../../lib/audit";
import Student from "../../../../../models/Student";
import User from "../../../../../models/User";

async function admin() {
  const session = await getSession();
  return session?.role === "ADMIN" ? session : null;
}
export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  if (!(await admin()))
    return NextResponse.json(
      { error: "Admin authentication is required." },
      { status: 401 },
    );
  await connectDB();
  const { id } = await context.params;
  const student = await Student.findById(id)
    .select("fullName admissionNumber dateOfBirth gender guardian")
    .lean();
  if (!student)
    return NextResponse.json({ error: "Student not found." }, { status: 404 });
  return NextResponse.json({ student });
}
export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await admin();
  if (!session)
    return NextResponse.json(
      { error: "Admin authentication is required." },
      { status: 401 },
    );
  const { id } = await context.params;
  const body = await request.json();
  await connectDB();
  const student = await Student.findByIdAndUpdate(
    id,
    {
      fullName: body.fullName,
      dateOfBirth: body.dateOfBirth,
      gender: body.gender,
      guardian: body.guardianId || undefined,
    },
    { new: true, runValidators: true },
  );
  if (!student)
    return NextResponse.json({ error: "Student not found." }, { status: 404 });
  if (typeof body.isActive === "boolean")
    await User.findByIdAndUpdate(student.user, { isActive: body.isActive });
  await writeAuditLog({
    session,
    action:
      typeof body.isActive === "boolean"
        ? "admin.student.accountStatus"
        : "admin.student.update",
    targetType: "Student",
    targetId: student._id.toString(),
    metadata: {
      isActive:
        typeof body.isActive === "boolean" ? body.isActive : undefined,
    },
  });
  return NextResponse.json({ student });
}
