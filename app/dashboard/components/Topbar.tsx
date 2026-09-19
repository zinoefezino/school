"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { Menu01Icon, Search01Icon } from "@hugeicons/core-free-icons";

const titles: Record<string, string> = {
  "/dashboard/admin": "Overview",
  "/dashboard/admin/students": "Students",
  "/dashboard/admin/staff": "Staff",
  "/dashboard/admin/parents/new": "Add parent",
  "/dashboard/admin/classes": "Classes",
  "/dashboard/admin/academics": "Academics",
  "/dashboard/admin/assignments": "Assignments",
  "/dashboard/admin/timetable": "Timetable",
  "/dashboard/admin/attendance": "Attendance",
  "/dashboard/admin/fees": "Fees",
  "/dashboard/admin/announcements": "Announcements",
  "/dashboard/admin/news": "News",
  "/dashboard/admin/settings": "Settings",
};

interface TopbarProps {
  onMenuClick: () => void;
}
type CurrentUser = { displayName: string; initials: string };

export default function Topbar({ onMenuClick }: TopbarProps) {
  const pathname = usePathname();
  const title = titles[pathname] ?? "Dashboard";
  const [user, setUser] = useState<CurrentUser | null>(null);

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
        <h1 className="text-lg font-medium text-foreground">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden items-center gap-2 rounded-full border border-black/10 px-3.5 py-2 sm:flex">
          <HugeiconsIcon
            icon={Search01Icon}
            size={18}
            className="text-foreground/40"
          />
          <input
            type="text"
            placeholder="Search..."
            className="w-40 text-sm text-foreground outline-none placeholder:text-foreground/40"
          />
        </div>

        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-light text-sm font-medium text-navy">
            {user?.initials ?? "A"}
          </span>
          <span className="hidden text-sm font-medium text-foreground sm:block">
            {user?.displayName ?? "Admin"}
          </span>
        </div>
      </div>
    </header>
  );
}
