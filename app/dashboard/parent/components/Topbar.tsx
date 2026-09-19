"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { Menu01Icon } from "@hugeicons/core-free-icons";

const titles: Record<string, string> = {
  "/dashboard/parent": "Overview",
  "/dashboard/parent/children": "My children",
  "/dashboard/parent/fees": "Fees & payments",
  "/dashboard/parent/results": "Results",
  "/dashboard/parent/attendance": "Attendance",
  "/dashboard/parent/announcements": "Announcements",
};

export default function ParentTopbar({
  onMenuClick,
}: {
  onMenuClick: () => void;
}) {
  const pathname = usePathname();
  const [user, setUser] = useState<{
    displayName: string;
    initials: string;
  } | null>(null);

  useEffect(() => {
    fetch("/api/dashboard/me")
      .then(async (response) => (response.ok ? response.json() : null))
      .then((data) => setUser(data?.user ?? null))
      .catch(() => setUser(null));
  }, []);

  return (
    <header className="flex items-center justify-between border-b border-black/5 bg-white px-6 py-4">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          aria-label="Open menu"
          className="text-navy lg:hidden"
        >
          <HugeiconsIcon icon={Menu01Icon} size={26} />
        </button>
        <h1 className="text-lg font-medium text-foreground">
          {titles[pathname] ?? "Parent dashboard"}
        </h1>
      </div>
      <div className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-light text-sm font-medium text-navy">
          {user?.initials ?? "P"}
        </span>
        <span className="hidden text-sm font-medium text-foreground sm:block">
          {user?.displayName ?? "Parent"}
        </span>
      </div>
    </header>
  );
}
