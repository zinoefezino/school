import { HugeiconsIcon } from "@hugeicons/react";
import {
  CalendarCheckIcon,
  Coins01Icon,
  TaskDaily01Icon,
  Calendar03Icon,
  ArrowRight02Icon,
  Megaphone01Icon,
} from "@hugeicons/core-free-icons";

// Placeholder — will come from the Student, ClassSection, and Term documents once wired up
const student = {
  fullName: "Chidera Okafor",
  admissionNumber: "FA-2026-0142",
  classSection: "JSS1 Gold",
  dateOfBirth: new Date("2013-04-12"),
  photoUrl: null as string | null, // real Cloudinary URL once uploads are wired up
};

const term = {
  name: "First Term",
  session: "2026/2027",
};

const stats = [
  { label: "Attendance this term", value: "94%", icon: CalendarCheckIcon },
  { label: "Fees balance", value: "₦0", icon: Coins01Icon },
  { label: "Pending assignments", value: "2", icon: TaskDaily01Icon },
];

const todayTimetable = [
  { time: "8:00 AM", subject: "Mathematics", room: "Room 4" },
  { time: "9:40 AM", subject: "English Language", room: "Room 4" },
  { time: "11:20 AM", subject: "Basic Science", room: "Lab 1" },
];

const announcements = [
  { title: "Mid-term break notice", date: "Sep 15, 2026" },
  { title: "Inter-house sports day", date: "Sep 2, 2026" },
];

function getAge(dob: Date) {
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const hasHadBirthdayThisYear =
    today.getMonth() > dob.getMonth() ||
    (today.getMonth() === dob.getMonth() && today.getDate() >= dob.getDate());
  if (!hasHadBirthdayThisYear) age -= 1;
  return age;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("");
}

export default function StudentDashboard() {
  return (
    <div className="flex flex-col gap-8">
      {/* Profile summary */}
      <div className="rounded-2xl border border-navy/10 bg-white p-6">
        <div className="flex flex-wrap items-center gap-5">
          {student.photoUrl ? (
            <img
              src={student.photoUrl}
              alt={student.fullName}
              className="h-16 w-16 rounded-full object-cover"
            />
          ) : (
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-blue-light text-lg font-medium text-navy">
              {getInitials(student.fullName)}
            </span>
          )}

          <div className="flex-1">
            <h1 className="text-lg font-medium text-foreground">
              {student.fullName}
            </h1>
            <p className="mt-1 text-sm text-foreground/60">
              {student.admissionNumber} · {student.classSection} ·{" "}
              {getAge(student.dateOfBirth)} yrs
            </p>
          </div>

          <div className="text-right text-sm text-foreground/70">
            <p className="font-medium text-foreground">{term.name}</p>
            <p className="text-foreground/50">{term.session}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-navy/10 bg-white p-5"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-light text-blue">
              <HugeiconsIcon icon={stat.icon} size={20} />
            </span>
            <p className="mt-4 text-2xl font-medium text-foreground">
              {stat.value}
            </p>
            <p className="mt-1 text-sm text-foreground/60">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-navy/10 bg-white p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-medium text-foreground">
              Today's classes
            </h2>
            <a
              href="/dashboard/student/timetable"
              className="flex items-center gap-1 text-sm font-medium text-blue"
            >
              Full timetable
              <HugeiconsIcon icon={ArrowRight02Icon} size={14} />
            </a>
          </div>
          <div className="mt-4 divide-y divide-black/5">
            {todayTimetable.map((slot) => (
              <div
                key={slot.time}
                className="flex items-center gap-4 py-3.5 first:pt-0"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-light text-blue">
                  <HugeiconsIcon icon={Calendar03Icon} size={16} />
                </span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {slot.subject}
                  </p>
                  <p className="text-xs text-foreground/50">{slot.room}</p>
                </div>
                <span className="text-sm text-foreground/60">{slot.time}</span>
              </div>
            ))}
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
            {announcements.map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-light text-blue">
                  <HugeiconsIcon icon={Megaphone01Icon} size={16} />
                </span>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {item.title}
                  </p>
                  <p className="text-xs text-foreground/50">{item.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
