"use client";

import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Certificate01Icon } from "@hugeicons/core-free-icons";
import { children } from "../data";

type Result = { name: string; score: number; grade: string };
const demoResults: Result[] = [
  { name: "Mathematics", score: 86, grade: "A" },
  { name: "English Language", score: 78, grade: "B" },
  { name: "Basic Science", score: 82, grade: "A" },
  { name: "Social Studies", score: 74, grade: "B" },
];

export default function ParentResultsPage() {
  const [selectedChild, setSelectedChild] = useState(children[0].id);
  const [results, setResults] = useState(demoResults);
  useEffect(() => {
    fetch(`/api/parent/results?studentId=${selectedChild}`)
      .then(async (response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (data)
          setResults(
            data.assessments.map(
              (assessment: { subject?: { name?: string }; score: number }) => ({
                name: assessment.subject?.name ?? "Subject",
                score: assessment.score,
                grade:
                  assessment.score >= 80
                    ? "A"
                    : assessment.score >= 70
                      ? "B"
                      : "C",
              }),
            ),
          );
      })
      .catch(() => undefined);
  }, [selectedChild]);
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm text-foreground/60">
          Published academic results for your children
        </p>
        <h2 className="mt-1 text-xl font-medium text-foreground">Results</h2>
      </div>
      <div className="flex flex-wrap gap-3">
        <select
          value={selectedChild}
          onChange={(event) => setSelectedChild(event.target.value)}
          className="rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm"
        >
          <option value={children[0].id}>{children[0].name}</option>
          <option value={children[1].id}>{children[1].name}</option>
        </select>
        <select className="rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm">
          <option>First Term · 2026/2027</option>
          <option>Second Term · 2026/2027</option>
          <option>Third Term · 2026/2027</option>
        </select>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-navy/10 bg-white">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-navy/10 text-xs font-medium uppercase tracking-wide text-foreground/50">
              <th className="px-6 py-3.5">Subject</th>
              <th className="px-6 py-3.5">Score</th>
              <th className="px-6 py-3.5">Grade</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {results.map((subject) => (
              <tr key={subject.name} className="text-sm">
                <td className="px-6 py-4 font-medium text-foreground">
                  <span className="flex items-center gap-2">
                    <HugeiconsIcon
                      icon={Certificate01Icon}
                      size={17}
                      className="text-blue"
                    />
                    {subject.name}
                  </span>
                </td>
                <td className="px-6 py-4 text-foreground/70">
                  {subject.score}%
                </td>
                <td className="px-6 py-4 font-medium text-foreground">
                  {subject.grade}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
