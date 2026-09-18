import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar03Icon, Clock01Icon } from "@hugeicons/core-free-icons";
import { timetable } from "../data";

export default function TimetablePage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm text-foreground/60">
          Your weekly lesson schedule
        </p>
        <h2 className="mt-1 text-xl font-medium text-foreground">
          Class timetable
        </h2>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {timetable.map((day) => (
          <div
            key={day.day}
            className="rounded-2xl border border-navy/10 bg-white p-5"
          >
            <div className="flex items-center gap-2 border-b border-black/5 pb-4">
              <HugeiconsIcon
                icon={Calendar03Icon}
                size={18}
                className="text-blue"
              />
              <h3 className="font-medium text-foreground">{day.day}</h3>
            </div>
            <div className="divide-y divide-black/5">
              {day.slots.map((slot) => (
                <div key={slot.time} className="py-4 last:pb-0">
                  <p className="text-sm font-medium text-foreground">
                    {slot.subject}
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-foreground/50">
                    <HugeiconsIcon icon={Clock01Icon} size={14} />
                    {slot.time} · {slot.room}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
