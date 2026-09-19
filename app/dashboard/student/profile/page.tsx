"use client";

import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Book02Icon,
  CakeIcon,
  Calendar03Icon,
  CalendarCheckIcon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import LoadingState from "../../components/LoadingState";
import StudentAvatar from "../components/StudentAvatar";

type StudentOverview = {
  fullName: string;
  admissionNumber: string;
  dateOfBirth: string;
  gender?: "male" | "female";
  term?: { name?: string; session?: { name?: string } };
  enrollment?: {
    classSection?: { name?: string; classLevel?: { name?: string } };
  };
  previousEnrollment?: {
    classSection?: { name?: string; classLevel?: { name?: string } };
  };
  academicStatus?: "ACTIVE" | "PROMOTED" | "COMPLETED" | "UNASSIGNED";
  guardian?: {
    fullName?: string;
    phone?: string;
    user?: { email?: string };
  };
};

function getAge(dateOfBirth: string) {
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const birthdayPassed =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() >= birthDate.getDate());
  if (!birthdayPassed) age -= 1;
  return Math.max(0, age);
}

export default function ProfilePage() {
  const [data, setData] = useState<StudentOverview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/student/overview")
      .then(async (response) => (response.ok ? response.json() : null))
      .then((overview) => setData(overview))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState label="Loading profile..." />;

  if (!data)
    return (
      <div className="rounded-2xl border border-dashed border-navy/20 bg-white p-8 text-sm text-foreground/60">
        Your student profile is not available yet. Please contact the school
        administrator.
      </div>
    );

  const className = data.enrollment?.classSection
    ? `${data.enrollment.classSection.classLevel?.name ?? ""} ${
        data.enrollment.classSection.name ?? ""
      }`.trim()
    : "Not assigned";
  const previousClass = data.previousEnrollment?.classSection
    ? `${data.previousEnrollment.classSection.classLevel?.name ?? ""} ${
        data.previousEnrollment.classSection.name ?? ""
      }`.trim()
    : "";
  const academicStatus =
    data.academicStatus === "PROMOTED" && previousClass
      ? `Promoted from ${previousClass}`
      : data.academicStatus === "COMPLETED"
        ? "Completed or graduated"
        : data.academicStatus === "UNASSIGNED"
          ? "Awaiting class assignment"
          : "Currently enrolled";
  const details = [
    { label: "Student", value: data.fullName, icon: UserIcon },
    { label: "Class", value: className, icon: Book02Icon },
    { label: "Academic status", value: academicStatus, icon: CalendarCheckIcon },
    { label: "Term", value: data.term?.name ?? "Not published", icon: Calendar03Icon },
    {
      label: "Session",
      value: data.term?.session?.name ?? "Not published",
      icon: CalendarCheckIcon,
    },
    {
      label: "Age",
      value: `${getAge(data.dateOfBirth)} years`,
      icon: CakeIcon,
    },
  ];

  return (
    <div className="max-w-4xl rounded-2xl border border-navy/10 bg-white p-6 sm:p-8">
      <div className="flex items-center gap-5 border-b border-black/5 pb-6">
        <StudentAvatar gender={data.gender} name={data.fullName} size="lg" />
        <div>
          <p className="text-sm text-foreground/50">Student profile</p>
          <h2 className="mt-1 text-xl font-medium text-foreground">
            {data.fullName}
          </h2>
          <p className="mt-1 text-sm text-foreground/60">
            Admission no. {data.admissionNumber}
          </p>
        </div>
      </div>
      <div className="grid gap-4 pt-6 sm:grid-cols-2">
        {details.map((detail) => (
          <div
            key={detail.label}
            className="flex items-center gap-3 rounded-xl bg-blue-light/50 p-4"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-blue">
              <HugeiconsIcon icon={detail.icon} size={17} />
            </span>
            <div>
              <p className="text-xs text-foreground/50">{detail.label}</p>
              <p className="mt-0.5 text-sm font-medium text-foreground">
                {detail.value}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 border-t border-black/5 pt-6">
        <h3 className="text-base font-medium text-foreground">
          Assigned parent
        </h3>
        {data.guardian ? (
          <div className="mt-4 rounded-xl bg-blue-light/50 p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-blue">
                <HugeiconsIcon icon={UserIcon} size={17} />
              </span>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {data.guardian.fullName ?? "Parent"}
                </p>
                <p className="mt-0.5 text-xs text-foreground/60">
                  {[data.guardian.user?.email, data.guardian.phone]
                    .filter(Boolean)
                    .join(" · ") || "No contact details available"}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <p className="mt-4 rounded-xl border border-dashed border-navy/20 p-4 text-sm text-foreground/60">
            No parent has been assigned to this student yet.
          </p>
        )}
      </div>
    </div>
  );
}
