import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/mongodb";
import { getSession } from "../../../../../lib/session";
import Staff from "../../../../../models/Staff";
import ClassSection from "../../../../../models/ClassSection";
import Enrollment from "../../../../../models/Enrollment";
import ResultSubmission from "../../../../../models/ResultSubmission";
import TeachingAssignment from "../../../../../models/TeachingAssignment";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "STAFF")
    return NextResponse.json(
      { error: "Staff authentication is required." },
      { status: 401 },
    );

  await connectDB();
  const staff = await Staff.findOne({ user: session.userId })
    .select("_id")
    .lean();
  if (!staff) return NextResponse.json({ classes: [], subjects: [] });

  const [headClasses, teachingAssignments, counts, submissions] =
    await Promise.all([
    ClassSection.find({ classTeacher: staff._id })
      .populate("classLevel", "name")
      .lean(),
    TeachingAssignment.find({ teacher: staff._id })
      .populate("subject", "name")
      .populate({
        path: "classSection",
        select: "name classLevel classTeacher",
        populate: { path: "classLevel", select: "name" },
      })
      .lean(),
    Enrollment.aggregate([
      { $match: { status: "ACTIVE" } },
      { $group: { _id: "$classSection", studentCount: { $sum: 1 } } },
    ]),
    ResultSubmission.find({ teacher: staff._id })
      .sort({ submittedAt: -1 })
      .select("classSection subject status rejectionNote")
      .lean(),
  ]);
  const classMap = new Map<
    string,
    {
      id: string;
      classSection: string;
      studentCount: number;
      isClassTeacher: boolean;
      subjects: { id: string; name: string }[];
      resultStatus: string;
    }
  >();

  for (const item of headClasses) {
    const classId = item._id.toString();
    const latestSubmission = submissions.find(
      (submission) => submission.classSection.toString() === classId,
    );
    classMap.set(classId, {
      id: classId,
      classSection: `${(item.classLevel as { name?: string })?.name ?? "Class"} ${item.name}`,
      studentCount:
        counts.find((count) => count._id.toString() === classId)
          ?.studentCount ?? 0,
      isClassTeacher: true,
      subjects: [],
      resultStatus: latestSubmission
        ? latestSubmission.status === "REJECTED"
          ? "Needs changes"
          : latestSubmission.status.charAt(0) +
            latestSubmission.status.slice(1).toLowerCase()
        : "Not started",
    });
  }

  for (const assignment of teachingAssignments) {
    const classSection = assignment.classSection as {
      _id?: { toString(): string };
      name?: string;
      classLevel?: { name?: string };
      classTeacher?: { toString(): string };
    };
    const subject = assignment.subject as {
      _id?: { toString(): string };
      name?: string;
    };
    const classId = classSection?._id?.toString();
    const subjectId = subject?._id?.toString();
    if (!classId || !subjectId) continue;
    const latestSubmission = submissions.find(
      (submission) =>
        submission.classSection.toString() === classId &&
        submission.subject.toString() === subjectId,
    );
    const existing = classMap.get(classId);
    const subjects = existing?.subjects ?? [];
    if (!subjects.some((item) => item.id === subjectId))
      subjects.push({ id: subjectId, name: subject.name ?? "Subject" });
    classMap.set(classId, {
      id: classId,
      classSection:
        existing?.classSection ??
        `${classSection.classLevel?.name ?? "Class"} ${classSection.name ?? ""}`,
      studentCount:
        existing?.studentCount ??
        counts.find((count) => count._id.toString() === classId)
          ?.studentCount ??
        0,
      isClassTeacher: existing?.isClassTeacher ?? false,
      subjects,
      resultStatus: latestSubmission
        ? latestSubmission.status === "REJECTED"
          ? "Needs changes"
          : latestSubmission.status.charAt(0) +
            latestSubmission.status.slice(1).toLowerCase()
        : (existing?.resultStatus ?? "Not started"),
    });
  }

  const subjectsById = new Map<string, { id: string; name: string }>();
  for (const item of classMap.values())
    for (const subject of item.subjects) subjectsById.set(subject.id, subject);
  return NextResponse.json({
    subjects: Array.from(subjectsById.values()),
    classes: Array.from(classMap.values()),
  });
}
