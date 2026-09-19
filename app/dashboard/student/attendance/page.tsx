"use client";

import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CalendarCheckIcon,
  CheckmarkCircle02Icon,
  CancelCircleIcon,
} from "@hugeicons/core-free-icons";
import LoadingState from "../../components/LoadingState";

type AttendanceRecord = {
  _id: string;
  date: string;
  status: "PRESENT" | "ABSENT" | "LATE";
  term?: { name?: string };
};
type AttendanceSummary = {
  total: number;
  present: number;
  absent: number;
  rate: number;
};

function statusLabel(status: AttendanceRecord["status"]) {
  return status.charAt(0) + status.slice(1).toLowerCase();
}

export default function AttendancePage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [summary, setSummary] = useState<AttendanceSummary>({
    total: 0,
    present: 0,
    absent: 0,
    rate: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/student/attendance")
      .then(async (response) => (response.ok ? response.json() : null))
      .then((data) => {
        setRecords(data?.records ?? []);
        if (data?.summary) setSummary(data.summary);
      })
      .catch(() => setRecords([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-navy/10 bg-white p-5">
          <HugeiconsIcon
            icon={CalendarCheckIcon}
            size={22}
            className="text-blue"
          />
          <p className="mt-3 text-2xl font-medium text-foreground">
            {summary.rate}%
          </p>
          <p className="mt-1 text-sm text-foreground/60">
            Attendance this term
          </p>
        </div>
        <div className="rounded-2xl border border-navy/10 bg-white p-5">
          <HugeiconsIcon
            icon={CheckmarkCircle02Icon}
            size={22}
            className="text-[#3F7A5B]"
          />
          <p className="mt-3 text-2xl font-medium text-foreground">
            {summary.present}
          </p>
          <p className="mt-1 text-sm text-foreground/60">Days present</p>
        </div>
        <div className="rounded-2xl border border-navy/10 bg-white p-5">
          <HugeiconsIcon
            icon={CancelCircleIcon}
            size={22}
            className="text-[#B4483B]"
          />
          <p className="mt-3 text-2xl font-medium text-foreground">
            {summary.absent}
          </p>
          <p className="mt-1 text-sm text-foreground/60">Days absent</p>
        </div>
      </div>
      <div>
        <p className="text-sm text-foreground/60">Recent attendance records</p>
        <h2 className="mt-1 text-xl font-medium text-foreground">
          Attendance history
        </h2>
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
            {loading ? (
              <tr>
                <td colSpan={3}>
                  <LoadingState
                    label="Loading attendance..."
                    className="min-h-32"
                  />
                </td>
              </tr>
            ) : records.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="p-8 text-center text-sm text-foreground/60"
                >
                  No attendance records yet.
                </td>
              </tr>
            ) : (
              records.map((item) => (
              <tr key={item._id} className="text-sm">
                <td className="px-6 py-4 text-foreground/70">
                  {new Date(item.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 font-medium text-foreground">
                  {item.term?.name ?? "School day"}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={
                      item.status === "PRESENT"
                        ? "text-[#3F7A5B]"
                        : "text-[#B4483B]"
                    }
                  >
                    {statusLabel(item.status)}
                  </span>
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
