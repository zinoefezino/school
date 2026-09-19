"use client";

import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Certificate01Icon } from "@hugeicons/core-free-icons";
import LoadingState from "../../components/LoadingState";

type ChildSummary = { id: string; name: string };
type Result = { name: string; score: number; grade: string };

function gradeFor(score: number) {
  if (score >= 80) return "A";
  if (score >= 70) return "B";
  if (score >= 60) return "C";
  if (score >= 50) return "D";
  return "F";
}

export default function ParentResultsPage() {
  const [children, setChildren] = useState<ChildSummary[]>([]);
  const [selectedChild, setSelectedChild] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [loadingChildren, setLoadingChildren] = useState(true);
  const [loadingResults, setLoadingResults] = useState(false);

  useEffect(() => {
    fetch("/api/parent/children")
      .then(async (response) => (response.ok ? response.json() : null))
      .then((data) => {
        const nextChildren = data?.children ?? [];
        setChildren(nextChildren);
        setSelectedChild(nextChildren[0]?.id ?? "");
      })
      .catch(() => setChildren([]))
      .finally(() => setLoadingChildren(false));
  }, []);

  useEffect(() => {
    if (!selectedChild) return;
    Promise.resolve().then(() => setLoadingResults(true));
    fetch(`/api/parent/results?studentId=${selectedChild}`)
      .then(async (response) => (response.ok ? response.json() : null))
      .then((data) => {
        setResults(
          (data?.assessments ?? []).map(
            (assessment: { subject?: { name?: string }; score: number }) => ({
              name: assessment.subject?.name ?? "Subject",
              score: assessment.score,
              grade: gradeFor(assessment.score),
            }),
          ),
        );
      })
      .catch(() => setResults([]))
      .finally(() => setLoadingResults(false));
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
          {children.map((child) => (
            <option key={child.id} value={child.id}>
              {child.name}
            </option>
          ))}
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
            {loadingChildren || loadingResults ? (
              <tr>
                <td colSpan={3}>
                  <LoadingState
                    label="Loading results..."
                    className="min-h-32"
                  />
                </td>
              </tr>
            ) : results.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="p-8 text-center text-sm text-foreground/60"
                >
                  No published results yet.
                </td>
              </tr>
            ) : (
              results.map((subject) => (
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
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
