import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import { getSession } from "../../../../lib/session";
import Attendance from "../../../../models/Attendance";
import Enrollment from "../../../../models/Enrollment";

export async function GET(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN")
    return NextResponse.json(
      { error: "Admin authentication is required." },
      { status: 401 },
    );
  const date = new URL(request.url).searchParams.get("date");
  const day = date ? new Date(`${date}T00:00:00.000Z`) : new Date();
  const nextDay = new Date(day);
  nextDay.setUTCDate(day.getUTCDate() + 1);
  await connectDB();
  const rows = await Attendance.aggregate([
    { $match: { date: { $gte: day, $lt: nextDay } } },
    {
      $lookup: {
        from: "enrollments",
        localField: "student",
        foreignField: "student",
        as: "enrollment",
      },
    },
    { $unwind: { path: "$enrollment", preserveNullAndEmptyArrays: true } },
    {
      $group: {
        _id: "$enrollment.classSection",
        present: { $sum: { $cond: [{ $eq: ["$status", "PRESENT"] }, 1, 0] } },
        total: { $sum: 1 },
      },
    },
  ]);
  return NextResponse.json({ attendance: rows });
}
