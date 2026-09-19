import { NextResponse } from "next/server";
import {
  getAuthorizedChildren,
  unauthorizedParentResponse,
} from "../../../../lib/parent-access";
import Invoice from "../../../../models/Invoice";
import Payment from "../../../../models/Payment";

export async function GET(request: Request) {
  try {
    const children = await getAuthorizedChildren(request);
    if (!children) return unauthorizedParentResponse();
    const invoices = await Invoice.find({
      student: { $in: children.map((child) => child._id) },
    })
      .populate("student", "fullName admissionNumber")
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
      .populate({
        path: "invoice",
        select: "student",
        populate: { path: "student", select: "fullName admissionNumber" },
      })
      .sort({ paidAt: -1 })
      .lean();
    const paidByInvoice = new Map<string, number>();
    for (const payment of payments) {
      const invoice = payment.invoice as { _id?: { toString(): string } };
      const invoiceId = invoice?._id?.toString();
      if (!invoiceId) continue;
      paidByInvoice.set(
        invoiceId,
        (paidByInvoice.get(invoiceId) ?? 0) + payment.amount,
      );
    }
    const invoicesWithBalance = invoices.map((invoice) => {
      const paidAmount = paidByInvoice.get(invoice._id.toString()) ?? 0;
      const balance = Math.max(invoice.amount - paidAmount, 0);
      return {
        ...invoice,
        paidAmount,
        balance,
        status: balance <= 0 ? "PAID" : invoice.status,
      };
    });
    return NextResponse.json({ invoices: invoicesWithBalance, payments });
  } catch {
    return NextResponse.json(
      { error: "Unable to load fees." },
      { status: 500 },
    );
  }
}
