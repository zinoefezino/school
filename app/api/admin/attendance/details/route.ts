import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/mongodb";
import { getSession } from "../../../../../lib/session";
import Attendance from "../../../../../models/Attendance";

export async function GET(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN")
    return NextResponse.json(
      { error: "Admin authentication is required." },
      { status: 401 },
    );
  const month =
    new URL(request.url).searchParams.get("month") ??
    new Date().toISOString().slice(0, 7);
  const start = new Date(`${month}-01T00:00:00.000Z`);
  const end = new Date(start);
  end.setUTCMonth(start.getUTCMonth() + 1);
  await connectDB();
  const records = await Attendance.find({ date: { $gte: start, $lt: end } })
    .populate("student", "fullName admissionNumber")
    .lean();
  const grouped = new Map<
    string,
    {
      student?: { fullName?: string; admissionNumber?: string };
      present: number;
      total: number;
    }
  >();
  for (const record of records) {
    const student = record.student as {
      _id?: string;
      fullName?: string;
      admissionNumber?: string;
    };
    const key = student?._id ?? "unknown";
    const row = grouped.get(key) ?? { student, present: 0, total: 0 };
    row.total += 1;
    if (record.status === "PRESENT") row.present += 1;
    grouped.set(key, row);
  }
  return NextResponse.json({ records: [...grouped.values()] });
}
