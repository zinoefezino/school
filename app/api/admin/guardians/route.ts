import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import { getSession } from "../../../../lib/session";
import Guardian from "../../../../models/Guardian";
import Student from "../../../../models/Student";
import "../../../../models/User";

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

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
          { fullName: new RegExp(escapeRegex(search), "i") },
          { phone: new RegExp(escapeRegex(search), "i") },
        ],
      }
    : {};
  const [guardians, total] = await Promise.all([
    Guardian.find(query)
      .select("_id fullName phone user")
      .populate("user", "email isActive")
      .sort({ fullName: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Guardian.countDocuments(query),
  ]);
  const guardianIds = guardians.map((guardian) => guardian._id);
  const childCounts = await Student.aggregate([
    { $match: { guardian: { $in: guardianIds } } },
    { $group: { _id: "$guardian", childCount: { $sum: 1 } } },
  ]);
  return NextResponse.json({
    guardians: guardians.map((guardian) => ({
      ...guardian,
      childCount:
        childCounts.find(
          (count) => count._id.toString() === guardian._id.toString(),
        )?.childCount ?? 0,
    })),
    page,
    limit,
    total,
    pages: Math.max(Math.ceil(total / limit), 1),
  });
}
