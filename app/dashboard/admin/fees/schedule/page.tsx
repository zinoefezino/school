"use client";

import { useEffect, useState } from "react";

type Lookup = {
  _id: string;
  name?: string;
  classLevel?: { name?: string };
  session?: { name?: string };
};

export default function FeeSchedulePage() {
  const [classes, setClasses] = useState<Lookup[]>([]);
  const [terms, setTerms] = useState<Lookup[]>([]);
  const [message, setMessage] = useState("");
  useEffect(() => {
    fetch("/api/admin/lookups")
      .then((response) => response.json())
      .then((data) => {
        setClasses(data.classes ?? []);
        setTerms(data.terms ?? []);
      })
      .catch(() => setMessage("Unable to load fee options."));
  }, []);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload = Object.fromEntries(new FormData(event.currentTarget));
    const response = await fetch("/api/admin/fee-schedules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, amount: Number(payload.amount) }),
    });
    const data = await response.json();
    setMessage(response.ok ? "Class fee schedule saved." : data.error);
  }
  return (
    <div className="max-w-3xl">
      <div>
        <p className="text-sm text-foreground/60">
          Set the amount used when students are enrolled in a class for a term.
        </p>
        <h2 className="mt-1 text-xl font-medium text-foreground">
          Class fee schedule
        </h2>
      </div>
      <form
        onSubmit={submit}
        className="mt-6 rounded-2xl border border-navy/10 bg-white p-6 sm:p-8"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
            Class
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
            Term
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
          <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
            Amount
            <input
              required
              min="0"
              type="number"
              name="amount"
              placeholder="85000"
              className="rounded-xl border border-black/10 px-4 py-3 font-normal outline-none focus:border-blue"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
            Due date
            <input
              required
              type="date"
              name="dueDate"
              className="rounded-xl border border-black/10 px-4 py-3 font-normal outline-none focus:border-blue"
            />
          </label>
        </div>
        {message && (
          <p className="mt-5 text-sm text-foreground/70">{message}</p>
        )}
        <div className="mt-6 flex justify-end border-t border-black/5 pt-5">
          <button className="rounded-full bg-blue px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700">
            Save fee schedule
          </button>
        </div>
      </form>
    </div>
  );
}
