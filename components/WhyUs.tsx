import { HugeiconsIcon } from "@hugeicons/react";
import {
  GraduationCapIcon,
  TeacherIcon,
  ShieldCheckIcon,
  StudentsIcon,
} from "@hugeicons/core-free-icons";

const reasons = [
  {
    icon: GraduationCapIcon,
    title: "Strong academic foundation",
    description:
      "A curriculum that balances core subjects with critical thinking, so students leave prepared for whatever comes next.",
  },
  {
    icon: TeacherIcon,
    title: "Experienced, dedicated faculty",
    description:
      "Small class sizes mean teachers know each student by name, not just by grade.",
  },
  {
    icon: ShieldCheckIcon,
    title: "A safe, supportive environment",
    description:
      "Clear pastoral care structures and a campus every parent feels comfortable leaving their child in.",
  },
  {
    icon: StudentsIcon,
    title: "A balanced student life",
    description:
      "Sports, arts, and clubs that help students discover what they're good at beyond the classroom.",
  },
];

export default function WhyUs() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-6 py-20 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:gap-20">
          <div>
            <h2 className="text-3xl font-bold leading-tight text-foreground">
              Why families choose School
            </h2>
            <p className="mt-4 max-w-sm text-base leading-7 text-foreground/70">
              Four things every parent tells us mattered most when they picked
              our school.
            </p>
          </div>

          <div className="divide-y divide-black/5">
            {reasons.map((reason) => (
              <div key={reason.title} className="flex gap-5 py-6 first:pt-0">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-light text-blue">
                  <HugeiconsIcon icon={reason.icon} size={22} />
                </span>
                <div>
                  <h3 className="text-base font-medium text-foreground">
                    {reason.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-6 text-foreground/70">
                    {reason.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
