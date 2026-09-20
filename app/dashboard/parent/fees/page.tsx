"use client";

import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CheckmarkCircle02Icon,
  Coins01Icon,
  Download01Icon,
} from "@hugeicons/core-free-icons";
import LoadingState from "../../components/LoadingState";
import StatusMessage from "../../components/StatusMessage";

type ChildSummary = {
  id: string;
  name: string;
  classSection: string;
  balance: number | null;
  hasBill?: boolean;
  billPaid?: boolean;
};
type Invoice = {
  _id?: string;
  amount: number;
  paidAmount?: number;
  balance?: number;
  billPaid?: boolean;
  status: string;
  student?: { _id?: string; fullName?: string };
  classSection?: { name?: string; classLevel?: { name?: string } };
  term?: { name?: string; session?: { name?: string } };
  dueDate?: string;
  allowInstallments?: boolean;
  minimumInstallmentAmount?: number;
};
type Payment = {
  _id: string;
  amount: number;
  paystackReference: string;
  paidAt: string;
  invoice?: {
    student?: { _id?: string; fullName?: string };
    term?: { name?: string; session?: { name?: string } };
  };
};

function formatNaira(amount: number) {
  return `₦${amount.toLocaleString("en-NG")}`;
}

function formatMaybeNaira(amount: number | null | undefined) {
  return typeof amount === "number" ? formatNaira(amount) : "No bill";
}

