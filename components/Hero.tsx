import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon, BookOpen01Icon } from "@hugeicons/core-free-icons";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#f4f7fb]">
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,23,42,0.09)_1px,transparent_1px),linear-gradient(180deg,rgba(15,23,42,0.09)_1px,transparent_1px)] bg-[size:28px_28px]" />
      <div className="absolute inset-0 bg-linear-to-b from-white/35 via-transparent to-white/45" />

      <div className="relative z-10 mx-auto grid min-h-svh max-w-6xl items-center gap-12 px-6 py-20 sm:min-h-140 lg:grid-cols-2 lg:py-28">
        <div className="max-w-xl">
          {/* <span className="text-sm font-medium uppercase tracking-wide text-blue">
            Fairview Academy
          </span> */}

          <h1 className="mt-4 text-4xl font-medium leading-tight text-blue sm:text-5xl lg:text-6xl">
            FAIRVIEW GROUP OF SCHOOLS
          </h1>

          <p className="mt-5 max-w-md text-base leading-7 text-slate-600 sm:text-lg">
            We blend strong academics with hands-on learning, guiding students
            from foundation years through to graduation.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#admissions"
              className="flex items-center gap-2 rounded-full bg-blue px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              ADMISSION
              <HugeiconsIcon icon={ArrowRight01Icon} size={18} />
            </a>

            <a
              href="#tour"
              className="flex items-center gap-2 rounded-full border border-navy/20 bg-white/75 px-6 py-3 text-sm font-medium text-navy backdrop-blur transition-colors hover:bg-white"
            >
              <HugeiconsIcon icon={BookOpen01Icon} size={18} />
              LEARN MORE
            </a>
          </div>
        </div>

        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-slate-100 shadow-xl ring-1 ring-navy/10 sm:aspect-[5/4] lg:aspect-[4/5]">
          <Image
            src="/hero.jpg"
            alt="Fairview Academy campus"
            fill
            priority
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
