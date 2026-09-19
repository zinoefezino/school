import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Target02Icon,
  HandshakeIcon,
  StudentsIcon,
  BulbIcon,
  Image01Icon,
  ArrowRight02Icon,
} from "@hugeicons/core-free-icons";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const values = [
  {
    icon: Target02Icon,
    title: "Excellence",
    description:
      "We hold every student to a high standard, and give them the support to reach it.",
  },
  {
    icon: HandshakeIcon,
    title: "Integrity",
    description:
      "Honesty and accountability are non-negotiable, in the classroom and beyond it.",
  },
  {
    icon: StudentsIcon,
    title: "Community",
    description:
      "A school is a family — students, staff, and parents working toward the same goal.",
  },
  {
    icon: BulbIcon,
    title: "Curiosity",
    description:
      "We reward questions as much as answers, and make room for students to explore.",
  },
];

const leadership = [
  { name: "Dr. Ifeoma Adeleke", title: "Principal" },
  { name: "Mr. Bassey Umoh", title: "Vice Principal, Academics" },
  { name: "Mrs. Ronke Fashina", title: "Head of Pastoral Care" },
];

const accreditations = [
  "Ministry of Education, Delta State",
  "WAEC Approved Examination Centre",
  "NECO Approved Examination Centre",
  "Nigerian Association of Private Schools",
];

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />

      {/* Page header */}
      <section className="relative overflow-hidden bg-navy">
        <Image
          src=""
          alt="Fairview Academy students on campus"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-navy/80" />

        <div className="relative z-10 mx-auto max-w-6xl px-6 py-16 lg:py-20">
          <h1 className="max-w-2xl text-3xl font-medium leading-tight text-white sm:text-4xl">
            Twenty years of shaping confident, capable students
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-white/70">
            Fairview Academy was founded on a simple idea: every student learns
            differently, and a good school makes room for that.
          </p>
        </div>
      </section>

      {/* Our story */}
      <section className="bg-white">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:py-28">
          <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-blue-light">
            <Image
              src="/hero6.jpeg"
              alt="Fairview Academy campus"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="text-2xl font-medium leading-tight text-foreground">
              Our story
            </h2>
            <p className="mt-4 text-base leading-7 text-foreground/70">
              Fairview Academy opened its doors in 2005 with two classrooms and
              thirty students. What started as a small neighborhood school grew,
              term by term, into a full early-years-through-SS3 institution —
              built on the same founding belief that individual attention
              matters more than class size alone.
            </p>
            <p className="mt-4 text-base leading-7 text-foreground/70">
              Today, over a thousand students pass through our gates each
              morning. What hasn&apos;t changed is the commitment behind it:
              small classes, teachers who know every student by name, and a
              campus where kids actually want to be.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-blue-light">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 py-20 sm:grid-cols-2 lg:py-28">
          <div className="rounded-2xl bg-white p-8">
            <h3 className="text-lg font-medium text-foreground">Our mission</h3>
            <p className="mt-3 text-sm leading-7 text-foreground/70">
              To provide a well-rounded education that builds strong academic
              foundations alongside character, curiosity, and confidence —
              preparing students not just for exams, but for life after them.
            </p>
          </div>
          <div className="rounded-2xl bg-navy p-8">
            <h3 className="text-lg font-medium text-white">Our vision</h3>
            <p className="mt-3 text-sm leading-7 text-white/70">
              To be the school families trust most in our community — known for
              the quality of our teaching, the care we take with every student,
              and the outcomes our graduates go on to achieve.
            </p>
          </div>
        </div>
      </section>

      {/* Core values */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:py-28">
          <div className="max-w-xl">
            <h2 className="text-2xl font-medium leading-tight text-foreground">
              What guides us
            </h2>
            <p className="mt-4 text-base leading-7 text-foreground/70">
              Four principles that shape how we teach and how we run this
              school.
            </p>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2">
            {values.map((value) => (
              <div key={value.title} className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-light text-blue">
                  <HugeiconsIcon icon={value.icon} size={22} />
                </span>
                <div>
                  <h3 className="text-base font-medium text-foreground">
                    {value.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-6 text-foreground/70">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="bg-blue-light">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:py-28">
          <div className="max-w-xl">
            <h2 className="text-2xl font-medium leading-tight text-foreground">
              School leadership
            </h2>
            <p className="mt-4 text-base leading-7 text-foreground/70">
              The team responsible for the day-to-day running of Fairview.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {leadership.map((person) => (
              <div
                key={person.name}
                className="rounded-2xl bg-white p-6 text-center"
              >
                <div className="mx-auto flex aspect-square w-20 items-center justify-center rounded-full bg-blue-light">
                  <HugeiconsIcon
                    icon={Image01Icon}
                    size={24}
                    className="text-navy/40"
                  />
                </div>
                <h3 className="mt-4 text-sm font-medium text-foreground">
                  {person.name}
                </h3>
                <p className="mt-1 text-xs text-foreground/60">
                  {person.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Accreditation */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <p className="text-center text-sm font-medium text-foreground/50">
            Accredited and recognized by
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {accreditations.map((item) => (
              <span
                key={item}
                className="rounded-full border border-navy/10 px-4 py-2 text-xs font-medium text-foreground/70"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-16 text-center">
          <h2 className="max-w-lg text-2xl font-medium leading-tight text-white">
            Ready to see Fairview for yourself?
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="/#admissions"
              className="rounded-full bg-blue px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              Apply now
            </a>
            <a
              href="/#tour"
              className="flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              Schedule a tour
              <HugeiconsIcon icon={ArrowRight02Icon} size={16} />
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
