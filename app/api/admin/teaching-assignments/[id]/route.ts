import { NextResponse } from "next/server";
import { Types } from "mongoose";
import { connectDB } from "../../../../../lib/mongodb";
import { getSession } from "../../../../../lib/session";
import TeachingAssignment from "../../../../../models/TeachingAssignment";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN")
    return NextResponse.json(
      { error: "Admin authentication is required." },
      { status: 401 },
    );

  const { id } = await params;
  if (!Types.ObjectId.isValid(id))
    return NextResponse.json(
      { error: "Invalid teaching assignment." },
      { status: 400 },
    );

  await connectDB();
  await TeachingAssignment.deleteOne({ _id: id });
  return NextResponse.json({ deleted: true });
}
