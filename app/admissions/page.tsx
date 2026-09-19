import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight02Icon,
  CheckmarkCircle02Icon,
  File01Icon,
  UserMultiple02Icon,
} from "@hugeicons/core-free-icons";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const steps = [
  {
    number: "01",
    title: "Make an enquiry",
    description:
      "Contact the school or visit the admissions office to discuss your child's intended class and entry point.",
  },
  {
    number: "02",
    title: "Submit application details",
    description:
      "Provide student biodata, parent/guardian details, previous school records, and required documents.",
  },
  {
    number: "03",
    title: "Assessment and interview",
    description:
      "The school reviews placement needs and may assess the student depending on age and class level.",
  },
  {
    number: "04",
    title: "Offer, fees, and enrollment",
    description:
      "After admission is approved, the student account is created, class enrollment is assigned, and billing can begin.",
  },
];

const requirements = [
  "Completed student application details",
  "Parent or guardian contact information",
  "Birth certificate or age declaration",
  "Recent passport photograph",
  "Previous school report, where applicable",
  "Medical or special learning information, where applicable",
];

const notes = [
  "Students are assigned to classes through active enrollments.",
  "Parents are linked to students so they can view fees, attendance, results, and announcements.",
  "Class placement depends on age, previous school records, and assessment outcome.",
  "Payment gateway integration is planned as the final phase; current fee records are managed in the dashboard.",
];

export default function AdmissionsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <section className="bg-blue-light/35">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-16 lg:grid-cols-[1fr_480px] lg:py-24">
            <div>
              {/* <p className="text-sm font-medium uppercase tracking-wide text-blue">
                Admissions
              </p> */}
              <h1 className="mt-3 text-4xl font-bold leading-tight text-foreground lg:text-5xl">
                Start your child&apos;s journey with School
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-foreground/70">
                Our admissions process is designed to help families understand
                the school, choose the right class placement, and complete
                enrollment smoothly.
              </p>
              <a
                href="/contact"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-blue px-6 py-3 text-sm font-medium text-white hover:bg-blue-700"
              >
                Contact admissions
                <HugeiconsIcon icon={ArrowRight02Icon} size={16} />
              </a>
            </div>
            <div className="relative h-80 overflow-hidden rounded-3xl bg-blue-light shadow-sm lg:h-96">
              <Image
                src="/hero6.jpeg"
                alt="Students on campus"
                fill
                priority
                className="object-cover"
              />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
          <div className="max-w-xl">
            <h2 className="text-3xl font-bold text-foreground">
              Admission steps
            </h2>
            <p className="mt-4 text-base leading-7 text-foreground/70">
              From enquiry to enrollment, the process keeps both the student and
              guardian records connected in the school portal.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <article
                key={step.number}
                className="rounded-3xl border border-navy/10 bg-white p-6"
              >
                <span className="text-sm font-semibold text-blue">
                  {step.number}
                </span>
                <h3 className="mt-4 text-base font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-foreground/70">
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-blue-light/35">
          <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 lg:grid-cols-2 lg:py-24">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-blue">
                <HugeiconsIcon icon={File01Icon} size={24} />
              </div>
              <h2 className="mt-5 text-3xl font-bold text-foreground">
                What to prepare
              </h2>
              <p className="mt-4 text-base leading-7 text-foreground/70">
                These details help the school create accurate student, parent,
                class, and billing records.
              </p>
            </div>
            <div className="grid gap-3">
              {requirements.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-2xl bg-white p-4 text-sm text-foreground/70"
                >
                  <HugeiconsIcon
                    icon={CheckmarkCircle02Icon}
                    size={18}
                    className="mt-0.5 shrink-0 text-blue"
                  />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[420px_1fr]">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-light text-blue">
                <HugeiconsIcon icon={UserMultiple02Icon} size={24} />
              </div>
              <h2 className="mt-5 text-3xl font-bold text-foreground">
                After admission
              </h2>
              <p className="mt-4 text-base leading-7 text-foreground/70">
                Once a student is admitted, the admin dashboard connects the
                student to their parent, active class enrollment, class teacher,
                subject teachers, invoices, and portal login.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {notes.map((note) => (
                <div
                  key={note}
                  className="rounded-3xl border border-navy/10 bg-white p-5 text-sm leading-6 text-foreground/70"
                >
                  {note}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
