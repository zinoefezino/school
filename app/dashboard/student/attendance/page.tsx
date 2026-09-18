import { HugeiconsIcon } from "@hugeicons/react";
import {
  CalendarCheckIcon,
  CheckmarkCircle02Icon,
  CancelCircleIcon,
} from "@hugeicons/core-free-icons";

const attendance = [
  { date: "Sep 18, 2026", subject: "Basic Science", status: "Present" },
  { date: "Sep 17, 2026", subject: "Mathematics", status: "Present" },
  { date: "Sep 16, 2026", subject: "English Language", status: "Absent" },
  { date: "Sep 15, 2026", subject: "Social Studies", status: "Present" },
];

export default function AttendancePage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-navy/10 bg-white p-5">
          <HugeiconsIcon
            icon={CalendarCheckIcon}
            size={22}
            className="text-blue"
          />
          <p className="mt-3 text-2xl font-medium text-foreground">94%</p>
          <p className="mt-1 text-sm text-foreground/60">
            Attendance this term
          </p>
        </div>
        <div className="rounded-2xl border border-navy/10 bg-white p-5">
          <HugeiconsIcon
            icon={CheckmarkCircle02Icon}
            size={22}
            className="text-[#3F7A5B]"
          />
          <p className="mt-3 text-2xl font-medium text-foreground">47</p>
          <p className="mt-1 text-sm text-foreground/60">Days present</p>
        </div>
        <div className="rounded-2xl border border-navy/10 bg-white p-5">
          <HugeiconsIcon
            icon={CancelCircleIcon}
            size={22}
            className="text-[#B4483B]"
          />
          <p className="mt-3 text-2xl font-medium text-foreground">3</p>
          <p className="mt-1 text-sm text-foreground/60">Days absent</p>
        </div>
      </div>
      <div>
        <p className="text-sm text-foreground/60">Recent attendance records</p>
        <h2 className="mt-1 text-xl font-medium text-foreground">
          Attendance history
        </h2>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-navy/10 bg-white">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-navy/10 text-xs font-medium uppercase tracking-wide text-foreground/50">
              <th className="px-6 py-3.5">Date</th>
              <th className="px-6 py-3.5">Subject</th>
              <th className="px-6 py-3.5">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {attendance.map((item) => (
              <tr key={`${item.date}-${item.subject}`} className="text-sm">
                <td className="px-6 py-4 text-foreground/70">{item.date}</td>
                <td className="px-6 py-4 font-medium text-foreground">
                  {item.subject}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={
                      item.status === "Present"
                        ? "text-[#3F7A5B]"
                        : "text-[#B4483B]"
                    }
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
