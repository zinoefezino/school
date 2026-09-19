import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Megaphone01Icon, NewspaperIcon } from "@hugeicons/core-free-icons";

const cards = [
  {
    title: "Announcements",
    description: "Send dashboard notices to students, parents, and staff.",
    href: "/dashboard/admin/communications/announcements",
    icon: Megaphone01Icon,
  },
  {
    title: "Public news",
    description: "Publish homepage and public news page stories.",
    href: "/dashboard/admin/communications/news",
    icon: NewspaperIcon,
  },
];

export default function CommunicationsPage() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {cards.map((card) => (
        <Link
          key={card.href}
          href={card.href}
          className="rounded-2xl border border-navy/10 bg-white p-6 transition-transform hover:-translate-y-1"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-light text-blue">
            <HugeiconsIcon icon={card.icon} size={21} />
          </span>
          <h2 className="mt-5 text-lg font-medium text-foreground">
            {card.title}
          </h2>
          <p className="mt-2 text-sm leading-6 text-foreground/60">
            {card.description}
          </p>
        </Link>
      ))}
    </div>
  );
}
