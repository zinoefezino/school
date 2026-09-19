"use client";

import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CalendarCheckIcon,
  CheckmarkCircle02Icon,
  CancelCircleIcon,
} from "@hugeicons/core-free-icons";
import LoadingState from "../../components/LoadingState";

type ChildSummary = { id: string; name: string };
type AttendanceRecord = { date: string; subject: string; status: string };

function statusLabel(status: string) {
  return status.charAt(0) + status.slice(1).toLowerCase();
}

export default function ParentAttendancePage() {
  const [children, setChildren] = useState<ChildSummary[]>([]);
  const [selectedChild, setSelectedChild] = useState("");
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loadingChildren, setLoadingChildren] = useState(true);
  const [loadingRecords, setLoadingRecords] = useState(false);

  useEffect(() => {
    fetch("/api/parent/children")
      .then(async (response) => (response.ok ? response.json() : null))
      .then((data) => {
        const nextChildren = data?.children ?? [];
        setChildren(nextChildren);
        setSelectedChild(nextChildren[0]?.id ?? "");
      })
      .catch(() => setChildren([]))
      .finally(() => setLoadingChildren(false));
  }, []);

  useEffect(() => {
    if (!selectedChild) return;
    Promise.resolve().then(() => setLoadingRecords(true));
    fetch(`/api/parent/attendance?studentId=${selectedChild}`)
      .then(async (response) => (response.ok ? response.json() : null))
      .then((data) => {
        setRecords(
          (data?.records ?? []).map(
            (record: { date: string; status: string }) => ({
              date: new Date(record.date).toLocaleDateString(),
              subject: "School attendance",
              status: record.status,
            }),
          ),
        );
      })
      .catch(() => setRecords([]))
      .finally(() => setLoadingRecords(false));
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
          {children.map((child) => (
            <option key={child.id} value={child.id}>
              {child.name}
            </option>
          ))}
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
            {loadingChildren || loadingRecords ? (
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
              records.map((record) => (
                <tr key={`${record.date}-${record.subject}`} className="text-sm">
                  <td className="px-6 py-4 text-foreground/70">
                    {record.date}
                  </td>
                  <td className="px-6 py-4 font-medium text-foreground">
                    {record.subject}
                  </td>
                  <td
                    className={`px-6 py-4 ${
                      record.status === "PRESENT"
                        ? "text-[#3F7A5B]"
                        : "text-[#B4483B]"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {record.status === "PRESENT" ? (
                        <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} />
                      ) : (
                        <HugeiconsIcon icon={CancelCircleIcon} size={16} />
                      )}
                      {statusLabel(record.status)}
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
