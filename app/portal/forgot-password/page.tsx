"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export default function ForgotPasswordPage() {
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    const email = new FormData(event.currentTarget).get("email");
    const response = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await response.json();
    setMessage(data.message);
    setSubmitting(false);
  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-10">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <Link href="/portal/login" className="text-sm font-medium text-blue">
          Back to portals
        </Link>
        <h1 className="mt-6 text-2xl font-medium text-slate-900">
          Forgot password?
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Enter your account email and we will send a secure reset link.
        </p>
        <form onSubmit={submit} className="mt-6 space-y-5">
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            Email address
            <input
              required
              type="email"
              name="email"
              placeholder="you@example.com"
              className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue"
            />
          </label>
          {message && <p className="text-sm text-slate-600">{message}</p>}
          <button
            disabled={submitting}
            className="w-full rounded-full bg-blue px-6 py-3 text-sm font-medium text-white disabled:opacity-50"
          >
            {submitting ? "Sending..." : "Send reset link"}
          </button>
        </form>
      </div>
    </div>
  );
}
