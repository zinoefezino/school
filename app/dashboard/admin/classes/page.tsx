"use client";

import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon, StudentsIcon } from "@hugeicons/core-free-icons";
import ActionMenu from "../components/ActionMenu";
import LoadingState from "../../components/LoadingState";

type ClassRow = {
  _id: string;
  name: string;
  classLevel?: { name?: string };
  classTeacher?: { fullName?: string };
  studentCount: number;
};
export default function ClassesPage() {
  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch("/api/admin/classes")
      .then((response) => response.json())
      .then((data) => setClasses(data.classes ?? []))
      .finally(() => setLoading(false));
  }, []);
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-foreground/60">
          {classes.length} classes across all levels
        </p>
        <a
          href="/dashboard/admin/classes/new"
          className="flex items-center gap-2 rounded-full bg-blue px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          <HugeiconsIcon icon={Add01Icon} size={18} />
          Add class
        </a>
      </div>
      {loading ? (
        <LoadingState label="Loading classes..." />
      ) : classes.length === 0 ? (
        <p className="rounded-2xl bg-white p-6 text-sm text-foreground/60">
          No classes have been created yet.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {classes.map((cls) => (
            <div
              key={cls._id}
              className="rounded-2xl border border-navy/10 bg-white p-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-medium text-foreground">
                    {cls.classLevel?.name} {cls.name}
                  </h3>
                  <p className="mt-1 text-xs text-foreground/50">
                    Class teacher
                  </p>
                  <p className="mt-0.5 text-sm text-foreground/60">
                    {cls.classTeacher?.fullName ?? "Unassigned"}
                  </p>
                </div>
                <ActionMenu
                  label={`${cls.classLevel?.name} ${cls.name}`}
                  editHref={`/dashboard/admin/classes/${cls._id}/edit`}
                  deactivateHref={`/api/admin/classes/${cls._id}`}
                />
              </div>
              <div className="mt-5 flex items-center gap-2 text-sm text-foreground/70">
                <HugeiconsIcon
                  icon={StudentsIcon}
                  size={16}
                  className="text-blue"
                />
                {cls.studentCount} students
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
