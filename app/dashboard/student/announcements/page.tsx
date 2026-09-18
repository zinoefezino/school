import { HugeiconsIcon } from "@hugeicons/react";
import { Megaphone01Icon } from "@hugeicons/core-free-icons";
import { announcementsFor } from "../../../../lib/announcements";

const announcements = announcementsFor("STUDENT");

export default function AnnouncementsPage() {
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
        {announcements.map((item) => (
          <article
            key={item.title}
            className="rounded-2xl border border-navy/10 bg-white p-6"
          >
            <div className="flex items-start gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-light text-blue">
                <HugeiconsIcon icon={Megaphone01Icon} size={20} />
              </span>
              <div>
                <p className="text-xs text-foreground/50">{item.date}</p>
                <h3 className="mt-1 text-base font-medium text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-foreground/65">
                  {item.body}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
