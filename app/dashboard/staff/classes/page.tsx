"use client";

import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Book02Icon,
  CalendarCheckIcon,
  Certificate01Icon,
  StudentsIcon,
} from "@hugeicons/core-free-icons";
import LoadingState from "../../components/LoadingState";

type AssignedClass = {
  id: string;
  classSection: string;
  studentCount: number;
  isClassTeacher: boolean;
  subjects?: { id: string; name: string }[];
  resultStatus: string;
};

export default function StaffClassesPage() {
  const [assignedClasses, setAssignedClasses] = useState<AssignedClass[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/staff/classes")
      .then(async (response) => (response.ok ? response.json() : null))
      .then((data) => setAssignedClasses(data?.classes ?? []))
      .catch(() => setAssignedClasses([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm text-foreground/60">
          Classes where you are the class head or assigned subject teacher
        </p>
        <h2 className="mt-1 text-xl font-medium text-foreground">My classes</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {loading ? (
          <LoadingState
            label="Loading assigned classes..."
            className="rounded-2xl bg-white p-6"
          />
        ) : assignedClasses.length === 0 ? (
          <p className="rounded-2xl bg-white p-6 text-sm text-foreground/60">
            No classes have been assigned to you yet.
          </p>
        ) : (
          assignedClasses.map((item) => (
          <article
            key={item.id}
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
                      Class head
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-foreground/60">
                  {item.subjects && item.subjects.length > 0
                    ? `Subject teacher: ${item.subjects.map((subject) => subject.name).join(", ")}`
                    : "Class assignment"}
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
          ))
        )}
      </div>
    </div>
  );
}
