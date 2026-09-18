"use client";

import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight02Icon,
  CalendarCheckIcon,
  Certificate01Icon,
  Coins01Icon,
  Megaphone01Icon,
  StudentsIcon,
  Alert02Icon,
} from "@hugeicons/core-free-icons";
import { children, formatNaira, parent, parentAnnouncements } from "./data";

type ParentAnnouncement = {
  title: string;
  date?: string;
  publishedAt?: string;
  body: string;
};

export default function ParentDashboard() {
  const [selectedChildId, setSelectedChildId] = useState(children[0].id);
  const [visibleAnnouncements, setVisibleAnnouncements] =
    useState<ParentAnnouncement[]>(parentAnnouncements);
  const [overdueCount, setOverdueCount] = useState(0);
  const [newResultsCount, setNewResultsCount] = useState(0);
  const child =
    children.find((item) => item.id === selectedChildId) ?? children[0];

  useEffect(() => {
    fetch("/api/parent/notifications")
      .then(async (response) => {
        if (!response.ok) return null;
        return response.json();
      })
      .then((data) => {
        if (!data) return;
        setVisibleAnnouncements(
          data.announcements.map((item: ParentAnnouncement) => ({
            ...item,
            date: item.publishedAt,
          })),
        );
        setOverdueCount(data.outstandingInvoices.length);
        setNewResultsCount(data.publishedTerms.length);
      })
      .catch(() => undefined);
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-foreground/60">
            Welcome back, {parent.fullName}
          </p>
          <h2 className="mt-1 text-xl font-medium text-foreground">
            Family overview
          </h2>
        </div>
        <label className="flex flex-col gap-1 text-xs text-foreground/50">
          Viewing child
          <select
            value={selectedChildId}
            onChange={(event) => setSelectedChildId(event.target.value)}
            className="rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm text-foreground outline-none focus:border-blue"
          >
            {children.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} - {item.classSection}
              </option>
            ))}
          </select>
        </label>
      </div>
      {(overdueCount > 0 || newResultsCount > 0) && (
        <div className="flex flex-wrap gap-3">
          {overdueCount > 0 && (
            <a
              href="/dashboard/parent/fees"
              className="flex items-center gap-2 rounded-xl border border-[#B4483B]/20 bg-[#B4483B]/5 px-4 py-3 text-sm text-[#B4483B]"
            >
              <HugeiconsIcon icon={Alert02Icon} size={18} />
              {overdueCount} outstanding fee notice
              {overdueCount === 1 ? "" : "s"}
            </a>
          )}
          {newResultsCount > 0 && (
            <a
              href="/dashboard/parent/results"
              className="flex items-center gap-2 rounded-xl border border-blue/20 bg-blue-light px-4 py-3 text-sm text-blue"
            >
              <HugeiconsIcon icon={Certificate01Icon} size={18} />
              New results are available
            </a>
          )}
        </div>
      )}
      <div className="rounded-2xl border border-navy/10 bg-white p-6">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-light text-lg font-medium text-navy">
            {child.avatar}
          </span>
          <div>
            <p className="text-lg font-medium text-foreground">{child.name}</p>
            <p className="mt-1 text-sm text-foreground/60">
              {child.admissionNumber} · {child.classSection}
            </p>
          </div>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-blue-light/50 p-4">
            <HugeiconsIcon
              icon={CalendarCheckIcon}
              size={20}
              className="text-blue"
            />
            <p className="mt-3 text-2xl font-medium text-foreground">
              {child.attendance}
            </p>
            <p className="mt-1 text-sm text-foreground/60">Attendance</p>
          </div>
          <div className="rounded-xl bg-blue-light/50 p-4">
            <HugeiconsIcon
              icon={Certificate01Icon}
              size={20}
              className="text-blue"
            />
            <p className="mt-3 text-2xl font-medium text-foreground">
              {child.average}
            </p>
            <p className="mt-1 text-sm text-foreground/60">Results average</p>
          </div>
          <div className="rounded-xl bg-blue-light/50 p-4">
            <HugeiconsIcon icon={Coins01Icon} size={20} className="text-blue" />
            <p className="mt-3 text-2xl font-medium text-foreground">
              {formatNaira(child.balance)}
            </p>
            <p className="mt-1 text-sm text-foreground/60">Fees balance</p>
          </div>
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-2xl border border-navy/10 bg-white p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-medium text-foreground">
              Fees for {child.name}
            </h2>
            <a
              href="/dashboard/parent/fees"
              className="flex items-center gap-1 text-sm font-medium text-blue"
            >
              View fees
              <HugeiconsIcon icon={ArrowRight02Icon} size={14} />
            </a>
          </div>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-black/5 p-4">
            <div>
              <p className="text-sm text-foreground/60">Outstanding balance</p>
              <p className="mt-1 text-2xl font-medium text-foreground">
                {formatNaira(child.balance)}
              </p>
              <p className="mt-1 text-xs text-foreground/50">
                Due {child.dueDate}
              </p>
            </div>
            {child.balance > 0 ? (
              <a
                href="/dashboard/parent/fees"
                className="rounded-full bg-blue px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
              >
                Pay fees
              </a>
            ) : (
              <span className="rounded-full bg-[#3F7A5B]/10 px-3 py-2 text-sm font-medium text-[#3F7A5B]">
                Paid in full
              </span>
            )}
          </div>
        </section>
        <section className="rounded-2xl border border-navy/10 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-medium text-foreground">
              Announcements
            </h2>
            <a
              href="/dashboard/parent/announcements"
              className="text-sm font-medium text-blue"
            >
              See all
            </a>
          </div>
          <div className="mt-4 flex flex-col gap-4">
            {visibleAnnouncements.slice(0, 3).map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-light text-blue">
                  <HugeiconsIcon icon={Megaphone01Icon} size={16} />
                </span>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {item.title}
                  </p>
                  <p className="mt-1 text-xs text-foreground/50">
                    {item.date ?? item.publishedAt}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      <section className="rounded-2xl border border-navy/10 bg-white p-6">
        <div className="flex items-center gap-3">
          <HugeiconsIcon icon={StudentsIcon} size={20} className="text-blue" />
          <div>
            <h2 className="text-base font-medium text-foreground">
              Family account
            </h2>
            <p className="mt-1 text-sm text-foreground/60">
              Your dashboard can show every child linked to {parent.email}.
              Select a child above to review their school activity.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
