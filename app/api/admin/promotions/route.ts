import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import { getSession } from "../../../../lib/session";
import Enrollment from "../../../../models/Enrollment";
import Invoice from "../../../../models/Invoice";
import ClassFee from "../../../../models/ClassFee";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN")
    return NextResponse.json(
      { error: "Admin authentication is required." },
      { status: 401 },
    );
  try {
    const body = (await request.json()) as {
      studentId?: string;
      classSectionId?: string;
      termId?: string;
    };
    if (!body.studentId || !body.classSectionId || !body.termId)
      return NextResponse.json(
        { error: "Student, class, and target term are required." },
        { status: 400 },
      );
    await connectDB();
    const fee = await ClassFee.findOne({
      classSection: body.classSectionId,
      term: body.termId,
    }).lean();
    if (!fee)
      return NextResponse.json(
        {
          error:
            "Configure the class fee for this term before promoting students.",
        },
        { status: 400 },
      );
    const existing = await Enrollment.findOne({
      student: body.studentId,
      term: body.termId,
    });
    if (existing)
      return NextResponse.json(
        { error: "This student already has an enrollment for that term." },
        { status: 409 },
      );
    await Enrollment.updateMany(
      { student: body.studentId, status: "ACTIVE" },
      { $set: { status: "COMPLETED" } },
    );
    const enrollment = await Enrollment.create({
      student: body.studentId,
      classSection: body.classSectionId,
      term: body.termId,
      status: "ACTIVE",
    });
    const invoice = await Invoice.create({
      student: body.studentId,
      classSection: body.classSectionId,
      term: body.termId,
      amount: fee.amount,
      dueDate: fee.dueDate,
      status: "PENDING",
    });
    return NextResponse.json(
      {
        enrollmentId: enrollment._id.toString(),
        invoiceId: invoice._id.toString(),
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof Error && error.message.includes("E11000"))
      return NextResponse.json(
        { error: "A record already exists for this student and term." },
        { status: 409 },
      );
    return NextResponse.json(
      { error: "Unable to promote student." },
      { status: 500 },
    );
  }
}
