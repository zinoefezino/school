import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import { getSession } from "../../../../lib/session";
import ClassSection from "../../../../models/ClassSection";
import Enrollment from "../../../../models/Enrollment";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN")
    return NextResponse.json(
      { error: "Admin authentication is required." },
      { status: 401 },
    );
  await connectDB();
  const classes = await ClassSection.find()
    .populate("classLevel", "name")
    .populate("classTeacher", "fullName")
    .sort({ name: 1 })
    .lean();
  const counts = await Enrollment.aggregate([
    { $match: { status: "ACTIVE" } },
    { $group: { _id: "$classSection", studentCount: { $sum: 1 } } },
  ]);
  return NextResponse.json({
    classes: classes.map((item) => ({
      ...item,
      studentCount:
        counts.find((count) => count._id.toString() === item._id.toString())
          ?.studentCount ?? 0,
    })),
  });
}
