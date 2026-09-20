"use client";

import { useEffect, useState } from "react";
import LoadingState from "../../../components/LoadingState";

type SessionSummary = {
  sessionId: string;
  sessionName: string;
  totalBilled: number;
  totalCollected: number;
  outstanding: number;
  overdue: number;
  collectionRate: number;
};

function formatNaira(amount: number) {
  return `₦${amount.toLocaleString("en-NG")}`;
}

export default function FinancialReportsPage() {
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/finance/overview")
      .then(async (response) => (response.ok ? response.json() : null))
      .then((data) => setSessions(data?.sessions ?? []))
      .catch(() => setSessions([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="rounded-2xl border border-navy/10 bg-white p-6">
      <h2 className="text-lg font-medium text-foreground">
        Financial reports
      </h2>
      <p className="mt-1 text-sm text-foreground/60">
        Session level report summary. CSV or PDF export can be added when the
        school confirms the required report format.
      </p>
      <div className="mt-5 overflow-x-auto">
        {loading ? (
          <LoadingState label="Loading reports..." className="min-h-32" />
        ) : sessions.length === 0 ? (
          <p className="rounded-xl bg-blue-light/50 p-4 text-sm text-foreground/60">
            No finance report data is available yet.
          </p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-navy/10 text-xs font-medium uppercase tracking-wide text-foreground/50">
                <th className="px-4 py-3">Session</th>
                <th className="px-4 py-3">Billed</th>
                <th className="px-4 py-3">Collected</th>
                <th className="px-4 py-3">Outstanding</th>
                <th className="px-4 py-3">Overdue</th>
                <th className="px-4 py-3">Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {sessions.map((session) => (
                <tr key={session.sessionId} className="text-sm">
                  <td className="px-4 py-4 font-medium text-foreground">
                    {session.sessionName}
                  </td>
                  <td className="px-4 py-4 text-foreground/70">
                    {formatNaira(session.totalBilled)}
                  </td>
                  <td className="px-4 py-4 font-medium text-[#3F7A5B]">
                    {formatNaira(session.totalCollected)}
                  </td>
                  <td className="px-4 py-4 font-medium text-[#B4483B]">
                    {formatNaira(session.outstanding)}
                  </td>
                  <td className="px-4 py-4 font-medium text-[#B4483B]">
                    {formatNaira(session.overdue)}
                  </td>
                  <td className="px-4 py-4 text-foreground/70">
                    {session.collectionRate}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
