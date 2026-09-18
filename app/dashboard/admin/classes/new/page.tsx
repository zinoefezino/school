"use client";

import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft02Icon, Book02Icon } from "@hugeicons/core-free-icons";

type Staff = { _id: string; fullName: string };
export default function NewClassPage() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [message, setMessage] = useState("");
  useEffect(() => {
    fetch("/api/admin/lookups")
      .then((response) => response.json())
      .then((data) => setStaff(data.staff ?? []))
      .catch(() => setMessage("Unable to load staff."));
  }, []);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload = Object.fromEntries(new FormData(event.currentTarget));
    const response = await fetch("/api/admin/classes/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    setMessage(response.ok ? "Class created successfully." : data.error);
  }
  return (
    <div className="max-w-3xl">
      <a
        href="/dashboard/admin/classes"
        className="flex items-center gap-1.5 text-sm font-medium text-blue"
      >
        <HugeiconsIcon icon={ArrowLeft02Icon} size={16} />
        Back to classes
      </a>
      <form
        onSubmit={submit}
        className="mt-5 rounded-2xl border border-navy/10 bg-white p-6 sm:p-8"
      >
        <div className="flex items-center gap-3 border-b border-black/5 pb-5">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-light text-blue">
            <HugeiconsIcon icon={Book02Icon} size={20} />
          </span>
          <div>
            <h2 className="text-xl font-medium text-foreground">Add class</h2>
            <p className="mt-1 text-sm text-foreground/60">
              Create a class section and assign its class teacher.
            </p>
          </div>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
            Class level
            <select
              required
              name="classLevel"
              className="rounded-xl border border-black/10 bg-white px-4 py-3 text-base outline-none"
            >
              <option>JSS1</option>
              <option>JSS2</option>
              <option>SS1</option>
              <option>SS2</option>
              <option>SS3</option>
            </select>
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
            Section
            <input
              required
              name="section"
              placeholder="Gold"
              className="rounded-xl border border-black/10 px-4 py-3 text-base outline-none focus:border-blue"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-foreground sm:col-span-2">
            Class teacher
            <select
              name="classTeacher"
              className="rounded-xl border border-black/10 bg-white px-4 py-3 text-base outline-none"
            >
              <option value="">Unassigned</option>
              {staff.map((member) => (
                <option key={member._id} value={member._id}>
                  {member.fullName}
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
            Create class
          </button>
        </div>
      </form>
    </div>
  );
}
