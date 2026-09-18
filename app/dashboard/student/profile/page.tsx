import { HugeiconsIcon } from "@hugeicons/react";
import {
  Book02Icon,
  CakeIcon,
  Calendar03Icon,
  CalendarCheckIcon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { getAge, getStudentAvatar, student, term } from "../data";

const details = [
  { label: "Student", value: student.fullName, icon: UserIcon },
  { label: "Class", value: student.classSection, icon: Book02Icon },
  { label: "Term", value: term.name, icon: Calendar03Icon },
  { label: "Session", value: term.session, icon: CalendarCheckIcon },
  {
    label: "Age",
    value: `${getAge(student.dateOfBirth)} years`,
    icon: CakeIcon,
  },
];

export default function ProfilePage() {
  return (
    <div className="max-w-4xl rounded-2xl border border-navy/10 bg-white p-6 sm:p-8">
      <div className="flex items-center gap-5 border-b border-black/5 pb-6">
        <img
          src={getStudentAvatar(student.gender, student.admissionNumber)}
          alt={`${student.fullName}'s avatar`}
          className="h-20 w-20 rounded-full object-cover"
        />
        <div>
          <p className="text-sm text-foreground/50">Student profile</p>
          <h2 className="mt-1 text-xl font-medium text-foreground">
            {student.fullName}
          </h2>
          <p className="mt-1 text-sm text-foreground/60">
            Admission no. {student.admissionNumber}
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
    </div>
  );
}
