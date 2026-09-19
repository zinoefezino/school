import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import { getSession } from "../../../../lib/session";
import ClassFee from "../../../../models/ClassFee";
import Enrollment from "../../../../models/Enrollment";
import Invoice from "../../../../models/Invoice";
import "../../../../models/ClassSection";
import "../../../../models/ClassLevel";
import "../../../../models/Term";
import "../../../../models/AcademicSession";

function parseBoolean(value: unknown) {
  return value === true || value === "true" || value === "on";
}

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN")
    return NextResponse.json(
      { error: "Admin authentication is required." },
      { status: 401 },
    );

  await connectDB();
  const schedules = await ClassFee.find()
    .populate({
      path: "classSection",
      select: "name classLevel",
      populate: { path: "classLevel", select: "name" },
    })
    .populate({
      path: "term",
      select: "name session",
      populate: { path: "session", select: "name" },
    })
    .sort({ createdAt: -1 })
    .limit(100)
    .lean();

  const invoiceCounts = await Invoice.aggregate([
    {
      $group: {
        _id: "$classFee",
        invoices: { $sum: 1 },
      },
    },
  ]);
  const countsBySchedule = new Map(
    invoiceCounts
      .filter((item) => item._id)
      .map((item) => [item._id.toString(), item.invoices as number]),
  );

  return NextResponse.json({
    schedules: schedules.map((schedule) => ({
      ...schedule,
      invoiceCount: countsBySchedule.get(schedule._id.toString()) ?? 0,
    })),
  });
}

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
      allowInstallments?: boolean | string;
      minimumInstallmentAmount?: number | string;
      publish?: boolean | string;
    };
    const allowInstallments = parseBoolean(body.allowInstallments);
    const minimumInstallmentAmount =
      body.minimumInstallmentAmount === undefined ||
      body.minimumInstallmentAmount === ""
        ? undefined
        : Number(body.minimumInstallmentAmount);
    if (
      !body.classSectionId ||
      !body.termId ||
      typeof body.amount !== "number" ||
      body.amount < 0 ||
      !body.dueDate ||
      (allowInstallments &&
        (typeof minimumInstallmentAmount !== "number" ||
          Number.isNaN(minimumInstallmentAmount) ||
          minimumInstallmentAmount <= 0 ||
          minimumInstallmentAmount > body.amount))
    )
      return NextResponse.json(
        {
          error:
            "Class, term, amount, due date, and valid installment settings are required.",
        },
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
        allowInstallments,
        minimumInstallmentAmount: allowInstallments
          ? minimumInstallmentAmount
          : undefined,
        ...(parseBoolean(body.publish) ? { publishedAt: new Date() } : {}),
      },
      { upsert: true, new: true, runValidators: true },
    );

    let generated = 0;
    let updated = 0;
    if (parseBoolean(body.publish)) {
      const enrollments = await Enrollment.find({
        classSection: body.classSectionId,
        term: body.termId,
        status: "ACTIVE",
      })
        .select("student")
        .lean();

      for (const enrollment of enrollments) {
        const existing = await Invoice.findOne({
          student: enrollment.student,
          term: body.termId,
        });
        if (existing) {
          if (existing.status !== "PAID") {
            existing.amount = body.amount;
            existing.dueDate = new Date(body.dueDate);
            existing.classSection = schedule.classSection;
            existing.allowInstallments = allowInstallments;
            existing.minimumInstallmentAmount = allowInstallments
              ? minimumInstallmentAmount
              : undefined;
            existing.classFee = schedule._id;
            await existing.save();
            updated += 1;
          }
          continue;
        }

        await Invoice.create({
          student: enrollment.student,
          classSection: body.classSectionId,
          term: body.termId,
          amount: body.amount,
          dueDate: body.dueDate,
          status: "PENDING",
          allowInstallments,
          minimumInstallmentAmount: allowInstallments
            ? minimumInstallmentAmount
            : undefined,
          classFee: schedule._id,
        });
        generated += 1;
      }
    }

    return NextResponse.json(
      { schedule: schedule.toObject(), generated, updated },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { error: "Unable to save class fee schedule." },
      { status: 500 },
    );
  }
}
