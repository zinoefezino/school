import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/mongodb";
import { getSession } from "../../../../../lib/session";
import Staff from "../../../../../models/Staff";
import ClassSection from "../../../../../models/ClassSection";
import Enrollment from "../../../../../models/Enrollment";
import ResultSubmission from "../../../../../models/ResultSubmission";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "STAFF")
    return NextResponse.json(
      { error: "Staff authentication is required." },
      { status: 401 },
    );
  await connectDB();
  const staff = await Staff.findOne({ user: session.userId })
    .select("_id subjects")
    .lean();
  if (!staff) return NextResponse.json({ classes: [], needsAttention: [] });
  const classes = await ClassSection.find({ classTeacher: staff._id })
    .populate("classLevel", "name")
    .lean();
  const classIds = classes.map((item) => item._id);
  const enrollments = await Enrollment.find({ classSection: { $in: classIds } })
    .select("classSection")
    .lean();
  const rejected = await ResultSubmission.find({
    teacher: staff._id,
    status: "REJECTED",
  })
    .populate("classSection", "name")
    .populate("subject", "name")
    .lean();
  return NextResponse.json({
    classes: classes.map((item) => ({
      classSection: `${(item.classLevel as { name?: string })?.name ?? "Class"} ${item.name}`,
      studentCount: enrollments.filter(
        (enrollment) =>
          enrollment.classSection.toString() === item._id.toString(),
      ).length,
    })),
    needsAttention: rejected,
  });
}
