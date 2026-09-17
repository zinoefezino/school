import { HugeiconsIcon } from "@hugeicons/react";
import { CalendarCheckIcon } from "@hugeicons/core-free-icons";

const attendanceByClass = [
  { classSection: "JSS1 Gold", present: 36, total: 38 },
  { classSection: "JSS2 Silver", present: 39, total: 41 },
  { classSection: "SS2 Diamond", present: 30, total: 35 },
  { classSection: "SS3 Emerald", present: 29, total: 29 },
  { classSection: "Primary 4A", present: 31, total: 33 },
];

export default function AttendancePage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-foreground/60">
          Today's attendance by class
        </p>

        <input
          type="date"
          defaultValue={new Date().toISOString().split("T")[0]}
          className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-foreground outline-none"
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-navy/10 bg-white">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-navy/10 text-xs font-medium uppercase tracking-wide text-foreground/50">
              <th className="px-6 py-3.5">Class</th>
              <th className="px-6 py-3.5">Present</th>
              <th className="px-6 py-3.5">Rate</th>
              <th className="px-6 py-3.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {attendanceByClass.map((row) => {
              const rate = Math.round((row.present / row.total) * 100);
              return (
                <tr key={row.classSection} className="text-sm">
                  <td className="whitespace-nowrap px-6 py-3.5 font-medium text-foreground">
                    {row.classSection}
                  </td>
                  <td className="whitespace-nowrap px-6 py-3.5 text-foreground/70">
                    {row.present} / {row.total}
                  </td>
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-blue-light">
                        <div
                          className="h-full rounded-full bg-blue"
                          style={{ width: `${rate}%` }}
                        />
                      </div>
                      <span className="text-foreground/70">{rate}%</span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-3.5 text-right">
                    <a
                      href="/dashboard/admin/attendance/details"
                      className="flex items-center justify-end gap-1.5 text-sm font-medium text-blue"
                    >
                      <HugeiconsIcon icon={CalendarCheckIcon} size={16} />
                      Details
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
