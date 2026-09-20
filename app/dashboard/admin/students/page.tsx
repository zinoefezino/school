"use client";

import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  Search01Icon,
  StudentsIcon,
} from "@hugeicons/core-free-icons";
import ActionMenu from "../components/ActionMenu";
import LoadingState from "../../components/LoadingState";

type Student = {
  _id: string;
  fullName: string;
  admissionNumber: string;
  classSection: string;
  guardianName: string;
  status: string;
  isActive?: boolean;
};
export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [pages, setPages] = useState(1);
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true);
      setError("");
      fetch(
        `/api/admin/students?search=${encodeURIComponent(search)}&page=${page}&limit=${limit}`,
      )
        .then(async (response) => {
          const data = await response.json();
          if (!response.ok)
            throw new Error(data.error ?? "Unable to load students.");
          return data;
        })
        .then((data) => {
          setStudents(data.students ?? []);
          setTotal(data.total ?? 0);
          setPages(data.pages ?? 1);
        })
        .catch((studentError) => {
          setStudents([]);
          setTotal(0);
          setPages(1);
          setError(
            studentError instanceof Error
              ? studentError.message
              : "Unable to load students.",
          );
        })
        .finally(() => setLoading(false));
    }, 250);
    return () => clearTimeout(timer);
  }, [search, page, limit]);
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
            href="/dashboard/admin/operations/promotions"
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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex w-full max-w-sm items-center gap-2 rounded-full border border-black/10 bg-white px-3.5 py-2.5">
          <HugeiconsIcon
            icon={Search01Icon}
            size={18}
            className="text-foreground/40"
          />
          <input
          value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            type="search"
            placeholder="Search students..."
            className="w-full text-base text-foreground outline-none placeholder:text-foreground/40"
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-foreground/60">
          Rows
          <select
            value={limit}
            onChange={(event) => {
              setLimit(Number(event.target.value));
              setPage(1);
            }}
            className="rounded-full border border-black/10 bg-white px-3 py-2 text-sm text-foreground"
          >
            {[25, 50, 100].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
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
                  <LoadingState
                    label="Loading students..."
                    className="min-h-24"
                  />
                </td>
              </tr>
            ) : students.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="p-8 text-center text-sm text-foreground/60"
                >
                  {error || "No students found."}
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
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        student.isActive === false
                          ? "bg-[#B4483B]/10 text-[#B4483B]"
                          : "bg-[#3F7A5B]/10 text-[#3F7A5B]"
                      }`}
                    >
                      {student.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <ActionMenu
                      label={student.fullName}
                      editHref={`/dashboard/admin/students/${student._id}/edit`}
                      deactivateHref={`/api/admin/students/${student._id}`}
                      isActive={student.isActive !== false}
                      onStatusChange={(nextStatus) =>
                        setStudents((current) =>
                          current.map((item) =>
                            item._id === student._id
                              ? {
                                  ...item,
                                  isActive: nextStatus,
                                  status: nextStatus ? "Active" : "Inactive",
                                }
                              : item,
                          ),
                        )
                      }
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-navy/10 bg-white px-5 py-3">
        <p className="text-sm text-foreground/60">
          Page {page} of {Math.max(pages, 1)} · {total.toLocaleString()} total
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={page <= 1 || loading}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            className="rounded-full border border-navy/15 px-4 py-2 text-sm font-medium text-navy hover:bg-blue-light disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>
          <button
            type="button"
            disabled={page >= pages || loading}
            onClick={() => setPage((current) => Math.min(pages, current + 1))}
            className="rounded-full border border-navy/15 px-4 py-2 text-sm font-medium text-navy hover:bg-blue-light disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
