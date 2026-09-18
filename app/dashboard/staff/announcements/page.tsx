import { HugeiconsIcon } from "@hugeicons/react";
import { Megaphone01Icon } from "@hugeicons/core-free-icons";
import { announcementsFor } from "../../../../lib/announcements";

const announcements = announcementsFor("STAFF");

export default function StaffAnnouncementsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm text-foreground/60">
          Updates shared by school administration
        </p>
        <h2 className="mt-1 text-xl font-medium text-foreground">
          Announcements
        </h2>
      </div>
      <div className="flex flex-col gap-4">
        {announcements.map((item) => (
          <article
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
                  {item.body}
                </p>
                <span className="mt-3 inline-block rounded-full bg-blue-light px-2.5 py-1 text-xs font-medium text-navy">
                  {item.audience}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
