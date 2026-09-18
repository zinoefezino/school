"use client";

import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { CalendarCheckIcon } from "@hugeicons/core-free-icons";

type AttendanceRow = { _id: string; present: number; total: number };
export default function AttendancePage() {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [rows, setRows] = useState<AttendanceRow[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/attendance?date=${date}`)
      .then((response) => response.json())
      .then((data) => setRows(data.attendance ?? []))
      .finally(() => setLoading(false));
  }, [date]);
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-foreground/60">
          Attendance recorded for the selected date
        </p>
        <input
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
          className="rounded-full border border-black/10 bg-white px-4 py-2 text-base text-foreground outline-none"
        />
      </div>
      <div className="overflow-x-auto rounded-2xl border border-navy/10 bg-white">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-navy/10 text-xs font-medium uppercase tracking-wide text-foreground/50">
              <th className="px-6 py-3.5">Class section ID</th>
              <th className="px-6 py-3.5">Present</th>
              <th className="px-6 py-3.5">Rate</th>
              <th className="px-6 py-3.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {loading ? (
              <tr>
                <td
                  colSpan={4}
                  className="p-8 text-center text-sm text-foreground/60"
                >
                  Loading attendance...
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="p-8 text-center text-sm text-foreground/60"
                >
                  No attendance has been recorded for this date.
                </td>
              </tr>
            ) : (
              rows.map((row) => {
                const rate = row.total
                  ? Math.round((row.present / row.total) * 100)
                  : 0;
                return (
                  <tr key={row._id} className="text-sm">
                    <td className="px-6 py-4 font-medium text-foreground">
                      <span className="flex items-center gap-2">
                        <HugeiconsIcon
                          icon={CalendarCheckIcon}
                          size={17}
                          className="text-blue"
                        />
                        {row._id}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-foreground/70">
                      {row.present} / {row.total}
                    </td>
                    <td className="px-6 py-4 text-foreground/70">{rate}%</td>
                    <td className="px-6 py-4 text-right">
                      <a
                        href={`/dashboard/admin/attendance/details?classSection=${row._id}&date=${date}`}
                        className="text-sm font-medium text-blue"
                      >
                        Details
                      </a>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
