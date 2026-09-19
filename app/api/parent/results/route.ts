import { NextResponse } from "next/server";
import {
  getAuthorizedChild,
  unauthorizedParentResponse,
} from "../../../../lib/parent-access";
import Assessment from "../../../../models/Assessment";
import Term from "../../../../models/Term";

export async function GET(request: Request) {
  try {
    const params = new URL(request.url).searchParams;
    const studentId = params.get("studentId");
    if (!studentId)
      return NextResponse.json(
        { error: "studentId is required." },
        { status: 400 },
      );
    const child = await getAuthorizedChild(studentId);
    if (!child) return unauthorizedParentResponse();
    const termQuery = params.get("termId")
      ? { _id: params.get("termId"), resultsPublished: true }
      : { resultsPublished: true };
    const terms = await Term.find(termQuery)
      .select("name session resultsPublished")
      .populate("session", "name")
      .lean();
    const termIds = terms.map((term) => term._id);
    const assessments = await Assessment.find({
      student: child._id,
      term: { $in: termIds },
    })
      .populate("subject", "name")
      .populate("term", "name session")
      .lean();
    return NextResponse.json({ student: child, terms, assessments });
  } catch {
    return NextResponse.json(
      { error: "Unable to load results." },
      { status: 500 },
    );
  }
}
