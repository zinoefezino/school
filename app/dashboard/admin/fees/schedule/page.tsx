"use client";

import { useEffect, useState } from "react";
import LoadingState from "../../../components/LoadingState";

type Lookup = {
  _id: string;
  name?: string;
  classLevel?: { name?: string };
  session?: { name?: string };
};
type FeeSchedule = {
  _id: string;
  amount: number;
  dueDate: string;
  allowInstallments?: boolean;
  minimumInstallmentAmount?: number;
  publishedAt?: string;
  invoiceCount?: number;
  classSection?: Lookup;
  term?: Lookup;
};

function formatNaira(amount: number) {
  return `₦${amount.toLocaleString("en-NG")}`;
}

export default function FeeSchedulePage() {
  const [classes, setClasses] = useState<Lookup[]>([]);
  const [terms, setTerms] = useState<Lookup[]>([]);
  const [schedules, setSchedules] = useState<FeeSchedule[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const [lookupResponse, scheduleResponse] = await Promise.all([
      fetch("/api/admin/lookups"),
      fetch("/api/admin/fee-schedules"),
    ]);
    const lookupData = lookupResponse.ok ? await lookupResponse.json() : {};
    const scheduleData = scheduleResponse.ok ? await scheduleResponse.json() : {};
    setClasses(lookupData.classes ?? []);
    setTerms(lookupData.terms ?? []);
    setSchedules(scheduleData.schedules ?? []);
  };

  useEffect(() => {
    Promise.resolve()
      .then(load)
      .catch(() => setMessage("Unable to load fee options."))
      .finally(() => setLoading(false));
  }, []);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload = Object.fromEntries(new FormData(event.currentTarget));
    const response = await fetch("/api/admin/fee-schedules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...payload,
        amount: Number(payload.amount),
        minimumInstallmentAmount: payload.minimumInstallmentAmount
          ? Number(payload.minimumInstallmentAmount)
          : undefined,
        allowInstallments: payload.allowInstallments === "on",
        publish: payload.publish === "true",
      }),
    });
    const data = await response.json();
    setMessage(
      response.ok
        ? payload.publish === "true"
          ? `Fee published. ${data.generated ?? 0} invoice(s) created, ${data.updated ?? 0} updated.`
          : "Class fee schedule saved."
        : data.error,
    );
    if (response.ok) await load();
  }

  if (loading) return <LoadingState label="Loading fee setup..." />;

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,520px)_1fr]">
      <div>
        <p className="text-sm text-foreground/60">
          Define fees by academic session, term, and class. The selected term
          already belongs to an academic session.
        </p>
        <h2 className="mt-1 text-xl font-medium text-foreground">
          Class fee setup
        </h2>
        <form
          onSubmit={submit}
          className="mt-6 rounded-2xl border border-navy/10 bg-white p-6 sm:p-8"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
              Class
              <select
                required
                name="classSectionId"
                className="rounded-xl border border-black/10 bg-white px-4 py-3 font-normal"
              >
                {classes.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.classLevel?.name} {item.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
              Term
              <select
                required
                name="termId"
                className="rounded-xl border border-black/10 bg-white px-4 py-3 font-normal"
              >
                {terms.map((term) => (
                  <option key={term._id} value={term._id}>
                    {term.name} · {term.session?.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
              Amount
              <input
                required
                min="0"
                type="number"
                name="amount"
                placeholder="85000"
                className="rounded-xl border border-black/10 px-4 py-3 font-normal outline-none focus:border-blue"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
              Due date
              <input
                required
                type="date"
                name="dueDate"
                className="rounded-xl border border-black/10 px-4 py-3 font-normal outline-none focus:border-blue"
              />
            </label>
            <label className="flex items-center gap-3 rounded-xl border border-black/10 px-4 py-3 text-sm font-medium text-foreground sm:col-span-2">
              <input name="allowInstallments" type="checkbox" />
              Allow parents to pay in installments
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-foreground sm:col-span-2">
              Minimum installment amount
              <input
                min="0"
                type="number"
                name="minimumInstallmentAmount"
                placeholder="25000"
                className="rounded-xl border border-black/10 px-4 py-3 font-normal outline-none focus:border-blue"
              />
            </label>
          </div>
          {message && (
            <p className="mt-5 text-sm text-foreground/70">{message}</p>
          )}
          <div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-black/5 pt-5">
            <button
              type="submit"
              name="publish"
              value="false"
              className="rounded-full border border-navy/15 px-5 py-2.5 text-sm font-medium text-navy hover:bg-blue-light"
            >
              Save draft
            </button>
            <button
              type="submit"
              name="publish"
              value="true"
              className="rounded-full bg-blue px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              Publish and generate invoices
            </button>
          </div>
        </form>
      </div>

      <section className="rounded-2xl border border-navy/10 bg-white p-6">
        <h2 className="text-lg font-medium text-foreground">
          Recent fee schedules
        </h2>
        <div className="mt-4 divide-y divide-black/5">
          {schedules.length === 0 ? (
            <p className="py-8 text-sm text-foreground/60">
              No class fees have been defined yet.
            </p>
          ) : (
            schedules.map((schedule) => (
              <article key={schedule._id} className="py-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-medium text-foreground">
                      {schedule.classSection?.classLevel?.name}{" "}
                      {schedule.classSection?.name}
                    </h3>
                    <p className="mt-1 text-sm text-foreground/60">
                      {[schedule.term?.name, schedule.term?.session?.name]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  </div>
                  <span className="rounded-full bg-blue-light px-3 py-1 text-xs font-medium text-blue">
                    {schedule.publishedAt ? "Published" : "Draft"}
                  </span>
                </div>
                <div className="mt-3 grid gap-2 text-sm text-foreground/70 sm:grid-cols-2">
                  <p>Amount: {formatNaira(schedule.amount)}</p>
                  <p>
                    Due: {new Date(schedule.dueDate).toLocaleDateString()}
                  </p>
                  <p>
                    Installments:{" "}
                    {schedule.allowInstallments
                      ? `Allowed from ${formatNaira(schedule.minimumInstallmentAmount ?? 0)}`
                      : "Not allowed"}
                  </p>
                  <p>Invoices: {schedule.invoiceCount ?? 0}</p>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
