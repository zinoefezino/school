import { HugeiconsIcon } from "@hugeicons/react";
import {
  Coins01Icon,
  Download01Icon,
  ReceiptDollarIcon,
} from "@hugeicons/core-free-icons";

const feeItems = [
  { label: "Tuition", amount: "₦85,000", status: "Paid" },
  { label: "Learning materials", amount: "₦15,000", status: "Paid" },
  { label: "Sports levy", amount: "₦5,000", status: "Paid" },
];

export default function FeesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-navy/10 bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm text-foreground/60">First Term · 2026/2027</p>
            <h2 className="mt-1 text-xl font-medium text-foreground">
              Current bill
            </h2>
          </div>
          <HugeiconsIcon icon={Coins01Icon} size={25} className="text-blue" />
        </div>
        <p className="mt-6 text-3xl font-medium text-foreground">₦0</p>
        <p className="mt-1 text-sm text-[#3F7A5B]">Paid in full</p>
      </div>
      <div className="flex items-center justify-between">
        <h2 className="text-base font-medium text-foreground">Fee breakdown</h2>
        <button className="flex items-center gap-2 rounded-full border border-navy/15 px-4 py-2 text-sm font-medium text-navy hover:bg-blue-light">
          <HugeiconsIcon icon={Download01Icon} size={17} />
          Receipt
        </button>
      </div>
      <div className="rounded-2xl border border-navy/10 bg-white divide-y divide-black/5">
        {feeItems.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between gap-4 p-5"
          >
            <span className="flex items-center gap-3 text-sm font-medium text-foreground">
              <HugeiconsIcon
                icon={ReceiptDollarIcon}
                size={18}
                className="text-blue"
              />
              {item.label}
            </span>
            <span className="text-right text-sm text-foreground/70">
              {item.amount}
              <span className="ml-3 text-[#3F7A5B]">{item.status}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
