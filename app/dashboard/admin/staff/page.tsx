"use client";

import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  UserAdd01Icon,
  Search01Icon,
  MoreHorizontalIcon,
} from "@hugeicons/core-free-icons";

type Staff = {
  _id: string;
  fullName: string;
  department?: string;
  phone?: string;
  subjects: { name: string }[];
  user?: { email?: string };
};
export default function StaffPage() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true);
      fetch(`/api/admin/staff?search=${encodeURIComponent(search)}`)
        .then((response) => response.json())
        .then((data) => {
          setStaff(data.staff ?? []);
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
            {total.toLocaleString()} staff members
          </p>
          <h2 className="mt-1 text-xl font-medium text-foreground">Staff</h2>
        </div>
        <a
          href="/dashboard/admin/staff/new"
          className="flex items-center gap-2 rounded-full bg-blue px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          <HugeiconsIcon icon={UserAdd01Icon} size={18} />
          Add staff
        </a>
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
          placeholder="Search staff..."
          className="w-full text-base text-foreground outline-none placeholder:text-foreground/40"
        />
      </div>
      <div className="overflow-x-auto rounded-2xl border border-navy/10 bg-white">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-navy/10 text-xs font-medium uppercase tracking-wide text-foreground/50">
              <th className="px-6 py-3.5">Staff</th>
              <th className="px-6 py-3.5">Department</th>
              <th className="px-6 py-3.5">Subjects</th>
              <th className="px-6 py-3.5">Email</th>
              <th className="px-6 py-3.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {loading ? (
              <tr>
                <td
                  colSpan={5}
                  className="p-8 text-center text-sm text-foreground/60"
                >
                  Loading staff...
                </td>
              </tr>
            ) : staff.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="p-8 text-center text-sm text-foreground/60"
                >
                  No staff found.
                </td>
              </tr>
            ) : (
              staff.map((member) => (
                <tr key={member._id} className="text-sm">
                  <td className="px-6 py-4 font-medium text-foreground">
                    {member.fullName}
                  </td>
                  <td className="px-6 py-4 text-foreground/70">
                    {member.department ?? "-"}
                  </td>
                  <td className="px-6 py-4 text-foreground/70">
                    {member.subjects
                      .map((subject) => subject.name)
                      .join(", ") || "-"}
                  </td>
                  <td className="px-6 py-4 text-foreground/70">
                    {member.user?.email ?? "-"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      aria-label={`More options for ${member.fullName}`}
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
