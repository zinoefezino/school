"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import LoadingState from "../../components/LoadingState";

type Subject = { id: string; name: string };
type StaffClass = { id: string; classSection: string; subjects?: Subject[] };
type Term = { _id: string; name: string; session?: { name?: string } };
type Assignment = {
  _id: string;
  title: string;
  dueDate: string;
  subject?: { name?: string };
  classSection?: { name?: string; classLevel?: { name?: string } };
};

export default function StaffAssignmentsPage() {
  const [classes, setClasses] = useState<StaffClass[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [terms, setTerms] = useState<Term[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState("");

  const load = useCallback(async () => {
    const [classData, lookupData, assignmentData] = await Promise.all([
      fetch("/api/dashboard/staff/classes").then((response) => response.json()),
      fetch("/api/dashboard/staff/lookups").then((response) =>
        response.ok ? response.json() : { terms: [] },
      ),
      fetch("/api/dashboard/staff/assignments").then((response) =>
        response.ok ? response.json() : { assignments: [] },
      ),
    ]);
    const nextClasses = classData.classes ?? [];
    setClasses(nextClasses);
    setSubjects(classData.subjects ?? []);
    setTerms(lookupData.terms ?? []);
    setAssignments(assignmentData.assignments ?? []);
    setSelectedClassId((current) =>
      nextClasses.length > 0 &&
      !nextClasses.some((item: StaffClass) => item.id === current)
        ? nextClasses[0].id
        : current,
    );
  }, []);

  useEffect(() => {
    Promise.resolve()
      .then(load)
      .catch(() => undefined)
      .finally(() => setLoading(false));
  }, [load]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setSubmitting(true);
    setStatus("");
    try {
      const response = await fetch("/api/dashboard/staff/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(formData.entries())),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error ?? "Unable to create assignment.");
      form.reset();
      setSelectedClassId(classes[0]?.id ?? "");
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
  const selectedClass = classes.find((item) => item.id === selectedClassId);
  const availableSubjects =
    selectedClass?.subjects && selectedClass.subjects.length > 0
      ? selectedClass.subjects
      : subjects;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,420px)_1fr]">
      <form
        onSubmit={submit}
        className="rounded-2xl border border-navy/10 bg-white p-6"
      >
        <h2 className="text-lg font-medium text-foreground">
          Publish assignment
        </h2>
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
          <select
            required
            name="classSectionId"
            value={selectedClassId}
            onChange={(event) => setSelectedClassId(event.target.value)}
            className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm"
          >
            <option value="">Class</option>
            {classes.map((item) => (
              <option key={item.id} value={item.id}>
                {item.classSection}
              </option>
            ))}
          </select>
          <select
            required
            name="subjectId"
            className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm"
          >
            <option value="">Subject</option>
            {availableSubjects.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
          <select
            required
            name="termId"
            className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm"
          >
            <option value="">Term</option>
            {terms.map((term) => (
              <option key={term._id} value={term._id}>
                {term.name}
                {term.session?.name ? ` · ${term.session.name}` : ""}
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
          {status && <p className="mt-4 text-sm text-foreground/70">{status}</p>}
        {selectedClassId && availableSubjects.length === 0 && (
          <p className="mt-4 rounded-xl bg-blue-light px-4 py-3 text-sm text-foreground/70">
            You are not assigned to teach a subject in this class yet.
          </p>
        )}
        <button
          disabled={submitting || availableSubjects.length === 0}
          className="mt-5 rounded-full bg-blue px-5 py-2.5 text-sm font-medium text-white disabled:opacity-40"
        >
          {submitting ? "Publishing..." : "Publish assignment"}
        </button>
      </form>
      <section className="rounded-2xl border border-navy/10 bg-white p-6">
        <h2 className="text-lg font-medium text-foreground">
          Published assignments
        </h2>
        <div className="mt-4 divide-y divide-black/5">
          {assignments.length === 0 ? (
            <p className="py-8 text-sm text-foreground/60">
              No assignments published yet.
            </p>
          ) : (
            assignments.map((assignment) => (
              <div key={assignment._id} className="py-4">
                <p className="font-medium text-foreground">
                  {assignment.title}
                </p>
                <p className="mt-1 text-sm text-foreground/60">
                  {assignment.subject?.name ?? "Subject"} · Due{" "}
                  {new Date(assignment.dueDate).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
