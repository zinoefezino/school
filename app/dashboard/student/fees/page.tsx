"use client";

import { useEffect, useMemo, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Coins01Icon, Invoice01Icon, ReceiptDollarIcon } from "@hugeicons/core-free-icons";
import LoadingState from "../../components/LoadingState";

type Bill = {
  _id: string;
  amount: number;
  paidAmount: number;
  balance: number;
  dueDate: string;
  status: "PENDING" | "PAID" | "OVERDUE";
  term?: { name?: string; session?: { name?: string } };
};

function formatNaira(amount: number) {
  return `₦${amount.toLocaleString("en-NG")}`;
}

export default function FeesPage() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/student/payments")
      .then(async (response) => (response.ok ? response.json() : null))
      .then((data) => setBills(data?.bills ?? []))
      .catch(() => setBills([]))
      .finally(() => setLoading(false));
  }, []);

  const currentBill = bills[0];
  const outstanding = useMemo(
    () => bills.reduce((total, bill) => total + bill.balance, 0),
    [bills],
  );

  if (loading) return <LoadingState label="Loading current bill..." />;
  const currentBillStatus = currentBill
    ? currentBill.balance > 0
      ? "Outstanding"
      : currentBill.status === "PAID" || currentBill.paidAmount > 0
        ? "Paid in full"
        : "No payment due"
    : "No bill assigned";
  const currentBillStatusClass = currentBill
    ? currentBill.balance > 0
      ? "text-[#B4483B]"
      : currentBill.status === "PAID" || currentBill.paidAmount > 0
        ? "text-[#3F7A5B]"
        : "text-foreground/60"
    : "text-foreground/60";

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-navy/10 bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm text-foreground/60">
              {currentBill?.term?.name ?? "No active bill"}
              {currentBill?.term?.session?.name
                ? ` · ${currentBill.term.session.name}`
                : ""}
            </p>
            <h2 className="mt-1 text-xl font-medium text-foreground">
              Current bill
            </h2>
          </div>
          <HugeiconsIcon icon={Coins01Icon} size={25} className="text-blue" />
        </div>
        <p
          className={`mt-6 text-3xl font-medium ${
            currentBill && currentBill.balance > 0
              ? "text-[#B4483B]"
              : currentBill && currentBill.balance === 0
                ? "text-[#3F7A5B]"
                : "text-foreground"
          }`}
        >
          {currentBill ? formatNaira(currentBill.balance) : "No bill"}
        </p>
        <p className={`mt-1 text-sm ${currentBillStatusClass}`}>
          {currentBillStatus}
        </p>
      </div>

      <div className="rounded-2xl border border-navy/10 bg-white p-5">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-sm font-medium text-foreground">
            <HugeiconsIcon
              icon={Invoice01Icon}
              size={18}
              className="text-blue"
            />
            Total outstanding balance
          </span>
          <span
            className={`text-lg font-semibold ${
              outstanding > 0 ? "text-[#B4483B]" : "text-[#3F7A5B]"
            }`}
          >
            {formatNaira(outstanding)}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-base font-medium text-foreground">Bill history</h2>
      </div>
      <div className="overflow-hidden rounded-2xl border border-navy/10 bg-white">
        {bills.length === 0 ? (
          <p className="p-8 text-center text-sm text-foreground/60">
            No bills have been assigned to your account yet.
          </p>
        ) : (
          <div className="divide-y divide-black/5">
            {bills.map((bill) => (
              <div
                key={bill._id}
                className="grid gap-4 p-5 sm:grid-cols-[1fr_auto_auto_auto]"
              >
                <span className="flex items-center gap-3 text-sm font-medium text-foreground">
                  <HugeiconsIcon
                    icon={ReceiptDollarIcon}
                    size={18}
                    className="text-blue"
                  />
                  <span>
                    {bill.term?.name ?? "School bill"}
                    <span className="block text-xs font-normal text-foreground/50">
                      Due {new Date(bill.dueDate).toLocaleDateString()}
                    </span>
                  </span>
                </span>
                <span className="text-sm text-foreground/70">
                  Billed: {formatNaira(bill.amount)}
                </span>
                <span className="text-sm font-medium text-[#3F7A5B]">
                  Paid: {formatNaira(bill.paidAmount)}
                </span>
                <span
                  className={`text-sm font-medium ${
                    bill.balance > 0 ? "text-[#B4483B]" : "text-[#3F7A5B]"
                  }`}
                >
                  {bill.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
