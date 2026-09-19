"use client";

import { FormEvent, useEffect, useState } from "react";
import LoadingState from "../../components/LoadingState";

type AcademicSession = { _id: string; name: string };
type Term = {
  _id: string;
  name: string;
  resultsPublished?: boolean;
  session?: { name?: string };
};
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
  subject?: { name?: string };
  teacher?: { fullName?: string };
  classSection?: ClassSection;
};

function classNameFor(item?: ClassSection) {
  return [item?.classLevel?.name, item?.name].filter(Boolean).join(" ");
}

export default function AdminAcademicsPage() {
  const [sessions, setSessions] = useState<AcademicSession[]>([]);
  const [terms, setTerms] = useState<Term[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [classes, setClasses] = useState<ClassSection[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [teachingAssignments, setTeachingAssignments] = useState<
    TeachingAssignment[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState("");
  const [status, setStatus] = useState("");

  const load = async () => {
    const [sessionData, termData, subjectData, lookupData, teachingData] =
      await Promise.all([
      fetch("/api/admin/sessions").then((response) =>
        response.ok ? response.json() : { sessions: [] },
      ),
      fetch("/api/admin/terms").then((response) =>
        response.ok ? response.json() : { terms: [] },
      ),
      fetch("/api/admin/subjects").then((response) =>
        response.ok ? response.json() : { subjects: [] },
      ),
      fetch("/api/admin/lookups").then((response) =>
        response.ok ? response.json() : { classes: [], staff: [] },
      ),
      fetch("/api/admin/teaching-assignments").then((response) =>
        response.ok ? response.json() : { teachingAssignments: [] },
      ),
    ]);
    setSessions(sessionData.sessions ?? []);
    setTerms(termData.terms ?? []);
    setSubjects(subjectData.subjects ?? []);
    setClasses(lookupData.classes ?? []);
    setStaff(lookupData.staff ?? []);
    setTeachingAssignments(teachingData.teachingAssignments ?? []);
  };

  useEffect(() => {
    Promise.resolve()
      .then(load)
      .catch(() => undefined)
      .finally(() => setLoading(false));
  }, []);

  const submit =
    (
      kind: "session" | "term" | "subject" | "teachingAssignment",
      endpoint: string,
    ) =>
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const form = event.currentTarget;
      const formData = new FormData(form);
      setSaving(kind);
      setStatus("");
      try {
        const payload = Object.fromEntries(formData.entries());
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...payload,
            resultsPublished: payload.resultsPublished === "on",
          }),
        });
        const result = await response.json();
        if (!response.ok)
          throw new Error(result.error ?? "Unable to save academic record.");
        form.reset();
        setStatus("Academic record saved.");
        await load();
      } catch (error) {
        setStatus(
          error instanceof Error
            ? error.message
            : "Unable to save academic record.",
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
      await load();
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

  if (loading) return <LoadingState label="Loading academic setup..." />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          Academic setup
        </h1>
        <p className="mt-1 text-sm text-foreground/60">
          Manage sessions, terms, and subjects used by assignments, timetable,
          attendance, and results.
        </p>
      </div>

      {status && (
        <p className="rounded-2xl border border-blue/20 bg-blue/5 px-4 py-3 text-sm text-foreground/70">
          {status}
        </p>
      )}

      <div className="grid gap-6 xl:grid-cols-3">
        <section className="rounded-2xl border border-navy/10 bg-white p-6">
          <h2 className="text-lg font-medium text-foreground">
            Academic sessions
          </h2>
          <form
            onSubmit={submit("session", "/api/admin/sessions")}
            className="mt-5 flex gap-3"
          >
            <input
              required
              name="name"
              placeholder="2026/2027"
              className="min-w-0 flex-1 rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-blue"
            />
            <button
              disabled={saving === "session"}
              className="rounded-full bg-blue px-5 py-2.5 text-sm font-medium text-white disabled:opacity-40"
            >
              {saving === "session" ? "Saving..." : "Add"}
            </button>
          </form>
          <div className="mt-5 divide-y divide-black/5">
            {sessions.length === 0 ? (
              <p className="py-6 text-sm text-foreground/60">
                No sessions yet.
              </p>
            ) : (
              sessions.map((session) => (
                <p key={session._id} className="py-3 text-sm text-foreground">
                  {session.name}
                </p>
              ))
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-navy/10 bg-white p-6">
          <h2 className="text-lg font-medium text-foreground">Terms</h2>
          <form
            onSubmit={submit("term", "/api/admin/terms")}
            className="mt-5 space-y-3"
          >
            <input
              required
              name="name"
              placeholder="First Term"
              className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-blue"
            />
            <select
              required
              name="sessionId"
              className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-blue"
            >
              <option value="">Academic session</option>
              {sessions.map((session) => (
                <option key={session._id} value={session._id}>
                  {session.name}
                </option>
              ))}
            </select>
            <label className="flex items-center gap-2 text-sm text-foreground/70">
              <input name="resultsPublished" type="checkbox" />
              Results published
            </label>
            <button
              disabled={saving === "term"}
              className="rounded-full bg-blue px-5 py-2.5 text-sm font-medium text-white disabled:opacity-40"
            >
              {saving === "term" ? "Saving..." : "Add term"}
            </button>
          </form>
          <div className="mt-5 divide-y divide-black/5">
            {terms.length === 0 ? (
              <p className="py-6 text-sm text-foreground/60">No terms yet.</p>
            ) : (
              terms.map((term) => (
                <div key={term._id} className="py-3">
                  <p className="text-sm font-medium text-foreground">
                    {term.name}
                  </p>
                  <p className="text-xs text-foreground/50">
                    {term.session?.name ?? "No session"}
                    {term.resultsPublished ? " · Results published" : ""}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-navy/10 bg-white p-6">
          <h2 className="text-lg font-medium text-foreground">Subjects</h2>
          <form
            onSubmit={submit("subject", "/api/admin/subjects")}
            className="mt-5 space-y-3"
          >
            <input
              required
              name="name"
              placeholder="Mathematics"
              className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-blue"
            />
            <input
              name="code"
              placeholder="MATH"
              className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm uppercase outline-none focus:border-blue"
            />
            <button
              disabled={saving === "subject"}
              className="rounded-full bg-blue px-5 py-2.5 text-sm font-medium text-white disabled:opacity-40"
            >
              {saving === "subject" ? "Saving..." : "Add subject"}
            </button>
          </form>
          <div className="mt-5 divide-y divide-black/5">
            {subjects.length === 0 ? (
              <p className="py-6 text-sm text-foreground/60">
                No subjects yet.
              </p>
            ) : (
              subjects.map((subject) => (
                <div key={subject._id} className="py-3">
                  <p className="text-sm font-medium text-foreground">
                    {subject.name}
                  </p>
                  {subject.code && (
                    <p className="text-xs text-foreground/50">
                      {subject.code}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      <section className="rounded-2xl border border-navy/10 bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-medium text-foreground">
              Subject teachers
            </h2>
            <p className="mt-1 text-sm text-foreground/60">
              Assign who teaches each subject in each class. This is separate
              from the class teacher, who remains the head of the class.
            </p>
          </div>
        </div>

        <form
          onSubmit={submit(
            "teachingAssignment",
            "/api/admin/teaching-assignments",
          )}
          className="mt-5 grid gap-3 lg:grid-cols-[1fr_1fr_1fr_auto]"
        >
          <select
            required
            name="classSectionId"
            className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-blue"
          >
            <option value="">Class</option>
            {classes.map((item) => (
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
            name="teacherId"
            className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-blue"
          >
            <option value="">Subject teacher</option>
            {staff.map((teacher) => (
              <option key={teacher._id} value={teacher._id}>
                {teacher.fullName}
              </option>
            ))}
          </select>
          <button
            disabled={saving === "teachingAssignment"}
            className="rounded-full bg-blue px-5 py-2.5 text-sm font-medium text-white disabled:opacity-40"
          >
            {saving === "teachingAssignment" ? "Saving..." : "Assign"}
          </button>
        </form>

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
              {teachingAssignments.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-sm text-foreground/60"
                  >
                    No subject teachers assigned yet.
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
      </section>
    </div>
  );
}
