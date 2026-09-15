"use client";

import { useRef } from "react";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";

const photos = [
  {
    src: "/img1.jpg",
    caption: "Inter-house sports day",
  },
  {
    src: "/img1.jpg",
    caption: "Cultural day parade",
  },
  {
    src: "/img1.jpg",
    caption: "Annual science fair",
  },
  {
    src: "/img1.jpg",
    caption: "Student art exhibition",
  },
  {
    src: "/img1.jpg",
    caption: "Music recital evening",
  },
  {
    src: "/img1.jpg",
    caption: "Founder's day",
  },
];

export default function Gallery() {
  const galleryRef = useRef<HTMLDivElement | null>(null);

  const scrollGallery = (direction: "left" | "right") => {
    const gallery = galleryRef.current;
    if (!gallery) return;

    const cardWidth =
      gallery.querySelector("div")?.getBoundingClientRect().width ?? 420;
    const gap = 20;
    gallery.scrollBy({
      left: direction === "left" ? -(cardWidth + gap) : cardWidth + gap,
      behavior: "smooth",
    });
  };

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-0 py-20 sm:px-6 lg:py-28">
        <div className="max-w-xl">
          <h2 className="text-3xl font-medium leading-tight text-foreground">
            Photos of our school activities and events
          </h2>
          <p className="mt-4 text-base leading-7 text-foreground/70">
            Sports days, exhibitions, and the everyday moments in between.
          </p>
        </div>

        <div className="mt-10 flex items-center justify-end gap-3">
          <button
            type="button"
            aria-label="Previous gallery image"
            onClick={() => scrollGallery("left")}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition-colors hover:border-blue hover:text-blue"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
          </button>
          <button
            type="button"
            aria-label="Next gallery image"
            onClick={() => scrollGallery("right")}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition-colors hover:border-blue hover:text-blue"
          >
            <HugeiconsIcon icon={ArrowRight01Icon} size={18} />
          </button>
        </div>

        <div
          ref={galleryRef}
          className="mt-8 flex gap-4 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-5 lg:overflow-x-auto lg:pb-4"
        >
          {photos.map((photo) => (
            <div
              key={photo.caption}
              className="group relative h-[320px] min-w-[84%] overflow-hidden rounded-[1.5rem] bg-blue-light shadow-sm sm:min-w-[420px] lg:h-[420px] lg:min-w-[420px]"
            >
              <Image
                src={photo.src}
                alt={photo.caption}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-navy/75 via-navy/10 to-transparent" />
              <p className="absolute bottom-4 left-4 text-base font-medium text-white">
                {photo.caption}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
