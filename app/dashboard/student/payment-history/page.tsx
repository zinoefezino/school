import { HugeiconsIcon } from "@hugeicons/react";
import {
  CheckmarkCircle02Icon,
  Download01Icon,
  Invoice01Icon,
} from "@hugeicons/core-free-icons";

const payments = [
  {
    reference: "PAY-2026-0081",
    date: "Sep 5, 2026",
    method: "Bank transfer",
    amount: "₦105,000",
    status: "Successful",
  },
  {
    reference: "PAY-2026-0044",
    date: "Jun 12, 2026",
    method: "Card",
    amount: "₦98,000",
    status: "Successful",
  },
];

export default function PaymentHistoryPage() {
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
              <th className="px-6 py-3.5">Method</th>
              <th className="px-6 py-3.5">Amount</th>
              <th className="px-6 py-3.5">Status</th>
              <th className="px-6 py-3.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {payments.map((payment) => (
              <tr key={payment.reference} className="text-sm">
                <td className="px-6 py-4 font-medium text-foreground">
                  <span className="flex items-center gap-2">
                    <HugeiconsIcon
                      icon={Invoice01Icon}
                      size={17}
                      className="text-blue"
                    />
                    {payment.reference}
                  </span>
                </td>
                <td className="px-6 py-4 text-foreground/70">{payment.date}</td>
                <td className="px-6 py-4 text-foreground/70">
                  {payment.method}
                </td>
                <td className="px-6 py-4 text-foreground/70">
                  {payment.amount}
                </td>
                <td className="px-6 py-4">
                  <span className="flex items-center gap-1.5 text-[#3F7A5B]">
                    <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} />
                    {payment.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    aria-label={`Download receipt for ${payment.reference}`}
                    className="text-blue hover:text-navy"
                  >
                    <HugeiconsIcon icon={Download01Icon} size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
