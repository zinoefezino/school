import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon, Megaphone01Icon } from "@hugeicons/core-free-icons";

const announcements = [
  {
    title: "Mid-term break notice",
    audience: "All",
    date: "Sep 15, 2026",
    excerpt:
      "School will be closed from Oct 3 to Oct 10 for mid-term break. Classes resume Oct 13.",
  },
  {
    title: "PTA meeting — Term 1",
    audience: "Parents",
    date: "Sep 10, 2026",
    excerpt:
      "The first PTA meeting of the term will be held in the main hall at 10am on Saturday.",
  },
  {
    title: "Inter-house sports day",
    audience: "Students, Staff",
    date: "Sep 2, 2026",
    excerpt:
      "This year's inter-house sports competition takes place on the school field. All houses to report by 8am.",
  },
];

export default function AnnouncementsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-foreground/60">
          {announcements.length} announcements
        </p>

        <a
          href="/dashboard/admin/announcements/new"
          className="flex items-center gap-2 rounded-full bg-blue px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <HugeiconsIcon icon={Add01Icon} size={18} />
          New announcement
        </a>
      </div>

      <div className="flex flex-col gap-4">
        {announcements.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-navy/10 bg-white p-6"
          >
            <div className="flex items-start gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-light text-blue">
                <HugeiconsIcon icon={Megaphone01Icon} size={20} />
              </span>
              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-base font-medium text-foreground">
                    {item.title}
                  </h3>
                  <span className="text-xs text-foreground/40">
                    {item.date}
                  </span>
                </div>
                <p className="mt-1.5 text-sm leading-6 text-foreground/70">
                  {item.excerpt}
                </p>
                <span className="mt-3 inline-block rounded-full bg-blue-light px-2.5 py-1 text-xs font-medium text-navy">
                  {item.audience}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
