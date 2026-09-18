import { HugeiconsIcon } from "@hugeicons/react";
import {
  CalendarCheckIcon,
  CheckmarkCircle02Icon,
  CancelCircleIcon,
  Clock01Icon,
} from "@hugeicons/core-free-icons";
import { classStudents } from "../data";

const statusStyles: Record<string, string> = {
  Present: "text-[#3F7A5B]",
  Absent: "text-[#B4483B]",
  Late: "text-blue",
};
const statusIcons = {
  Present: CheckmarkCircle02Icon,
  Absent: CancelCircleIcon,
  Late: Clock01Icon,
};

export default function StaffAttendancePage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-foreground/60">
            Record attendance for your assigned class
          </p>
          <h2 className="mt-1 text-xl font-medium text-foreground">
            Attendance
          </h2>
        </div>
        <div className="flex flex-wrap gap-3">
          <select className="rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm text-foreground">
            <option>JSS1 Gold</option>
            <option>JSS2 Silver</option>
          </select>
          <input
            type="date"
            defaultValue="2026-09-18"
            className="rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm text-foreground"
          />
        </div>
      </div>
      <div className="flex items-center gap-2 rounded-2xl border border-navy/10 bg-white p-4 text-sm text-foreground/70">
        <HugeiconsIcon
          icon={CalendarCheckIcon}
          size={19}
          className="text-blue"
        />
        Attendance is ready to be saved for 38 students.
      </div>
      <div className="overflow-x-auto rounded-2xl border border-navy/10 bg-white">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-navy/10 text-xs font-medium uppercase tracking-wide text-foreground/50">
              <th className="px-6 py-3.5">Student</th>
              <th className="px-6 py-3.5">Admission no.</th>
              <th className="px-6 py-3.5">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {classStudents.map((student) => {
              const Icon =
                statusIcons[student.attendance as keyof typeof statusIcons];
              return (
                <tr key={student.admissionNumber} className="text-sm">
                  <td className="px-6 py-4 font-medium text-foreground">
                    {student.name}
                  </td>
                  <td className="px-6 py-4 text-foreground/60">
                    {student.admissionNumber}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      className={`flex items-center gap-2 font-medium ${statusStyles[student.attendance]}`}
                    >
                      <HugeiconsIcon icon={Icon} size={17} />
                      {student.attendance}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end">
        <button className="rounded-full bg-blue px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700">
          Save attendance
        </button>
      </div>
    </div>
  );
}
