import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft02Icon, Book02Icon } from "@hugeicons/core-free-icons";

export default function NewClassPage() {
  return (
    <div className="max-w-3xl">
      <a
        href="/dashboard/admin/classes"
        className="flex items-center gap-1.5 text-sm font-medium text-blue"
      >
        <HugeiconsIcon icon={ArrowLeft02Icon} size={16} />
        Back to classes
      </a>
      <form className="mt-5 rounded-2xl border border-navy/10 bg-white p-6 sm:p-8">
        <div className="flex items-center gap-3 border-b border-black/5 pb-5">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-light text-blue">
            <HugeiconsIcon icon={Book02Icon} size={20} />
          </span>
          <div>
            <h2 className="text-xl font-medium text-foreground">Add class</h2>
            <p className="mt-1 text-sm text-foreground/60">
              Create a class section and assign its class teacher.
            </p>
          </div>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
            Class level
            <select className="rounded-xl border border-black/10 bg-white px-4 py-3 font-normal outline-none focus:border-blue">
              <option>JSS1</option>
              <option>JSS2</option>
              <option>SS2</option>
              <option>SS3</option>
            </select>
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
            Section
            <input
              required
              placeholder="Gold"
              className="rounded-xl border border-black/10 px-4 py-3 font-normal outline-none focus:border-blue"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-foreground sm:col-span-2">
            Class teacher
            <select className="rounded-xl border border-black/10 bg-white px-4 py-3 font-normal outline-none focus:border-blue">
              <option>Mrs. Adaeze Nwosu</option>
              <option>Mr. Emeka Obi</option>
              <option>Unassigned</option>
            </select>
          </label>
        </div>
        <div className="mt-6 flex justify-end border-t border-black/5 pt-5">
          <button
            type="submit"
            className="rounded-full bg-blue px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            Create class
          </button>
        </div>
      </form>
    </div>
  );
}
