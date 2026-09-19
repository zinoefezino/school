import { NextResponse } from "next/server";
import { Types } from "mongoose";
import { connectDB } from "../../../../../lib/mongodb";
import { getSession } from "../../../../../lib/session";
import Staff from "../../../../../models/Staff";
import ClassSection from "../../../../../models/ClassSection";
import Enrollment from "../../../../../models/Enrollment";
import Attendance, {
  type AttendanceStatus,
} from "../../../../../models/Attendance";

const allowedStatuses: AttendanceStatus[] = ["PRESENT", "ABSENT", "LATE"];

async function getStaffClass(userId: string, classSectionId: string) {
  if (!Types.ObjectId.isValid(classSectionId)) return null;
  const staff = await Staff.findOne({ user: userId }).select("_id").lean();
  if (!staff) return null;
  const classSection = await ClassSection.findOne({
    _id: classSectionId,
    classTeacher: staff._id,
  }).lean();
  return classSection ? { staff, classSection } : null;
}

export async function GET(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "STAFF")
    return NextResponse.json(
      { error: "Staff authentication is required." },
      { status: 401 },
    );

  const params = new URL(request.url).searchParams;
  const classSectionId = params.get("classSectionId");
  const date = params.get("date") ?? new Date().toISOString().slice(0, 10);
  if (!classSectionId)
    return NextResponse.json(
      { error: "classSectionId is required." },
      { status: 400 },
    );

  await connectDB();
  const staffClass = await getStaffClass(session.userId, classSectionId);
  if (!staffClass)
    return NextResponse.json(
      { error: "Class assignment not found." },
      { status: 404 },
    );

  const day = new Date(`${date}T00:00:00.000Z`);
  const nextDay = new Date(day);
  nextDay.setUTCDate(day.getUTCDate() + 1);
  const enrollments = await Enrollment.find({
    classSection: classSectionId,
    status: "ACTIVE",
  })
    .populate("student", "fullName admissionNumber")
    .populate("term", "name")
    .lean();
  const studentIds = enrollments.map((item) => item.student?._id);
  const attendance = await Attendance.find({
    student: { $in: studentIds },
    date: { $gte: day, $lt: nextDay },
  })
    .select("student status")
    .lean();

  return NextResponse.json({
    students: enrollments.map((enrollment) => {
      const student = enrollment.student as {
        _id: Types.ObjectId;
        fullName?: string;
        admissionNumber?: string;
      };
      const record = attendance.find(
        (item) => item.student.toString() === student._id.toString(),
      );
      return {
        id: student._id.toString(),
        name: student.fullName ?? "Unknown student",
        admissionNumber: student.admissionNumber ?? "-",
        attendance: record?.status ?? "PRESENT",
        termId: enrollment.term?._id?.toString(),
      };
    }),
  });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "STAFF")
    return NextResponse.json(
      { error: "Staff authentication is required." },
      { status: 401 },
    );

  const body = await request.json();
  if (
    typeof body.classSectionId !== "string" ||
    typeof body.date !== "string" ||
    !Array.isArray(body.records)
  )
    return NextResponse.json(
      { error: "Class, date, and attendance records are required." },
      { status: 400 },
    );

  await connectDB();
  const staffClass = await getStaffClass(session.userId, body.classSectionId);
  if (!staffClass)
    return NextResponse.json(
      { error: "Class assignment not found." },
      { status: 404 },
    );

  const enrollments = await Enrollment.find({
    classSection: body.classSectionId,
    status: "ACTIVE",
  })
    .select("student term")
    .lean();
  const enrollmentByStudent = new Map(
    enrollments.map((item) => [item.student.toString(), item]),
  );
  const day = new Date(`${body.date}T00:00:00.000Z`);
  const writes = body.records.map(
    (record: { studentId?: string; status?: AttendanceStatus }) => {
      if (
        !record.studentId ||
        !enrollmentByStudent.has(record.studentId) ||
        !allowedStatuses.includes(record.status as AttendanceStatus)
      )
        throw new Error("Invalid attendance record.");
      const enrollment = enrollmentByStudent.get(record.studentId)!;
      return Attendance.updateOne(
        { student: record.studentId, date: day },
        {
          $set: {
            student: record.studentId,
            term: enrollment.term,
            date: day,
            status: record.status,
          },
        },
        { upsert: true },
      );
    },
  );
  try {
    await Promise.all(writes);
    return NextResponse.json({ saved: true });
  } catch {
    return NextResponse.json(
      { error: "Unable to save attendance." },
      { status: 400 },
    );
  }
}
