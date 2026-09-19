"use client";

import { useEffect, useState } from "react";
import LoadingState from "../../../components/LoadingState";

type Transaction = {
  _id: string;
  amount: number;
  paidAt: string;
  reference: string;
  studentName: string;
};

function formatNaira(amount: number) {
  return `₦${amount.toLocaleString("en-NG")}`;
}

export default function FinanceTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/finance/overview")
      .then(async (response) => (response.ok ? response.json() : null))
      .then((data) => setTransactions(data?.recentTransactions ?? []))
      .catch(() => setTransactions([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="rounded-2xl border border-navy/10 bg-white p-6">
      <h2 className="text-lg font-medium text-foreground">Transactions</h2>
      <p className="mt-1 text-sm text-foreground/60">
        Recent recorded fee payments.
      </p>
      <div className="mt-5 overflow-x-auto">
        {loading ? (
          <LoadingState label="Loading transactions..." className="min-h-32" />
        ) : transactions.length === 0 ? (
          <p className="rounded-xl bg-blue-light/50 p-4 text-sm text-foreground/60">
            No payment transactions have been recorded yet.
          </p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-navy/10 text-xs font-medium uppercase tracking-wide text-foreground/50">
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Reference</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {transactions.map((transaction) => (
                <tr key={transaction._id} className="text-sm">
                  <td className="px-4 py-4 font-medium text-foreground">
                    {transaction.studentName}
                  </td>
                  <td className="px-4 py-4 text-foreground/70">
                    {transaction.reference}
                  </td>
                  <td className="px-4 py-4 text-foreground/70">
                    {formatNaira(transaction.amount)}
                  </td>
                  <td className="px-4 py-4 text-foreground/70">
                    {new Date(transaction.paidAt).toLocaleDateString()}
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
