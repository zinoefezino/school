import { HugeiconsIcon } from "@hugeicons/react";
import {
  StudentsIcon,
  TeacherIcon,
  Coins01Icon,
  Calendar03Icon,
  UserAdd01Icon,
  Megaphone01Icon,
  ArrowRight02Icon,
} from "@hugeicons/core-free-icons";

const stats = [
  { label: "Total students", value: "1,204", icon: StudentsIcon },
  { label: "Total staff", value: "86", icon: TeacherIcon },
  { label: "Fees collected (this term)", value: "₦42.6M", icon: Coins01Icon },
  { label: "Attendance today", value: "94%", icon: Calendar03Icon },
];

const quickActions = [
  {
    label: "Add student",
    href: "/dashboard/admin/students/new",
    icon: UserAdd01Icon,
  },
  { label: "Add staff", href: "/dashboard/admin/staff/new", icon: TeacherIcon },
  {
    label: "Post announcement",
    href: "/dashboard/admin/announcements/new",
    icon: Megaphone01Icon,
  },
];

const recentActivity = [
  { text: "New student admitted — Chidera Okafor (JSS1 Gold)", time: "2h ago" },
  { text: "Fee payment received — ₦85,000 from Tamuno Briggs", time: "4h ago" },
  { text: "Staff added — Mrs. Adaeze Nwosu (Mathematics)", time: "Yesterday" },
  { text: "Announcement posted — Mid-term break notice", time: "Yesterday" },
];

export default function AdminOverview() {
  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-navy/10 bg-white p-5"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-light text-blue">
              <HugeiconsIcon icon={stat.icon} size={20} />
            </span>
            <p className="mt-4 text-2xl font-medium text-foreground">
              {stat.value}
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
          <div className="mt-4 divide-y divide-black/5">
            {recentActivity.map((activity) => (
              <div
                key={activity.text}
                className="flex items-center justify-between gap-4 py-3.5 first:pt-0"
              >
                <p className="text-sm text-foreground/80">{activity.text}</p>
                <span className="shrink-0 text-xs text-foreground/40">
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
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
