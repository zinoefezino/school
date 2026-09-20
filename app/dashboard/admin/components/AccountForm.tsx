"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export type AccountRole = "STUDENT" | "STAFF" | "PARENT";

export default function AccountForm({ role }: { role: AccountRole }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [guardians, setGuardians] = useState<
    { _id: string; fullName: string; user?: { email?: string } }[]
  >([]);
  const [guardianSearch, setGuardianSearch] = useState("");

  useEffect(() => {
    if (role !== "STUDENT") return;
    const timer = window.setTimeout(() => {
      fetch(
        `/api/admin/guardians?search=${encodeURIComponent(guardianSearch)}&limit=15`,
      )
        .then(async (response) => (response.ok ? response.json() : null))
        .then((data) => {
          if (data) setGuardians(data.guardians ?? []);
        })
        .catch(() => undefined);
    }, 250);
    return () => window.clearTimeout(timer);
  }, [guardianSearch, role]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");
    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    try {
      const response = await fetch("/api/admin/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, role }),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error ?? "Unable to create account.");
      setSuccess(
        "Account created. Give the user their temporary password securely.",
      );
      form.reset();
      setTimeout(
        () =>
          router.push(
            role === "STUDENT"
              ? "/dashboard/admin/students"
              : role === "STAFF"
                ? "/dashboard/admin/staff"
                : "/dashboard/admin/parents",
          ),
        1200,
      );
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Unable to create account.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="mt-6 rounded-2xl border border-navy/10 bg-white p-6 sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm font-medium text-foreground sm:col-span-2">
          Full name
          <input
            required
            name="fullName"
            placeholder="Full name"
            className="rounded-xl border border-black/10 px-4 py-3 font-normal outline-none focus:border-blue text-base"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
          Email
          <input
            required
            type="email"
            name="email"
            placeholder="name@example.com"
            className="rounded-xl border border-black/10 px-4 py-3 font-normal outline-none focus:border-blue text base"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
          Temporary password
          <input
            required
            minLength={8}
            name="temporaryPassword"
            type="password"
            placeholder="At least 8 characters"
            className="rounded-xl border border-black/10 px-4 py-3 font-normal outline-none focus:border-blue text-base"
          />
        </label>
        {role === "PARENT" && (
          <label className="flex flex-col gap-2 text-sm font-medium text-foreground sm:col-span-2">
            Phone
            <input
              name="phone"
              placeholder="+234..."
              className="rounded-xl border border-black/10 px-4 py-3 font-normal outline-none focus:border-blue text-base"
            />
          </label>
        )}
        {role === "STAFF" && (
          <>
            <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
              Department
              <input
                name="department"
                placeholder="Mathematics"
                className="rounded-xl border border-black/10 px-4 py-3 font-normal outline-none focus:border-blue text-base"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
              Phone
              <input
                name="phone"
                placeholder="+234..."
                className="rounded-xl border border-black/10 px-4 py-3 font-normal outline-none focus:border-blue text-base"
              />
            </label>
          </>
        )}
        {role === "STUDENT" && (
          <>
            <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
              Admission number
              <input
                required
                name="admissionNumber"
                placeholder="FA-2026-0142"
                className="rounded-xl border border-black/10 px-4 py-3 font-normal outline-none focus:border-blue text-base"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
              Date of birth
              <input
                required
                type="date"
                name="dateOfBirth"
                className="rounded-xl border border-black/10 px-4 py-3 font-normal outline-none focus:border-blue text-base"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
              Gender
              <select
                name="gender"
                className="rounded-xl border border-black/10 bg-white px-4 py-3 font-normal outline-none focus:border-blue"
              >
                <option value="female">Female</option>
                <option value="male">Male</option>
              </select>
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
              Find guardian
              <input
                value={guardianSearch}
                onChange={(event) => setGuardianSearch(event.target.value)}
                placeholder="Search parent name or phone"
                className="rounded-xl border border-black/10 px-4 py-3 font-normal outline-none focus:border-blue text-base"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
              Guardian
              <select
                name="guardianId"
                className="rounded-xl border border-black/10 bg-white px-4 py-3 font-normal outline-none focus:border-blue"
              >
                <option value="">No guardian linked</option>
                {guardians.map((guardian) => (
                  <option key={guardian._id} value={guardian._id}>
                    {guardian.fullName}
                    {guardian.user?.email ? ` - ${guardian.user.email}` : ""}
                  </option>
                ))}
              </select>
            </label>
          </>
        )}
      </div>
      {error && (
        <p role="alert" className="mt-5 text-sm text-[#B4483B]">
          {error}
        </p>
      )}
      {success && (
        <p role="status" className="mt-5 text-sm text-[#3F7A5B]">
          {success}
        </p>
      )}
      <div className="mt-6 flex justify-end border-t border-black/5 pt-5">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-blue px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? "Creating..." : `Create ${role.toLowerCase()} account`}
        </button>
      </div>
    </form>
  );
}
