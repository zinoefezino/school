"use client";

import { useEffect, useState } from "react";

type Lookup = {
  _id: string;
  name?: string;
  fullName?: string;
  admissionNumber?: string;
  classLevel?: { name?: string };
  session?: { name?: string };
};

export default function PromoteStudentPage() {
  const [students, setStudents] = useState<Lookup[]>([]);
  const [classes, setClasses] = useState<Lookup[]>([]);
  const [terms, setTerms] = useState<Lookup[]>([]);
  const [message, setMessage] = useState("");
  useEffect(() => {
    fetch("/api/admin/lookups")
      .then((response) => response.json())
      .then((data) => {
        setStudents(data.students ?? []);
        setClasses(data.classes ?? []);
        setTerms(data.terms ?? []);
      })
      .catch(() => setMessage("Unable to load promotion options."));
  }, []);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    const payload = Object.fromEntries(new FormData(event.currentTarget));
    const response = await fetch("/api/admin/promotions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    setMessage(
      response.ok ? "Student promoted and term invoice created." : data.error,
    );
  }
  return (
    <div className="max-w-3xl">
      <div>
        <p className="text-sm text-foreground/60">
          Move a student into a new class for a new term without deleting past
          records.
        </p>
        <h2 className="mt-1 text-xl font-medium text-foreground">
          Promote student
        </h2>
      </div>
      <form
        onSubmit={submit}
        className="mt-6 rounded-2xl border border-navy/10 bg-white p-6 sm:p-8"
      >
        <div className="grid gap-5">
          <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
            Student
            <select
              required
              name="studentId"
              className="rounded-xl border border-black/10 bg-white px-4 py-3 font-normal"
            >
              {students.map((student) => (
                <option key={student._id} value={student._id}>
                  {student.fullName} - {student.admissionNumber}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
            New class
            <select
              required
              name="classSectionId"
              className="rounded-xl border border-black/10 bg-white px-4 py-3 font-normal"
            >
              {classes.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.classLevel?.name} {item.name}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
            Target term
            <select
              required
              name="termId"
              className="rounded-xl border border-black/10 bg-white px-4 py-3 font-normal"
            >
              {terms.map((term) => (
                <option key={term._id} value={term._id}>
                  {term.name} - {term.session?.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        {message && (
          <p className="mt-5 text-sm text-foreground/70">{message}</p>
        )}
        <div className="mt-6 flex justify-end border-t border-black/5 pt-5">
          <button className="rounded-full bg-blue px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700">
            Promote student
          </button>
        </div>
      </form>
    </div>
  );
}
