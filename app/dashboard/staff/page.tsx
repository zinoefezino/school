"use client";

import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Alert02Icon,
  ArrowRight02Icon,
  Book02Icon,
  CalendarCheckIcon,
  StudentsIcon,
} from "@hugeicons/core-free-icons";

type StaffClass = { classSection: string; studentCount: number };
type Attention = {
  subject?: { name?: string };
  classSection?: { name?: string };
  rejectionNote?: string;
};

export default function StaffOverview() {
  const [classes, setClasses] = useState<StaffClass[]>([]);
  const [needsAttention, setNeedsAttention] = useState<Attention[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch("/api/dashboard/staff/overview")
      .then(async (response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (data) {
          setClasses(data.classes);
          setNeedsAttention(data.needsAttention);
        }
      })
      .finally(() => setLoading(false));
  }, []);
  return (
    <div className="flex flex-col gap-8">
      {needsAttention.map((item, index) => (
        <div
          key={index}
          className="flex items-start gap-3 rounded-2xl border border-[#B4483B]/20 bg-[#B4483B]/5 p-5"
        >
          <HugeiconsIcon
            icon={Alert02Icon}
            size={20}
            className="mt-0.5 shrink-0 text-[#B4483B]"
          />
          <div>
            <p className="text-sm font-medium text-foreground">
              {item.subject?.name ?? "Result submission"} needs changes
            </p>
            <p className="mt-1 text-sm text-foreground/70">
              {item.rejectionNote ?? "Review and resubmit this result."}
            </p>
            <a
              href="/dashboard/staff/results"
              className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-[#B4483B]"
            >
              Review and resubmit
              <HugeiconsIcon icon={ArrowRight02Icon} size={14} />
            </a>
          </div>
        </div>
      ))}
      <div>
        <h2 className="text-base font-medium text-foreground">
          My assigned classes
        </h2>
        {loading ? (
          <p className="mt-4 text-sm text-foreground/60">
            Loading assigned classes...
          </p>
        ) : classes.length === 0 ? (
          <p className="mt-4 rounded-xl bg-white p-5 text-sm text-foreground/60">
            No classes have been assigned to you yet. An administrator can
            assign classes from the Classes page.
          </p>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {classes.map((item) => (
              <div
                key={item.classSection}
                className="rounded-2xl border border-navy/10 bg-white p-5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-medium text-foreground">
                      {item.classSection}
                    </h3>
                    <p className="mt-1 text-sm text-foreground/60">
                      Class assignment
                    </p>
                  </div>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-light text-blue">
                    <HugeiconsIcon icon={Book02Icon} size={20} />
                  </span>
                </div>
                <div className="mt-5 flex items-center gap-2 text-sm text-foreground/70">
                  <HugeiconsIcon
                    icon={StudentsIcon}
                    size={16}
                    className="text-blue"
                  />
                  {item.studentCount} students
                </div>
                <div className="mt-4 flex gap-3 border-t border-black/5 pt-4">
                  <a
                    href="/dashboard/staff/attendance"
                    className="flex items-center gap-1.5 text-sm font-medium text-navy"
                  >
                    <HugeiconsIcon icon={CalendarCheckIcon} size={16} />
                    Attendance
                  </a>
                  <a
                    href="/dashboard/staff/results"
                    className="flex items-center gap-1.5 text-sm font-medium text-blue"
                  >
                    <HugeiconsIcon icon={Book02Icon} size={16} />
                    Enter results
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
