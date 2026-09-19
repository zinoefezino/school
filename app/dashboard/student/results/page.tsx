"use client";

import { useEffect, useMemo, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Certificate01Icon,
  Download01Icon,
  TrendingUpIcon,
} from "@hugeicons/core-free-icons";
import LoadingState from "../../components/LoadingState";
import { studentReadResultTermsStorageKey } from "../../../../lib/announcements";

type Result = {
  subject: string;
  score: number;
  grade: string;
};
type ResultPeriod = {
  termId: string;
  term: string;
  session: string;
  results: Result[];
};

export default function ResultsPage() {
  const [periods, setPeriods] = useState<ResultPeriod[]>([]);
  const [selectedTermId, setSelectedTermId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/student/results")
      .then(async (response) => (response.ok ? response.json() : null))
      .then((data) => {
        const nextPeriods = data?.periods ?? [];
        setPeriods(nextPeriods);
        setSelectedTermId(nextPeriods[0]?.termId ?? "");
        window.localStorage.setItem(
          studentReadResultTermsStorageKey(),
          JSON.stringify(
            nextPeriods
              .map((period: ResultPeriod) => period.termId)
              .filter(Boolean),
          ),
        );
      })
      .catch(() => setPeriods([]))
      .finally(() => setLoading(false));
  }, []);

  const selectedPeriod =
    periods.find((period) => period.termId === selectedTermId) ?? periods[0];
  const sessionOptions = useMemo(
    () => [...new Set(periods.map((period) => period.session).filter(Boolean))],
    [periods],
  );
  const termOptions = periods.filter(
    (period) => period.session === (selectedPeriod?.session ?? ""),
  );
  const results = selectedPeriod?.results ?? [];
  const average = results.length
    ? (
        results.reduce((total, result) => total + result.score, 0) /
        results.length
      ).toFixed(1)
    : "0.0";
  const downloadResult = (format: "pdf" | "docx") => {
    if (!selectedPeriod?.termId || results.length === 0) return;
    const link = document.createElement("a");
    link.href = `/api/dashboard/student/results/export?termId=${selectedPeriod.termId}&format=${format}`;
    link.rel = "noopener";
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

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
          {results.length > 0 && (
            <div className="flex items-end gap-2">
              <button
                type="button"
                onClick={() => downloadResult("pdf")}
                className="flex items-center gap-2 rounded-full border border-navy/15 px-4 py-2.5 text-sm font-medium text-navy hover:bg-blue-light"
              >
                <HugeiconsIcon icon={Download01Icon} size={16} />
                PDF
              </button>
              <button
                type="button"
                onClick={() => downloadResult("docx")}
                className="flex items-center gap-2 rounded-full border border-navy/15 px-4 py-2.5 text-sm font-medium text-navy hover:bg-blue-light"
              >
                <HugeiconsIcon icon={Download01Icon} size={16} />
                DOCX
              </button>
            </div>
          )}
          <label className="flex flex-col gap-1 text-xs text-foreground/50">
            Session
            <select
              value={selectedPeriod?.session ?? ""}
              onChange={(event) => {
                const nextPeriod = periods.find(
                  (period) => period.session === event.target.value,
                );
                setSelectedTermId(nextPeriod?.termId ?? "");
              }}
              className="rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm text-foreground outline-none focus:border-blue"
            >
              {sessionOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs text-foreground/50">
            Term
            <select
              value={selectedTermId}
              onChange={(event) => setSelectedTermId(event.target.value)}
              className="rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm text-foreground outline-none focus:border-blue"
            >
              {termOptions.map((option) => (
                <option key={option.termId} value={option.termId}>
                  {option.term}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-2xl border border-navy/10 bg-white px-5 py-4">
        <div>
          <p className="text-sm font-medium text-foreground">
            {selectedPeriod?.term ?? "No published term"}
          </p>
          <p className="mt-1 text-xs text-foreground/50">
            {selectedPeriod?.session ?? ""} session
          </p>
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

      {loading ? (
        <LoadingState
          label="Loading results..."
          className="rounded-2xl border border-dashed border-navy/20 bg-white p-8"
        />
      ) : results.length > 0 ? (
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
                        style={{ width: `${Math.min(result.score, 100)}%` }}
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
