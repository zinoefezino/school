import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/mongodb";
import { getSession } from "../../../../../lib/session";
import Student from "../../../../../models/Student";
import Assessment from "../../../../../models/Assessment";
import Term from "../../../../../models/Term";

function gradeFor(score: number) {
  if (score >= 80) return "A";
  if (score >= 70) return "B";
  if (score >= 60) return "C";
  if (score >= 50) return "D";
  return "F";
}

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "STUDENT")
    return NextResponse.json(
      { error: "Student authentication is required." },
      { status: 401 },
    );

  await connectDB();
  const student = await Student.findOne({ user: session.userId })
    .select("_id")
    .lean();
  if (!student)
    return NextResponse.json(
      { error: "Student profile not found." },
      { status: 404 },
    );

  const terms = await Term.find({ resultsPublished: true })
    .select("name session")
    .populate("session", "name")
    .sort({ _id: -1 })
    .lean();
  const assessments = await Assessment.find({
    student: student._id,
    term: { $in: terms.map((term) => term._id) },
  })
    .populate("subject", "name")
    .lean();

  const periods = terms.map((term) => {
    const termAssessments = assessments.filter(
      (assessment) => assessment.term.toString() === term._id.toString(),
    );
    const bySubject = new Map<
      string,
      { subject: string; score: number }
    >();
    for (const assessment of termAssessments) {
      const subject = assessment.subject as { _id?: string; name?: string };
      const key = subject?._id?.toString() ?? "unknown";
      const current = bySubject.get(key) ?? {
        subject: subject?.name ?? "Subject",
        score: 0,
      };
      current.score += assessment.score;
      bySubject.set(key, current);
    }
    const results = [...bySubject.values()].map((result) => ({
      ...result,
      grade: gradeFor(result.score),
    }));
    return {
      termId: term._id.toString(),
      term: term.name,
      session: (term.session as { name?: string } | undefined)?.name ?? "",
      results,
    };
  });

  return NextResponse.json({ periods });
}
