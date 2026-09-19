"use client";

import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  Delete02Icon,
  Megaphone01Icon,
} from "@hugeicons/core-free-icons";
import {
  audienceLabel,
  type AnnouncementAudience,
} from "../../../../lib/announcements";
import LoadingState from "../../components/LoadingState";

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
  const [deletingId, setDeletingId] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  useEffect(() => {
    const audience = filter === "ALL" ? "" : `&audience=${filter}`;
    fetch(`/api/announcements?page=${page}&limit=10${audience}`)
      .then(async (response) => (response.ok ? response.json() : null))
      .then((data) => {
        setItems(data?.announcements ?? []);
        setPages(data?.pages ?? 1);
        setTotal(data?.total ?? 0);
      })
      .catch(() => {
        setItems([]);
        setPages(1);
        setTotal(0);
      })
      .finally(() => setLoading(false));
  }, [filter, page]);
  const deleteAnnouncement = async (id: string) => {
    const item = items.find((announcement) => announcement._id === id);
    const confirmed = window.confirm(
      `Delete "${item?.title ?? "this announcement"}"? This will remove it from all dashboards.`,
    );
    if (!confirmed) return;
    setDeletingId(id);
    setStatus("");
    try {
      const response = await fetch(`/api/announcements/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error ?? "Unable to delete announcement.");
      setItems((current) =>
        current.filter((announcement) => announcement._id !== id),
      );
      setTotal((current) => Math.max(current - 1, 0));
      setStatus("Announcement deleted.");
    } catch (error) {
      setStatus(
        error instanceof Error
          ? error.message
          : "Unable to delete announcement.",
      );
    } finally {
      setDeletingId("");
    }
  };
  const filters: [Filter, string][] = [
    ["ALL", "All announcements"],
    ["STUDENT", "Students"],
    ["PARENT", "Parents"],
    ["STAFF", "Staff"],
  ];
  const displayTotal = Math.max(total, items.length);
  const headerText = loading
    ? "Loading announcements"
    : `${displayTotal.toLocaleString()} ${
        displayTotal === 1 ? "announcement" : "announcements"
      } shown`;
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-foreground/60">{headerText}</p>
          <h2 className="mt-1 text-xl font-medium text-foreground">
            Announcements
          </h2>
        </div>
        <a
          href="/dashboard/admin/communications/announcements/new"
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
            onClick={() => {
              setFilter(value);
              setPage(1);
            }}
            className={`rounded-full px-4 py-2 text-sm font-medium ${filter === value ? "bg-navy text-white" : "bg-white text-foreground/60 hover:bg-blue-light"}`}
          >
            {label}
          </button>
        ))}
      </div>
      {status && (
        <p className="rounded-2xl border border-blue/20 bg-blue/5 px-4 py-3 text-sm text-foreground/70">
          {status}
        </p>
      )}
      <div className="flex flex-col gap-4">
        {loading ? (
          <LoadingState
            label="Loading announcements..."
            className="rounded-2xl bg-white p-6"
          />
        ) : items.length === 0 ? (
          <p className="rounded-2xl bg-white p-6 text-sm text-foreground/60">
            No announcements found.
          </p>
        ) : (
          items.map((item) => (
            <article
              key={item._id}
              className="rounded-2xl border border-navy/10 bg-white p-6"
            >
              <div className="flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-light text-blue">
                  <HugeiconsIcon icon={Megaphone01Icon} size={20} />
                </span>
                <div className="min-w-0 flex-1">
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
                <button
                  type="button"
                  disabled={deletingId === item._id}
                  onClick={() => deleteAnnouncement(item._id)}
                  className="flex shrink-0 items-center gap-1.5 rounded-full border border-[#B4483B]/20 px-3 py-2 text-xs font-medium text-[#B4483B] hover:bg-[#B4483B]/5 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <HugeiconsIcon icon={Delete02Icon} size={15} />
                  {deletingId === item._id ? "Deleting..." : "Delete"}
                </button>
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
