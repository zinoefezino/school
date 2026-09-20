"use client";

import { useEffect, useMemo, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon, StudentsIcon } from "@hugeicons/core-free-icons";
import LoadingState from "../../components/LoadingState";
import StatusMessage from "../../components/StatusMessage";

type ClassRow = {
  _id: string;
  name: string;
  classLevel?: { name?: string };
  classTeacher?: { fullName?: string };
  studentCount: number;
};
const pageSize = 12;

export default function ClassesPage() {
  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("");
  const [page, setPage] = useState(1);
  useEffect(() => {
    fetch("/api/admin/classes")
      .then((response) => response.json())
      .then((data) => setClasses(data.classes ?? []))
      .finally(() => setLoading(false));
  }, []);
  const levels = useMemo(
    () =>
      Array.from(
        new Set(classes.map((item) => item.classLevel?.name).filter(Boolean)),
      ) as string[],
    [classes],
  );
  const filteredClasses = useMemo(() => {
    const term = search.trim().toLowerCase();
    return classes.filter((cls) => {
      const text = [
        cls.classLevel?.name,
        cls.name,
        cls.classTeacher?.fullName,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const matchesSearch = term ? text.includes(term) : true;
      const matchesLevel = level ? cls.classLevel?.name === level : true;
      return matchesSearch && matchesLevel;
    });
  }, [classes, level, search]);
  const pages = Math.max(1, Math.ceil(filteredClasses.length / pageSize));
  const visibleClasses = filteredClasses.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-foreground/60">
          {classes.length} classes across all levels
        </p>
        <a
          href="/dashboard/admin/classes/new"
          className="flex items-center gap-2 rounded-full bg-blue px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          <HugeiconsIcon icon={Add01Icon} size={18} />
          Add class
        </a>
      </div>
      {message && <StatusMessage>{message}</StatusMessage>}
      <div className="grid gap-3 rounded-2xl border border-navy/10 bg-white p-4 md:grid-cols-[1fr_220px]">
        <input
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
          placeholder="Search class, level, or class teacher"
          className="rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-blue"
        />
        <select
          value={level}
          onChange={(event) => {
            setLevel(event.target.value);
            setPage(1);
          }}
          className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-blue"
        >
          <option value="">All levels</option>
          {levels.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </div>
      {loading ? (
        <LoadingState label="Loading classes..." />
      ) : filteredClasses.length === 0 ? (
        <p className="rounded-2xl bg-white p-6 text-sm text-foreground/60">
          No classes match your search.
        </p>
      ) : (
        <>
          <p className="text-sm text-foreground/60">
            Showing {visibleClasses.length} of {filteredClasses.length} matching
            classes
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visibleClasses.map((cls) => (
              <div
                key={cls._id}
                className="rounded-2xl border border-navy/10 bg-white p-5"
              >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-medium text-foreground">
                    {cls.classLevel?.name} {cls.name}
                  </h3>
                  <p className="mt-1 text-xs text-foreground/50">
                    Class teacher
                  </p>
                  <p className="mt-0.5 text-sm text-foreground/60">
                    {cls.classTeacher?.fullName ?? "Unassigned"}
                  </p>
                </div>
                <div className="flex flex-wrap justify-end gap-2">
                  <a
                    href={`/dashboard/admin/classes/${cls._id}/edit`}
                    className="rounded-full border border-navy/15 px-3 py-1.5 text-xs font-medium text-navy hover:bg-blue-light"
                  >
                    Edit
                  </a>
                  <button
                    type="button"
                    onClick={async () => {
                      setMessage("");
                      if (
                        !window.confirm(
                          `Delete ${cls.classLevel?.name ?? ""} ${cls.name}? This only works when the class has no active students.`,
                        )
                      )
                        return;
                      const response = await fetch(
                        `/api/admin/classes/${cls._id}`,
                        {
                          method: "PATCH",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ action: "delete" }),
                        },
                      );
                      const data = await response.json();
                      if (response.ok) {
                        setClasses((current) =>
                          current.filter((item) => item._id !== cls._id),
                        );
                        setMessage("Class deleted.");
                      } else {
                        setMessage(data.error ?? "Unable to delete class.");
                      }
                    }}
                    className="rounded-full border border-[#B4483B]/30 px-3 py-1.5 text-xs font-medium text-[#B4483B] hover:bg-[#B4483B]/5"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="mt-5 flex items-center gap-2 text-sm text-foreground/70">
                <HugeiconsIcon
                  icon={StudentsIcon}
                  size={16}
                  className="text-blue"
                />
                {cls.studentCount} students
              </div>
              </div>
            ))}
          </div>
          {filteredClasses.length > pageSize && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-navy/10 bg-white px-5 py-3">
              <p className="text-sm text-foreground/60">
                Page {page} of {pages}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={page === 1}
                  onClick={() =>
                    setPage((current) => Math.max(1, current - 1))
                  }
                  className="rounded-full border border-navy/15 px-4 py-2 text-sm font-medium text-navy disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>
                <button
                  type="button"
                  disabled={page === pages}
                  onClick={() =>
                    setPage((current) => Math.min(pages, current + 1))
                  }
                  className="rounded-full border border-navy/15 px-4 py-2 text-sm font-medium text-navy disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
