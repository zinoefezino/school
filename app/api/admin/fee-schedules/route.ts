import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import { getSession } from "../../../../lib/session";
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
      classSectionId?: string;
      termId?: string;
      amount?: number;
      dueDate?: string;
    };
    if (
      !body.classSectionId ||
      !body.termId ||
      typeof body.amount !== "number" ||
      body.amount < 0 ||
      !body.dueDate
    )
      return NextResponse.json(
        { error: "Class, term, amount, and due date are required." },
        { status: 400 },
      );
    await connectDB();
    const schedule = await ClassFee.findOneAndUpdate(
      { classSection: body.classSectionId, term: body.termId },
      {
        classSection: body.classSectionId,
        term: body.termId,
        amount: body.amount,
        dueDate: body.dueDate,
      },
      { upsert: true, new: true, runValidators: true },
    ).lean();
    return NextResponse.json({ schedule }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Unable to save class fee schedule." },
      { status: 500 },
    );
  }
}
