"use client";

import Link from "next/link";
import { FormEvent, Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    if (form.get("password") !== form.get("confirmPassword")) {
      setError("Passwords do not match.");
      return;
    }
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: form.get("password") }),
      });
      const data = await response.json();
      if (!response.ok) setError(data.error ?? "Something went wrong.");
      else setMessage(data.message);
    } catch {
      setError("Network error. Please try again.");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-10">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-medium text-slate-900">Reset password</h1>
        <p className="mt-2 text-sm text-slate-500">
          Choose a new password with at least 8 characters.
        </p>
        <form onSubmit={submit} className="mt-6 space-y-5">
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            New password
            <input
              required
              minLength={8}
              type="password"
              name="password"
              className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            Confirm password
            <input
              required
              minLength={8}
              type="password"
              name="confirmPassword"
              className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue"
            />
          </label>
          {error && <p className="text-sm text-[#B4483B]">{error}</p>}
          {message ? (
            <p className="text-sm text-[#3F7A5B]">
              {message}{" "}
              <Link href="/portal/login" className="font-medium underline">
                Sign in
              </Link>
            </p>
          ) : (
            <button className="w-full rounded-full bg-blue px-6 py-3 text-sm font-medium text-white">
              Update password
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
