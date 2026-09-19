import { HugeiconsIcon } from "@hugeicons/react";
import { Message01Icon } from "@hugeicons/core-free-icons";

export default function MessagesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm text-foreground/60">
          Messages from teachers and school staff
        </p>
        <h2 className="mt-1 text-xl font-medium text-foreground">Messages</h2>
      </div>
      <div className="flex items-start gap-4 rounded-2xl border border-navy/10 bg-white p-6">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-light text-blue">
          <HugeiconsIcon icon={Message01Icon} size={19} />
        </span>
        <div>
          <p className="text-sm font-medium text-foreground">
            No messages yet.
          </p>
          <p className="mt-1 text-sm text-foreground/60">
            Messages will appear here once staff communication is available.
          </p>
        </div>
      </div>
    </div>
  );
}
