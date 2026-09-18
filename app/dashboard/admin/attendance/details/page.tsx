import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft02Icon, CalendarCheckIcon } from "@hugeicons/core-free-icons";

const records = [
  { name: "Chidera Okafor", classSection: "JSS1 Gold", present: 18, total: 19 },
  {
    name: "Tamuno Briggs",
    classSection: "SS2 Diamond",
    present: 17,
    total: 19,
  },
  { name: "Amara Chukwu", classSection: "Primary 4A", present: 16, total: 18 },
];

export default function AttendanceDetailsPage() {
  return (
    <div className="flex flex-col gap-6">
      <a
        href="/dashboard/admin/attendance"
        className="flex items-center gap-1.5 text-sm font-medium text-blue"
      >
        <HugeiconsIcon icon={ArrowLeft02Icon} size={16} />
        Back to attendance
      </a>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-foreground/60">
            Student attendance records
          </p>
          <h2 className="mt-1 text-xl font-medium text-foreground">
            Attendance details
          </h2>
        </div>
        <div className="flex gap-3">
          <select className="rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm">
            <option>All classes</option>
            <option>JSS1 Gold</option>
          </select>
          <input
            type="month"
            defaultValue="2026-09"
            className="rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm"
          />
        </div>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-navy/10 bg-white">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-navy/10 text-xs font-medium uppercase tracking-wide text-foreground/50">
              <th className="px-6 py-3.5">Student</th>
              <th className="px-6 py-3.5">Class</th>
              <th className="px-6 py-3.5">Present days</th>
              <th className="px-6 py-3.5">Rate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {records.map((record) => (
              <tr key={record.name} className="text-sm">
                <td className="px-6 py-4 font-medium text-foreground">
                  <span className="flex items-center gap-2">
                    <HugeiconsIcon
                      icon={CalendarCheckIcon}
                      size={17}
                      className="text-blue"
                    />
                    {record.name}
                  </span>
                </td>
                <td className="px-6 py-4 text-foreground/70">
                  {record.classSection}
                </td>
                <td className="px-6 py-4 text-foreground/70">
                  {record.present} / {record.total}
                </td>
                <td className="px-6 py-4 font-medium text-foreground">
                  {Math.round((record.present / record.total) * 100)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
