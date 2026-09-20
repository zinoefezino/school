"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft02Icon } from "@hugeicons/core-free-icons";
import StatusMessage from "../../../../components/StatusMessage";

type Staff = { _id: string; fullName: string };

export default function EditClassPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", classTeacher: "" });
  const [staff, setStaff] = useState<Staff[]>([]);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    Promise.all([
      fetch(`/api/admin/classes/${id}`).then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error ?? "Unable to load class.");
        return data;
      }),
      fetch("/api/admin/lookups").then(async (response) => {
        const data = await response.json();
        if (!response.ok)
          throw new Error(data.error ?? "Unable to load staff options.");
        return data;
      }),
    ])
      .then(([classData, lookupData]) => {
        if (classData.class)
          setForm({
            name: classData.class.name,
            classTeacher:
              typeof classData.class.classTeacher === "string"
                ? classData.class.classTeacher
                : classData.class.classTeacher?._id ?? "",
          });
        setStaff(lookupData.staff ?? []);
      })
      .catch(() => setMessage("Unable to load class details."));
  }, [id]);
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    const response = await fetch(`/api/admin/classes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await response.json();
    if (response.ok) {
      router.push("/dashboard/admin/academics/classes");
    } else {
      setMessage(data.error ?? "Unable to update class.");
      setSaving(false);
    }
  }
  async function remove() {
    if (!window.confirm("Delete this class? It must have no active students."))
      return;
    const response = await fetch(`/api/admin/classes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete" }),
    });
    if (response.ok) router.push("/dashboard/admin/academics/classes");
    else setMessage((await response.json()).error);
  }
  return (
    <div className="max-w-2xl">
      <a
        href="/dashboard/admin/academics/classes"
        className="flex items-center gap-1.5 text-sm font-medium text-blue"
      >
        <HugeiconsIcon icon={ArrowLeft02Icon} size={16} />
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
            Class teacher
            <select
              value={form.classTeacher}
              onChange={(e) =>
                setForm({ ...form, classTeacher: e.target.value })
              }
              className="rounded-xl border bg-white px-4 py-3 text-base"
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
        {message && <StatusMessage className="mt-4">{message}</StatusMessage>}
        <div className="mt-6 flex justify-between">
          <button
            type="button"
            onClick={remove}
            className="rounded-full border border-[#B4483B]/30 px-5 py-2.5 text-sm text-[#B4483B]"
          >
            Delete class
          </button>
          <button
            disabled={saving}
            className="rounded-full bg-blue px-5 py-2.5 text-sm text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
