import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/mongodb";
import { getSession } from "../../../../../lib/session";
import Student from "../../../../../models/Student";
import Invoice from "../../../../../models/Invoice";
import Payment from "../../../../../models/Payment";
import "../../../../../models/Term";
import "../../../../../models/AcademicSession";

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

  try {
    const invoices = await Invoice.find({ student: student._id })
      .populate({
        path: "term",
        select: "name session",
        populate: { path: "session", select: "name" },
      })
      .sort({ dueDate: -1 })
      .lean();
    const payments = await Payment.find({
      invoice: { $in: invoices.map((invoice) => invoice._id) },
    })
      .sort({ paidAt: -1 })
      .lean();
    const paymentsByInvoice = new Map<string, number>();
    for (const payment of payments) {
      const key = payment.invoice.toString();
      paymentsByInvoice.set(
        key,
        (paymentsByInvoice.get(key) ?? 0) + payment.amount,
      );
    }
    const bills = invoices.map((invoice) => {
      const paidAmount = paymentsByInvoice.get(invoice._id.toString()) ?? 0;
      const balance = Math.max(invoice.amount - paidAmount, 0);
      const isActuallyPaid =
        invoice.status === "PAID" ||
        (invoice.amount > 0 && paidAmount >= invoice.amount);
      return {
        _id: invoice._id.toString(),
        amount: invoice.amount,
        paidAmount,
        balance,
        dueDate: invoice.dueDate,
        status: isActuallyPaid ? "PAID" : invoice.status,
        term: invoice.term,
      };
    });

    return NextResponse.json({ payments, bills });
  } catch {
    return NextResponse.json(
      { error: "Unable to load student payments." },
      { status: 500 },
    );
  }
}
