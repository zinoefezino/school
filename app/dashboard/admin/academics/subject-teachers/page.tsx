"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import LoadingState from "../../../components/LoadingState";
import StatusMessage from "../../../components/StatusMessage";

type Subject = { _id: string; name: string; code?: string };
type ClassSection = {
  _id: string;
  name?: string;
  classLevel?: { name?: string };
  classTeacher?: { fullName?: string };
};
type Staff = { _id: string; fullName: string };
type TeachingAssignment = {
  _id: string;
  subject?: { name?: string; code?: string };
  teacher?: { fullName?: string };
  classSection?: ClassSection;
};

function classNameFor(item?: ClassSection) {
  return [item?.classLevel?.name, item?.name].filter(Boolean).join(" ");
}

export default function AdminSubjectTeachersPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [classes, setClasses] = useState<ClassSection[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [teachingAssignments, setTeachingAssignments] = useState<
    TeachingAssignment[]
  >([]);
  const [loadingLookups, setLoadingLookups] = useState(true);
  const [loadingAssignments, setLoadingAssignments] = useState(true);
  const [saving, setSaving] = useState("");
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [teachingForm, setTeachingForm] = useState({
    classSectionId: "",
    subjectId: "",
    teacherId: "",
  });

  const loadLookups = async () => {
    const [subjectData, lookupData] = await Promise.all([
      fetch("/api/admin/subjects").then((response) =>
        response.ok ? response.json() : { subjects: [] },
      ),
      fetch("/api/admin/lookups").then((response) =>
        response.ok ? response.json() : { classes: [], staff: [] },
      ),
    ]);
    setSubjects(subjectData.subjects ?? []);
    setClasses(lookupData.classes ?? []);
    setStaff(lookupData.staff ?? []);
  };

  const loadAssignments = useCallback(async (nextPage: number) => {
    setLoadingAssignments(true);
    try {
      const params = new URLSearchParams({
        page: String(nextPage),
        limit: String(limit),
      });
      if (search.trim()) params.set("search", search.trim());
      const response = await fetch(`/api/admin/teaching-assignments?${params}`);
      const data = response.ok
        ? await response.json()
        : { teachingAssignments: [], total: 0, pages: 1 };
      setTeachingAssignments(data.teachingAssignments ?? []);
      setTotal(data.total ?? 0);
      setPages(data.pages ?? 1);
    } finally {
      setLoadingAssignments(false);
    }
  }, [limit, search]);

  useEffect(() => {
    Promise.resolve()
      .then(loadLookups)
      .catch(() => undefined)
      .finally(() => setLoadingLookups(false));
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadAssignments(page);
    }, 250);
    return () => window.clearTimeout(timer);
  }, [loadAssignments, page]);

  const submitTeachingAssignment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving("teachingAssignment");
    setStatus("");
    try {
      if (
        !teachingForm.classSectionId ||
        !teachingForm.subjectId ||
        !teachingForm.teacherId
      )
        throw new Error("Select a class, subject, and subject teacher.");
      const response = await fetch("/api/admin/teaching-assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(teachingForm),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error ?? "Unable to assign subject teacher.");
      setTeachingForm({ classSectionId: "", subjectId: "", teacherId: "" });
      setStatus("Subject teacher assigned.");
      setPage(1);
      await loadAssignments(1);
    } catch (error) {
      setStatus(
        error instanceof Error
          ? error.message
          : "Unable to assign subject teacher.",
      );
    } finally {
      setSaving("");
    }
  };

  const removeTeachingAssignment = async (id: string) => {
    setSaving(id);
    setStatus("");
    try {
      const response = await fetch(`/api/admin/teaching-assignments/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error ?? "Unable to remove subject teacher.");
      setStatus("Subject teacher removed.");
      await loadAssignments(page);
    } catch (error) {
      setStatus(
        error instanceof Error
          ? error.message
          : "Unable to remove subject teacher.",
      );
    } finally {
      setSaving("");
    }
  };

  const isLoading = loadingLookups && loadingAssignments;

  if (isLoading) return <LoadingState label="Loading subject teachers..." />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          Subject teachers
        </h1>
        <p className="mt-1 text-sm text-foreground/60">
          Assign teachers to the exact subject they teach in each class. This is
          separate from the class teacher, who remains the head of the class.
        </p>
      </div>

      {status && <StatusMessage>{status}</StatusMessage>}

      <section className="rounded-2xl border border-navy/10 bg-white p-6">
        <h2 className="text-lg font-medium text-foreground">
          Assign subject teacher
        </h2>
        <form
          noValidate
          onSubmit={submitTeachingAssignment}
          className="mt-5 grid gap-3 lg:grid-cols-[1fr_1fr_1fr_auto]"
        >
          <select
            name="classSectionId"
            value={teachingForm.classSectionId}
            onChange={(event) =>
              setTeachingForm((current) => ({
                ...current,
                classSectionId: event.target.value,
              }))
            }
            className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-blue"
          >
            <option value="">
              {classes.length ? "Select class" : "Add a class first"}
            </option>
            {classes.map((item) => (
              <option key={item._id} value={item._id}>
                {classNameFor(item) || "Class"}
              </option>
            ))}
          </select>
          <select
            name="subjectId"
            value={teachingForm.subjectId}
            onChange={(event) =>
              setTeachingForm((current) => ({
                ...current,
                subjectId: event.target.value,
              }))
            }
            className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-blue"
          >
            <option value="">
              {subjects.length ? "Select subject" : "Add a subject first"}
            </option>
            {subjects.map((subject) => (
              <option key={subject._id} value={subject._id}>
                {subject.name}
                {subject.code ? ` (${subject.code})` : ""}
              </option>
            ))}
          </select>
          <select
            name="teacherId"
            value={teachingForm.teacherId}
            onChange={(event) =>
              setTeachingForm((current) => ({
                ...current,
                teacherId: event.target.value,
              }))
            }
            className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-blue"
          >
            <option value="">
              {staff.length ? "Select subject teacher" : "Add staff first"}
            </option>
            {staff.map((teacher) => (
              <option key={teacher._id} value={teacher._id}>
                {teacher.fullName}
              </option>
            ))}
          </select>
          <button
            disabled={
              saving === "teachingAssignment" ||
              !teachingForm.classSectionId ||
              !teachingForm.subjectId ||
              !teachingForm.teacherId
            }
            className="rounded-full bg-blue px-5 py-2.5 text-sm font-medium text-white disabled:opacity-40"
          >
            {saving === "teachingAssignment" ? "Saving..." : "Assign"}
          </button>
        </form>
      </section>

      <section className="rounded-2xl border border-navy/10 bg-white p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-medium text-foreground">
              Assigned teachers
            </h2>
            <p className="mt-1 text-sm text-foreground/60">
              {total.toLocaleString()} assignment{total === 1 ? "" : "s"} found
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Search class, subject, or teacher"
              className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-blue sm:w-72"
            />
            <select
              value={limit}
              onChange={(event) => {
                setLimit(Number(event.target.value));
                setPage(1);
              }}
              className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-blue"
            >
              {[10, 25, 50, 100].map((value) => (
                <option key={value} value={value}>
                  {value} rows
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-navy/10 text-xs font-medium uppercase tracking-wide text-foreground/50">
                <th className="px-4 py-3">Class</th>
                <th className="px-4 py-3">Class teacher</th>
                <th className="px-4 py-3">Subject</th>
                <th className="px-4 py-3">Subject teacher</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {loadingAssignments ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-sm text-foreground/60"
                  >
                    Loading assignments...
                  </td>
                </tr>
              ) : teachingAssignments.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-sm text-foreground/60"
                  >
                    No subject teachers found.
                  </td>
                </tr>
              ) : (
                teachingAssignments.map((assignment) => (
                  <tr key={assignment._id} className="text-sm">
                    <td className="px-4 py-4 font-medium text-foreground">
                      {classNameFor(assignment.classSection) || "Class"}
                    </td>
                    <td className="px-4 py-4 text-foreground/60">
                      {assignment.classSection?.classTeacher?.fullName ??
                        "Unassigned"}
                    </td>
                    <td className="px-4 py-4 text-foreground/70">
                      {assignment.subject?.name ?? "Subject"}
                    </td>
                    <td className="px-4 py-4 text-foreground/70">
                      {assignment.teacher?.fullName ?? "Teacher"}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <button
                        type="button"
                        disabled={saving === assignment._id}
                        onClick={() => removeTeachingAssignment(assignment._id)}
                        className="rounded-full border border-[#B4483B]/20 px-4 py-2 text-xs font-medium text-[#B4483B] disabled:opacity-40"
                      >
                        {saving === assignment._id ? "Removing..." : "Remove"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-5 flex flex-col gap-3 border-t border-black/5 pt-4 text-sm text-foreground/60 sm:flex-row sm:items-center sm:justify-between">
          <span>
            Page {page} of {pages}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={page <= 1 || loadingAssignments}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              className="rounded-full border border-black/10 px-4 py-2 font-medium text-foreground disabled:opacity-40"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={page >= pages || loadingAssignments}
              onClick={() =>
                setPage((current) => Math.min(pages, current + 1))
              }
              className="rounded-full border border-black/10 px-4 py-2 font-medium text-foreground disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
