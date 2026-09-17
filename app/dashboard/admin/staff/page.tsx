import { HugeiconsIcon } from "@hugeicons/react";
import {
  UserAdd01Icon,
  Search01Icon,
  MoreHorizontalIcon,
} from "@hugeicons/core-free-icons";

const staff = [
  {
    name: "Mrs. Adaeze Nwosu",
    department: "Mathematics",
    subjects: "Mathematics, Further Maths",
    phone: "+234 802 000 0001",
  },
  {
    name: "Mr. Emeka Obi",
    department: "Sciences",
    subjects: "Physics, Chemistry",
    phone: "+234 802 000 0002",
  },
  {
    name: "Mrs. Halima Yusuf",
    department: "Languages",
    subjects: "English, Literature",
    phone: "+234 802 000 0003",
  },
  {
    name: "Mr. Kelechi Uche",
    department: "Sports",
    subjects: "Physical Education",
    phone: "+234 802 000 0004",
  },
];

export default function StaffPage() {
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
            placeholder="Search staff..."
            className="w-56 text-sm text-foreground outline-none placeholder:text-foreground/40"
          />
        </div>

        <a
          href="/dashboard/admin/staff/new"
          className="flex items-center gap-2 rounded-full bg-blue px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <HugeiconsIcon icon={UserAdd01Icon} size={18} />
          Add staff
        </a>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-navy/10 bg-white">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-navy/10 text-xs font-medium uppercase tracking-wide text-foreground/50">
              <th className="px-6 py-3.5">Staff</th>
              <th className="px-6 py-3.5">Department</th>
              <th className="px-6 py-3.5">Subjects</th>
              <th className="px-6 py-3.5">Phone</th>
              <th className="px-6 py-3.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {staff.map((member) => (
              <tr key={member.phone} className="text-sm">
                <td className="flex items-center gap-3 whitespace-nowrap px-6 py-3.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-light text-xs font-medium text-navy">
                    {member.name
                      .replace("Mrs.", "")
                      .replace("Mr.", "")
                      .trim()
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                  <span className="font-medium text-foreground">
                    {member.name}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-3.5 text-foreground/70">
                  {member.department}
                </td>
                <td className="whitespace-nowrap px-6 py-3.5 text-foreground/70">
                  {member.subjects}
                </td>
                <td className="whitespace-nowrap px-6 py-3.5 text-foreground/70">
                  {member.phone}
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
