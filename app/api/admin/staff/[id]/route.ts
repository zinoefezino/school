import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/mongodb";
import { getSession } from "../../../../../lib/session";
import { writeAuditLog } from "../../../../../lib/audit";
import Staff from "../../../../../models/Staff";
import User from "../../../../../models/User";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN")
    return NextResponse.json(
      { error: "Admin authentication is required." },
      { status: 401 },
    );
  const { id } = await context.params;
  const body = await request.json();
  await connectDB();
  const staff = await Staff.findByIdAndUpdate(
    id,
    { fullName: body.fullName, phone: body.phone, department: body.department },
    { new: true, runValidators: true },
  );
  if (!staff)
    return NextResponse.json(
      { error: "Staff member not found." },
      { status: 404 },
    );
  if (typeof body.isActive === "boolean")
    await User.findByIdAndUpdate(staff.user, { isActive: body.isActive });
  await writeAuditLog({
    session,
    action:
      typeof body.isActive === "boolean"
        ? "admin.staff.accountStatus"
        : "admin.staff.update",
    targetType: "Staff",
    targetId: staff._id.toString(),
    metadata: {
      isActive:
        typeof body.isActive === "boolean" ? body.isActive : undefined,
    },
  });
  return NextResponse.json({ staff });
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN")
    return NextResponse.json(
      { error: "Admin authentication is required." },
      { status: 401 },
    );
  await connectDB();
  const { id } = await context.params;
  const staff = await Staff.findById(id)
    .select("fullName phone department")
    .lean();
  if (!staff)
    return NextResponse.json(
      { error: "Staff member not found." },
      { status: 404 },
    );
  return NextResponse.json({ staff });
}
