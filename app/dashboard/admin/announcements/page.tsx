"use client";

import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon, Megaphone01Icon } from "@hugeicons/core-free-icons";
import {
  audienceLabel,
  type AnnouncementAudience,
} from "../../../../lib/announcements";

type Announcement = {
  _id: string;
  title: string;
  body: string;
  audiences: AnnouncementAudience[];
  publishedAt: string;
};
type Filter = "ALL" | AnnouncementAudience;
export default function AdminAnnouncementsPage() {
  const [items, setItems] = useState<Announcement[]>([]);
  const [filter, setFilter] = useState<Filter>("ALL");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch("/api/announcements")
      .then((response) => response.json())
      .then((data) => setItems(data.announcements ?? []))
      .finally(() => setLoading(false));
  }, []);
  const visible =
    filter === "ALL"
      ? items
      : items.filter((item) => item.audiences.includes(filter));
  const filters: [Filter, string][] = [
    ["ALL", "All announcements"],
    ["STUDENT", "Students"],
    ["PARENT", "Parents"],
    ["STAFF", "Staff"],
  ];
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-foreground/60">
            {visible.length} announcements shown
          </p>
          <h2 className="mt-1 text-xl font-medium text-foreground">
            Announcements
          </h2>
        </div>
        <a
          href="/dashboard/admin/announcements/new"
          className="flex items-center gap-2 rounded-full bg-blue px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          <HugeiconsIcon icon={Add01Icon} size={18} />
          New announcement
        </a>
      </div>
      <div className="flex flex-wrap gap-2">
        {filters.map(([value, label]) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={`rounded-full px-4 py-2 text-sm font-medium ${filter === value ? "bg-navy text-white" : "bg-white text-foreground/60 hover:bg-blue-light"}`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-4">
        {loading ? (
          <p className="rounded-2xl bg-white p-6 text-sm text-foreground/60">
            Loading announcements...
          </p>
        ) : visible.length === 0 ? (
          <p className="rounded-2xl bg-white p-6 text-sm text-foreground/60">
            No announcements found.
          </p>
        ) : (
          visible.map((item) => (
            <article
              key={item._id}
              className="rounded-2xl border border-navy/10 bg-white p-6"
            >
              <div className="flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-light text-blue">
                  <HugeiconsIcon icon={Megaphone01Icon} size={20} />
                </span>
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-base font-medium text-foreground">
                      {item.title}
                    </h3>
                    <span className="text-xs text-foreground/40">
                      {new Date(item.publishedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mt-1.5 text-sm leading-6 text-foreground/70">
                    {item.body}
                  </p>
                  <span className="mt-3 inline-block rounded-full bg-blue-light px-2.5 py-1 text-xs font-medium text-navy">
                    {audienceLabel(item.audiences)}
                  </span>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
