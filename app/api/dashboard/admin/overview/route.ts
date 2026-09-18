import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/mongodb";
import { getSession } from "../../../../../lib/session";
import Student from "../../../../../models/Student";
import Staff from "../../../../../models/Staff";
import Invoice from "../../../../../models/Invoice";
import Attendance from "../../../../../models/Attendance";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") return NextResponse.json({ error: "Admin authentication is required." }, { status: 401 });
  await connectDB();
  const [students, staff, invoices, attendance] = await Promise.all([Student.countDocuments(), Staff.countDocuments(), Invoice.find({ status: "PAID" }).select("amount").lean(), Attendance.countDocuments({ date: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }, status: "PRESENT" })]);
  const totalAttendance = await Attendance.countDocuments({ date: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) });
  return NextResponse.json({ stats: { students, staff, feesCollected: invoices.reduce((sum, invoice) => sum + invoice.amount, 0), attendanceRate: totalAttendance ? Math.round((attendance / totalAttendance) * 100) : 0 } });
}
