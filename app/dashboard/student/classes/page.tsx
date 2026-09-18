import { HugeiconsIcon } from "@hugeicons/react";
import { Book02Icon, TeacherIcon } from "@hugeicons/core-free-icons";
import { subjects, student, term } from "../data";

export default function ClassesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm text-foreground/60">
          {student.classSection} · {term.session}
        </p>
        <h2 className="mt-1 text-xl font-medium text-foreground">
          My subjects
        </h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {subjects.map((subject, index) => (
          <div
            key={subject}
            className="rounded-2xl border border-navy/10 bg-white p-5"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-light text-blue">
              <HugeiconsIcon icon={Book02Icon} size={20} />
            </span>
            <h3 className="mt-4 text-base font-medium text-foreground">
              {subject}
            </h3>
            <p className="mt-2 flex items-center gap-2 text-sm text-foreground/60">
              <HugeiconsIcon
                icon={TeacherIcon}
                size={16}
                className="text-blue"
              />{" "}
              {index % 2 === 0 ? "Mrs. Adaeze Nwosu" : "Mr. Emeka Obi"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
