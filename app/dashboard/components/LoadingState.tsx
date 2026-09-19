"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { Loading03Icon } from "@hugeicons/core-free-icons";

export default function LoadingState({
  label = "Loading...",
  className = "",
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      role="status"
      className={`flex min-h-48 flex-col items-center justify-center gap-3 text-sm text-foreground/60 ${className}`}
    >
      <HugeiconsIcon
        icon={Loading03Icon}
        size={28}
        className="animate-spin text-blue"
      />
      <span>{label}</span>
    </div>
  );
}
