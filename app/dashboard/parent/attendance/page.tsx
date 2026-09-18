"use client";

import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CalendarCheckIcon,
  CheckmarkCircle02Icon,
  CancelCircleIcon,
} from "@hugeicons/core-free-icons";
import { children } from "../data";

const demoRecords = [
  { date: "Sep 18, 2026", subject: "Basic Science", status: "Present" },
  { date: "Sep 17, 2026", subject: "Mathematics", status: "Present" },
  { date: "Sep 16, 2026", subject: "English Language", status: "Absent" },
];

export default function ParentAttendancePage() {
  const [selectedChild, setSelectedChild] = useState(children[0].id);
  const [records, setRecords] = useState(demoRecords);
  useEffect(() => {
    fetch(`/api/parent/attendance?studentId=${selectedChild}`)
      .then(async (response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (data)
          setRecords(
            data.records.map((record: { date: string; status: string }) => ({
              date: new Date(record.date).toLocaleDateString(),
              subject: "School attendance",
              status: record.status,
            })),
          );
      })
      .catch(() => undefined);
  }, [selectedChild]);
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-foreground/60">
            Review attendance for a linked child
          </p>
          <h2 className="mt-1 text-xl font-medium text-foreground">
            Attendance
          </h2>
        </div>
        <select
          value={selectedChild}
          onChange={(event) => setSelectedChild(event.target.value)}
          className="rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm"
        >
          <option value={children[0].id}>{children[0].name}</option>
          <option value={children[1].id}>{children[1].name}</option>
        </select>
      </div>
      <div className="rounded-2xl border border-navy/10 bg-white p-5">
        <div className="flex items-center gap-2 text-sm text-foreground/70">
          <HugeiconsIcon
            icon={CalendarCheckIcon}
            size={19}
            className="text-blue"
          />
          Attendance is visible only for children linked to your account.
        </div>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-navy/10 bg-white">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-navy/10 text-xs font-medium uppercase tracking-wide text-foreground/50">
              <th className="px-6 py-3.5">Date</th>
              <th className="px-6 py-3.5">Subject</th>
              <th className="px-6 py-3.5">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {records.map((record) => (
              <tr key={`${record.date}-${record.subject}`} className="text-sm">
                <td className="px-6 py-4 text-foreground/70">{record.date}</td>
                <td className="px-6 py-4 font-medium text-foreground">
                  {record.subject}
                </td>
                <td
                  className={`px-6 py-4 ${record.status === "Present" ? "text-[#3F7A5B]" : "text-[#B4483B]"}`}
                >
                  <span className="flex items-center gap-2">
                    {record.status === "Present" ? (
                      <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} />
                    ) : (
                      <HugeiconsIcon icon={CancelCircleIcon} size={16} />
                    )}
                    {record.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
