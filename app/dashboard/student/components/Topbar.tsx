"use client";

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
};

interface TopbarProps {
  onMenuClick: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  const pathname = usePathname();
  const title = titles[pathname] ?? "Dashboard";

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
            C
          </span>
          <span className="hidden text-sm font-medium text-foreground sm:block">
            Chidera Okafor
          </span>
        </div>
      </div>
    </header>
  );
}
