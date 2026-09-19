"use client";

import { Fragment, useEffect, useState } from "react";
import type { FormEvent } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Coins01Icon, Download01Icon } from "@hugeicons/core-free-icons";
import LoadingState from "../../components/LoadingState";

type Invoice = {
  _id: string;
  amount: number;
  paidAmount?: number;
  balance?: number;
  dueDate: string;
  status: string;
  student?: { fullName?: string };
  classSection?: { name?: string; classLevel?: { name?: string } };
  term?: { name?: string; session?: { name?: string } };
};
export default function FeesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [summary, setSummary] = useState({
    collected: 0,
    pending: 0,
    overdue: 0,
  });
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [manualInvoiceId, setManualInvoiceId] = useState("");
  const [message, setMessage] = useState("");

  const load = async () => {
    const response = await fetch("/api/admin/fees");
    const data = await response.json();
    setInvoices(data.invoices ?? []);
    setSummary(data.summary ?? { collected: 0, pending: 0, overdue: 0 });
    setTotal(data.total ?? 0);
  };

  useEffect(() => {
    Promise.resolve()
      .then(load)
      .finally(() => setLoading(false));
  }, []);

  async function recordManualPayment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form));
    setMessage("");
    const response = await fetch("/api/admin/payments/manual", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...payload,
        amount: Number(payload.amount),
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      setMessage(data.error ?? "Unable to record manual payment.");
      return;
    }
    form.reset();
    setManualInvoiceId("");
    setMessage("Manual payment recorded and verified.");
    await load();
  }

  const statusStyles: Record<string, string> = {
    PAID: "bg-[#3F7A5B]/10 text-[#3F7A5B]",
    PENDING: "bg-blue-light text-blue",
    OVERDUE: "bg-[#B4483B]/10 text-[#B4483B]",
  };
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          ["Collected", summary.collected],
          ["Outstanding", summary.pending],
          ["Overdue", summary.overdue],
        ].map(([label, amount]) => (
          <div
            key={label}
            className="rounded-2xl border border-navy/10 bg-white p-5"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-light text-blue">
              <HugeiconsIcon icon={Coins01Icon} size={20} />
            </span>
            <p className="mt-4 text-2xl font-medium text-foreground">
              ₦{Number(amount).toLocaleString()}
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
            href="/dashboard/admin/finance/structure"
            className="rounded-full border border-navy/15 px-5 py-2.5 text-sm font-medium text-navy hover:bg-blue-light"
          >
            Define fees
          </a>
          <button className="flex items-center gap-2 rounded-full border border-navy/15 px-5 py-2.5 text-sm font-medium text-navy hover:bg-blue-light">
            <HugeiconsIcon icon={Download01Icon} size={18} />
            Export
          </button>
        </div>
      </div>
      {message && (
        <p className="rounded-2xl bg-white px-5 py-3 text-sm text-foreground/70">
          {message}
        </p>
      )}
      <div className="overflow-x-auto rounded-2xl border border-navy/10 bg-white">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-navy/10 text-xs font-medium uppercase tracking-wide text-foreground/50">
              <th className="px-6 py-3.5">Student</th>
              <th className="px-6 py-3.5">Class</th>
              <th className="px-6 py-3.5">Term</th>
              <th className="px-6 py-3.5">Amount</th>
              <th className="px-6 py-3.5">Paid</th>
              <th className="px-6 py-3.5">Balance</th>
              <th className="px-6 py-3.5">Due date</th>
              <th className="px-6 py-3.5">Status</th>
              <th className="px-6 py-3.5">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {loading ? (
              <tr>
                <td
                  colSpan={9}
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
                  colSpan={9}
                  className="p-8 text-center text-sm text-foreground/60"
                >
                  No invoices found.
                </td>
              </tr>
            ) : (
              invoices.map((invoice) => (
                <Fragment key={invoice._id}>
                  <tr key={invoice._id} className="text-sm">
                    <td className="px-6 py-4 font-medium text-foreground">
                      {invoice.student?.fullName ?? "Unknown student"}
                    </td>
                    <td className="px-6 py-4 text-foreground/70">
                      {invoice.classSection?.classLevel?.name}{" "}
                      {invoice.classSection?.name}
                    </td>
                    <td className="px-6 py-4 text-foreground/70">
                      {[invoice.term?.name, invoice.term?.session?.name]
                        .filter(Boolean)
                        .join(" · ") || "Term"}
                    </td>
                    <td className="px-6 py-4 text-foreground/70">
                      ₦{invoice.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-foreground/70">
                      ₦{(invoice.paidAmount ?? 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-foreground/70">
                      ₦{(invoice.balance ?? invoice.amount).toLocaleString()}
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
                    <td className="px-6 py-4">
                      {(invoice.balance ?? 0) > 0 && (
                        <button
                          type="button"
                          onClick={() =>
                            setManualInvoiceId((current) =>
                              current === invoice._id ? "" : invoice._id,
                            )
                          }
                          className="rounded-full border border-navy/15 px-3 py-1.5 text-xs font-medium text-navy hover:bg-blue-light"
                        >
                          Record payment
                        </button>
                      )}
                    </td>
                  </tr>
                  {manualInvoiceId === invoice._id && (
                    <tr key={`${invoice._id}-manual`}>
                      <td colSpan={9} className="bg-blue-light/35 px-6 py-5">
                        <form
                          onSubmit={recordManualPayment}
                          className="grid gap-3 lg:grid-cols-6"
                        >
                          <input
                            type="hidden"
                            name="invoiceId"
                            value={invoice._id}
                          />
                          <input
                            required
                            min="1"
                            max={invoice.balance ?? invoice.amount}
                            type="number"
                            name="amount"
                            placeholder="Amount"
                            defaultValue={invoice.balance ?? invoice.amount}
                            className="rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:border-blue"
                          />
                          <select
                            required
                            name="paymentMethod"
                            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-blue"
                          >
                            <option value="BANK_TRANSFER">Bank transfer</option>
                            <option value="CASH">Cash</option>
                            <option value="POS">POS</option>
                            <option value="CHEQUE">Cheque</option>
                            <option value="OTHER">Other</option>
                          </select>
                          <input
                            required
                            name="reference"
                            placeholder="Reference or teller no."
                            className="rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:border-blue"
                          />
                          <input
                            required
                            name="depositorName"
                            placeholder="Depositor name"
                            className="rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:border-blue"
                          />
                          <input
                            name="notes"
                            placeholder="Notes"
                            className="rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:border-blue"
                          />
                          <button className="rounded-xl bg-blue px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                            Save verified payment
                          </button>
                        </form>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
