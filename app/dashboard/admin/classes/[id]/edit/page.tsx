"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function EditClassPage() {
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState({ name: "", classTeacher: "" });
  const [message, setMessage] = useState("");
  useEffect(() => {
    fetch(`/api/admin/classes/${id}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.class)
          setForm({
            name: data.class.name,
            classTeacher: data.class.classTeacher ?? "",
          });
      });
  }, [id]);
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const response = await fetch(`/api/admin/classes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setMessage(response.ok ? "Class updated." : (await response.json()).error);
  }
  async function remove() {
    if (!window.confirm("Delete this class? It must have no active students."))
      return;
    const response = await fetch(`/api/admin/classes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete" }),
    });
    if (response.ok) window.location.href = "/dashboard/admin/classes";
    else setMessage((await response.json()).error);
  }
  return (
    <div className="max-w-2xl">
      <a
        href="/dashboard/admin/classes"
        className="text-sm font-medium text-blue"
      >
        Back to classes
      </a>
      <form
        onSubmit={submit}
        className="mt-5 rounded-2xl border border-navy/10 bg-white p-6"
      >
        <h2 className="text-xl font-medium text-foreground">Edit class</h2>
        <div className="mt-6 grid gap-4">
          <label className="flex flex-col gap-2 text-sm font-medium">
            Section
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="rounded-xl border px-4 py-3 text-base"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium">
            Class teacher ID
            <input
              value={form.classTeacher}
              onChange={(e) =>
                setForm({ ...form, classTeacher: e.target.value })
              }
              className="rounded-xl border px-4 py-3 text-base"
            />
          </label>
        </div>
        {message && (
          <p className="mt-4 text-sm text-foreground/70">{message}</p>
        )}
        <div className="mt-6 flex justify-between">
          <button
            type="button"
            onClick={remove}
            className="rounded-full border border-[#B4483B]/30 px-5 py-2.5 text-sm text-[#B4483B]"
          >
            Delete class
          </button>
          <button className="rounded-full bg-blue px-5 py-2.5 text-sm text-white">
            Save changes
          </button>
        </div>
      </form>
    </div>
  );
}
