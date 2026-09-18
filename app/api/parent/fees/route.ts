import { NextResponse } from "next/server";
import {
  getAuthorizedChildren,
  unauthorizedParentResponse,
} from "../../../../lib/parent-access";
import Invoice from "../../../../models/Invoice";

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
    return NextResponse.json({ invoices });
  } catch {
    return NextResponse.json(
      { error: "Unable to load fees." },
      { status: 500 },
    );
  }
}
