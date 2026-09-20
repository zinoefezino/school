import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import { getSession } from "../../../../lib/session";
import Invoice from "../../../../models/Invoice";
import Payment from "../../../../models/Payment";
import Student from "../../../../models/Student";
import ClassSection from "../../../../models/ClassSection";
import "../../../../models/ClassLevel";
import "../../../../models/Term";
import "../../../../models/AcademicSession";

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function GET(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN")
    return NextResponse.json(
      { error: "Admin authentication is required." },
      { status: 401 },
    );
  const params = new URL(request.url).searchParams;
  const page = Math.max(Number(params.get("page") ?? 1), 1);
  const limit = Math.min(Math.max(Number(params.get("limit") ?? 25), 1), 100);
  const search = params.get("search")?.trim();
  const status = params.get("status");
  await connectDB();
  const query: Record<string, unknown> = {};
  if (status === "PENDING" || status === "PAID" || status === "OVERDUE")
    query.status = status;
  if (search) {
    const regex = new RegExp(escapeRegex(search), "i");
    const [students, classSections] = await Promise.all([
      Student.find({ fullName: regex }).select("_id").lean(),
      ClassSection.find({ name: regex }).select("_id").lean(),
    ]);
    query.$or = [
      { student: { $in: students.map((student) => student._id) } },
      { classSection: { $in: classSections.map((item) => item._id) } },
    ];
  }
  const [invoices, total, allInvoices, payments] = await Promise.all([
    Invoice.find(query)
      .populate("student", "fullName")
      .populate({
        path: "classSection",
        populate: { path: "classLevel", select: "name" },
        select: "name classLevel",
      })
      .populate({
        path: "term",
        select: "name session",
        populate: { path: "session", select: "name" },
      })
      .sort({ dueDate: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Invoice.countDocuments(query),
    Invoice.find(query).select("_id amount dueDate status").lean(),
    Payment.find().select("invoice amount").lean(),
  ]);
  const paidByInvoice = new Map<string, number>();
  payments.forEach((payment) => {
    const key = payment.invoice.toString();
    paidByInvoice.set(key, (paidByInvoice.get(key) ?? 0) + payment.amount);
  });
  const now = new Date();
  const summary = {
    collected: payments.reduce((sum, payment) => sum + payment.amount, 0),
    pending: 0,
    overdue: 0,
  };
  allInvoices.forEach((invoice) => {
    const paidAmount = paidByInvoice.get(invoice._id.toString()) ?? 0;
    const balance = Math.max(invoice.amount - paidAmount, 0);
    if (balance <= 0) return;
    if (invoice.status === "OVERDUE" || new Date(invoice.dueDate) < now) {
      summary.overdue += balance;
    } else {
      summary.pending += balance;
    }
  });
  const invoicesWithBalance = invoices.map((invoice) => {
    const paidAmount = paidByInvoice.get(invoice._id.toString()) ?? 0;
    const balance = Math.max(invoice.amount - paidAmount, 0);
    const status =
      balance <= 0
        ? "PAID"
        : invoice.status === "OVERDUE" || new Date(invoice.dueDate) < now
          ? "OVERDUE"
          : invoice.status;
    return { ...invoice, paidAmount, balance, status };
  });
  return NextResponse.json({
    invoices: invoicesWithBalance,
    total,
    page,
    limit,
    pages: Math.ceil(total / limit),
    summary,
  });
}
