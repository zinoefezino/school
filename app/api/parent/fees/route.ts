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
      .populate("term", "name session")
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
    return NextResponse.json({ invoices, payments });
  } catch {
    return NextResponse.json(
      { error: "Unable to load fees." },
      { status: 500 },
    );
  }
}
