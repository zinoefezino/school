"use client";

import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ChartBarLineIcon,
  Coins01Icon,
  Invoice01Icon,
  MoneyReceive01Icon,
} from "@hugeicons/core-free-icons";
import LoadingState from "../../components/LoadingState";

type SessionSummary = {
  sessionId: string;
  sessionName: string;
  totalBilled: number;
  totalCollected: number;
  outstanding: number;
  overdue: number;
  invoiceCount: number;
  paidInvoiceCount: number;
  collectionRate: number;
};

type FinanceOverview = {
  totals: {
    totalBilled: number;
    totalCollected: number;
    outstanding: number;
    overdue: number;
    invoiceCount: number;
    paidInvoiceCount: number;
    collectionRate: number;
  };
  sessions: SessionSummary[];
  recentTransactions: {
    _id: string;
    amount: number;
    paidAt: string;
    reference: string;
    studentName: string;
  }[];
};

function formatNaira(amount: number) {
  return `₦${amount.toLocaleString("en-NG")}`;
}

export default function FinanceOverviewPage() {
  const [data, setData] = useState<FinanceOverview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/finance/overview")
      .then(async (response) => (response.ok ? response.json() : null))
      .then((result) => setData(result))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState label="Loading finance overview..." />;

  const totals = data?.totals ?? {
    totalBilled: 0,
    totalCollected: 0,
    outstanding: 0,
    overdue: 0,
    invoiceCount: 0,
    paidInvoiceCount: 0,
    collectionRate: 0,
  };
  const sessions = data?.sessions ?? [];
  const maxBilled = Math.max(
    ...sessions.map((item) => item.totalBilled),
    1,
  );

  const cards = [
    {
      label: "Total billed",
      value: formatNaira(totals.totalBilled),
      icon: Invoice01Icon,
    },
    {
      label: "Total collected",
      value: formatNaira(totals.totalCollected),
      icon: Coins01Icon,
    },
    {
      label: "Outstanding",
      value: formatNaira(totals.outstanding),
      icon: MoneyReceive01Icon,
    },
    {
      label: "Collection rate",
      value: `${totals.collectionRate}%`,
      icon: ChartBarLineIcon,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-navy/10 bg-white p-5"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-light text-blue">
              <HugeiconsIcon icon={card.icon} size={20} />
            </span>
            <p className="mt-4 text-2xl font-medium text-foreground">
              {card.value}
            </p>
            <p className="mt-1 text-sm text-foreground/60">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <section className="rounded-2xl border border-navy/10 bg-white p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-medium text-foreground">
                Session finance overview
              </h2>
              <p className="mt-1 text-sm text-foreground/60">
                Billed fees, paid fees, balances, and collection rate per
                academic session.
              </p>
            </div>
            <span className="rounded-full bg-blue-light px-3 py-1 text-xs font-medium text-blue">
              {totals.invoiceCount.toLocaleString()} invoices
            </span>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-navy/10 text-xs font-medium uppercase tracking-wide text-foreground/50">
                  <th className="px-3 py-3">Session</th>
                  <th className="px-3 py-3">Billed</th>
                  <th className="px-3 py-3">Collected</th>
                  <th className="px-3 py-3">Outstanding</th>
                  <th className="px-3 py-3">Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {sessions.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-3 py-8 text-center text-sm text-foreground/60"
                    >
                      No finance records yet. Publish a fee structure to
                      generate invoices.
                    </td>
                  </tr>
                ) : (
                  sessions.map((session) => (
                    <tr key={session.sessionId} className="text-sm">
                      <td className="px-3 py-4 font-medium text-foreground">
                        {session.sessionName}
                      </td>
                      <td className="px-3 py-4 text-foreground/70">
                        {formatNaira(session.totalBilled)}
                      </td>
                      <td className="px-3 py-4 text-foreground/70">
                        {formatNaira(session.totalCollected)}
                      </td>
                      <td className="px-3 py-4 text-foreground/70">
                        {formatNaira(session.outstanding)}
                      </td>
                      <td className="px-3 py-4">
                        <div className="flex min-w-36 items-center gap-2">
                          <div className="h-2 flex-1 rounded-full bg-blue-light">
                            <div
                              className="h-full rounded-full bg-blue"
                              style={{
                                width: `${Math.min(session.collectionRate, 100)}%`,
                              }}
                            />
                          </div>
                          <span className="text-xs font-medium text-foreground/70">
                            {session.collectionRate}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-2xl border border-navy/10 bg-white p-6">
          <h2 className="text-lg font-medium text-foreground">
            Illustrative figures
          </h2>
          <p className="mt-1 text-sm text-foreground/60">
            A quick visual comparison of billed, collected, and outstanding
            fees by session.
          </p>
          <div className="mt-6 flex flex-col gap-5">
            {sessions.slice(0, 5).map((session) => (
              <div key={session.sessionId}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">
                    {session.sessionName}
                  </span>
                  <span className="text-foreground/60">
                    {formatNaira(session.totalBilled)}
                  </span>
                </div>
                <div className="space-y-1.5">
                  <div className="h-2 rounded-full bg-blue-light">
                    <div
                      className="h-full rounded-full bg-blue"
                      style={{
                        width: `${(session.totalBilled / maxBilled) * 100}%`,
                      }}
                    />
                  </div>
                  <div className="h-2 rounded-full bg-[#3F7A5B]/10">
                    <div
                      className="h-full rounded-full bg-[#3F7A5B]"
                      style={{
                        width: `${(session.totalCollected / maxBilled) * 100}%`,
                      }}
                    />
                  </div>
                  <div className="h-2 rounded-full bg-[#B4483B]/10">
                    <div
                      className="h-full rounded-full bg-[#B4483B]"
                      style={{
                        width: `${(session.outstanding / maxBilled) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
            {sessions.length === 0 && (
              <p className="rounded-xl bg-blue-light/50 p-4 text-sm text-foreground/60">
                Charts will appear after invoices are generated.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
