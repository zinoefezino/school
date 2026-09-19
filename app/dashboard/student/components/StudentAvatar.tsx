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
  size = "md",
}: {
  gender?: "male" | "female";
  name: string;
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
  const dimensions = size === "lg" ? "h-20 w-20" : "h-16 w-16";
  const iconSize = size === "lg" ? 30 : 25;

  return (
    <div
      aria-label={`${name}'s avatar`}
      className={`${dimensions} relative flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-navy/10 bg-gradient-to-br from-white to-blue-light text-blue shadow-sm`}
    >
      <HugeiconsIcon icon={Icon} size={iconSize} />
      <span className="absolute bottom-0 right-0 flex h-6 min-w-6 items-center justify-center rounded-full border border-white bg-navy px-1 text-[10px] font-medium text-white">
        {initials}
      </span>
    </div>
  );
}
