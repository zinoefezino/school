"use client";

import { useEffect, useMemo, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar03Icon, Clock01Icon } from "@hugeicons/core-free-icons";
import LoadingState from "../../components/LoadingState";

type TimetableEntry = {
  _id: string;
  day: string;
  startTime: string;
  endTime: string;
  room?: string;
  subject?: { name?: string };
  teacher?: { fullName?: string };
};

const dayOrder = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function TimetablePage() {
  const [entries, setEntries] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/student/timetable")
      .then(async (response) => (response.ok ? response.json() : null))
      .then((data) => setEntries(data?.timetable ?? []))
      .catch(() => setEntries([]))
      .finally(() => setLoading(false));
  }, []);

  const days = useMemo(
    () =>
      dayOrder
        .map((day) => ({
          day,
          slots: entries.filter((entry) => entry.day === day),
        }))
        .filter((day) => day.slots.length > 0),
    [entries],
  );

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
      {loading ? (
        <LoadingState
          label="Loading timetable..."
          className="rounded-2xl bg-white p-6"
        />
      ) : days.length === 0 ? (
        <div className="flex items-start gap-4 rounded-2xl border border-navy/10 bg-white p-6">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-light text-blue">
            <HugeiconsIcon icon={Calendar03Icon} size={19} />
          </span>
          <div>
            <p className="text-sm font-medium text-foreground">
              No timetable has been published yet.
            </p>
            <p className="mt-1 text-sm text-foreground/60">
              Your weekly schedule will appear here once timetable entries are
              created for your class.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-3">
          {days.map((day) => (
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
                  <div key={slot._id} className="py-4 last:pb-0">
                    <p className="text-sm font-medium text-foreground">
                      {slot.subject?.name ?? "Subject"}
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-foreground/50">
                      <HugeiconsIcon icon={Clock01Icon} size={14} />
                      {slot.startTime} - {slot.endTime}
                      {slot.room ? ` · ${slot.room}` : ""}
                    </p>
                    {slot.teacher?.fullName && (
                      <p className="mt-1 text-xs text-foreground/50">
                        {slot.teacher.fullName}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
