import { HugeiconsIcon } from "@hugeicons/react";
import {
  Certificate01Icon,
  CheckmarkCircle02Icon,
  Upload01Icon,
} from "@hugeicons/core-free-icons";
import { classStudents } from "../data";

export default function StaffResultsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-foreground/60">
            Enter and submit continuous assessment and exam scores
          </p>
          <h2 className="mt-1 text-xl font-medium text-foreground">Results</h2>
        </div>
        <div className="flex gap-3">
          <select className="rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm text-foreground">
            <option>JSS1 Gold</option>
            <option>JSS2 Silver</option>
          </select>
          <select className="rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm text-foreground">
            <option>Mathematics</option>
          </select>
        </div>
      </div>
      <div className="flex items-start gap-3 rounded-2xl border border-[#B4483B]/20 bg-[#B4483B]/5 p-5">
        <HugeiconsIcon
          icon={Certificate01Icon}
          size={20}
          className="mt-0.5 shrink-0 text-[#B4483B]"
        />
        <div>
          <p className="text-sm font-medium text-foreground">
            This submission needs changes
          </p>
          <p className="mt-1 text-sm text-foreground/70">
            Review the CA1 scores flagged by the administrator, then submit
            again for approval.
          </p>
        </div>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-navy/10 bg-white">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-navy/10 text-xs font-medium uppercase tracking-wide text-foreground/50">
              <th className="px-6 py-3.5">Student</th>
              <th className="px-6 py-3.5">CA1 / 20</th>
              <th className="px-6 py-3.5">CA2 / 20</th>
              <th className="px-6 py-3.5">Exam / 60</th>
              <th className="px-6 py-3.5">Total / 100</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {classStudents.map((student) => (
              <tr key={student.admissionNumber} className="text-sm">
                <td className="whitespace-nowrap px-6 py-4 font-medium text-foreground">
                  {student.name}
                </td>
                <td className="px-6 py-4">
                  <input
                    type="number"
                    defaultValue={student.ca1}
                    min="0"
                    max="20"
                    className="w-20 rounded-lg border border-black/10 px-3 py-2 text-sm text-foreground outline-none focus:border-blue"
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="number"
                    defaultValue={student.ca2}
                    min="0"
                    max="20"
                    className="w-20 rounded-lg border border-black/10 px-3 py-2 text-sm text-foreground outline-none focus:border-blue"
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="number"
                    defaultValue={student.exam}
                    min="0"
                    max="60"
                    className="w-20 rounded-lg border border-black/10 px-3 py-2 text-sm text-foreground outline-none focus:border-blue"
                  />
                </td>
                <td className="px-6 py-4 font-medium text-foreground">
                  {student.ca1 + student.ca2 + student.exam}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap justify-end gap-3">
        <button className="flex items-center gap-2 rounded-full border border-navy/15 px-5 py-2.5 text-sm font-medium text-navy hover:bg-blue-light">
          <HugeiconsIcon icon={Upload01Icon} size={17} />
          Save draft
        </button>
        <button className="flex items-center gap-2 rounded-full bg-blue px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700">
          <HugeiconsIcon icon={CheckmarkCircle02Icon} size={17} />
          Submit for review
        </button>
      </div>
    </div>
  );
}
