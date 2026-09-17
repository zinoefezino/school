import { HugeiconsIcon } from "@hugeicons/react";
import { Coins01Icon, Download01Icon } from "@hugeicons/core-free-icons";

const feeSummary = [
  { label: "Collected", value: "₦42.6M" },
  { label: "Pending", value: "₦6.1M" },
  { label: "Overdue", value: "₦1.8M" },
];

const invoices = [
  {
    student: "Chidera Okafor",
    classSection: "JSS1 Gold",
    amount: "₦85,000",
    dueDate: "Oct 15, 2026",
    status: "Paid",
  },
  {
    student: "Tamuno Briggs",
    classSection: "SS2 Diamond",
    amount: "₦120,000",
    dueDate: "Oct 15, 2026",
    status: "Pending",
  },
  {
    student: "Amara Chukwu",
    classSection: "Primary 4A",
    amount: "₦65,000",
    dueDate: "Sep 30, 2026",
    status: "Overdue",
  },
  {
    student: "David Effiong",
    classSection: "SS3 Emerald",
    amount: "₦120,000",
    dueDate: "Oct 15, 2026",
    status: "Paid",
  },
];

const statusStyles: Record<string, string> = {
  Paid: "bg-[#3F7A5B]/10 text-[#3F7A5B]",
  Pending: "bg-blue-light text-blue",
  Overdue: "bg-[#B4483B]/10 text-[#B4483B]",
};

export default function FeesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-3">
        {feeSummary.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-navy/10 bg-white p-5"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-light text-blue">
              <HugeiconsIcon icon={Coins01Icon} size={20} />
            </span>
            <p className="mt-4 text-2xl font-medium text-foreground">
              {item.value}
            </p>
            <p className="mt-1 text-sm text-foreground/60">
              {item.label} (this term)
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-foreground/60">
          {invoices.length} invoices this term
        </p>
        <button className="flex items-center gap-2 rounded-full border border-navy/15 px-5 py-2.5 text-sm font-medium text-navy transition-colors hover:bg-blue-light">
          <HugeiconsIcon icon={Download01Icon} size={18} />
          Export
        </button>
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
            {invoices.map((invoice) => (
              <tr key={invoice.student} className="text-sm">
                <td className="whitespace-nowrap px-6 py-3.5 font-medium text-foreground">
                  {invoice.student}
                </td>
                <td className="whitespace-nowrap px-6 py-3.5 text-foreground/70">
                  {invoice.classSection}
                </td>
                <td className="whitespace-nowrap px-6 py-3.5 text-foreground/70">
                  {invoice.amount}
                </td>
                <td className="whitespace-nowrap px-6 py-3.5 text-foreground/70">
                  {invoice.dueDate}
                </td>
                <td className="whitespace-nowrap px-6 py-3.5">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[invoice.status]}`}
                  >
                    {invoice.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
