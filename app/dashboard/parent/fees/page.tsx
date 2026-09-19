"use client";

import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CheckmarkCircle02Icon,
  Coins01Icon,
  Download01Icon,
} from "@hugeicons/core-free-icons";
import LoadingState from "../../components/LoadingState";

type ChildSummary = {
  id: string;
  name: string;
  classSection: string;
  balance: number;
};
type Invoice = {
  _id?: string;
  amount: number;
  status: string;
  student?: { _id?: string; fullName?: string };
  term?: { name?: string; session?: { name?: string } };
};
type Payment = {
  _id: string;
  amount: number;
  paystackReference: string;
  paidAt: string;
  invoice?: {
    student?: { fullName?: string };
  };
};

function formatNaira(amount: number) {
  return `₦${amount.toLocaleString("en-NG")}`;
}

export default function ParentFeesPage() {
  const [children, setChildren] = useState<ChildSummary[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

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
        setChildren(childrenData?.children ?? []);
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
        <div className="grid gap-4 sm:grid-cols-2">
          {children.map((child) => {
            const invoice = invoices.find(
              (item) => item.student?.fullName === child.name,
            );
            const balance =
              invoice?.status === "PAID" ? 0 : (invoice?.amount ?? child.balance);
            const termName = invoice?.term?.name ?? "No active invoice";
            const sessionName = invoice?.term?.session?.name ?? "";
            return (
              <article
                key={child.id}
                className="rounded-2xl border border-navy/10 bg-white p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-medium text-foreground">
                      {child.name}
                    </h3>
                    <p className="mt-1 text-sm text-foreground/60">
                      {[child.classSection, termName, sessionName]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  </div>
                  <HugeiconsIcon
                    icon={Coins01Icon}
                    size={21}
                    className="text-blue"
                  />
                </div>
                <p className="mt-6 text-3xl font-medium text-foreground">
                  {formatNaira(balance)}
                </p>
                <p className="mt-1 text-sm text-foreground/60">
                  Outstanding balance
                </p>
                {balance > 0 ? (
                  <button className="mt-5 w-full rounded-full bg-blue px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700">
                    Pay {formatNaira(balance)}
                  </button>
                ) : (
                  <div className="mt-5 flex items-center gap-2 text-sm font-medium text-[#3F7A5B]">
                    <HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} />
                    Paid in full
                  </div>
                )}
              </article>
            );
          })}
        </div>
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
              ) : payments.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="p-8 text-center text-sm text-foreground/60"
                  >
                    No payments have been recorded yet.
                  </td>
                </tr>
              ) : (
                payments.map((payment) => (
                  <tr key={payment._id} className="text-sm">
                    <td className="px-6 py-4 font-medium text-foreground">
                      {payment.invoice?.student?.fullName ?? "Student"}
                    </td>
                    <td className="px-6 py-4 text-foreground/70">
                      {payment.paystackReference}
                    </td>
                    <td className="px-6 py-4 text-foreground/70">
                      {formatNaira(payment.amount)}
                    </td>
                    <td className="px-6 py-4">
                      <button aria-label="Download receipt" className="text-blue">
                        <HugeiconsIcon icon={Download01Icon} size={18} />
                      </button>
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
