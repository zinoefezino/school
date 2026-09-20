import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import { getSession } from "../../../../lib/session";
import Student from "../../../../models/Student";
import ClassSection from "../../../../models/ClassSection";
import Term from "../../../../models/Term";
import Staff from "../../../../models/Staff";
import "../../../../models/ClassLevel";
import "../../../../models/AcademicSession";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN")
    return NextResponse.json(
      { error: "Admin authentication is required." },
      { status: 401 },
    );
  await connectDB();
  const [students, classes, terms, staff] = await Promise.all([
    Student.find()
      .select("_id fullName admissionNumber")
      .sort({ fullName: 1 })
      .lean(),
    ClassSection.find()
      .select("_id name classLevel")
      .populate("classLevel", "name")
      .sort({ name: 1 })
      .lean(),
    Term.find()
      .select("_id name session")
      .populate("session", "name")
      .sort({ _id: -1 })
      .lean(),
    Staff.find().select("_id fullName").sort({ fullName: 1 }).lean(),
  ]);
  return NextResponse.json({ students, classes, terms, staff });
}
