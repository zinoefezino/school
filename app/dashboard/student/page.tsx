"use client";

import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight02Icon,
  Book02Icon,
  CakeIcon,
  Calendar03Icon,
  CalendarCheckIcon,
  Certificate01Icon,
  Coins01Icon,
  Megaphone01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import LoadingState from "../components/LoadingState";
import StudentAvatar from "./components/StudentAvatar";

type StudentOverview = {
  fullName: string;
  admissionNumber: string;
  dateOfBirth: string;
  gender?: "male" | "female";
  attendance: number;
  feesBalance: number;
  average: number | null;
  term?: { name?: string; session?: { name?: string } };
  enrollment?: {
    classSection?: { name?: string; classLevel?: { name?: string } };
  };
};
type Announcement = { title: string; publishedAt: string };

export default function StudentDashboard() {
  const [data, setData] = useState<StudentOverview | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    Promise.all([
      fetch("/api/dashboard/student/overview").then(async (response) =>
        response.ok ? response.json() : null,
      ),
      fetch("/api/announcements").then(async (response) =>
        response.ok ? response.json() : null,
      ),
    ])
      .then(([overview, announcementData]) => {
        if (overview) setData(overview);
        if (announcementData) setAnnouncements(announcementData.announcements);
      })
      .finally(() => setLoading(false));
  }, []);
  if (loading)
    return <LoadingState label="Loading your dashboard..." />;
  if (!data)
    return (
      <div className="rounded-2xl border border-dashed border-navy/20 bg-white p-8 text-sm text-foreground/60">
        Your dashboard overview is not available yet. Please contact the school
        office to complete your student setup.
      </div>
    );
  const birthDate = new Date(data.dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const birthdayPassed =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() >= birthDate.getDate());
  if (!birthdayPassed) age -= 1;
  age = Math.max(0, age);
  const details = [
    { label: "Student", value: data.fullName, icon: UserIcon },
    {
      label: "Class",
      value: data.enrollment?.classSection
        ? `${data.enrollment.classSection.classLevel?.name ?? ""} ${data.enrollment.classSection.name ?? ""}`.trim()
        : "Not assigned",
      icon: Book02Icon,
    },
    {
      label: "Term",
      value: data.term?.name ?? "Not published",
      icon: Calendar03Icon,
    },
    {
      label: "Session",
      value: data.term?.session?.name ?? "Not published",
      icon: CalendarCheckIcon,
    },
    { label: "Age", value: `${age} years`, icon: CakeIcon },
  ];
  return (
    <div className="flex flex-col gap-8">
      <div className="rounded-2xl border border-navy/10 bg-white p-6">
        <div className="flex items-center gap-5">
          <StudentAvatar
            gender={data.gender}
            name={data.fullName}
            size="md"
          />
          <div>
            <p className="text-sm text-foreground/50">Student overview</p>
            <h1 className="mt-1 text-lg font-medium text-foreground">
              {data.fullName}
            </h1>
            <p className="mt-1 text-sm text-foreground/60">
              Admission no. {data.admissionNumber}
            </p>
          </div>
        </div>
        <div className="mt-6 grid gap-3 border-t border-black/5 pt-5 sm:grid-cols-2 lg:grid-cols-4">
          {details.map((detail) => (
            <div key={detail.label} className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-light text-blue">
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
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-navy/10 bg-white p-5">
          <HugeiconsIcon
            icon={CalendarCheckIcon}
            size={20}
            className="text-blue"
          />
          <p className="mt-4 text-2xl font-medium text-foreground">
            {data.attendance}%
          </p>
          <p className="mt-1 text-sm text-foreground/60">
            Attendance this term
          </p>
        </div>
        <div className="rounded-2xl border border-navy/10 bg-white p-5">
          <HugeiconsIcon icon={Coins01Icon} size={20} className="text-blue" />
          <p className="mt-4 text-2xl font-medium text-foreground">
            ₦{data.feesBalance.toLocaleString()}
          </p>
          <p className="mt-1 text-sm text-foreground/60">Fees balance</p>
        </div>
        <div className="rounded-2xl border border-navy/10 bg-white p-5">
          <HugeiconsIcon
            icon={Certificate01Icon}
            size={20}
            className="text-blue"
          />
          <p className="mt-4 text-2xl font-medium text-foreground">
            {data.average === null ? "-" : `${data.average}%`}
          </p>
          <p className="mt-1 text-sm text-foreground/60">Results average</p>
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-navy/10 bg-white p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-medium text-foreground">
              Today&apos;s classes
            </h2>
            <a
              href="/dashboard/student/timetable"
              className="flex items-center gap-1 text-sm font-medium text-blue"
            >
              Full timetable
              <HugeiconsIcon icon={ArrowRight02Icon} size={14} />
            </a>
          </div>
          <div className="mt-5 flex items-center gap-3 rounded-xl bg-blue-light/50 p-4 text-sm text-foreground/60">
            <HugeiconsIcon icon={Book02Icon} size={18} className="text-blue" />
            Your timetable will appear here once classes are scheduled.
          </div>
        </div>
        <div className="rounded-2xl border border-navy/10 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-medium text-foreground">
              Announcements
            </h2>
            <a
              href="/dashboard/student/announcements"
              className="text-sm font-medium text-blue"
            >
              See all
            </a>
          </div>
          <div className="mt-4 flex flex-col gap-4">
            {announcements.length === 0 ? (
              <p className="text-sm text-foreground/60">
                No announcements yet.
              </p>
            ) : (
              announcements.slice(0, 3).map((item) => (
                <div key={item.title} className="flex items-start gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-light text-blue">
                    <HugeiconsIcon icon={Megaphone01Icon} size={16} />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {item.title}
                    </p>
                    <p className="text-xs text-foreground/50">
                      {new Date(item.publishedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
