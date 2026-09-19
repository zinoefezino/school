"use client";

import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { UserIcon } from "@hugeicons/core-free-icons";

type CurrentUser = {
  role: string;
  email: string;
  displayName: string;
  initials: string;
  lastLoginAt?: string;
};

function formatLastLogin(value?: string) {
  if (!value) return "Last login not recorded";
  return new Date(value).toLocaleString();
}

function roleLabel(role?: string) {
  if (!role) return "Account";
  return role.charAt(0) + role.slice(1).toLowerCase();
}

export default function AccountSummary() {
  const [user, setUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    fetch("/api/dashboard/me")
      .then(async (response) => (response.ok ? response.json() : null))
      .then((data) => setUser(data?.user ?? null))
      .catch(() => setUser(null));
  }, []);

  return (
    <section className="rounded-2xl border border-navy/10 bg-white p-6">
      <div className="flex items-center gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-light text-sm font-medium text-navy">
          {user?.initials ?? "U"}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-medium text-foreground">
              {user?.displayName ?? "Account"}
            </h3>
            <span className="rounded-full bg-blue-light px-2.5 py-1 text-xs font-medium text-navy">
              {roleLabel(user?.role)}
            </span>
          </div>
          <p className="mt-1 truncate text-sm text-foreground/60">
            {user?.email ?? "Email not available"}
          </p>
          <p className="mt-1 text-xs italic text-foreground/50">
            Last login: {formatLastLogin(user?.lastLoginAt)}
          </p>
        </div>
        <HugeiconsIcon
          icon={UserIcon}
          size={20}
          className="hidden text-blue sm:block"
        />
      </div>
    </section>
  );
}
