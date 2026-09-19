"use client";

import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Megaphone01Icon } from "@hugeicons/core-free-icons";
import LoadingState from "../../components/LoadingState";

type Announcement = {
  _id: string;
  title: string;
  body: string;
  publishedAt: string;
};

export default function ParentAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetch(`/api/announcements?page=${page}&limit=10`)
      .then(async (response) => (response.ok ? response.json() : null))
      .then((data) => {
        const nextAnnouncements = data?.announcements ?? [];
        setAnnouncements(nextAnnouncements);
        setPages(data?.pages ?? 1);
        setTotal(data?.total ?? 0);
        if (nextAnnouncements.length > 0) {
          fetch("/api/announcements/read", { method: "POST" });
        }
      })
      .catch(() => setAnnouncements([]))
      .finally(() => setLoading(false));
  }, [page]);
  const displayTotal = Math.max(total, announcements.length);
  const headerText = loading
    ? "Loading parent updates"
    : `${displayTotal.toLocaleString()} ${
        displayTotal === 1 ? "update" : "updates"
      } addressed to parents`;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm text-foreground/60">{headerText}</p>
        <h2 className="mt-1 text-xl font-medium text-foreground">
          Announcements
        </h2>
      </div>
      <div className="flex flex-col gap-4">
        {loading ? (
          <LoadingState
            label="Loading announcements..."
            className="rounded-2xl bg-white p-6"
          />
        ) : announcements.length === 0 ? (
          <p className="rounded-2xl bg-white p-6 text-sm text-foreground/60">
            No announcements yet.
          </p>
        ) : (
          announcements.map((item) => (
            <article
              key={item._id}
              className="rounded-2xl border border-navy/10 bg-white p-6"
            >
              <div className="flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-light text-blue">
                  <HugeiconsIcon icon={Megaphone01Icon} size={20} />
                </span>
                <div>
                  <p className="text-xs text-foreground/50">
                    {new Date(item.publishedAt).toLocaleDateString()}
                  </p>
                  <h3 className="mt-1 text-base font-medium text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-foreground/65">
                    {item.body}
                  </p>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-navy/10 bg-white px-5 py-3">
        <p className="text-sm text-foreground/60">
          Page {page} of {Math.max(pages, 1)}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={page <= 1 || loading}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            className="rounded-full border border-navy/15 px-4 py-2 text-sm font-medium text-navy hover:bg-blue-light disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>
          <button
            type="button"
            disabled={page >= pages || loading}
            onClick={() => setPage((current) => Math.min(pages, current + 1))}
            className="rounded-full border border-navy/15 px-4 py-2 text-sm font-medium text-navy hover:bg-blue-light disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
