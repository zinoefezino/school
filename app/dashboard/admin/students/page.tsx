import { HugeiconsIcon } from "@hugeicons/react";
import {
  UserAdd01Icon,
  Search01Icon,
  MoreHorizontalIcon,
} from "@hugeicons/core-free-icons";

const students = [
  {
    name: "Chidera Okafor",
    admissionNo: "FA-2026-0142",
    classSection: "JSS1 Gold",
    guardian: "Ngozi Okafor",
    status: "Active",
  },
  {
    name: "Tamuno Briggs",
    admissionNo: "FA-2025-0098",
    classSection: "SS2 Diamond",
    guardian: "Ebiere Briggs",
    status: "Active",
  },
  {
    name: "Amara Chukwu",
    admissionNo: "FA-2026-0143",
    classSection: "Primary 4",
    guardian: "Ifeoma Chukwu",
    status: "Active",
  },
  {
    name: "David Effiong",
    admissionNo: "FA-2024-0071",
    classSection: "SS3 Emerald",
    guardian: "Grace Effiong",
    status: "Inactive",
  },
  {
    name: "Zainab Bello",
    admissionNo: "FA-2026-0144",
    classSection: "JSS2 Silver",
    guardian: "Musa Bello",
    status: "Active",
  },
];

const statusStyles: Record<string, string> = {
  Active: "bg-[#3F7A5B]/10 text-[#3F7A5B]",
  Inactive: "bg-foreground/5 text-foreground/50",
};

export default function StudentsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 rounded-full border border-black/10 bg-white px-3.5 py-2">
          <HugeiconsIcon
            icon={Search01Icon}
            size={18}
            className="text-foreground/40"
          />
          <input
            type="text"
            placeholder="Search students..."
            className="w-56 text-sm text-foreground outline-none placeholder:text-foreground/40"
          />
        </div>

        <a
          href="/dashboard/admin/students/new"
          className="flex items-center gap-2 rounded-full bg-blue px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <HugeiconsIcon icon={UserAdd01Icon} size={18} />
          Add student
        </a>
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
              <tr key={student.admissionNo} className="text-sm">
                <td className="flex items-center gap-3 whitespace-nowrap px-6 py-3.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-light text-xs font-medium text-navy">
                    {student.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                  <span className="font-medium text-foreground">
                    {student.name}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-3.5 text-foreground/70">
                  {student.admissionNo}
                </td>
                <td className="whitespace-nowrap px-6 py-3.5 text-foreground/70">
                  {student.classSection}
                </td>
                <td className="whitespace-nowrap px-6 py-3.5 text-foreground/70">
                  {student.guardian}
                </td>
                <td className="whitespace-nowrap px-6 py-3.5">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[student.status]}`}
                  >
                    {student.status}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-3.5 text-right">
                  <button
                    aria-label="More options"
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
