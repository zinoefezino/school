import { HugeiconsIcon } from "@hugeicons/react";
import { Message01Icon } from "@hugeicons/core-free-icons";

const messages = [
  {
    sender: "Mrs. Adaeze Nwosu",
    subject: "Mathematics revision",
    preview:
      "Please remember to complete the revision questions before Friday.",
    date: "Today",
  },
  {
    sender: "School office",
    subject: "Mid-term break",
    preview: "Your mid-term break notice is available in announcements.",
    date: "Sep 15",
  },
];

export default function MessagesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm text-foreground/60">
          Messages from teachers and school staff
        </p>
        <h2 className="mt-1 text-xl font-medium text-foreground">Messages</h2>
      </div>
      <div className="rounded-2xl border border-navy/10 bg-white divide-y divide-black/5">
        {messages.map((message) => (
          <button
            key={message.subject}
            className="flex w-full items-start gap-4 p-5 text-left transition-colors hover:bg-blue-light/40"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-light text-blue">
              <HugeiconsIcon icon={Message01Icon} size={19} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex flex-wrap items-center justify-between gap-2">
                <strong className="text-sm font-medium text-foreground">
                  {message.subject}
                </strong>
                <span className="text-xs text-foreground/45">
                  {message.date}
                </span>
              </span>
              <span className="mt-1 block text-sm text-foreground/60">
                {message.sender}
              </span>
              <span className="mt-2 block truncate text-sm text-foreground/50">
                {message.preview}
              </span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
