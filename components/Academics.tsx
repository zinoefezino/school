import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Book02Icon,
  GraduationScrollIcon,
  Certificate01Icon,
  ArrowRight02Icon,
} from "@hugeicons/core-free-icons";

const programs = [
  {
    icon: Book02Icon,
    name: "Early years",
    ageRange: "Ages 3 to 5",
    image: "/img1.jpg",
    description:
      "Play based learning that builds curiosity, language, and early number sense.",
  },
  {
    icon: GraduationScrollIcon,
    name: "Primary school",
    ageRange: "Ages 6 to 11",
    image: "/img1.jpg",
    description:
      "A structured curriculum across core subjects, with room for art, music, and sport.",
  },
  {
    icon: Certificate01Icon,
    name: "Secondary school",
    ageRange: "Ages 12 to 18",
    image: "/hero2.jpg",
    description:
      "Exam track academics alongside guidance for university and career pathways.",
  },
];

export default function Academics() {
  return (
    <section id="academics" className="">
      <div className="mx-auto max-w-6xl px-6 py-20 lg:py-28">
        <div className="max-w-xl">
          <h2 className="text-3xl font-bold leading-tight text-foreground">
            Academic programs for every age
          </h2>
          <p className="mt-4 text-base leading-7 text-foreground/70">
            From first steps to final exams, each stage is built on what came
            before it.
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {programs.map((program) => (
            <div
              key={program.name}
              className="flex flex-col overflow-hidden rounded-2xl border border-navy/10 bg-white"
            >
              <div className="relative aspect-video bg-blue-light">
                <Image
                  src={program.image}
                  alt={`${program.name} students at Fairview Academy`}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col p-6 bg-blue-light">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-blue">
                  <HugeiconsIcon icon={program.icon} size={18} />
                </span>
                <h3 className="mt-4 text-base font-medium text-foreground">
                  {program.name}
                </h3>
                <p className="mt-1 text-xs font-medium text-blue">
                  {program.ageRange}
                </p>
                <p className="mt-3 text-sm leading-6 text-foreground/70">
                  {program.description}
                </p>
                <a
                  href="/academics"
                  className="mt-5 flex items-center gap-1.5 text-sm font-medium text-navy"
                >
                  Learn more
                  <HugeiconsIcon icon={ArrowRight02Icon} size={16} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
