import { NextResponse } from "next/server";
import {
  getAuthorizedChildren,
  unauthorizedParentResponse,
} from "../../../../lib/parent-access";
import Invoice from "../../../../models/Invoice";
import Payment from "../../../../models/Payment";
import "../../../../models/Term";
import "../../../../models/AcademicSession";
import "../../../../models/Student";
import "../../../../models/ClassSection";
import "../../../../models/ClassLevel";

export async function GET() {
  try {
    const children = await getAuthorizedChildren();
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
      .populate({
        path: "classSection",
        select: "name classLevel",
        populate: { path: "classLevel", select: "name" },
      })
      .sort({ dueDate: -1 })
      .lean();
    const payments = await Payment.find({
      invoice: { $in: invoices.map((invoice) => invoice._id) },
    })
      .populate({
        path: "invoice",
        select: "student term",
        populate: [
          { path: "student", select: "fullName admissionNumber" },
          {
            path: "term",
            select: "name session",
            populate: { path: "session", select: "name" },
          },
        ],
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
      const isActuallyPaid =
        invoice.status === "PAID" ||
        (invoice.amount > 0 && paidAmount >= invoice.amount);
      return {
        ...invoice,
        paidAmount,
        balance,
        billPaid: isActuallyPaid,
        status: isActuallyPaid ? "PAID" : invoice.status,
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
