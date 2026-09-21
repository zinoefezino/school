"use client";

import { FormEvent, useEffect, useState } from "react";
import LoadingState from "../../components/LoadingState";
import StatusMessage from "../../components/StatusMessage";

type AcademicSession = { _id: string; name: string };
type Term = {
  _id: string;
  name: string;
  resultsPublished?: boolean;
  session?: { name?: string };
};
type Subject = { _id: string; name: string; code?: string };
export default function AdminAcademicsPage() {
  const [sessions, setSessions] = useState<AcademicSession[]>([]);
  const [terms, setTerms] = useState<Term[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState("");
  const [status, setStatus] = useState("");

  const load = async () => {
    const [sessionData, termData, subjectData] = await Promise.all([
      fetch("/api/admin/sessions").then((response) =>
        response.ok ? response.json() : { sessions: [] },
      ),
      fetch("/api/admin/terms").then((response) =>
        response.ok ? response.json() : { terms: [] },
      ),
      fetch("/api/admin/subjects").then((response) =>
        response.ok ? response.json() : { subjects: [] },
      ),
    ]);
    setSessions(sessionData.sessions ?? []);
    setTerms(termData.terms ?? []);
    setSubjects(subjectData.subjects ?? []);
  };

  useEffect(() => {
    Promise.resolve()
      .then(load)
      .catch(() => undefined)
      .finally(() => setLoading(false));
  }, []);

  const submit =
    (kind: "session" | "term" | "subject", endpoint: string) =>
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
        <StatusMessage>{status}</StatusMessage>
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

    </div>
  );
}
