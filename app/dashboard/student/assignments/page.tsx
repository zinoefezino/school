import { HugeiconsIcon } from "@hugeicons/react";
import {
  Calendar03Icon,
  CheckmarkCircle02Icon,
  TaskDaily01Icon,
} from "@hugeicons/core-free-icons";
import { assignments } from "../data";

const statusStyles: Record<string, string> = {
  Pending: "bg-blue-light text-blue",
  Submitted: "bg-[#3F7A5B]/10 text-[#3F7A5B]",
};

export default function AssignmentsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm text-foreground/60">
          Keep track of work from your teachers
        </p>
        <h2 className="mt-1 text-xl font-medium text-foreground">
          Assignments
        </h2>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-navy/10 bg-white">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-navy/10 text-xs font-medium uppercase tracking-wide text-foreground/50">
              <th className="px-6 py-3.5">Assignment</th>
              <th className="px-6 py-3.5">Subject</th>
              <th className="px-6 py-3.5">Due date</th>
              <th className="px-6 py-3.5">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {assignments.map((item) => (
              <tr key={item.title} className="text-sm">
                <td className="px-6 py-4 font-medium text-foreground">
                  <span className="flex items-center gap-2">
                    <HugeiconsIcon
                      icon={TaskDaily01Icon}
                      size={17}
                      className="text-blue"
                    />
                    {item.title}
                  </span>
                </td>
                <td className="px-6 py-4 text-foreground/70">{item.subject}</td>
                <td className="px-6 py-4 text-foreground/70">
                  <span className="flex items-center gap-2">
                    <HugeiconsIcon icon={Calendar03Icon} size={15} />
                    {item.due}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[item.status]}`}
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
