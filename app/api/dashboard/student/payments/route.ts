import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/mongodb";
import { getSession } from "../../../../../lib/session";
import Student from "../../../../../models/Student";
import Invoice from "../../../../../models/Invoice";
import Payment from "../../../../../models/Payment";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "STUDENT")
    return NextResponse.json(
      { error: "Student authentication is required." },
      { status: 401 },
    );

  await connectDB();
  const student = await Student.findOne({ user: session.userId })
    .select("_id")
    .lean();
  if (!student)
    return NextResponse.json(
      { error: "Student profile not found." },
      { status: 404 },
    );

  const invoices = await Invoice.find({ student: student._id })
    .select("_id")
    .lean();
  const payments = await Payment.find({
    invoice: { $in: invoices.map((invoice) => invoice._id) },
  })
    .sort({ paidAt: -1 })
    .lean();

  return NextResponse.json({ payments });
}
