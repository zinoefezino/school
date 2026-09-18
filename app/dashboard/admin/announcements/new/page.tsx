"use client";

import { FormEvent, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft02Icon, Megaphone01Icon } from "@hugeicons/core-free-icons";
import type { AnnouncementAudience } from "../../../../../lib/announcements";

const audienceOptions: { value: AnnouncementAudience; label: string }[] = [
  { value: "STUDENT", label: "Students" },
  { value: "PARENT", label: "Parents" },
  { value: "STAFF", label: "Staff" },
];

export default function NewAnnouncementPage() {
  const [selectedAudiences, setSelectedAudiences] = useState<
    AnnouncementAudience[]
  >(["STUDENT"]);
  const [status, setStatus] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const toggleAudience = (audience: AnnouncementAudience) => {
    setSelectedAudiences((current) =>
      current.includes(audience)
        ? current.filter((item) => item !== audience)
        : [...current, audience],
    );
  };

  const publishAnnouncement = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setStatus(null);
    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.get("title"),
          body: formData.get("body"),
          audiences: selectedAudiences,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      event.currentTarget.reset();
      setSelectedAudiences(["STUDENT"]);
      setStatus("Announcement published successfully.");
    } catch (error) {
      setStatus(
        error instanceof Error
          ? error.message
          : "Unable to publish announcement.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <a
        href="/dashboard/admin/announcements"
        className="flex items-center gap-1.5 text-sm font-medium text-blue"
      >
        <HugeiconsIcon icon={ArrowLeft02Icon} size={16} />
        Back to announcements
      </a>
      <div className="mt-5 rounded-2xl border border-navy/10 bg-white p-6 sm:p-8">
        <div className="flex items-center gap-3 border-b border-black/5 pb-5">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-light text-blue">
            <HugeiconsIcon icon={Megaphone01Icon} size={20} />
          </span>
          <div>
            <h2 className="text-xl font-medium text-foreground">
              New announcement
            </h2>
            <p className="mt-1 text-sm text-foreground/60">
              Choose exactly which portal audiences can see this message.
            </p>
          </div>
        </div>
        <form
          onSubmit={publishAnnouncement}
          className="mt-6 flex flex-col gap-5"
        >
          <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
            Title
            <input
              required
              name="title"
              placeholder="Announcement title"
              className="rounded-xl border border-black/10 px-4 py-3 font-normal outline-none focus:border-blue"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
            Message
            <textarea
              required
              name="body"
              rows={5}
              placeholder="Write the announcement..."
              className="resize-y rounded-xl border border-black/10 px-4 py-3 font-normal outline-none focus:border-blue"
            />
          </label>
          <fieldset>
            <legend className="text-sm font-medium text-foreground">
              Send to
            </legend>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {audienceOptions.map((option) => (
                <label
                  key={option.value}
                  className="flex cursor-pointer items-center gap-3 rounded-xl border border-black/10 p-4 text-sm text-foreground has-[:checked]:border-blue has-[:checked]:bg-blue-light"
                >
                  <input
                    type="checkbox"
                    checked={selectedAudiences.includes(option.value)}
                    onChange={() => toggleAudience(option.value)}
                    className="h-4 w-4 accent-blue"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </fieldset>
          {status && <p className="text-sm text-foreground/70">{status}</p>}
          <div className="flex justify-end border-t border-black/5 pt-5">
            <button
              type="submit"
              disabled={submitting || selectedAudiences.length === 0}
              className="rounded-full bg-blue px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {submitting ? "Publishing..." : "Publish announcement"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
