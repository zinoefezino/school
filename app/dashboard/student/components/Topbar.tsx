"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { Menu01Icon } from "@hugeicons/core-free-icons";

const titles: Record<string, string> = {
  "/dashboard/student": "Dashboard",
  "/dashboard/student/profile": "Profile",
  "/dashboard/student/classes": "Classes",
  "/dashboard/student/timetable": "Timetable",
  "/dashboard/student/assignments": "Assignments",
  "/dashboard/student/results": "Results",
  "/dashboard/student/attendance": "Attendance",
  "/dashboard/student/fees": "Current bill",
  "/dashboard/student/payment-history": "Payment history",
  "/dashboard/student/announcements": "Announcements",
  "/dashboard/student/messages": "Messages",
  "/dashboard/student/settings": "Settings",
};

interface TopbarProps {
  onMenuClick: () => void;
}
type CurrentUser = {
  displayName: string;
  initials: string;
  lastLoginAt?: string;
};

function formatLastLogin(value?: string) {
  if (!value) return "Last login not recorded";
  return `Last login: ${new Date(value).toLocaleString()}`;
}

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
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-light text-sm font-medium text-navy">
            {user?.initials ?? "S"}
          </span>
          <span className="hidden sm:block">
            <span className="block text-sm font-medium text-foreground">
              {user?.displayName ?? "Student"}
            </span>
            <span className="block text-xs italic text-foreground/45">
              {formatLastLogin(user?.lastLoginAt)}
            </span>
          </span>
        </div>
      </div>
    </header>
  );
}
