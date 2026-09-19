"use client";

import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight02Icon,
  Calendar03Icon,
  Coins01Icon,
  Megaphone01Icon,
  StudentsIcon,
  TeacherIcon,
  UserAdd01Icon,
  NewspaperIcon,
} from "@hugeicons/core-free-icons";

const quickActions = [
  {
    label: "Add student",
    href: "/dashboard/admin/students/new",
    icon: UserAdd01Icon,
  },
  { label: "Add staff", href: "/dashboard/admin/staff/new", icon: TeacherIcon },
  {
    label: "Post announcement",
    href: "/dashboard/admin/communications/announcements/new",
    icon: Megaphone01Icon,
  },
  {
    label: "Finance overview",
    href: "/dashboard/admin/finance",
    icon: Coins01Icon,
  },
  {
    label: "Post news",
    href: "/dashboard/admin/communications/news",
    icon: NewspaperIcon,
  },
];
const statCards = [
  { key: "students", label: "Total students", icon: StudentsIcon },
  { key: "staff", label: "Total staff", icon: TeacherIcon },
  { key: "feesCollected", label: "Fees collected", icon: Coins01Icon },
  { key: "attendanceRate", label: "Attendance today", icon: Calendar03Icon },
];

type Stats = {
  students: number;
  staff: number;
  feesCollected: number;
  attendanceRate: number;
};

export default function AdminOverview() {
  const [stats, setStats] = useState<Stats>({
    students: 0,
    staff: 0,
    feesCollected: 0,
    attendanceRate: 0,
  });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch("/api/dashboard/admin/overview")
      .then(async (response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (data) setStats(data.stats);
      })
      .finally(() => setLoading(false));
  }, []);
  const values: Record<string, string> = {
    students: stats.students.toLocaleString(),
    staff: stats.staff.toLocaleString(),
    feesCollected: `₦${stats.feesCollected.toLocaleString()}`,
    attendanceRate: `${stats.attendanceRate}%`,
  };
  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <div
            key={stat.key}
            className="rounded-2xl border border-navy/10 bg-white p-5"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-light text-blue">
              <HugeiconsIcon icon={stat.icon} size={20} />
            </span>
            <p className="mt-4 text-2xl font-medium text-foreground">
              {loading ? "..." : values[stat.key]}
            </p>
            <p className="mt-1 text-sm text-foreground/60">{stat.label}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-navy/10 bg-white p-6 lg:col-span-2">
          <h2 className="text-base font-medium text-foreground">
            Recent activity
          </h2>
          <p className="mt-4 rounded-xl bg-blue-light/50 p-4 text-sm text-foreground/60">
            Activity history will appear here as admin actions are recorded.
          </p>
        </div>
        <div className="rounded-2xl border border-navy/10 bg-white p-6">
          <h2 className="text-base font-medium text-foreground">
            Quick actions
          </h2>
          <div className="mt-4 flex flex-col gap-2">
            {quickActions.map((action) => (
              <a
                key={action.label}
                href={action.href}
                className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-blue-light"
              >
                <span className="flex items-center gap-2.5">
                  <HugeiconsIcon
                    icon={action.icon}
                    size={18}
                    className="text-blue"
                  />
                  {action.label}
                </span>
                <HugeiconsIcon
                  icon={ArrowRight02Icon}
                  size={16}
                  className="text-foreground/30"
                />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
