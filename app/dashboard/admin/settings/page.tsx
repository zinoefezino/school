import { HugeiconsIcon } from "@hugeicons/react";
import {
  Building06Icon,
  LockPasswordIcon,
  Notification01Icon,
} from "@hugeicons/core-free-icons";

export default function SettingsPage() {
  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <div>
        <p className="text-sm text-foreground/60">
          Manage school-wide dashboard preferences
        </p>
        <h2 className="mt-1 text-xl font-medium text-foreground">Settings</h2>
      </div>
      <section className="rounded-2xl border border-navy/10 bg-white p-6">
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
              defaultValue="Fairview Academy"
              className="rounded-xl border border-black/10 px-4 py-3 font-normal outline-none focus:border-blue"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
            Current session
            <input
              defaultValue="2026/2027"
              className="rounded-xl border border-black/10 px-4 py-3 font-normal outline-none focus:border-blue"
            />
          </label>
        </div>
      </section>
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
        <label className="mt-5 flex items-center gap-3 text-sm text-foreground">
          <input
            type="checkbox"
            defaultChecked
            className="h-4 w-4 accent-blue"
          />
          Notify administrators when results need review
        </label>
      </section>
      <section className="rounded-2xl border border-navy/10 bg-white p-6">
        <div className="flex items-center gap-3">
          <HugeiconsIcon
            icon={LockPasswordIcon}
            size={20}
            className="text-blue"
          />
          <div>
            <h3 className="font-medium text-foreground">Security</h3>
            <p className="mt-1 text-sm text-foreground/60">
              Keep administrator access protected.
            </p>
          </div>
        </div>
        <button className="mt-5 rounded-full border border-navy/15 px-5 py-2.5 text-sm font-medium text-navy hover:bg-blue-light">
          Change password
        </button>
      </section>
      <div className="flex justify-end">
        <button className="rounded-full bg-blue px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700">
          Save settings
        </button>
      </div>
    </div>
  );
}
