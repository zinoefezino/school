import { NextResponse } from "next/server";
import { Types } from "mongoose";
import { connectDB } from "../../../../../lib/mongodb";
import { getSession } from "../../../../../lib/session";
import Staff from "../../../../../models/Staff";
import Enrollment from "../../../../../models/Enrollment";
import Assessment from "../../../../../models/Assessment";
import ResultSubmission from "../../../../../models/ResultSubmission";
import TeachingAssignment from "../../../../../models/TeachingAssignment";
import "../../../../../models/Student";

async function getStaffContext(
  userId: string,
  classSectionId: string,
  subjectId: string,
) {
  if (
    !Types.ObjectId.isValid(classSectionId) ||
    !Types.ObjectId.isValid(subjectId)
  )
    return null;
  const staff = await Staff.findOne({ user: userId })
    .select("_id")
    .lean();
  if (!staff) return null;
  const teachingAssignment = await TeachingAssignment.findOne({
    classSection: classSectionId,
    subject: subjectId,
    teacher: staff._id,
  }).lean();
  return teachingAssignment ? { staff, teachingAssignment } : null;
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
  const subjectId = params.get("subjectId");
  if (!classSectionId || !subjectId)
    return NextResponse.json(
      { error: "classSectionId and subjectId are required." },
      { status: 400 },
    );

  await connectDB();
  const context = await getStaffContext(session.userId, classSectionId, subjectId);
  if (!context)
    return NextResponse.json(
      { error: "Subject assignment not found for this class." },
      { status: 403 },
    );

  const enrollments = await Enrollment.find({
    classSection: classSectionId,
    status: "ACTIVE",
  })
    .populate("student", "fullName admissionNumber")
    .lean();
  const studentIds = enrollments.map((item) => item.student?._id);
  const termIds = [...new Set(enrollments.map((item) => item.term.toString()))];
  const termId = termIds[0];
  const [assessments, submission] = await Promise.all([
    Assessment.find({
      student: { $in: studentIds },
      subject: subjectId,
      term: termId,
    })
      .select("student scoreType score")
      .lean(),
    ResultSubmission.findOne({
      classSection: classSectionId,
      subject: subjectId,
      term: termId,
    })
      .select("status rejectionNote")
      .lean(),
  ]);

  return NextResponse.json({
    submission,
    students: enrollments.map((enrollment) => {
      const student = enrollment.student as {
        _id: Types.ObjectId;
        fullName?: string;
        admissionNumber?: string;
      };
      const scores = assessments.filter(
        (item) => item.student.toString() === student._id.toString(),
      );
      const scoreFor = (type: string) =>
        scores.find((item) => item.scoreType === type)?.score ?? 0;
      return {
        id: student._id.toString(),
        name: student.fullName ?? "Unknown student",
        admissionNumber: student.admissionNumber ?? "-",
        ca1: scoreFor("CA1"),
        ca2: scoreFor("CA2"),
        exam: scoreFor("Exam"),
        termId: enrollment.term.toString(),
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
    typeof body.subjectId !== "string" ||
    !Array.isArray(body.records)
  )
    return NextResponse.json(
      { error: "Class, subject, and result records are required." },
      { status: 400 },
    );

  await connectDB();
  const context = await getStaffContext(
    session.userId,
    body.classSectionId,
    body.subjectId,
  );
  if (!context)
    return NextResponse.json(
      { error: "Subject assignment not found for this class." },
      { status: 403 },
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
  const termId = enrollments[0]?.term;
  if (!termId)
    return NextResponse.json(
      { error: "No active students found for this class." },
      { status: 400 },
    );

  const scoreTypes = [
    ["CA1", 20],
    ["CA2", 20],
    ["Exam", 60],
  ] as const;
  const writes = body.records.flatMap(
    (record: {
      studentId?: string;
      ca1?: number;
      ca2?: number;
      exam?: number;
    }) => {
      if (!record.studentId || !enrollmentByStudent.has(record.studentId))
        throw new Error("Invalid result record.");
      return scoreTypes.map(([scoreType, max]) => {
        const key = scoreType === "Exam" ? "exam" : scoreType.toLowerCase();
        const score = Number(record[key as "ca1" | "ca2" | "exam"] ?? 0);
        if (Number.isNaN(score) || score < 0 || score > max)
          throw new Error("Invalid score.");
        return Assessment.updateOne(
          {
            student: record.studentId,
            subject: body.subjectId,
            term: termId,
            scoreType,
          },
          {
            $set: {
              student: record.studentId,
              subject: body.subjectId,
              term: termId,
              scoreType,
              score,
            },
          },
          { upsert: true },
        );
      });
    },
  );

  try {
    await Promise.all(writes);
    if (body.submit) {
      await ResultSubmission.updateOne(
        {
          classSection: body.classSectionId,
          subject: body.subjectId,
          term: termId,
        },
        {
          $set: {
            classSection: body.classSectionId,
            subject: body.subjectId,
            term: termId,
            teacher: context.staff._id,
            status: "SUBMITTED",
            submittedAt: new Date(),
          },
          $unset: { rejectionNote: "" },
        },
        { upsert: true },
      );
    }
    return NextResponse.json({ saved: true });
  } catch {
    return NextResponse.json(
      { error: "Unable to save results." },
      { status: 400 },
    );
  }
}
