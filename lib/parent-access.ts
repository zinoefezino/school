import { Types } from "mongoose";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "./mongodb";
import Student from "../models/Student";
import Guardian from "../models/Guardian";
import { sessionCookieName, verifySessionToken } from "./auth";

export function unauthorizedParentResponse() {
  return NextResponse.json(
    { error: "Parent authentication is required." },
    { status: 401 },
  );
}

export async function getGuardianId(request: Request) {
  const guardianId = request.headers.get("x-guardian-id");
  if (guardianId && Types.ObjectId.isValid(guardianId)) return guardianId;

  const cookieStore = await cookies();
  const token = cookieStore.get(sessionCookieName)?.value;
  const session = token ? verifySessionToken(token) : null;
  if (
    !session ||
    session.role !== "PARENT" ||
    !Types.ObjectId.isValid(session.userId)
  )
    return null;

  await connectDB();
  const guardian = await Guardian.findOne({ user: session.userId })
    .select("_id")
    .lean();
  return guardian?._id.toString() ?? null;
}

export async function getAuthorizedChildren(request: Request) {
  const guardianId = await getGuardianId(request);
  if (!guardianId) return null;
  await connectDB();
  return Student.find({ guardian: guardianId })
    .select("_id fullName admissionNumber guardian")
    .lean();
}

export async function getAuthorizedChild(request: Request, studentId: string) {
  const guardianId = await getGuardianId(request);
  if (!guardianId || !Types.ObjectId.isValid(studentId)) return null;
  await connectDB();
  return Student.findOne({ _id: studentId, guardian: guardianId })
    .select("_id fullName admissionNumber guardian")
    .lean();
}
