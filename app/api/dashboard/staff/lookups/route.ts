import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/mongodb";
import { getSession } from "../../../../../lib/session";
import Term from "../../../../../models/Term";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "STAFF")
    return NextResponse.json(
      { error: "Staff authentication is required." },
      { status: 401 },
    );

  await connectDB();
  const terms = await Term.find()
    .select("_id name session")
    .populate("session", "name")
    .sort({ _id: -1 })
    .lean();
  return NextResponse.json({ terms });
}
