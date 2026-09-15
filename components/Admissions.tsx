import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight02Icon } from "@hugeicons/core-free-icons";

const steps = [
  {
    number: "01",
    title: "Submit your application",
    description:
      "Fill out the online form and upload the required documents or visit us directly in school.",
  },
  {
    number: "02",
    title: "Assessment & interview",
    description:
      "We meet the student and, for older applicants, review a short assessment.",
  },
  {
    number: "03",
    title: "Receive your offer",
    description: "Families hear back within two weeks of the interview.",
  },
  {
    number: "04",
    title: "Enroll & get settled",
    description:
      "Confirm your place, complete payment, and pick up the welcome pack.",
  },
];

export default function Admissions() {
  return (
    <section id="admissions" className="bg-white">
      <div className="mx-auto max-w-6xl px-6 py-20 lg:py-28">
        <div className="max-w-xl">
          <h2 className="text-3xl font-medium leading-tight text-foreground">
            How to join School
          </h2>
          <p className="mt-4 text-base leading-7 text-foreground/70">
            Four steps from application to your child&apos;s first day.
          </p>
        </div>

        <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <div key={step.number} className="relative pl-0">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-blue">
                  {step.number}
                </span>
                {i < steps.length - 1 && (
                  <span className="hidden h-px flex-1 bg-navy/10 lg:block" />
                )}
              </div>
              <h3 className="mt-4 text-base font-medium text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-foreground/70">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <a
          href="#apply"
          className="mt-14 inline-flex items-center gap-2 rounded-full bg-blue px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          Start your application
          <HugeiconsIcon icon={ArrowRight02Icon} size={16} />
        </a>
      </div>
    </section>
  );
}
