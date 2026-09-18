import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import { getSession } from "../../../../lib/session";
import Staff from "../../../../models/Staff";
import User from "../../../../models/User";
import Subject from "../../../../models/Subject";

export async function GET(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN")
    return NextResponse.json(
      { error: "Admin authentication is required." },
      { status: 401 },
    );
  const params = new URL(request.url).searchParams;
  const search = params.get("search")?.trim();
  const page = Math.max(Number(params.get("page") ?? 1), 1);
  const limit = Math.min(Math.max(Number(params.get("limit") ?? 25), 1), 100);
  await connectDB();
  const query = search
    ? {
        $or: [
          { fullName: { $regex: search, $options: "i" } },
          { department: { $regex: search, $options: "i" } },
        ],
      }
    : {};
  const [staff, total] = await Promise.all([
    Staff.find(query)
      .select("fullName phone department subjects user")
      .populate("user", "email isActive")
      .populate("subjects", "name")
      .sort({ fullName: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Staff.countDocuments(query),
  ]);
  return NextResponse.json({
    staff,
    page,
    limit,
    total,
    pages: Math.ceil(total / limit),
  });
}
