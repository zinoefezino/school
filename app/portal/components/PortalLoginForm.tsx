"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  LockIcon,
  Mail01Icon,
  ViewIcon,
  ViewOffIcon,
} from "@hugeicons/core-free-icons";
import type { UserRole } from "../../../models/User";

const redirects: Record<UserRole, string> = {
  ADMIN: "/dashboard/admin",
  STAFF: "/dashboard/staff",
  PARENT: "/dashboard/parent",
  STUDENT: "/dashboard/student",
};

export default function PortalLoginForm({
  role,
  identifierLabel,
  placeholder,
  submitLabel,
}: {
  role: UserRole;
  identifierLabel: string;
  placeholder: string;
  submitLabel: string;
}) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    const formData = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: formData.get("identifier"),
          password: formData.get("password"),
          role,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Unable to sign in.");
      router.push(redirects[role]);
    } catch (loginError) {
      setError(
        loginError instanceof Error ? loginError.message : "Unable to sign in.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-6 space-y-5">
      <div>
        <label
          htmlFor="identifier"
          className="text-sm font-medium text-slate-700"
        >
          {identifierLabel}
        </label>
        <div className="mt-1.5 flex items-center gap-2.5 rounded-xl border border-slate-200 px-3.5 py-2.5 focus-within:border-blue">
          <HugeiconsIcon
            icon={Mail01Icon}
            size={18}
            className="text-slate-400"
          />
          <input
            id="identifier"
            name="identifier"
            required
            placeholder={placeholder}
            className="w-full border-0 bg-transparent text-base text-slate-800 outline-none placeholder:text-slate-400"
          />
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between">
          <label
            htmlFor="password"
            className="text-sm font-medium text-slate-700"
          >
            Password
          </label>
          <a href="#" className="text-sm text-blue">
            Forgot password?
          </a>
        </div>
        <div className="mt-1.5 flex items-center gap-2.5 rounded-xl border border-slate-200 px-3.5 py-2.5 focus-within:border-blue">
          <HugeiconsIcon icon={LockIcon} size={18} className="text-slate-400" />
          <input
            id="password"
            name="password"
            required
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            className="w-full border-0 bg-transparent text-base text-slate-800 outline-none placeholder:text-slate-400"
          />
          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="text-slate-400 hover:text-slate-700"
          >
            <HugeiconsIcon
              icon={showPassword ? ViewOffIcon : ViewIcon}
              size={18}
            />
          </button>
        </div>
      </div>
      {error && (
        <p role="alert" className="text-sm text-[#B4483B]">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-full bg-blue px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? "Signing in..." : submitLabel}
      </button>
    </form>
  );
}
