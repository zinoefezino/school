type StatusTone = "success" | "error" | "info" | "warning";

interface StatusMessageProps {
  children: React.ReactNode;
  className?: string;
  tone?: StatusTone;
}

function inferTone(value: React.ReactNode): StatusTone {
  if (typeof value !== "string") return "info";
  const text = value.toLowerCase();
  if (
    text.includes("unable") ||
    text.includes("error") ||
    text.includes("failed") ||
    text.includes("missing") ||
    text.includes("required") ||
    text.includes("not found") ||
    text.includes("cannot") ||
    text.includes("do not match")
  )
    return "error";
  if (
    text.includes("saved") ||
    text.includes("created") ||
    text.includes("published") ||
    text.includes("deleted") ||
    text.includes("updated") ||
    text.includes("changed") ||
    text.includes("recorded") ||
    text.includes("verified") ||
    text.includes("promoted")
  )
    return "success";
  return "info";
}

const toneStyles: Record<StatusTone, string> = {
  success: "border-[#3F7A5B]/20 bg-[#3F7A5B]/10 text-[#3F7A5B]",
  error: "border-[#B4483B]/20 bg-[#B4483B]/10 text-[#B4483B]",
  warning: "border-[#B88A2C]/20 bg-[#B88A2C]/10 text-[#8A651E]",
  info: "border-blue/20 bg-blue/5 text-foreground/70",
};

export default function StatusMessage({
  children,
  className = "",
  tone,
}: StatusMessageProps) {
  const resolvedTone = tone ?? inferTone(children);
  return (
    <p
      role={resolvedTone === "error" ? "alert" : "status"}
      className={`rounded-2xl border px-4 py-3 text-sm ${toneStyles[resolvedTone]} ${className}`}
    >
      {children}
    </p>
  );
}
