"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { Logout01Icon } from "@hugeicons/core-free-icons";

const navItems = [
  { label: "Overview", href: "/dashboard/staff" },
  { label: "My classes", href: "/dashboard/staff/classes" },
  { label: "Attendance", href: "/dashboard/staff/attendance" },
  { label: "Announcements", href: "/dashboard/staff/announcements" },
];

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-blue-light/40">
      <header className="border-b border-black/5 bg-white">
        <div className="flex items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-navy/20 text-sm font-medium text-navy">
              F
            </span>
            <span className="text-base font-medium text-navy">
              Fairview Academy
            </span>
          </Link>

          <div className="flex items-center gap-5">
            <span className="hidden text-sm font-medium text-foreground sm:block">
              Mrs. Adaeze Nwosu
            </span>
            <Link
              href="/portal/login"
              className="flex items-center gap-2 text-sm font-medium text-foreground/60 hover:text-foreground"
            >
              <HugeiconsIcon icon={Logout01Icon} size={18} />
              Log out
            </Link>
          </div>
        </div>

        <nav className="flex gap-6 px-6">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`border-b-2 py-3 text-sm font-medium transition-colors ${
                pathname === item.href
                  ? "border-blue text-blue"
                  : "border-transparent text-foreground/60 hover:text-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
    </div>
  );
}
