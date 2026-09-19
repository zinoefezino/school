import { NextResponse } from "next/server";
import {
  getAuthorizedChildren,
  unauthorizedParentResponse,
} from "../../../../lib/parent-access";
import Invoice from "../../../../models/Invoice";
import Payment from "../../../../models/Payment";

export async function POST(request: Request) {
  const children = await getAuthorizedChildren();
  if (!children) return unauthorizedParentResponse();

  const body = (await request.json()) as {
    invoiceId?: string;
    amount?: number;
  };

  if (!body.invoiceId || typeof body.amount !== "number" || body.amount <= 0)
    return NextResponse.json(
      { error: "Invoice and payment amount are required." },
      { status: 400 },
    );

  const childIds = children.map((child) => child._id);
  const invoice = await Invoice.findOne({
    _id: body.invoiceId,
    student: { $in: childIds },
  });

  if (!invoice)
    return NextResponse.json(
      { error: "Invoice not found for this parent account." },
      { status: 404 },
    );

  const payments = await Payment.find({ invoice: invoice._id })
    .select("amount")
    .lean();
  const paidAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const balance = Math.max(invoice.amount - paidAmount, 0);

  if (balance <= 0)
    return NextResponse.json(
      { error: "This invoice has already been paid." },
      { status: 400 },
    );

  if (body.amount > balance)
    return NextResponse.json(
      { error: "Payment amount cannot be higher than the outstanding balance." },
      { status: 400 },
    );

  if (
    body.amount < balance &&
    (!invoice.allowInstallments ||
      body.amount < (invoice.minimumInstallmentAmount ?? 0))
  )
    return NextResponse.json(
      {
        error:
          "Installment payment is not allowed for this invoice or the amount is below the minimum installment.",
      },
      { status: 400 },
    );

  return NextResponse.json(
    {
      error:
        "Payment gateway is not configured yet. This validated payment request is ready for the final payment integration phase.",
      invoiceId: invoice._id.toString(),
      amount: body.amount,
      balance,
    },
    { status: 501 },
  );
}
