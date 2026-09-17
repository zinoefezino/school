"use client";

import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Logout01Icon } from "@hugeicons/core-free-icons";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-blue-light/40">
      <header className="flex items-center justify-between border-b border-black/5 bg-white px-6 py-4">
        <Link href="/" className="flex items-center gap-2.5">
          {/* <span className="flex h-9 w-9 items-center justify-center rounded-full border border-navy/20 text-sm font-medium text-navy">
            F
          </span> */}
          <span className="text-base font-medium text-navy">School</span>
        </Link>

        <Link
          href="/portal/login"
          className="flex items-center gap-2 text-sm font-medium text-foreground/60 hover:text-foreground"
        >
          <HugeiconsIcon icon={Logout01Icon} size={18} />
          Log out
        </Link>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10">{children}</main>
    </div>
  );
}
