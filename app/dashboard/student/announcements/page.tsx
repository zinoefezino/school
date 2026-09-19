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

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/announcements")
      .then(async (response) => (response.ok ? response.json() : null))
      .then((data) => setAnnouncements(data?.announcements ?? []))
      .catch(() => setAnnouncements([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm text-foreground/60">
          Important updates from your school
        </p>
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
    </div>
  );
}
