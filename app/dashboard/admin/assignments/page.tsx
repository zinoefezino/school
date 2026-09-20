"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import LoadingState from "../../components/LoadingState";
import StatusMessage from "../../components/StatusMessage";

type ClassSection = {
  _id: string;
  name?: string;
  classLevel?: { name?: string };
};
type Staff = { _id: string; fullName: string };
type Subject = { _id: string; name: string };
type Term = { _id: string; name: string; session?: { name?: string } };
type Assignment = {
  _id: string;
  title: string;
  dueDate: string;
  subject?: { name?: string };
  teacher?: { fullName?: string };
  classSection?: { name?: string; classLevel?: { name?: string } };
};

function classNameFor(item?: ClassSection | Assignment["classSection"]) {
  return [item?.classLevel?.name, item?.name].filter(Boolean).join(" ");
}

const pageSize = 8;
const optionLimit = 15;

export default function AdminAssignmentsPage() {
  const [classes, setClasses] = useState<ClassSection[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [terms, setTerms] = useState<Term[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState("");
  const [classSearch, setClassSearch] = useState("");
  const [listSearch, setListSearch] = useState("");
  const [page, setPage] = useState(1);

  const load = async () => {
    const [lookupData, subjectData, assignmentData] = await Promise.all([
      fetch("/api/admin/lookups").then((response) =>
        response.ok ? response.json() : { classes: [], terms: [], staff: [] },
      ),
      fetch("/api/admin/subjects").then((response) =>
        response.ok ? response.json() : { subjects: [] },
      ),
      fetch("/api/admin/assignments").then((response) =>
        response.ok ? response.json() : { assignments: [] },
      ),
    ]);
    setClasses(lookupData.classes ?? []);
    setStaff(lookupData.staff ?? []);
    setTerms(lookupData.terms ?? []);
    setSubjects(subjectData.subjects ?? []);
    setAssignments(assignmentData.assignments ?? []);
  };

  useEffect(() => {
    Promise.resolve()
      .then(load)
      .catch(() => undefined)
      .finally(() => setLoading(false));
  }, []);

  const visibleClasses = useMemo(() => {
    const search = classSearch.trim().toLowerCase();
    const matches = search
      ? classes.filter((item) =>
          classNameFor(item).toLowerCase().includes(search),
        )
      : classes;
    return matches.slice(0, optionLimit);
  }, [classSearch, classes]);

  const filteredAssignments = useMemo(() => {
    const search = listSearch.trim().toLowerCase();
    if (!search) return assignments;
    return assignments.filter((assignment) =>
      [
        assignment.title,
        assignment.subject?.name,
        classNameFor(assignment.classSection),
        assignment.teacher?.fullName,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(search),
    );
  }, [assignments, listSearch]);
  const pages = Math.max(1, Math.ceil(filteredAssignments.length / pageSize));
  const visibleAssignments = filteredAssignments.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setSubmitting(true);
    setStatus("");
    try {
      const response = await fetch("/api/admin/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(formData.entries())),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error ?? "Unable to create assignment.");
      form.reset();
      setStatus("Assignment published.");
      await load();
    } catch (error) {
      setStatus(
        error instanceof Error ? error.message : "Unable to create assignment.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingState label="Loading assignments..." />;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,420px)_1fr]">
      <form
        onSubmit={submit}
        className="rounded-2xl border border-navy/10 bg-white p-6"
      >
        <h1 className="text-lg font-medium text-foreground">
          Publish assignment
        </h1>
        <p className="mt-1 text-sm text-foreground/60">
          Assign work to a class and optionally attach a teacher.
        </p>
        <div className="mt-5 flex flex-col gap-4">
          <input
            required
            name="title"
            placeholder="Assignment title"
            className="rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-blue"
          />
          <textarea
            name="description"
            rows={4}
            placeholder="Instructions"
            className="rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-blue"
          />
          <input
            value={classSearch}
            onChange={(event) => setClassSearch(event.target.value)}
            placeholder="Find class"
            className="rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-blue"
          />
          <select
            required
            name="classSectionId"
            className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-blue"
          >
            <option value="">Class</option>
            {visibleClasses.map((item) => (
              <option key={item._id} value={item._id}>
                {classNameFor(item) || "Class"}
              </option>
            ))}
          </select>
          <select
            required
            name="subjectId"
            className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-blue"
          >
            <option value="">Subject</option>
            {subjects.map((subject) => (
              <option key={subject._id} value={subject._id}>
                {subject.name}
              </option>
            ))}
          </select>
          <select
            required
            name="termId"
            className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-blue"
          >
            <option value="">Term</option>
            {terms.map((term) => (
              <option key={term._id} value={term._id}>
                {term.name}
                {term.session?.name ? ` · ${term.session.name}` : ""}
              </option>
            ))}
          </select>
          <select
            name="teacherId"
            className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-blue"
          >
            <option value="">Teacher optional</option>
            {staff.map((teacher) => (
              <option key={teacher._id} value={teacher._id}>
                {teacher.fullName}
              </option>
            ))}
          </select>
          <input
            required
            type="date"
            name="dueDate"
            className="rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-blue"
          />
        </div>
        {status && <StatusMessage className="mt-4">{status}</StatusMessage>}
        <button
          disabled={submitting}
          className="mt-5 rounded-full bg-blue px-5 py-2.5 text-sm font-medium text-white disabled:opacity-40"
        >
          {submitting ? "Publishing..." : "Publish assignment"}
        </button>
      </form>

      <section className="rounded-2xl border border-navy/10 bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-medium text-foreground">
              Published assignments
            </h2>
            <p className="mt-1 text-sm text-foreground/60">
              {filteredAssignments.length.toLocaleString()} assignments shown
            </p>
          </div>
        </div>
        <input
          value={listSearch}
          onChange={(event) => {
            setListSearch(event.target.value);
            setPage(1);
          }}
          placeholder="Search title, class, subject, or teacher"
          className="mt-5 w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-blue"
        />
        <div className="mt-4 divide-y divide-black/5">
          {filteredAssignments.length === 0 ? (
            <p className="py-8 text-sm text-foreground/60">
              No assignments match your search.
            </p>
          ) : (
            visibleAssignments.map((assignment) => (
              <div key={assignment._id} className="py-4">
                <p className="font-medium text-foreground">
                  {assignment.title}
                </p>
                <p className="mt-1 text-sm text-foreground/60">
                  {assignment.subject?.name ?? "Subject"} ·{" "}
                  {classNameFor(assignment.classSection) || "Class"} · Due{" "}
                  {new Date(assignment.dueDate).toLocaleDateString()}
                </p>
                {assignment.teacher?.fullName && (
                  <p className="mt-1 text-xs text-foreground/50">
                    Teacher: {assignment.teacher.fullName}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
        {filteredAssignments.length > pageSize && (
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-black/5 pt-5">
            <p className="text-sm text-foreground/60">
              Page {page} of {pages}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={page === 1}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
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
      </section>
    </div>
  );
}
