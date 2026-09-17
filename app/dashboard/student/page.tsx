import { HugeiconsIcon } from "@hugeicons/react";
import {
  CheckmarkCircle02Icon,
  TimeScheduleIcon,
  Award01Icon,
} from "@hugeicons/core-free-icons";

// Placeholder — will come from Student, ClassSection, Term, and Assessment documents once wired up
const student = {
  fullName: "Chidera Okafor",
  admissionNumber: "FA-2026-0142",
  classSection: "JSS1 Gold",
  classTeacher: "Mrs. Adaeze Nwosu",
  classSize: 38,
};

const term = {
  name: "First Term",
  session: "2026/2027",
  resultsPublished: true, // will read from Term.resultsPublished
  position: 5, // e.g. 5th out of 38
  average: 78.5,
  teacherRemark:
    "Chidera has shown great improvement this term, especially in Mathematics and Basic Science. Keep up the consistent effort.",
};

const results = [
  { subject: "Mathematics", ca: 28, exam: 58, total: 86, grade: "A" },
  { subject: "English Language", ca: 24, exam: 52, total: 76, grade: "B" },
  { subject: "Basic Science", ca: 26, exam: 55, total: 81, grade: "A" },
  { subject: "Social Studies", ca: 22, exam: 50, total: 72, grade: "B" },
];

function ordinal(n: number) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export default function StudentResultsPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Student info card */}
      <div className="rounded-2xl border border-navy/10 bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-lg font-medium text-foreground">
              {student.fullName}
            </h1>
            <p className="mt-1 text-sm text-foreground/60">
              {student.admissionNumber} · {student.classSection}
            </p>
          </div>
          <div className="text-sm text-foreground/70">
            <p>
              Class teacher:{" "}
              <span className="font-medium text-foreground">
                {student.classTeacher}
              </span>
            </p>
            <p className="mt-1 text-foreground/50">
              {term.name}, {term.session}
            </p>
          </div>
        </div>
      </div>

      {term.resultsPublished ? (
        <>
          {/* Summary stats */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-4 rounded-2xl border border-navy/10 bg-white p-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-light text-blue">
                <HugeiconsIcon icon={Award01Icon} size={22} />
              </span>
              <div>
                <p className="text-lg font-medium text-foreground">
                  {ordinal(term.position)} of {student.classSize}
                </p>
                <p className="text-sm text-foreground/60">Position in class</p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl border border-navy/10 bg-white p-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-light text-blue">
                <HugeiconsIcon icon={CheckmarkCircle02Icon} size={22} />
              </span>
              <div>
                <p className="text-lg font-medium text-foreground">
                  {term.average}%
                </p>
                <p className="text-sm text-foreground/60">Term average</p>
              </div>
            </div>
          </div>

          {/* Results table */}
          <div className="overflow-x-auto rounded-2xl border border-navy/10 bg-white">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-navy/10 text-xs font-medium uppercase tracking-wide text-foreground/50">
                  <th className="px-6 py-3.5">Subject</th>
                  <th className="px-6 py-3.5">CA</th>
                  <th className="px-6 py-3.5">Exam</th>
                  <th className="px-6 py-3.5">Total</th>
                  <th className="px-6 py-3.5">Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {results.map((row) => (
                  <tr key={row.subject} className="text-sm">
                    <td className="whitespace-nowrap px-6 py-3.5 font-medium text-foreground">
                      {row.subject}
                    </td>
                    <td className="whitespace-nowrap px-6 py-3.5 text-foreground/70">
                      {row.ca}
                    </td>
                    <td className="whitespace-nowrap px-6 py-3.5 text-foreground/70">
                      {row.exam}
                    </td>
                    <td className="whitespace-nowrap px-6 py-3.5 font-medium text-foreground">
                      {row.total}
                    </td>
                    <td className="whitespace-nowrap px-6 py-3.5 text-foreground/70">
                      {row.grade}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Class teacher's remark */}
          <div className="rounded-2xl border border-navy/10 bg-white p-6">
            <h2 className="text-sm font-medium text-foreground">
              Class teacher's remark
            </h2>
            <p className="mt-2 text-sm leading-6 text-foreground/70">
              {term.teacherRemark}
            </p>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-navy/10 bg-white px-6 py-16 text-center">
          <HugeiconsIcon
            icon={TimeScheduleIcon}
            size={32}
            className="text-navy/30"
          />
          <p className="text-sm font-medium text-foreground">
            Results for {term.name} haven&apos;t been published yet
          </p>
          <p className="text-sm text-foreground/60">
            Check back once your school releases them.
          </p>
        </div>
      )}
    </div>
  );
}
