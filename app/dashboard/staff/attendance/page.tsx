"use client";

import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CalendarCheckIcon,
  CheckmarkCircle02Icon,
  CancelCircleIcon,
  Clock01Icon,
} from "@hugeicons/core-free-icons";
import LoadingState from "../../components/LoadingState";

const statusStyles: Record<string, string> = {
  PRESENT: "text-[#3F7A5B]",
  ABSENT: "text-[#B4483B]",
  LATE: "text-blue",
};
const statusIcons = {
  PRESENT: CheckmarkCircle02Icon,
  ABSENT: CancelCircleIcon,
  LATE: Clock01Icon,
};
const statuses = ["PRESENT", "ABSENT", "LATE"] as const;

type AssignedClass = { id: string; classSection: string };
type AttendanceStatus = (typeof statuses)[number];
type StudentRow = {
  id: string;
  name: string;
  admissionNumber: string;
  attendance: AttendanceStatus;
};

function statusLabel(status: AttendanceStatus) {
  return status.charAt(0) + status.slice(1).toLowerCase();
}

export default function StaffAttendancePage() {
  const [classes, setClasses] = useState<AssignedClass[]>([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetch("/api/dashboard/staff/classes")
      .then(async (response) => (response.ok ? response.json() : null))
      .then((data) => {
        const nextClasses = data?.classes ?? [];
        setClasses(nextClasses);
        setSelectedClassId(nextClasses[0]?.id ?? "");
      })
      .catch(() => setClasses([]));
  }, []);

  useEffect(() => {
    if (!selectedClassId) {
      Promise.resolve().then(() => {
        setStudents([]);
        setLoading(false);
      });
      return;
    }
    Promise.resolve().then(() => {
      setLoading(true);
      setStatus("");
    });
    fetch(
      `/api/dashboard/staff/attendance?classSectionId=${selectedClassId}&date=${date}`,
    )
      .then(async (response) => (response.ok ? response.json() : null))
      .then((data) => setStudents(data?.students ?? []))
      .catch(() => setStudents([]))
      .finally(() => setLoading(false));
  }, [selectedClassId, date]);

  const updateStatus = (studentId: string) => {
    setStudents((current) =>
      current.map((student) => {
        if (student.id !== studentId) return student;
        const currentIndex = statuses.indexOf(student.attendance);
        return {
          ...student,
          attendance: statuses[(currentIndex + 1) % statuses.length],
        };
      }),
    );
  };

  const saveAttendance = async () => {
    if (!selectedClassId) return;
    setSaving(true);
    setStatus("");
    try {
      const response = await fetch("/api/dashboard/staff/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          classSectionId: selectedClassId,
          date,
          records: students.map((student) => ({
            studentId: student.id,
            status: student.attendance,
          })),
        }),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error ?? "Unable to save attendance.");
      setStatus("Attendance saved successfully.");
    } catch (error) {
      setStatus(
        error instanceof Error ? error.message : "Unable to save attendance.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-foreground/60">
            Record attendance for your assigned class
          </p>
          <h2 className="mt-1 text-xl font-medium text-foreground">
            Attendance
          </h2>
        </div>
        <div className="flex flex-wrap gap-3">
          <select
            value={selectedClassId}
            onChange={(event) => setSelectedClassId(event.target.value)}
            className="rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm text-foreground"
          >
            {classes.map((item) => (
              <option key={item.id} value={item.id}>
                {item.classSection}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm text-foreground"
          />
        </div>
      </div>
      <div className="flex items-center gap-2 rounded-2xl border border-navy/10 bg-white p-4 text-sm text-foreground/70">
        <HugeiconsIcon
          icon={CalendarCheckIcon}
          size={19}
          className="text-blue"
        />
        Attendance is ready to be saved for {students.length} students.
      </div>
      <div className="overflow-x-auto rounded-2xl border border-navy/10 bg-white">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-navy/10 text-xs font-medium uppercase tracking-wide text-foreground/50">
              <th className="px-6 py-3.5">Student</th>
              <th className="px-6 py-3.5">Admission no.</th>
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
            ) : students.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="p-8 text-center text-sm text-foreground/60"
                >
                  No students found for this class.
                </td>
              </tr>
            ) : (
              students.map((student) => {
              const Icon = statusIcons[student.attendance];
              return (
                <tr key={student.id} className="text-sm">
                  <td className="px-6 py-4 font-medium text-foreground">
                    {student.name}
                  </td>
                  <td className="px-6 py-4 text-foreground/60">
                    {student.admissionNumber}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      type="button"
                      onClick={() => updateStatus(student.id)}
                      className={`flex items-center gap-2 font-medium ${statusStyles[student.attendance]}`}
                    >
                      <HugeiconsIcon icon={Icon} size={17} />
                      {statusLabel(student.attendance)}
                    </button>
                  </td>
                </tr>
              );
              })
            )}
          </tbody>
        </table>
      </div>
      {status && <p className="text-sm text-foreground/70">{status}</p>}
      <div className="flex justify-end">
        <button
          type="button"
          disabled={saving || students.length === 0}
          onClick={saveAttendance}
          className="rounded-full bg-blue px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {saving ? "Saving..." : "Save attendance"}
        </button>
      </div>
    </div>
  );
}
