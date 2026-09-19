import { NextResponse } from "next/server";
import {
  getAuthorizedChild,
  unauthorizedParentResponse,
} from "../../../../lib/parent-access";
import Attendance from "../../../../models/Attendance";

export async function GET(request: Request) {
  try {
    const studentId = new URL(request.url).searchParams.get("studentId");
    if (!studentId)
      return NextResponse.json(
        { error: "studentId is required." },
        { status: 400 },
      );
    const child = await getAuthorizedChild(studentId);
    if (!child) return unauthorizedParentResponse();
    const records = await Attendance.find({ student: child._id })
      .sort({ date: -1 })
      .populate("term", "name session")
      .lean();
    return NextResponse.json({ student: child, records });
  } catch {
    return NextResponse.json(
      { error: "Unable to load attendance." },
      { status: 500 },
    );
  }
}
