import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import { getSession } from "../../../../lib/session";
import Invoice from "../../../../models/Invoice";

export async function GET(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN")
    return NextResponse.json(
      { error: "Admin authentication is required." },
      { status: 401 },
    );
  const params = new URL(request.url).searchParams;
  const page = Math.max(Number(params.get("page") ?? 1), 1);
  const limit = Math.min(Math.max(Number(params.get("limit") ?? 25), 1), 100);
  await connectDB();
  const [invoices, total, summary] = await Promise.all([
    Invoice.find()
      .populate("student", "fullName")
      .populate({
        path: "classSection",
        populate: { path: "classLevel", select: "name" },
        select: "name classLevel",
      })
      .sort({ dueDate: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Invoice.countDocuments(),
    Invoice.aggregate([
      { $group: { _id: "$status", total: { $sum: "$amount" } } },
    ]),
  ]);
  return NextResponse.json({
    invoices,
    total,
    page,
    limit,
    pages: Math.ceil(total / limit),
    summary,
  });
}
