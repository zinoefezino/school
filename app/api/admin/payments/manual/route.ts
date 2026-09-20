import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/mongodb";
import { getSession } from "../../../../../lib/session";
import { writeAuditLog } from "../../../../../lib/audit";
import Invoice from "../../../../../models/Invoice";
import Payment from "../../../../../models/Payment";

type ManualPaymentBody = {
  invoiceId?: string;
  amount?: number;
  paymentMethod?: "BANK_TRANSFER" | "CASH" | "POS" | "CHEQUE" | "OTHER";
  reference?: string;
  depositorName?: string;
  notes?: string;
};

const allowedMethods = new Set([
  "BANK_TRANSFER",
  "CASH",
  "POS",
  "CHEQUE",
  "OTHER",
]);

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN")
    return NextResponse.json(
      { error: "Admin authentication is required." },
      { status: 401 },
    );

  const body = (await request.json()) as ManualPaymentBody;
  const amount = Number(body.amount);
  const method = body.paymentMethod;

  if (
    !body.invoiceId ||
    !amount ||
    amount <= 0 ||
    !method ||
    !allowedMethods.has(method) ||
    !body.reference?.trim() ||
    !body.depositorName?.trim()
  )
    return NextResponse.json(
      {
        error:
          "Invoice, amount, payment method, reference, and depositor name are required.",
      },
      { status: 400 },
    );

  await connectDB();
  const invoice = await Invoice.findById(body.invoiceId);
  if (!invoice)
    return NextResponse.json({ error: "Invoice not found." }, { status: 404 });

  const existingPayments = await Payment.find({ invoice: invoice._id })
    .select("amount")
    .lean();
  const paidAmount = existingPayments.reduce(
    (sum, payment) => sum + payment.amount,
    0,
  );
  const balance = Math.max(invoice.amount - paidAmount, 0);

  if (balance <= 0)
    return NextResponse.json(
      { error: "This invoice has already been paid." },
      { status: 400 },
    );

  if (amount > balance)
    return NextResponse.json(
      { error: "Manual payment cannot exceed the outstanding balance." },
      { status: 400 },
    );

  const reference = body.reference.trim();
  const payment = await Payment.create({
    invoice: invoice._id,
    amount,
    paystackReference: `MANUAL-${reference}`,
    paidAt: new Date(),
    channel: method === "BANK_TRANSFER" ? "BANK_TRANSFER" : method === "CASH" ? "CASH" : "MANUAL",
    paymentMethod: method,
    depositorName: body.depositorName.trim(),
    notes: body.notes?.trim() || undefined,
    verificationStatus: "VERIFIED",
    recordedBy: session.userId,
  });

  if (amount >= balance) {
    invoice.status = "PAID";
    await invoice.save();
  }

  await writeAuditLog({
    session,
    action: "admin.payment.manualRecord",
    targetType: "Payment",
    targetId: payment._id.toString(),
    metadata: {
      invoiceId: invoice._id.toString(),
      amount,
      method,
      reference,
    },
  });

  return NextResponse.json({ payment }, { status: 201 });
}
