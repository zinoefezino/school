"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function EditStaffPage() {
  const { id } = useParams<{ id: string }>();
  const [staff, setStaff] = useState({
    fullName: "",
    department: "",
    phone: "",
  });
  const [message, setMessage] = useState("");
  useEffect(() => {
    fetch(`/api/admin/staff/${id}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.staff)
          setStaff({
            fullName: data.staff.fullName,
            department: data.staff.department ?? "",
            phone: data.staff.phone ?? "",
          });
      });
  }, [id]);
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const response = await fetch(`/api/admin/staff/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(staff),
    });
    setMessage(
      response.ok ? "Staff member updated." : (await response.json()).error,
    );
  }
  return (
    <div className="max-w-2xl">
      <a
        href="/dashboard/admin/staff"
        className="text-sm font-medium text-blue"
      >
        Back to staff
      </a>
      <form
        onSubmit={submit}
        className="mt-5 rounded-2xl border border-navy/10 bg-white p-6"
      >
        <h2 className="text-xl font-medium text-foreground">
          Edit staff member
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm font-medium">
            Full name
            <input
              required
              value={staff.fullName}
              onChange={(e) => setStaff({ ...staff, fullName: e.target.value })}
              className="rounded-xl border px-4 py-3 text-base"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium">
            Department
            <input
              value={staff.department}
              onChange={(e) =>
                setStaff({ ...staff, department: e.target.value })
              }
              className="rounded-xl border px-4 py-3 text-base"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium">
            Phone
            <input
              value={staff.phone}
              onChange={(e) => setStaff({ ...staff, phone: e.target.value })}
              className="rounded-xl border px-4 py-3 text-base"
            />
          </label>
        </div>
        {message && (
          <p className="mt-4 text-sm text-foreground/70">{message}</p>
        )}
        <button className="mt-6 rounded-full bg-blue px-5 py-2.5 text-sm text-white">
          Save changes
        </button>
      </form>
    </div>
  );
}
