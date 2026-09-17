import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  StudentsIcon,
  MoreHorizontalIcon,
} from "@hugeicons/core-free-icons";

const classes = [
  {
    classLevel: "JSS1",
    section: "Gold",
    teacher: "Mrs. Adaeze Nwosu",
    studentCount: 38,
  },
  {
    classLevel: "JSS2",
    section: "Silver",
    teacher: "Mr. Emeka Obi",
    studentCount: 41,
  },
  {
    classLevel: "SS2",
    section: "Diamond",
    teacher: "Mrs. Halima Yusuf",
    studentCount: 35,
  },
  {
    classLevel: "SS3",
    section: "Emerald",
    teacher: "Mr. Kelechi Uche",
    studentCount: 29,
  },
  {
    classLevel: "Primary 4",
    section: "A",
    teacher: "Mrs. Funke Adeyemi",
    studentCount: 33,
  },
];

export default function ClassesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-foreground/60">
          {classes.length} classes across all levels
        </p>

        <a
          href="/dashboard/admin/classes/new"
          className="flex items-center gap-2 rounded-full bg-blue px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <HugeiconsIcon icon={Add01Icon} size={18} />
          Add class
        </a>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {classes.map((cls) => (
          <div
            key={`${cls.classLevel}-${cls.section}`}
            className="rounded-2xl border border-navy/10 bg-white p-5"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-medium text-foreground">
                  {cls.classLevel} {cls.section}
                </h3>
                <p className="mt-1 text-sm text-foreground/60">{cls.teacher}</p>
              </div>
              <button
                aria-label="More options"
                className="text-foreground/40 hover:text-foreground"
              >
                <HugeiconsIcon icon={MoreHorizontalIcon} size={18} />
              </button>
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
    </div>
  );
}
