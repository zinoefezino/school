"use client";

import { FormEvent, useEffect, useState } from "react";
import LoadingState from "../../components/LoadingState";

type ClassSection = {
  _id: string;
  name?: string;
  classLevel?: { name?: string };
};
type Staff = { _id: string; fullName: string };
type Subject = { _id: string; name: string };
type Term = { _id: string; name: string; session?: { name?: string } };
type TimetableEntry = {
  _id: string;
  day: string;
  startTime: string;
  endTime: string;
  room?: string;
  subject?: { name?: string };
  teacher?: { fullName?: string };
  classSection?: { name?: string; classLevel?: { name?: string } };
};

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function classNameFor(item?: ClassSection | TimetableEntry["classSection"]) {
  return [item?.classLevel?.name, item?.name].filter(Boolean).join(" ");
}

export default function AdminTimetablePage() {
  const [classes, setClasses] = useState<ClassSection[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [terms, setTerms] = useState<Term[]>([]);
  const [entries, setEntries] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState("");

  const load = async () => {
    const [lookupData, subjectData, timetableData] = await Promise.all([
      fetch("/api/admin/lookups").then((response) =>
        response.ok ? response.json() : { classes: [], terms: [], staff: [] },
      ),
      fetch("/api/admin/subjects").then((response) =>
        response.ok ? response.json() : { subjects: [] },
      ),
      fetch("/api/admin/timetable").then((response) =>
        response.ok ? response.json() : { timetable: [] },
      ),
    ]);
    setClasses(lookupData.classes ?? []);
    setStaff(lookupData.staff ?? []);
    setTerms(lookupData.terms ?? []);
    setSubjects(subjectData.subjects ?? []);
    setEntries(timetableData.timetable ?? []);
  };

  useEffect(() => {
    Promise.resolve()
      .then(load)
      .catch(() => undefined)
      .finally(() => setLoading(false));
  }, []);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setSubmitting(true);
    setStatus("");
    try {
      const response = await fetch("/api/admin/timetable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(formData.entries())),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error ?? "Unable to create timetable entry.");
      form.reset();
      setStatus("Timetable entry added.");
      await load();
    } catch (error) {
      setStatus(
        error instanceof Error
          ? error.message
          : "Unable to create timetable entry.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingState label="Loading timetable..." />;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,420px)_1fr]">
      <form
        onSubmit={submit}
        className="rounded-2xl border border-navy/10 bg-white p-6"
      >
        <h1 className="text-lg font-medium text-foreground">
          Add timetable entry
        </h1>
        <p className="mt-1 text-sm text-foreground/60">
          Build the timetable for any class and subject.
        </p>
        <div className="mt-5 flex flex-col gap-4">
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
            name="termId"
            className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-blue"
          >
            <option value="">All terms</option>
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
          <select
            required
            name="day"
            className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-blue"
          >
            <option value="">Day</option>
            {days.map((day) => (
              <option key={day}>{day}</option>
            ))}
          </select>
          <div className="grid grid-cols-2 gap-3">
            <input
              required
              type="time"
              name="startTime"
              className="rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-blue"
            />
            <input
              required
              type="time"
              name="endTime"
              className="rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-blue"
            />
          </div>
          <input
            name="room"
            placeholder="Room"
            className="rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-blue"
          />
        </div>
        {status && <p className="mt-4 text-sm text-foreground/70">{status}</p>}
        <button
          disabled={submitting}
          className="mt-5 rounded-full bg-blue px-5 py-2.5 text-sm font-medium text-white disabled:opacity-40"
        >
          {submitting ? "Adding..." : "Add entry"}
        </button>
      </form>

      <section className="rounded-2xl border border-navy/10 bg-white p-6">
        <h2 className="text-lg font-medium text-foreground">
          Timetable entries
        </h2>
        <div className="mt-4 divide-y divide-black/5">
          {entries.length === 0 ? (
            <p className="py-8 text-sm text-foreground/60">
              No timetable entries yet.
            </p>
          ) : (
            entries.map((entry) => (
              <div key={entry._id} className="py-4">
                <p className="font-medium text-foreground">
                  {entry.day} · {entry.startTime} - {entry.endTime}
                </p>
                <p className="mt-1 text-sm text-foreground/60">
                  {entry.subject?.name ?? "Subject"} ·{" "}
                  {classNameFor(entry.classSection) || "Class"}
                  {entry.room ? ` · ${entry.room}` : ""}
                </p>
                {entry.teacher?.fullName && (
                  <p className="mt-1 text-xs text-foreground/50">
                    Teacher: {entry.teacher.fullName}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
