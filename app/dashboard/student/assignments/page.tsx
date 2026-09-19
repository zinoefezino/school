"use client";

import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Calendar03Icon,
  CheckmarkCircle02Icon,
  TaskDaily01Icon,
} from "@hugeicons/core-free-icons";
import LoadingState from "../../components/LoadingState";

type Assignment = {
  _id: string;
  title: string;
  dueDate: string;
  studentStatus: "Pending" | "Submitted";
  subject?: { name?: string };
};

const statusStyles: Record<Assignment["studentStatus"], string> = {
  Pending: "bg-blue-light text-blue",
  Submitted: "bg-[#3F7A5B]/10 text-[#3F7A5B]",
};

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/student/assignments")
      .then(async (response) => (response.ok ? response.json() : null))
      .then((data) => setAssignments(data?.assignments ?? []))
      .catch(() => setAssignments([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm text-foreground/60">
          Keep track of work from your teachers
        </p>
        <h2 className="mt-1 text-xl font-medium text-foreground">
          Assignments
        </h2>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-navy/10 bg-white">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-navy/10 text-xs font-medium uppercase tracking-wide text-foreground/50">
              <th className="px-6 py-3.5">Assignment</th>
              <th className="px-6 py-3.5">Subject</th>
              <th className="px-6 py-3.5">Due date</th>
              <th className="px-6 py-3.5">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {loading ? (
              <tr>
                <td colSpan={4}>
                  <LoadingState
                    label="Loading assignments..."
                    className="min-h-32"
                  />
                </td>
              </tr>
            ) : assignments.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="p-8 text-center text-sm text-foreground/60"
                >
                  No assignments have been published yet.
                </td>
              </tr>
            ) : (
              assignments.map((item) => (
                <tr key={item._id} className="text-sm">
                  <td className="px-6 py-4 font-medium text-foreground">
                    <span className="flex items-center gap-2">
                      <HugeiconsIcon
                        icon={TaskDaily01Icon}
                        size={17}
                        className="text-blue"
                      />
                      {item.title}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-foreground/70">
                    {item.subject?.name ?? "Subject"}
                  </td>
                  <td className="px-6 py-4 text-foreground/70">
                    <span className="flex items-center gap-2">
                      <HugeiconsIcon icon={Calendar03Icon} size={15} />
                      {new Date(item.dueDate).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[item.studentStatus]}`}
                    >
                      {item.studentStatus === "Submitted" && (
                        <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} />
                      )}
                      {item.studentStatus}
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
