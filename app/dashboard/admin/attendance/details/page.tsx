"use client";

import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft02Icon, CalendarCheckIcon } from "@hugeicons/core-free-icons";
import LoadingState from "../../../components/LoadingState";

type RecordRow = {
  student?: { fullName?: string; admissionNumber?: string };
  present: number;
  total: number;
};
export default function AttendanceDetailsPage() {
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [records, setRecords] = useState<RecordRow[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/attendance/details?month=${month}`)
      .then((response) => response.json())
      .then((data) => setRecords(data.records ?? []))
      .finally(() => setLoading(false));
  }, [month]);
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
        <input
          type="month"
          value={month}
          onChange={(event) => setMonth(event.target.value)}
          className="rounded-full border border-black/10 bg-white px-4 py-2.5 text-base"
        />
      </div>
      <div className="overflow-x-auto rounded-2xl border border-navy/10 bg-white">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-navy/10 text-xs font-medium uppercase tracking-wide text-foreground/50">
              <th className="px-6 py-3.5">Student</th>
              <th className="px-6 py-3.5">Admission no.</th>
              <th className="px-6 py-3.5">Present days</th>
              <th className="px-6 py-3.5">Rate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {loading ? (
              <tr>
                <td
                  colSpan={4}
                  className="p-8 text-center text-sm text-foreground/60"
                >
                  <LoadingState
                    label="Loading attendance..."
                    className="min-h-24"
                  />
                </td>
              </tr>
            ) : records.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="p-8 text-center text-sm text-foreground/60"
                >
                  No attendance records for this month.
                </td>
              </tr>
            ) : (
              records.map((record) => (
                <tr key={record.student?.admissionNumber} className="text-sm">
                  <td className="px-6 py-4 font-medium text-foreground">
                    <span className="flex items-center gap-2">
                      <HugeiconsIcon
                        icon={CalendarCheckIcon}
                        size={17}
                        className="text-blue"
                      />
                      {record.student?.fullName ?? "Unknown student"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-foreground/70">
                    {record.student?.admissionNumber ?? "-"}
                  </td>
                  <td className="px-6 py-4 text-foreground/70">
                    {record.present} / {record.total}
                  </td>
                  <td className="px-6 py-4 font-medium text-foreground">
                    {record.total
                      ? Math.round((record.present / record.total) * 100)
                      : 0}
                    %
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
