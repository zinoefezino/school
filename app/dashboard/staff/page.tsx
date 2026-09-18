import { HugeiconsIcon } from "@hugeicons/react";
import {
  Book02Icon,
  StudentsIcon,
  CalendarCheckIcon,
  Alert02Icon,
  ArrowRight02Icon,
} from "@hugeicons/core-free-icons";

// Placeholder — will come from Staff.subjects + Enrollment once wired to MongoDB
const myClasses = [
  { classSection: "JSS1 Gold", subject: "Mathematics", studentCount: 38 },
  { classSection: "JSS2 Silver", subject: "Mathematics", studentCount: 41 },
];

// Placeholder — a ResultSubmission with status "REJECTED" for this teacher
const needsAttention = [
  {
    subject: "Mathematics",
    classSection: "JSS1 Gold",
    note: "CA1 scores for 3 students look too high compared to their exam scores — please double check.",
  },
];

export default function StaffOverview() {
  return (
    <div className="flex flex-col gap-8">
      {needsAttention.length > 0 && (
        <div className="flex flex-col gap-3 rounded-2xl border border-[#B4483B]/20 bg-[#B4483B]/5 p-5">
          {needsAttention.map((item) => (
            <div
              key={item.subject + item.classSection}
              className="flex items-start gap-3"
            >
              <HugeiconsIcon
                icon={Alert02Icon}
                size={20}
                className="mt-0.5 shrink-0 text-[#B4483B]"
              />
              <div>
                <p className="text-sm font-medium text-foreground">
                  {item.subject} — {item.classSection} was sent back for changes
                </p>
                <p className="mt-1 text-sm text-foreground/70">{item.note}</p>
                <a
                  href="/dashboard/staff/classes"
                  className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-[#B4483B]"
                >
                  Review and resubmit
                  <HugeiconsIcon icon={ArrowRight02Icon} size={14} />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      <div>
        <h2 className="text-base font-medium text-foreground">My classes</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {myClasses.map((cls) => (
            <div
              key={cls.classSection + cls.subject}
              className="rounded-2xl border border-navy/10 bg-white p-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-medium text-foreground">
                    {cls.subject}
                  </h3>
                  <p className="mt-1 text-sm text-foreground/60">
                    {cls.classSection}
                  </p>
                </div>
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-light text-blue">
                  <HugeiconsIcon icon={Book02Icon} size={20} />
                </span>
              </div>

              <div className="mt-5 flex items-center gap-2 text-sm text-foreground/70">
                <HugeiconsIcon
                  icon={StudentsIcon}
                  size={16}
                  className="text-blue"
                />
                {cls.studentCount} students
              </div>

              <div className="mt-4 flex gap-3 border-t border-black/5 pt-4">
                <a
                  href="/dashboard/staff/attendance"
                  className="flex items-center gap-1.5 text-sm font-medium text-navy"
                >
                  <HugeiconsIcon icon={CalendarCheckIcon} size={16} />
                  Take attendance
                </a>
                <a
                  href="/dashboard/staff/classes"
                  className="flex items-center gap-1.5 text-sm font-medium text-blue"
                >
                  <HugeiconsIcon icon={Book02Icon} size={16} />
                  Enter results
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
