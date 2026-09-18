import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  MoreHorizontalIcon,
  Search01Icon,
  StudentsIcon,
} from "@hugeicons/core-free-icons";

const students = [
  {
    name: "Chidera Okafor",
    admissionNumber: "FA-2026-0142",
    classSection: "JSS1 Gold",
    guardian: "Mrs. Ngozi Okafor",
    status: "Active",
  },
  {
    name: "Tamuno Briggs",
    admissionNumber: "FA-2026-0138",
    classSection: "SS2 Diamond",
    guardian: "Mr. Briggs",
    status: "Active",
  },
  {
    name: "Amara Chukwu",
    admissionNumber: "FA-2026-0147",
    classSection: "Primary 4A",
    guardian: "Mrs. Chukwu",
    status: "Active",
  },
  {
    name: "David Effiong",
    admissionNumber: "FA-2026-0151",
    classSection: "SS3 Emerald",
    guardian: "Mr. Effiong",
    status: "Active",
  },
];

export default function StudentsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-foreground/60">1,204 enrolled students</p>
          <h2 className="mt-1 text-xl font-medium text-foreground">Students</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href="/dashboard/admin/students/promote"
            className="rounded-full border border-navy/15 px-5 py-2.5 text-sm font-medium text-navy hover:bg-blue-light"
          >
            Promote student
          </a>
          <a
            href="/dashboard/admin/students/new"
            className="flex items-center gap-2 rounded-full bg-blue px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            <HugeiconsIcon icon={Add01Icon} size={18} />
            Add student
          </a>
        </div>
      </div>
      <div className="flex w-full max-w-sm items-center gap-2 rounded-full border border-black/10 bg-white px-3.5 py-2.5">
        <HugeiconsIcon
          icon={Search01Icon}
          size={18}
          className="text-foreground/40"
        />
        <input
          type="search"
          placeholder="Search students..."
          className="w-full text-sm text-foreground outline-none placeholder:text-foreground/40"
        />
      </div>
      <div className="overflow-x-auto rounded-2xl border border-navy/10 bg-white">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-navy/10 text-xs font-medium uppercase tracking-wide text-foreground/50">
              <th className="px-6 py-3.5">Student</th>
              <th className="px-6 py-3.5">Admission no.</th>
              <th className="px-6 py-3.5">Class</th>
              <th className="px-6 py-3.5">Guardian</th>
              <th className="px-6 py-3.5">Status</th>
              <th className="px-6 py-3.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {students.map((student) => (
              <tr key={student.admissionNumber} className="text-sm">
                <td className="px-6 py-4">
                  <span className="flex items-center gap-3 font-medium text-foreground">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-light text-navy">
                      <HugeiconsIcon icon={StudentsIcon} size={16} />
                    </span>
                    {student.name}
                  </span>
                </td>
                <td className="px-6 py-4 text-foreground/70">
                  {student.admissionNumber}
                </td>
                <td className="px-6 py-4 text-foreground/70">
                  {student.classSection}
                </td>
                <td className="px-6 py-4 text-foreground/70">
                  {student.guardian}
                </td>
                <td className="px-6 py-4">
                  <span className="rounded-full bg-[#3F7A5B]/10 px-2.5 py-1 text-xs font-medium text-[#3F7A5B]">
                    {student.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    aria-label={`More options for ${student.name}`}
                    className="text-foreground/40 hover:text-foreground"
                  >
                    <HugeiconsIcon icon={MoreHorizontalIcon} size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
