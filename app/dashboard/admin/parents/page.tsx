"use client";

import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { LocationUser01Icon, Search01Icon } from "@hugeicons/core-free-icons";
import LoadingState from "../../components/LoadingState";

type Guardian = {
  _id: string;
  fullName: string;
  phone?: string;
  childCount?: number;
  user?: { email?: string; isActive?: boolean };
};

export default function ParentsPage() {
  const [parents, setParents] = useState<Guardian[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [pages, setPages] = useState(1);
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setLoading(true);
      setError("");
      fetch(
        `/api/admin/guardians?search=${encodeURIComponent(search)}&page=${page}&limit=${limit}`,
      )
        .then(async (response) => {
          const data = await response.json();
          if (!response.ok)
            throw new Error(data.error ?? "Unable to load parents.");
          return data;
        })
        .then((data) => {
          setParents(data.guardians ?? []);
          setTotal(data.total ?? 0);
          setPages(data.pages ?? 1);
        })
        .catch((parentsError) => {
          setParents([]);
          setTotal(0);
          setPages(1);
          setError(
            parentsError instanceof Error
              ? parentsError.message
              : "Unable to load parents.",
          );
        })
        .finally(() => setLoading(false));
    }, 250);
    return () => window.clearTimeout(timer);
  }, [limit, page, search]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-foreground/60">
            {total.toLocaleString()} parents and guardians
          </p>
          <h2 className="mt-1 text-xl font-medium text-foreground">Parents</h2>
        </div>
        <a
          href="/dashboard/admin/parents/new"
          className="flex items-center gap-2 rounded-full bg-blue px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          <HugeiconsIcon icon={LocationUser01Icon} size={18} />
          Add parent
        </a>
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
            placeholder="Search parents..."
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
              <th className="px-6 py-3.5">Parent</th>
              <th className="px-6 py-3.5">Phone</th>
              <th className="px-6 py-3.5">Email</th>
              <th className="px-6 py-3.5">Linked children</th>
              <th className="px-6 py-3.5">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {loading ? (
              <tr>
                <td
                  colSpan={5}
                  className="p-8 text-center text-sm text-foreground/60"
                >
                  <LoadingState
                    label="Loading parents..."
                    className="min-h-24"
                  />
                </td>
              </tr>
            ) : parents.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="p-8 text-center text-sm text-foreground/60"
                >
                  {error || "No parents found."}
                </td>
              </tr>
            ) : (
              parents.map((parent) => (
                <tr key={parent._id} className="text-sm">
                  <td className="px-6 py-4 font-medium text-foreground">
                    {parent.fullName}
                  </td>
                  <td className="px-6 py-4 text-foreground/70">
                    {parent.phone ?? "-"}
                  </td>
                  <td className="px-6 py-4 text-foreground/70">
                    {parent.user?.email ?? "-"}
                  </td>
                  <td className="px-6 py-4 text-foreground/70">
                    {parent.childCount ?? 0}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        parent.user?.isActive === false
                          ? "bg-[#B4483B]/10 text-[#B4483B]"
                          : "bg-[#3F7A5B]/10 text-[#3F7A5B]"
                      }`}
                    >
                      {parent.user?.isActive === false ? "Inactive" : "Active"}
                    </span>
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
