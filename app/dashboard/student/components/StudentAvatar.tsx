"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  GraduateFemaleIcon,
  GraduateMaleIcon,
  StudentIcon,
} from "@hugeicons/core-free-icons";

export default function StudentAvatar({
  gender,
  name,
  photoUrl,
  size = "md",
}: {
  gender?: "male" | "female";
  name: string;
  photoUrl?: string;
  size?: "md" | "lg";
}) {
  const Icon =
    gender === "male"
      ? GraduateMaleIcon
      : gender === "female"
        ? GraduateFemaleIcon
        : StudentIcon;
  const initials =
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "S";
  const dimensions = size === "lg" ? "h-36 w-32" : "h-28 w-24";
  const iconSize = size === "lg" ? 54 : 42;
  const initialsSize =
    size === "lg" ? "h-8 min-w-8 text-xs" : "h-7 min-w-7 text-[11px]";

  return (
    <div
      aria-label={`${name}'s avatar`}
      className={`${dimensions} relative flex shrink-0 items-center justify-center overflow-hidden rounded-3xl border border-white/80 bg-gradient-to-br from-blue-light via-white to-[#EAF1FF] text-blue shadow-[0_12px_30px_rgba(15,23,42,0.12)] ring-1 ring-navy/10`}
    >
      {photoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={photoUrl}
          alt={`${name}'s profile photo`}
          className="h-full w-full object-cover"
        />
      ) : (
        <>
          <span className="absolute inset-x-4 bottom-0 h-1/2 rounded-t-full bg-blue/10" />
          <span
            className={`relative flex ${
              size === "lg" ? "h-20 w-20" : "h-16 w-16"
            } items-center justify-center rounded-3xl bg-white/80 text-blue shadow-sm`}
          >
            <HugeiconsIcon icon={Icon} size={iconSize} />
          </span>
        </>
      )}
      <span
        className={`absolute bottom-2 right-2 flex ${initialsSize} items-center justify-center rounded-full border border-white bg-navy px-1 font-medium text-white shadow-sm`}
      >
        {initials}
      </span>
    </div>
  );
}
