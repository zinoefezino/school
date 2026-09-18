"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function EditStudentPage() {
  const { id } = useParams<{ id: string }>();
  const [student, setStudent] = useState({
    fullName: "",
    dateOfBirth: "",
    gender: "female",
  });
  const [message, setMessage] = useState("");
  useEffect(() => {
    fetch(`/api/admin/students/${id}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.student)
          setStudent({
            fullName: data.student.fullName,
            dateOfBirth: data.student.dateOfBirth?.slice(0, 10) ?? "",
            gender: data.student.gender ?? "female",
          });
      });
  }, [id]);
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const response = await fetch(`/api/admin/students/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(student),
    });
    setMessage(
      response.ok ? "Student updated." : (await response.json()).error,
    );
  }
  return (
    <div className="max-w-2xl">
      <a
        href="/dashboard/admin/students"
        className="text-sm font-medium text-blue"
      >
        Back to students
      </a>
      <form
        onSubmit={submit}
        className="mt-5 rounded-2xl border border-navy/10 bg-white p-6"
      >
        <h2 className="text-xl font-medium text-foreground">Edit student</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm font-medium">
            Full name
            <input
              required
              value={student.fullName}
              onChange={(e) =>
                setStudent({ ...student, fullName: e.target.value })
              }
              className="rounded-xl border px-4 py-3 text-base"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium">
            Date of birth
            <input
              required
              type="date"
              value={student.dateOfBirth}
              onChange={(e) =>
                setStudent({ ...student, dateOfBirth: e.target.value })
              }
              className="rounded-xl border px-4 py-3 text-base"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium">
            Gender
            <select
              value={student.gender}
              onChange={(e) =>
                setStudent({ ...student, gender: e.target.value })
              }
              className="rounded-xl border bg-white px-4 py-3 text-base"
            >
              <option value="female">Female</option>
              <option value="male">Male</option>
            </select>
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
