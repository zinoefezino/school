import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/mongodb";
import { getSession } from "../../../../../lib/session";
import AcademicSession from "../../../../../models/AcademicSession";
import Invoice from "../../../../../models/Invoice";
import Payment from "../../../../../models/Payment";
import Term from "../../../../../models/Term";
import "../../../../../models/Student";

type SessionSummary = {
  sessionId: string;
  sessionName: string;
  totalBilled: number;
  totalCollected: number;
  outstanding: number;
  overdue: number;
  invoiceCount: number;
  paidInvoiceCount: number;
  collectionRate: number;
};

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN")
    return NextResponse.json(
      { error: "Admin authentication is required." },
      { status: 401 },
    );

  await connectDB();
  const [sessions, terms, invoices, payments] = await Promise.all([
    AcademicSession.find().sort({ name: -1 }).lean(),
    Term.find().select("_id session").lean(),
    Invoice.find()
      .select("_id term amount dueDate status")
      .sort({ createdAt: -1 })
      .lean(),
    Payment.find()
      .select("invoice amount paidAt paystackReference")
      .populate({
        path: "invoice",
        select: "term student",
        populate: { path: "student", select: "fullName" },
      })
      .sort({ paidAt: -1 })
      .limit(8)
      .lean(),
  ]);

  const sessionById = new Map(
    sessions.map((item) => [
      item._id.toString(),
      { id: item._id.toString(), name: item.name },
    ]),
  );
  const termSessionById = new Map(
    terms.map((term) => [term._id.toString(), term.session.toString()]),
  );
  const paidByInvoice = new Map<string, number>();

  const allPayments = await Payment.find().select("invoice amount").lean();
  allPayments.forEach((payment) => {
    const key = payment.invoice.toString();
    paidByInvoice.set(key, (paidByInvoice.get(key) ?? 0) + payment.amount);
  });

  const bySession = new Map<string, SessionSummary>();
  const ensureSummary = (sessionId: string) => {
    const sessionInfo = sessionById.get(sessionId);
    const existing = bySession.get(sessionId);
    if (existing) return existing;
    const next: SessionSummary = {
      sessionId,
      sessionName: sessionInfo?.name ?? "Unknown session",
      totalBilled: 0,
      totalCollected: 0,
      outstanding: 0,
      overdue: 0,
      invoiceCount: 0,
      paidInvoiceCount: 0,
      collectionRate: 0,
    };
    bySession.set(sessionId, next);
    return next;
  };

  const now = new Date();
  invoices.forEach((invoice) => {
    const sessionId = termSessionById.get(invoice.term.toString());
    if (!sessionId) return;
    const summary = ensureSummary(sessionId);
    const paidAmount = paidByInvoice.get(invoice._id.toString()) ?? 0;
    const balance = Math.max(invoice.amount - paidAmount, 0);
    summary.totalBilled += invoice.amount;
    summary.totalCollected += paidAmount;
    summary.outstanding += balance;
    summary.invoiceCount += 1;
    if (balance <= 0) {
      summary.paidInvoiceCount += 1;
    } else if (invoice.status === "OVERDUE" || new Date(invoice.dueDate) < now) {
      summary.overdue += balance;
    }
  });

  const sessionSummaries = [...bySession.values()]
    .map((item) => ({
      ...item,
      collectionRate: item.totalBilled
        ? Math.round((item.totalCollected / item.totalBilled) * 100)
        : 0,
    }))
    .sort((first, second) =>
      second.sessionName.localeCompare(first.sessionName),
    );

  const totals = sessionSummaries.reduce(
    (sum, item) => ({
      totalBilled: sum.totalBilled + item.totalBilled,
      totalCollected: sum.totalCollected + item.totalCollected,
      outstanding: sum.outstanding + item.outstanding,
      overdue: sum.overdue + item.overdue,
      invoiceCount: sum.invoiceCount + item.invoiceCount,
      paidInvoiceCount: sum.paidInvoiceCount + item.paidInvoiceCount,
    }),
    {
      totalBilled: 0,
      totalCollected: 0,
      outstanding: 0,
      overdue: 0,
      invoiceCount: 0,
      paidInvoiceCount: 0,
    },
  );

  return NextResponse.json({
    totals: {
      ...totals,
      collectionRate: totals.totalBilled
        ? Math.round((totals.totalCollected / totals.totalBilled) * 100)
        : 0,
    },
    sessions: sessionSummaries,
    recentTransactions: payments.map((payment) => {
      const invoice = payment.invoice as
        | { student?: { fullName?: string } }
        | undefined;
      return {
        _id: payment._id.toString(),
        amount: payment.amount,
        paidAt: payment.paidAt,
        reference: payment.paystackReference,
        studentName: invoice?.student?.fullName ?? "Student",
      };
    }),
  });
}
