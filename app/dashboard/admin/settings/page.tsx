"use client";

import { FormEvent, useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Building06Icon,
  LockPasswordIcon,
  Notification01Icon,
} from "@hugeicons/core-free-icons";

type Settings = {
  schoolName: string;
  currentSession: string;
  notifyResultsReview: boolean;
};
const inputClass =
  "rounded-xl border border-black/10 px-4 py-3 text-base font-normal outline-none focus:border-blue";

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    schoolName: "",
    currentSession: "",
    notifyResultsReview: true,
  });
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [status, setStatus] = useState("");
  const [passwordStatus, setPasswordStatus] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then(async (response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (data?.settings)
          setSettings({
            schoolName: data.settings.schoolName,
            currentSession: data.settings.currentSession,
            notifyResultsReview: data.settings.notifyResultsReview,
          });
      })
      .finally(() => setLoading(false));
  }, []);

  async function saveSettings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("");
    const response = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    const data = await response.json();
    setStatus(response.ok ? "Settings saved successfully." : data.error);
  }

  async function changePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPasswordStatus("");
    const response = await fetch("/api/admin/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const data = await response.json();
    setPasswordStatus(response.ok ? data.message : data.error);
    if (response.ok) {
      setCurrentPassword("");
      setNewPassword("");
    }
  }

  if (loading)
    return <p className="text-sm text-foreground/60">Loading settings...</p>;
  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <div>
        <p className="text-sm text-foreground/60">
          Manage school-wide dashboard preferences
        </p>
        <h2 className="mt-1 text-xl font-medium text-foreground">Settings</h2>
      </div>
      <form
        onSubmit={saveSettings}
        className="rounded-2xl border border-navy/10 bg-white p-6"
      >
        <div className="flex items-center gap-3">
          <HugeiconsIcon
            icon={Building06Icon}
            size={20}
            className="text-blue"
          />
          <div>
            <h3 className="font-medium text-foreground">School details</h3>
            <p className="mt-1 text-sm text-foreground/60">
              Information shown across the school portal.
            </p>
          </div>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
            School name
            <input
              required
              value={settings.schoolName}
              onChange={(event) =>
                setSettings({ ...settings, schoolName: event.target.value })
              }
              className={inputClass}
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
            Current session
            <input
              required
              value={settings.currentSession}
              onChange={(event) =>
                setSettings({ ...settings, currentSession: event.target.value })
              }
              className={inputClass}
            />
          </label>
        </div>
        <div className="mt-5 flex items-center justify-between gap-4 border-t border-black/5 pt-5">
          <span className="text-sm text-foreground/60">{status}</span>
          <button className="rounded-full bg-blue px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700">
            Save settings
          </button>
        </div>
      </form>
      <section className="rounded-2xl border border-navy/10 bg-white p-6">
        <div className="flex items-center gap-3">
          <HugeiconsIcon
            icon={Notification01Icon}
            size={20}
            className="text-blue"
          />
          <div>
            <h3 className="font-medium text-foreground">Notifications</h3>
            <p className="mt-1 text-sm text-foreground/60">
              Control administrative reminders.
            </p>
          </div>
        </div>
        <label className="mt-5 flex items-center gap-3 text-base text-foreground">
          <input
            type="checkbox"
            checked={settings.notifyResultsReview}
            onChange={(event) =>
              setSettings({
                ...settings,
                notifyResultsReview: event.target.checked,
              })
            }
            className="h-4 w-4 accent-blue"
          />
          Notify administrators when results need review
        </label>
      </section>
      <form
        onSubmit={changePassword}
        className="rounded-2xl border border-navy/10 bg-white p-6"
      >
        <div className="flex items-center gap-3">
          <HugeiconsIcon
            icon={LockPasswordIcon}
            size={20}
            className="text-blue"
          />
          <div>
            <h3 className="font-medium text-foreground">Change password</h3>
            <p className="mt-1 text-sm text-foreground/60">
              Use your current password to set a new one.
            </p>
          </div>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
            Current password
            <input
              required
              type="password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              className={inputClass}
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
              className={inputClass}
            />
          </label>
        </div>
        <div className="mt-5 flex items-center justify-between gap-4 border-t border-black/5 pt-5">
          <span className="text-sm text-foreground/60">{passwordStatus}</span>
          <button className="rounded-full border border-navy/15 px-5 py-2.5 text-sm font-medium text-navy hover:bg-blue-light">
            Change password
          </button>
        </div>
      </form>
    </div>
  );
}
