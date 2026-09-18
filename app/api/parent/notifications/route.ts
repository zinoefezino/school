import { NextResponse } from "next/server";
import {
  getAuthorizedChildren,
  unauthorizedParentResponse,
} from "../../../../lib/parent-access";
import Announcement from "../../../../models/Announcement";
import Assessment from "../../../../models/Assessment";
import Invoice from "../../../../models/Invoice";
import Term from "../../../../models/Term";

export async function GET(request: Request) {
  try {
    const children = await getAuthorizedChildren(request);
    if (!children) return unauthorizedParentResponse();
    const childIds = children.map((child) => child._id);
    const [announcements, invoices, publishedTerms] = await Promise.all([
      Announcement.find({ audiences: { $in: ["PARENT"] } })
        .sort({ publishedAt: -1 })
        .limit(20)
        .lean(),
      Invoice.find({
        student: { $in: childIds },
        status: { $in: ["PENDING", "OVERDUE"] },
      })
        .populate("student", "fullName")
        .sort({ dueDate: 1 })
        .lean(),
      Term.find({ resultsPublished: true })
        .select("name session")
        .sort({ _id: -1 })
        .limit(10)
        .lean(),
    ]);
    const publishedTermIds = publishedTerms.map((term) => term._id);
    const resultTerms = await Assessment.find({
      student: { $in: childIds },
      term: { $in: publishedTermIds },
    }).distinct("term");
    return NextResponse.json({
      announcements,
      outstandingInvoices: invoices,
      publishedTerms: publishedTerms.filter((term) =>
        resultTerms.some((id) => id.equals(term._id)),
      ),
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to load parent notifications." },
      { status: 500 },
    );
  }
}
