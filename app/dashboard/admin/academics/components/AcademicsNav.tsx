"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Book02Icon,
  Calendar03Icon,
  StudentsIcon,
  TeacherIcon,
} from "@hugeicons/core-free-icons";

const items = [
  {
    label: "Setup",
    href: "/dashboard/admin/academics",
    icon: Book02Icon,
  },
  {
    label: "Classes",
    href: "/dashboard/admin/academics/classes",
    icon: StudentsIcon,
  },
  {
    label: "Subject teachers",
    href: "/dashboard/admin/academics/subject-teachers",
    icon: TeacherIcon,
  },
  {
    label: "Assignments",
    href: "/dashboard/admin/academics/assignments",
    icon: Book02Icon,
  },
  {
    label: "Timetable",
    href: "/dashboard/admin/academics/timetable",
    icon: Calendar03Icon,
  },
];

export default function AcademicsNav() {
  const pathname = usePathname();

  return (
    <div className="rounded-2xl border border-navy/10 bg-white px-4">
      <nav className="flex flex-wrap items-center gap-x-6 gap-y-1">
        {items.map((item) => {
          const active =
            item.href === "/dashboard/admin/academics"
              ? pathname === item.href
              : pathname.startsWith(item.href.split("#")[0]);
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
