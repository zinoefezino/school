"use client";

import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  MoreHorizontalIcon,
  Search01Icon,
  StudentsIcon,
} from "@hugeicons/core-free-icons";

type Student = {
  _id: string;
  fullName: string;
  admissionNumber: string;
  classSection: string;
  guardianName: string;
  status: string;
};
export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true);
      fetch(`/api/admin/students?search=${encodeURIComponent(search)}`)
        .then((response) => response.json())
        .then((data) => {
          setStudents(data.students ?? []);
          setTotal(data.total ?? 0);
        })
        .finally(() => setLoading(false));
    }, 250);
    return () => clearTimeout(timer);
  }, [search]);
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-foreground/60">
            {total.toLocaleString()} enrolled students
          </p>
          <h2 className="mt-1 text-xl font-medium text-foreground">Students</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href="/dashboard/admin/students/promote"
            className="rounded-full border border-navy/15 px-5 py-2.5 text-sm font-medium text-navy hover:bg-blue-light"
          >
            Promote student
          </a>
          <a
            href="/dashboard/admin/students/new"
            className="flex items-center gap-2 rounded-full bg-blue px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            <HugeiconsIcon icon={Add01Icon} size={18} />
            Add student
          </a>
        </div>
      </div>
      <div className="flex w-full max-w-sm items-center gap-2 rounded-full border border-black/10 bg-white px-3.5 py-2.5">
        <HugeiconsIcon
          icon={Search01Icon}
          size={18}
          className="text-foreground/40"
        />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          type="search"
          placeholder="Search students..."
          className="w-full text-base text-foreground outline-none placeholder:text-foreground/40"
        />
      </div>
      <div className="overflow-x-auto rounded-2xl border border-navy/10 bg-white">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-navy/10 text-xs font-medium uppercase tracking-wide text-foreground/50">
              <th className="px-6 py-3.5">Student</th>
              <th className="px-6 py-3.5">Admission no.</th>
              <th className="px-6 py-3.5">Class</th>
              <th className="px-6 py-3.5">Guardian</th>
              <th className="px-6 py-3.5">Status</th>
              <th />
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {loading ? (
              <tr>
                <td
                  colSpan={6}
                  className="p-8 text-center text-sm text-foreground/60"
                >
                  Loading students...
                </td>
              </tr>
            ) : students.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="p-8 text-center text-sm text-foreground/60"
                >
                  No students found.
                </td>
              </tr>
            ) : (
              students.map((student) => (
                <tr key={student._id} className="text-sm">
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-3 font-medium text-foreground">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-light text-navy">
                        <HugeiconsIcon icon={StudentsIcon} size={16} />
                      </span>
                      {student.fullName}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-foreground/70">
                    {student.admissionNumber}
                  </td>
                  <td className="px-6 py-4 text-foreground/70">
                    {student.classSection}
                  </td>
                  <td className="px-6 py-4 text-foreground/70">
                    {student.guardianName}
                  </td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-[#3F7A5B]/10 px-2.5 py-1 text-xs font-medium text-[#3F7A5B]">
                      {student.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      aria-label={`More options for ${student.fullName}`}
                      className="text-foreground/40"
                    >
                      <HugeiconsIcon icon={MoreHorizontalIcon} size={18} />
                    </button>
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
