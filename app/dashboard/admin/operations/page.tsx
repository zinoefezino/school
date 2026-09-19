import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar03Icon, StudentsIcon } from "@hugeicons/core-free-icons";

const cards = [
  {
    title: "Attendance",
    description: "Review daily class attendance and open detailed records.",
    href: "/dashboard/admin/operations/attendance",
    icon: Calendar03Icon,
  },
  {
    title: "Promotions",
    description: "Move students into their next class and term when ready.",
    href: "/dashboard/admin/operations/promotions",
    icon: StudentsIcon,
  },
];

export default function OperationsPage() {
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
