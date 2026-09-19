"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ChartBarLineIcon,
  Coins01Icon,
  FileChartColumnIcon,
  Invoice01Icon,
  MoneyReceive01Icon,
  TransactionHistoryIcon,
} from "@hugeicons/core-free-icons";

const items = [
  {
    label: "Overview",
    href: "/dashboard/admin/finance",
    icon: ChartBarLineIcon,
  },
  {
    label: "Fee structure",
    href: "/dashboard/admin/finance/structure",
    icon: Coins01Icon,
  },
  {
    label: "Student invoices",
    href: "/dashboard/admin/finance/invoices",
    icon: Invoice01Icon,
  },
  {
    label: "Transactions",
    href: "/dashboard/admin/finance/transactions",
    icon: TransactionHistoryIcon,
  },
  {
    label: "Outstanding payments",
    href: "/dashboard/admin/finance/outstanding",
    icon: MoneyReceive01Icon,
  },
  {
    label: "Financial reports",
    href: "/dashboard/admin/finance/reports",
    icon: FileChartColumnIcon,
  },
];

export default function FinanceNav() {
  const pathname = usePathname();

  return (
    <div className="rounded-2xl border border-navy/10 bg-white px-4">
      <nav className="flex flex-wrap items-center gap-x-6 gap-y-1">
        {items.map((item) => {
          const active =
            item.href === "/dashboard/admin/finance"
              ? pathname === item.href
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 border-b-2 py-3 text-sm font-medium transition-colors ${
                active
                  ? "border-blue text-blue"
                  : "border-transparent text-foreground/60 hover:text-navy"
              }`}
            >
              <HugeiconsIcon icon={item.icon} size={17} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
