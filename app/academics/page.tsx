import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Book02Icon,
  Certificate01Icon,
  CheckmarkCircle02Icon,
  GraduationScrollIcon,
  TeacherIcon,
} from "@hugeicons/core-free-icons";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const stages = [
  {
    title: "Early years",
    ageRange: "Ages 3 to 5",
    image: "/img1.jpg",
    icon: Book02Icon,
    description:
      "Children build language, confidence, number sense, creativity, and social habits through guided play and structured discovery.",
  },
  {
    title: "Primary school",
    ageRange: "Ages 6 to 11",
    image: "/hero3.png",
    icon: GraduationScrollIcon,
    description:
      "Learners develop strong foundations in literacy, numeracy, science, digital awareness, arts, and character formation.",
  },
  {
    title: "Secondary school",
    ageRange: "Ages 12 to 18",
    image: "/hero2.jpg",
    icon: Certificate01Icon,
    description:
      "Students prepare for external examinations, leadership, higher education, and real world problem solving.",
  },
];

const approach = [
  "Structured lessons with continuous assessment",
  "Subject specialist teachers for focused instruction",
  "Class teachers who mentor and support each class",
  "Clear progress reports for students and parents",
  "Balanced academics, sports, clubs, creativity, and character",
  "Regular assignments, attendance monitoring, and termly assessments",
];

const subjects = [
  "English Language",
  "Mathematics",
  "Basic Science",
  "Social Studies",
  "Computer Studies",
  "Creative Arts",
  "Business Studies",
  "Civic Education",
  "Literature",
  "Physics",
  "Chemistry",
  "Biology",
];

export default function AcademicsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <section className="bg-blue-light/35">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-16 lg:grid-cols-[1fr_480px] lg:py-24">
            <div>
              <h1 className="mt-3 text-4xl font-bold leading-tight text-foreground lg:text-5xl">
                A clear learning path from early years to graduation
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-foreground/70">
                Our academic structure supports every stage of growth with
                strong classroom teaching, subject specific instruction,
                continuous assessment, and parent visible progress.
              </p>
            </div>
            <div className="relative h-80 overflow-hidden rounded-3xl bg-blue-light shadow-sm lg:h-96">
              <Image
                src="/hero2.jpg"
                alt="Students learning in school"
                fill
                priority
                className="object-cover"
              />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold text-foreground">
              Academic stages
            </h2>
            <p className="mt-4 text-base leading-7 text-foreground/70">
              Each stage is designed to build on the previous one, helping
              students grow in knowledge, discipline, confidence, and curiosity.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {stages.map((stage) => (
              <article
                key={stage.title}
                className="overflow-hidden rounded-3xl border border-navy/10 bg-white"
              >
                <div className="relative h-52 bg-blue-light">
                  <Image
                    src={stage.image}
                    alt={stage.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-light text-blue">
                    <HugeiconsIcon icon={stage.icon} size={20} />
                  </span>
                  <h3 className="mt-4 text-lg font-semibold text-foreground">
                    {stage.title}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-blue">
                    {stage.ageRange}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-foreground/70">
                    {stage.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-blue-light/35">
          <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 lg:grid-cols-2 lg:py-24">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-blue">
                <HugeiconsIcon icon={TeacherIcon} size={24} />
              </div>
              <h2 className="mt-5 text-3xl font-bold text-foreground">
                Teaching and assessment approach
              </h2>
              <p className="mt-4 text-base leading-7 text-foreground/70">
                Students are supported by class teachers who know them well and
                subject specialists who bring depth to each lesson. This balance
                helps every learner receive both personal guidance and strong
                academic instruction.
              </p>
            </div>
            <div className="grid gap-3">
              {approach.map((item) => (
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
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div className="max-w-xl">
              <h2 className="text-3xl font-bold text-foreground">
                Subject areas
              </h2>
              <p className="mt-4 text-base leading-7 text-foreground/70">
                Our subject offering gives students a strong foundation in core
                academics while making room for creativity, technology,
                leadership, and practical learning.
              </p>
            </div>
            <a
              href="/admissions"
              className="rounded-full bg-blue px-6 py-3 text-sm font-medium text-white hover:bg-blue-700"
            >
              Ask about admission
            </a>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {subjects.map((subject) => (
              <div
                key={subject}
                className="rounded-2xl border border-navy/10 bg-white px-4 py-3 text-sm font-medium text-foreground"
              >
                {subject}
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
