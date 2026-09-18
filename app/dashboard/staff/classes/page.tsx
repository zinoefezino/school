import { HugeiconsIcon } from "@hugeicons/react";
import {
  Book02Icon,
  CalendarCheckIcon,
  Certificate01Icon,
  StudentsIcon,
} from "@hugeicons/core-free-icons";
import { assignedClasses } from "../data";

export default function StaffClassesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm text-foreground/60">
          Classes assigned to you by the school administrator
        </p>
        <h2 className="mt-1 text-xl font-medium text-foreground">My classes</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {assignedClasses.map((item) => (
          <article
            key={item.classSection}
            className="rounded-2xl border border-navy/10 bg-white p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-medium text-foreground">
                    {item.classSection}
                  </h3>
                  {item.isClassTeacher && (
                    <span className="rounded-full bg-blue-light px-2.5 py-1 text-xs font-medium text-blue">
                      Class teacher
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-foreground/60">
                  {item.subject}
                </p>
              </div>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-light text-blue">
                <HugeiconsIcon icon={Book02Icon} size={20} />
              </span>
            </div>
            <div className="mt-5 flex items-center gap-2 text-sm text-foreground/70">
              <HugeiconsIcon
                icon={StudentsIcon}
                size={16}
                className="text-blue"
              />
              {item.studentCount} students
            </div>
            <div className="mt-4 border-t border-black/5 pt-4">
              <p className="text-xs text-foreground/50">Result submission</p>
              <p
                className={`mt-1 text-sm font-medium ${item.resultStatus === "Needs changes" ? "text-[#B4483B]" : "text-foreground"}`}
              >
                {item.resultStatus}
              </p>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href="/dashboard/staff/attendance"
                className="flex items-center gap-1.5 text-sm font-medium text-navy"
              >
                <HugeiconsIcon icon={CalendarCheckIcon} size={16} />
                Attendance
              </a>
              <a
                href="/dashboard/staff/results"
                className="flex items-center gap-1.5 text-sm font-medium text-blue"
              >
                <HugeiconsIcon icon={Certificate01Icon} size={16} />
                Enter results
              </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