export default function ParentFeesPage() {
  const [children, setChildren] = useState<ChildSummary[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChildId, setSelectedChildId] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/parent/children").then(async (response) =>
        response.ok ? response.json() : null,
      ),
      fetch("/api/parent/fees").then(async (response) =>
        response.ok ? response.json() : null,
      ),
    ])
      .then(([childrenData, feesData]) => {
        const nextChildren = childrenData?.children ?? [];
        setChildren(nextChildren);
        setSelectedChildId(nextChildren[0]?.id ?? "");
        setInvoices(feesData?.invoices ?? []);
        setPayments(feesData?.payments ?? []);
      })
      .catch(() => {
        setChildren([]);
        setInvoices([]);
        setPayments([]);
      })
      .finally(() => setLoading(false));
  }, []);

  async function startPayment(invoice: Invoice, amount: number) {
    if (!invoice._id) return;
    setMessage("");
    const response = await fetch("/api/parent/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ invoiceId: invoice._id, amount }),
    });
    const data = await response.json();
    setMessage(
      response.ok
        ? "Payment started."
        : (data.error ?? "Unable to start payment."),
    );
  }

  const selectedChild =
    children.find((child) => child.id === selectedChildId) ?? children[0];
  const childInvoices = invoices.filter(
    (invoice) =>
      invoice.student?._id === selectedChild?.id ||
      invoice.student?.fullName === selectedChild?.name,
  );
  const childPayments = payments.filter(
    (payment) =>
      payment.invoice?.student?._id === selectedChild?.id ||
      payment.invoice?.student?.fullName === selectedChild?.name,
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm text-foreground/60">
          Pay and review fees for every linked child
        </p>
        <h2 className="mt-1 text-xl font-medium text-foreground">
          Fees & payments
        </h2>
      </div>
      {loading ? (
        <LoadingState
          label="Loading fees..."
          className="rounded-2xl bg-white p-6"
        />
      ) : children.length === 0 ? (
        <p className="rounded-2xl bg-white p-6 text-sm text-foreground/60">
          No students are linked to your parent account yet.
        </p>
      ) : (
        <section className="rounded-2xl border border-navy/10 bg-white p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <label className="flex min-w-64 flex-col gap-2 text-sm font-medium text-foreground">
              Select child
              <select
                value={selectedChild?.id ?? ""}
                onChange={(event) => setSelectedChildId(event.target.value)}
                className="rounded-xl border border-black/10 bg-white px-4 py-3 font-normal"
              >
                {children.map((child) => (
                  <option key={child.id} value={child.id}>
                    {child.name}
                  </option>
                ))}
              </select>
            </label>
            <div className="text-right">
              <p className="text-sm text-foreground/60">Outstanding balance</p>
              <p
                className={`text-2xl font-medium ${
                  childInvoices.reduce(
                    (sum, invoice) => sum + (invoice.balance ?? 0),
                    0,
                  ) > 0
                    ? "text-[#B4483B]"
                    : childInvoices.some((invoice) => invoice.billPaid)
                      ? "text-[#3F7A5B]"
                      : "text-foreground"
                }`}
              >
                {formatMaybeNaira(
                  childInvoices.reduce(
                    (sum, invoice) => sum + (invoice.balance ?? 0),
                    0,
                  ),
                )}
              </p>
            </div>
          </div>

          {message && (
            <StatusMessage className="mt-5">{message}</StatusMessage>
          )}

          <div className="mt-6 grid gap-4">
            {childInvoices.length === 0 ? (
              <div className="rounded-xl bg-blue-light/50 px-4 py-3 text-sm text-foreground/70">
                No invoice has been assigned to {selectedChild?.name ?? "this child"} yet.
              </div>
            ) : (
              childInvoices.map((invoice) => {
                const balance = invoice.balance ?? invoice.amount;
                const billPaid = invoice.billPaid ?? false;
                const installmentAmount = Math.min(
                  invoice.minimumInstallmentAmount ?? balance,
                  balance,
                );
                return (
                  <article
                    key={invoice._id}
                    className="rounded-2xl border border-navy/10 p-5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <h3 className="font-medium text-foreground">
                          {[invoice.term?.name, invoice.term?.session?.name]
                            .filter(Boolean)
                            .join(" · ") || "School fee invoice"}
                        </h3>
                        <p className="mt-1 text-sm text-foreground/60">
                          {[
                            invoice.classSection?.classLevel?.name,
                            invoice.classSection?.name,
                          ]
                            .filter(Boolean)
                            .join(" ")}
                        </p>
                      </div>
                      <HugeiconsIcon
                        icon={Coins01Icon}
                        size={21}
                        className="text-blue"
                      />
                    </div>
                    <div className="mt-5 grid gap-3 text-sm text-foreground/70 sm:grid-cols-4">
                      <p>Total: {formatNaira(invoice.amount)}</p>
                      <p className="font-medium text-[#3F7A5B]">
                        Paid: {formatNaira(invoice.paidAmount ?? 0)}
                      </p>
                      <p
                        className={`font-medium ${
                          balance > 0 ? "text-[#B4483B]" : "text-[#3F7A5B]"
                        }`}
                      >
                        Balance: {formatNaira(balance)}
                      </p>
                      <p>
                        Due:{" "}
                        {invoice.dueDate
                          ? new Date(invoice.dueDate).toLocaleDateString()
                          : "Not set"}
                      </p>
                    </div>
                    {balance > 0 ? (
                      <div className="mt-5 flex flex-wrap gap-3">
                        <button
                          onClick={() => startPayment(invoice, balance)}
                          className="rounded-full bg-blue px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                        >
                          Pay full amount
                        </button>
                        {invoice.allowInstallments && (
                          <button
                            onClick={() =>
                              startPayment(invoice, installmentAmount)
                            }
                            className="rounded-full border border-navy/15 px-5 py-2.5 text-sm font-medium text-navy hover:bg-blue-light"
                          >
                            Pay installment of {formatNaira(installmentAmount)}
                          </button>
                        )}
                      </div>
                    ) : billPaid ? (
                      <div className="mt-5 flex items-center gap-2 text-sm font-medium text-[#3F7A5B]">
                        <HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} />
                        Paid in full
                      </div>
                    ) : (
                      <div className="mt-5 rounded-xl bg-blue-light/50 px-4 py-3 text-sm text-foreground/70">
                        No payment due.
                      </div>
                    )}
                  </article>
                );
              })
            )}
          </div>
        </section>
      )}
      <div>
        <h2 className="text-base font-medium text-foreground">
          Payment history
        </h2>
        <div className="mt-3 overflow-x-auto rounded-2xl border border-navy/10 bg-white">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-navy/10 text-xs font-medium uppercase tracking-wide text-foreground/50">
                <th className="px-6 py-3.5">Child</th>
                <th className="px-6 py-3.5">Reference</th>
                <th className="px-6 py-3.5">Amount</th>
                <th className="px-6 py-3.5">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {loading ? (
                <tr>
                  <td colSpan={4}>
                    <LoadingState
                      label="Loading payments..."
                      className="min-h-32"
                    />
                  </td>
                </tr>
            ) : childPayments.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="p-8 text-center text-sm text-foreground/60"
                  >
                    No payments have been recorded yet.
                  </td>
                </tr>
              ) : (
                childPayments.map((payment) => (
                  <tr key={payment._id} className="text-sm">
                    <td className="px-6 py-4 font-medium text-foreground">
                      {payment.invoice?.student?.fullName ?? "Student"}
                    </td>
                    <td className="px-6 py-4 text-foreground/70">
                      {payment.paystackReference}
                    </td>
                    <td className="px-6 py-4 font-medium text-[#3F7A5B]">
                      {formatNaira(payment.amount)}
                    </td>
                    <td className="px-6 py-4">
                      <a
                        href={`/api/parent/payments/${payment._id}/receipt`}
                        aria-label="Download receipt"
                        className="text-blue"
                      >
                        <HugeiconsIcon icon={Download01Icon} size={18} />
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
