"use client";

import Link from "next/link";
import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  LockIcon,
  Mail01Icon,
  ViewIcon,
  ViewOffIcon,
  LocationUser01Icon,
} from "@hugeicons/core-free-icons";

export default function ParentPortalPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-10">
      <div className="mx-auto w-full max-w-md">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-700"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
          Back to Home
        </Link>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-light text-blue">
              <HugeiconsIcon icon={LocationUser01Icon} size={24} />
            </span>
            <div>
              <p className="text-xs font-medium uppercase bg-slate-100 inline-block px-3 py-1 rounded-full text-blue">
                Parent portal
              </p>
              <h1 className="mt-1 text-2xl font-medium text-slate-900">
                Sign in
              </h1>
            </div>
          </div>

          <form className="mt-6 space-y-5">
            <div>
              <label
                htmlFor="parent-email"
                className="text-sm font-medium text-slate-700"
              >
                Email address
              </label>
              <div className="mt-1.5 flex items-center gap-2.5 rounded-xl border border-slate-200 px-3.5 py-2.5 focus-within:border-blue">
                <HugeiconsIcon
                  icon={Mail01Icon}
                  size={18}
                  className="text-slate-400"
                />
                <input
                  id="parent-email"
                  type="email"
                  placeholder="parent@email.com"
                  className="w-full border-0 bg-transparent text-base text-slate-800 outline-none placeholder:text-slate-400"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="parent-password"
                  className="text-sm font-medium text-slate-700"
                >
                  Password
                </label>
                <a href="#" className="text-sm text-blue">
                  Forgot password?
                </a>
              </div>
              <div className="mt-1.5 flex items-center gap-2.5 rounded-xl border border-slate-200 px-3.5 py-2.5 focus-within:border-blue">
                <HugeiconsIcon
                  icon={LockIcon}
                  size={18}
                  className="text-slate-400"
                />
                <input
                  id="parent-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full border-0 bg-transparent text-base text-slate-800 outline-none placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
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

            <button
              type="submit"
              className="w-full rounded-full bg-blue px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              Sign in to parent portal
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
