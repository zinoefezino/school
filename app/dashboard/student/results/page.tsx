"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Certificate01Icon, TrendingUpIcon } from "@hugeicons/core-free-icons";

type TermName = "First Term" | "Second Term" | "Third Term";

type Result = {
  subject: string;
  score: number;
  grade: string;
};

const sessions = ["2026/2027", "2025/2026"];
const terms: TermName[] = ["First Term", "Second Term", "Third Term"];

const resultsByPeriod: Record<string, Result[]> = {
  "2026/2027|First Term": [
    { subject: "Mathematics", score: 86, grade: "A" },
    { subject: "English Language", score: 78, grade: "B" },
    { subject: "Basic Science", score: 82, grade: "A" },
    { subject: "Social Studies", score: 74, grade: "B" },
    { subject: "Computer Studies", score: 91, grade: "A" },
  ],
  "2026/2027|Second Term": [
    { subject: "Mathematics", score: 89, grade: "A" },
    { subject: "English Language", score: 81, grade: "A" },
    { subject: "Basic Science", score: 84, grade: "A" },
    { subject: "Social Studies", score: 79, grade: "B" },
    { subject: "Computer Studies", score: 93, grade: "A" },
  ],
  "2026/2027|Third Term": [
    { subject: "Mathematics", score: 92, grade: "A" },
    { subject: "English Language", score: 84, grade: "A" },
    { subject: "Basic Science", score: 88, grade: "A" },
    { subject: "Social Studies", score: 81, grade: "A" },
    { subject: "Computer Studies", score: 95, grade: "A" },
  ],
  "2025/2026|Third Term": [
    { subject: "Mathematics", score: 80, grade: "A" },
    { subject: "English Language", score: 73, grade: "B" },
    { subject: "Basic Science", score: 78, grade: "B" },
    { subject: "Social Studies", score: 76, grade: "B" },
    { subject: "Computer Studies", score: 87, grade: "A" },
  ],
};

export default function ResultsPage() {
  const [session, setSession] = useState(sessions[0]);
  const [term, setTerm] = useState<TermName>(terms[0]);
  const resultKey = `${session}|${term}`;
  const results = resultsByPeriod[resultKey] ?? [];
  const average = results.length
    ? (
        results.reduce((total, result) => total + result.score, 0) /
        results.length
      ).toFixed(1)
    : "0.0";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-foreground/60">
            View published results from any available academic period
          </p>
          <h2 className="mt-1 text-xl font-medium text-foreground">
            Academic results
          </h2>
        </div>
        <div className="flex flex-wrap gap-3">
          <label className="flex flex-col gap-1 text-xs text-foreground/50">
            Session
            <select
              value={session}
              onChange={(event) => setSession(event.target.value)}
              className="rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm text-foreground outline-none focus:border-blue"
            >
              {sessions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs text-foreground/50">
            Term
            <select
              value={term}
              onChange={(event) => setTerm(event.target.value as TermName)}
              className="rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm text-foreground outline-none focus:border-blue"
            >
              {terms.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-2xl border border-navy/10 bg-white px-5 py-4">
        <div>
          <p className="text-sm font-medium text-foreground">{term}</p>
          <p className="mt-1 text-xs text-foreground/50">{session} session</p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <HugeiconsIcon
            icon={TrendingUpIcon}
            size={18}
            className="text-blue"
          />
          <span className="text-foreground/60">Average</span>
          <strong className="text-foreground">{average}%</strong>
        </div>
      </div>

      {results.length > 0 ? (
        <div className="overflow-x-auto rounded-2xl border border-navy/10 bg-white">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-navy/10 text-xs font-medium uppercase tracking-wide text-foreground/50">
                <th className="px-6 py-3.5">Subject</th>
                <th className="px-6 py-3.5">Score</th>
                <th className="px-6 py-3.5">Grade</th>
                <th className="px-6 py-3.5">Progress</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {results.map((result) => (
                <tr key={result.subject} className="text-sm">
                  <td className="px-6 py-4 font-medium text-foreground">
                    <span className="flex items-center gap-2">
                      <HugeiconsIcon
                        icon={Certificate01Icon}
                        size={17}
                        className="text-blue"
                      />
                      {result.subject}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-foreground/70">
                    {result.score}%
                  </td>
                  <td className="px-6 py-4 font-medium text-foreground">
                    {result.grade}
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-2 w-32 overflow-hidden rounded-full bg-blue-light">
                      <div
                        className="h-full rounded-full bg-blue"
                        style={{ width: `${result.score}%` }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-navy/20 bg-white p-8 text-center text-sm text-foreground/60">
          Results for this term have not been published yet.
        </div>
      )}
    </div>
  );
}
