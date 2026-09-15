import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon, BookOpen01Icon } from "@hugeicons/core-free-icons";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <Image
        src="/hero2.jpg"
        alt="Fairview Academy campus"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-linear-to-r from-navy/60 via-navy/35 to-navy/10" />

      <div className="relative z-10 mx-auto flex min-h-svh max-w-6xl items-center px-6 py-24 sm:min-h-140 lg:py-32">
        <div className="max-w-xl">
          <h1 className="text-4xl font-medium leading-tight text-white sm:text-5xl lg:text-6xl">
            Building confident learners for a changing world
          </h1>
          <p className="mt-5 max-w-md text-base leading-7 text-white/80 sm:text-lg">
            Fairview Academy blends strong academics with hands-on learning,
            guiding students from foundation years through to graduation.
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
              className="flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              <HugeiconsIcon icon={BookOpen01Icon} size={18} />
              LEARN MORE
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
