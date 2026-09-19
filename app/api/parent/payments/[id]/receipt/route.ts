import { NextResponse } from "next/server";
import {
  getAuthorizedChildren,
  unauthorizedParentResponse,
} from "../../../../../../lib/parent-access";
import Payment from "../../../../../../models/Payment";
import "../../../../../../models/Invoice";
import "../../../../../../models/Student";
import "../../../../../../models/Term";
import "../../../../../../models/AcademicSession";

function safePdfText(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function createReceiptPdf(lines: string[]) {
  const stream = [
    "BT",
    "/F1 18 Tf",
    "50 780 Td",
    ...lines.flatMap((line, index) => [
      index === 0 ? "/F1 18 Tf" : "/F1 12 Tf",
      `(${safePdfText(line)}) Tj`,
      "0 -24 Td",
    ]),
    "ET",
  ].join("\n");
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}\nendstream`,
  ];
  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [0];
  objects.forEach((object, index) => {
    offsets.push(Buffer.byteLength(pdf));
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xrefOffset = Buffer.byteLength(pdf);
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const offset of offsets.slice(1)) {
    pdf += `${offset.toString().padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  return Buffer.from(pdf);
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const children = await getAuthorizedChildren();
  if (!children) return unauthorizedParentResponse();

  const childIds = new Set(children.map((child) => child._id.toString()));
  const { id } = await params;
  const payment = await Payment.findById(id)
    .populate({
      path: "invoice",
      select: "student term amount",
      populate: [
        { path: "student", select: "fullName admissionNumber" },
        {
          path: "term",
          select: "name session",
          populate: { path: "session", select: "name" },
        },
      ],
    })
    .lean();

  const invoice = payment?.invoice as
    | {
        amount?: number;
        student?: {
          _id?: { toString(): string };
          fullName?: string;
          admissionNumber?: string;
        };
        term?: { name?: string; session?: { name?: string } };
      }
    | undefined;
  const studentId = invoice?.student?._id?.toString();

  if (!payment || !invoice || !studentId || !childIds.has(studentId))
    return NextResponse.json({ error: "Receipt not found." }, { status: 404 });

  const fileBase = `receipt-${payment.paystackReference}`.replace(
    /[^a-z0-9-]+/gi,
    "-",
  );
  const body = createReceiptPdf([
    "Payment Receipt",
    `Student: ${invoice.student?.fullName ?? "Student"}`,
    `Admission No: ${invoice.student?.admissionNumber ?? ""}`,
    `Period: ${invoice.term?.name ?? "Term"} ${invoice.term?.session?.name ?? ""}`,
    `Reference: ${payment.paystackReference}`,
    `Amount paid: NGN ${payment.amount.toLocaleString("en-NG")}`,
    `Paid on: ${new Date(payment.paidAt).toLocaleDateString()}`,
    `Channel: ${payment.channel ?? "GATEWAY"}`,
  ]);

  return new NextResponse(body, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${fileBase}.pdf"`,
    },
  });
}
