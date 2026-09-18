import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import { getSession } from "../../../../lib/session";
import Guardian from "../../../../models/Guardian";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN")
    return NextResponse.json(
      { error: "Admin authentication is required." },
      { status: 401 },
    );
  await connectDB();
  const guardians = await Guardian.find()
    .select("_id fullName phone user")
    .populate("user", "email")
    .sort({ fullName: 1 })
    .lean();
  return NextResponse.json({ guardians });
}
