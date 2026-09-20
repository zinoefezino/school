"use client";

import { useEffect, useMemo, useState } from "react";
import LoadingState from "../../../components/LoadingState";
import StatusMessage from "../../../components/StatusMessage";

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

function classLabel(item?: Lookup) {
  return [item?.classLevel?.name, item?.name].filter(Boolean).join(" ");
}

const pageSize = 8;
const classOptionLimit = 15;

export default function FeeSchedulePage() {
  const [classes, setClasses] = useState<Lookup[]>([]);
  const [terms, setTerms] = useState<Lookup[]>([]);
  const [schedules, setSchedules] = useState<FeeSchedule[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [classSearch, setClassSearch] = useState("");
  const [scheduleSearch, setScheduleSearch] = useState("");
  const [scheduleTermId, setScheduleTermId] = useState("");
  const [scheduleStatus, setScheduleStatus] = useState("");
  const [page, setPage] = useState(1);

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

  const filteredClasses = useMemo(() => {
    const search = classSearch.trim().toLowerCase();
    if (!search) return classes;
    return classes.filter((item) =>
      classLabel(item).toLowerCase().includes(search),
    );
  }, [classes, classSearch]);
  const visibleClasses = filteredClasses.slice(0, classOptionLimit);

  const filteredSchedules = useMemo(() => {
    const search = scheduleSearch.trim().toLowerCase();
    return schedules.filter((schedule) => {
      const matchesSearch = search
        ? [
            classLabel(schedule.classSection),
            schedule.term?.name,
            schedule.term?.session?.name,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase()
            .includes(search)
        : true;
      const matchesTerm = scheduleTermId
        ? schedule.term?._id === scheduleTermId
        : true;
      const matchesStatus =
        scheduleStatus === "published"
          ? Boolean(schedule.publishedAt)
          : scheduleStatus === "draft"
            ? !schedule.publishedAt
            : true;
      return matchesSearch && matchesTerm && matchesStatus;
    });
  }, [scheduleSearch, scheduleStatus, scheduleTermId, schedules]);

  const pageCount = Math.max(1, Math.ceil(filteredSchedules.length / pageSize));
  const visibleSchedules = filteredSchedules.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

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
            <label className="flex flex-col gap-2 text-sm font-medium text-foreground sm:col-span-2">
              Find class
              <input
                value={classSearch}
                onChange={(event) => setClassSearch(event.target.value)}
                placeholder="Search JSS1, SS2 Gold, Basic 4..."
                className="rounded-xl border border-black/10 px-4 py-3 font-normal outline-none focus:border-blue"
              />
              <span className="text-xs font-normal text-foreground/50">
                Showing {Math.min(filteredClasses.length, classOptionLimit)} of{" "}
                {filteredClasses.length} matching classes. Search to narrow it
                down.
              </span>
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
              Class
              <select
                required
                name="classSectionId"
                className="rounded-xl border border-black/10 bg-white px-4 py-3 font-normal"
              >
                {visibleClasses.length === 0 && (
                  <option value="" disabled>
                    No matching classes
                  </option>
                )}
                {visibleClasses.map((item) => (
                  <option key={item._id} value={item._id}>
                    {classLabel(item)}
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
            <StatusMessage className="mt-5">{message}</StatusMessage>
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
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-medium text-foreground">
              Fee schedules
            </h2>
            <p className="mt-1 text-sm text-foreground/60">
              Search, filter, and page through fee schedules instead of
              scrolling through everything.
            </p>
          </div>
          <span className="rounded-full bg-blue-light px-3 py-1 text-xs font-medium text-blue">
            {filteredSchedules.length} shown
          </span>
        </div>
        <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_180px_140px]">
          <input
            value={scheduleSearch}
            onChange={(event) => {
              setScheduleSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search class, term, or session"
            className="rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-blue"
          />
          <select
            value={scheduleTermId}
            onChange={(event) => {
              setScheduleTermId(event.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-blue"
          >
            <option value="">All terms</option>
            {terms.map((term) => (
              <option key={term._id} value={term._id}>
                {term.name} · {term.session?.name}
              </option>
            ))}
          </select>
          <select
            value={scheduleStatus}
            onChange={(event) => {
              setScheduleStatus(event.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-blue"
          >
            <option value="">All status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
        <div className="mt-4 divide-y divide-black/5">
          {filteredSchedules.length === 0 ? (
            <p className="py-8 text-sm text-foreground/60">
              No fee schedules match your filters.
            </p>
          ) : (
            visibleSchedules.map((schedule) => (
              <article key={schedule._id} className="py-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-medium text-foreground">
                      {classLabel(schedule.classSection)}
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
        {filteredSchedules.length > pageSize && (
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-black/5 pt-5 text-sm">
            <p className="text-foreground/60">
              Page {page} of {pageCount}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={page === 1}
                className="rounded-full border border-navy/15 px-4 py-2 font-medium text-navy disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() =>
                  setPage((current) => Math.min(pageCount, current + 1))
                }
                disabled={page === pageCount}
                className="rounded-full border border-navy/15 px-4 py-2 font-medium text-navy disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
