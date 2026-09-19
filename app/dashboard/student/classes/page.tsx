"use client";

import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Book02Icon, TeacherIcon } from "@hugeicons/core-free-icons";
import LoadingState from "../../components/LoadingState";

type Subject = { _id: string; name: string; code?: string };
type Enrollment = {
  classSection?: { name?: string; classLevel?: { name?: string } };
  term?: { name?: string; session?: { name?: string } };
};

export default function ClassesPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/student/classes")
      .then(async (response) => (response.ok ? response.json() : null))
      .then((data) => {
        setSubjects(data?.subjects ?? []);
        setEnrollment(data?.enrollment ?? null);
      })
      .catch(() => {
        setSubjects([]);
        setEnrollment(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const className = enrollment?.classSection
    ? `${enrollment.classSection.classLevel?.name ?? ""} ${
        enrollment.classSection.name ?? ""
      }`.trim()
    : "Not assigned";
  const sessionName = enrollment?.term?.session?.name ?? "No active session";

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm text-foreground/60">
          {className} · {sessionName}
        </p>
        <h2 className="mt-1 text-xl font-medium text-foreground">
          My subjects
        </h2>
      </div>
      {loading ? (
        <LoadingState
          label="Loading subjects..."
          className="rounded-2xl bg-white p-6"
        />
      ) : subjects.length === 0 ? (
        <p className="rounded-2xl bg-white p-6 text-sm text-foreground/60">
          Subjects have not been added yet.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {subjects.map((subject) => (
            <div
              key={subject._id}
              className="rounded-2xl border border-navy/10 bg-white p-5"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-light text-blue">
                <HugeiconsIcon icon={Book02Icon} size={20} />
              </span>
              <h3 className="mt-4 text-base font-medium text-foreground">
                {subject.name}
              </h3>
              <p className="mt-2 flex items-center gap-2 text-sm text-foreground/60">
                <HugeiconsIcon
                  icon={TeacherIcon}
                  size={16}
                  className="text-blue"
                />
                {subject.code ?? "Subject"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
