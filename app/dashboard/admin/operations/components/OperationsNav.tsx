"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Calendar03Icon,
  StudentsIcon,
  WorkflowCircle02Icon,
} from "@hugeicons/core-free-icons";

const items = [
  {
    label: "Overview",
    href: "/dashboard/admin/operations",
    icon: WorkflowCircle02Icon,
  },
  {
    label: "Attendance",
    href: "/dashboard/admin/operations/attendance",
    icon: Calendar03Icon,
  },
  {
    label: "Promotions",
    href: "/dashboard/admin/operations/promotions",
    icon: StudentsIcon,
  },
];

export default function OperationsNav() {
  const pathname = usePathname();

  return (
    <div className="rounded-2xl border border-navy/10 bg-white px-4">
      <nav className="flex flex-wrap items-center gap-x-6 gap-y-1">
        {items.map((item) => {
          const active =
            item.href === "/dashboard/admin/operations"
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
