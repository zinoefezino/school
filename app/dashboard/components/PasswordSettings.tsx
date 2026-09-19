"use client";

import { FormEvent, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { LockPasswordIcon } from "@hugeicons/core-free-icons";
import AccountSummary from "./AccountSummary";

export default function PasswordSettings() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("");
    if (newPassword !== confirmPassword) {
      setStatus("New password and confirmation do not match.");
      return;
    }
    setSaving(true);
    try {
      const response = await fetch("/api/account/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error ?? "Unable to change password.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setStatus(result.message ?? "Password changed successfully.");
    } catch (error) {
      setStatus(
        error instanceof Error ? error.message : "Unable to change password.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <AccountSummary />
      <div className="rounded-2xl border border-navy/10 bg-white p-6 sm:p-8">
        <div className="flex items-center gap-3 border-b border-black/5 pb-5">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-light text-blue">
            <HugeiconsIcon icon={LockPasswordIcon} size={20} />
          </span>
          <div>
            <h2 className="text-xl font-medium text-foreground">
              Change password
            </h2>
            <p className="mt-1 text-sm text-foreground/60">
              Use a secure password of at least 8 characters.
            </p>
          </div>
        </div>

        <form onSubmit={submit} className="mt-6 flex flex-col gap-4">
          <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
            Current password
            <input
              required
              type="password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              className="rounded-xl border border-black/10 px-4 py-3 font-normal outline-none focus:border-blue"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
            New password
            <input
              required
              minLength={8}
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              className="rounded-xl border border-black/10 px-4 py-3 font-normal outline-none focus:border-blue"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
            Confirm new password
            <input
              required
              minLength={8}
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="rounded-xl border border-black/10 px-4 py-3 font-normal outline-none focus:border-blue"
            />
          </label>

          {status && <p className="text-sm text-foreground/70">{status}</p>}

          <div className="flex justify-end border-t border-black/5 pt-5">
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-blue px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {saving ? "Changing..." : "Change password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
