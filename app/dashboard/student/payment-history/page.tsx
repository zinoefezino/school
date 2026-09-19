"use client";

import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CheckmarkCircle02Icon,
  Download01Icon,
  Invoice01Icon,
} from "@hugeicons/core-free-icons";
import LoadingState from "../../components/LoadingState";

type Payment = {
  _id: string;
  paystackReference: string;
  paidAt: string;
  amount: number;
};

function formatNaira(amount: number) {
  return `₦${amount.toLocaleString("en-NG")}`;
}

export default function PaymentHistoryPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/student/payments")
      .then(async (response) => (response.ok ? response.json() : null))
      .then((data) => setPayments(data?.payments ?? []))
      .catch(() => setPayments([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm text-foreground/60">
          A record of payments made for your account
        </p>
        <h2 className="mt-1 text-xl font-medium text-foreground">
          Payment history
        </h2>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-navy/10 bg-white">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-navy/10 text-xs font-medium uppercase tracking-wide text-foreground/50">
              <th className="px-6 py-3.5">Reference</th>
              <th className="px-6 py-3.5">Date</th>
              <th className="px-6 py-3.5">Amount</th>
              <th className="px-6 py-3.5">Status</th>
              <th className="px-6 py-3.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {loading ? (
              <tr>
                <td colSpan={5}>
                  <LoadingState
                    label="Loading payments..."
                    className="min-h-32"
                  />
                </td>
              </tr>
            ) : payments.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="p-8 text-center text-sm text-foreground/60"
                >
                  No payments have been recorded yet.
                </td>
              </tr>
            ) : (
              payments.map((payment) => (
                <tr key={payment._id} className="text-sm">
                  <td className="px-6 py-4 font-medium text-foreground">
                    <span className="flex items-center gap-2">
                      <HugeiconsIcon
                        icon={Invoice01Icon}
                        size={17}
                        className="text-blue"
                      />
                      {payment.paystackReference}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-foreground/70">
                    {new Date(payment.paidAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-foreground/70">
                    {formatNaira(payment.amount)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1.5 text-[#3F7A5B]">
                      <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} />
                      Successful
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      aria-label={`Download receipt for ${payment.paystackReference}`}
                      className="text-blue hover:text-navy"
                    >
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
  );
}
