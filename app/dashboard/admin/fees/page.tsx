"use client";

import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Coins01Icon, Download01Icon } from "@hugeicons/core-free-icons";
import LoadingState from "../../components/LoadingState";

type Invoice = {
  _id: string;
  amount: number;
  dueDate: string;
  status: string;
  student?: { fullName?: string };
  classSection?: { name?: string; classLevel?: { name?: string } };
};
export default function FeesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [summary, setSummary] = useState<{ _id: string; total: number }[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch("/api/admin/fees")
      .then((response) => response.json())
      .then((data) => {
        setInvoices(data.invoices ?? []);
        setSummary(data.summary ?? []);
        setTotal(data.total ?? 0);
      })
      .finally(() => setLoading(false));
  }, []);
  const totalFor = (status: string) =>
    summary.find((item) => item._id === status)?.total ?? 0;
  const statusStyles: Record<string, string> = {
    PAID: "bg-[#3F7A5B]/10 text-[#3F7A5B]",
    PENDING: "bg-blue-light text-blue",
    OVERDUE: "bg-[#B4483B]/10 text-[#B4483B]",
  };
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          ["Collected", "PAID"],
          ["Pending", "PENDING"],
          ["Overdue", "OVERDUE"],
        ].map(([label, status]) => (
          <div
            key={status}
            className="rounded-2xl border border-navy/10 bg-white p-5"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-light text-blue">
              <HugeiconsIcon icon={Coins01Icon} size={20} />
            </span>
            <p className="mt-4 text-2xl font-medium text-foreground">
              ₦{totalFor(status).toLocaleString()}
            </p>
            <p className="mt-1 text-sm text-foreground/60">{label}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-foreground/60">
          {total.toLocaleString()} invoices
        </p>
        <div className="flex gap-2">
          <a
            href="/dashboard/admin/fees/schedule"
            className="rounded-full border border-navy/15 px-5 py-2.5 text-sm font-medium text-navy hover:bg-blue-light"
          >
            Fee schedules
          </a>
          <button className="flex items-center gap-2 rounded-full border border-navy/15 px-5 py-2.5 text-sm font-medium text-navy hover:bg-blue-light">
            <HugeiconsIcon icon={Download01Icon} size={18} />
            Export
          </button>
        </div>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-navy/10 bg-white">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-navy/10 text-xs font-medium uppercase tracking-wide text-foreground/50">
              <th className="px-6 py-3.5">Student</th>
              <th className="px-6 py-3.5">Class</th>
              <th className="px-6 py-3.5">Amount</th>
              <th className="px-6 py-3.5">Due date</th>
              <th className="px-6 py-3.5">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {loading ? (
              <tr>
                <td
                  colSpan={5}
                  className="p-8 text-center text-sm text-foreground/60"
                >
                  <LoadingState
                    label="Loading invoices..."
                    className="min-h-24"
                  />
                </td>
              </tr>
            ) : invoices.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="p-8 text-center text-sm text-foreground/60"
                >
                  No invoices found.
                </td>
              </tr>
            ) : (
              invoices.map((invoice) => (
                <tr key={invoice._id} className="text-sm">
                  <td className="px-6 py-4 font-medium text-foreground">
                    {invoice.student?.fullName ?? "Unknown student"}
                  </td>
                  <td className="px-6 py-4 text-foreground/70">
                    {invoice.classSection?.classLevel?.name}{" "}
                    {invoice.classSection?.name}
                  </td>
                  <td className="px-6 py-4 text-foreground/70">
                    ₦{invoice.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-foreground/70">
                    {new Date(invoice.dueDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[invoice.status] ?? "bg-blue-light text-blue"}`}
                    >
                      {invoice.status}
                    </span>
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
