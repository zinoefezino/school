"use client";

import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight02Icon,
  CalendarCheckIcon,
  Certificate01Icon,
} from "@hugeicons/core-free-icons";
import LoadingState from "../../components/LoadingState";

type ChildSummary = {
  id: string;
  name: string;
  admissionNumber: string;
  classSection: string;
  attendance: string;
  average: string;
  avatar: string;
};

export default function ParentChildrenPage() {
  const [children, setChildren] = useState<ChildSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/parent/children")
      .then(async (response) => (response.ok ? response.json() : null))
      .then((data) => setChildren(data?.children ?? []))
      .catch(() => setChildren([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm text-foreground/60">
          Students linked to your parent account
        </p>
        <h2 className="mt-1 text-xl font-medium text-foreground">
          My children
        </h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {loading ? (
          <LoadingState
            label="Loading linked students..."
            className="rounded-2xl bg-white p-6"
          />
        ) : children.length === 0 ? (
          <p className="rounded-2xl bg-white p-6 text-sm text-foreground/60">
            No students are linked to your parent account yet.
          </p>
        ) : (
          children.map((child) => (
          <article
            key={child.id}
            className="rounded-2xl border border-navy/10 bg-white p-6"
          >
            <div className="flex items-center gap-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-light text-lg font-medium text-navy">
                {child.avatar}
              </span>
              <div>
                <h3 className="font-medium text-foreground">{child.name}</h3>
                <p className="mt-1 text-sm text-foreground/60">
                  {child.classSection}
                </p>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-blue-light/50 p-3">
                <HugeiconsIcon
                  icon={CalendarCheckIcon}
                  size={17}
                  className="text-blue"
                />
                <p className="mt-2 text-sm font-medium text-foreground">
                  {child.attendance}
                </p>
                <p className="text-xs text-foreground/50">Attendance</p>
              </div>
              <div className="rounded-xl bg-blue-light/50 p-3">
                <HugeiconsIcon
                  icon={Certificate01Icon}
                  size={17}
                  className="text-blue"
                />
                <p className="mt-2 text-sm font-medium text-foreground">
                  {child.average}
                </p>
                <p className="text-xs text-foreground/50">Average</p>
              </div>
            </div>
            <a
              href="/dashboard/parent"
              className="mt-5 flex items-center gap-1 text-sm font-medium text-blue"
            >
              View overview
              <HugeiconsIcon icon={ArrowRight02Icon} size={14} />
            </a>
          </article>
          ))
        )}
      </div>
    </div>
  );
}
