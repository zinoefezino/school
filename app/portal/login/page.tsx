import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  Briefcase01Icon,
  LocationUser01Icon,
  Settings01Icon,
  StudentsIcon,
} from "@hugeicons/core-free-icons";

const portals = [
  {
    label: "Student portal",
    description: "Access classes, results, fees, and announcements.",
    href: "/portal/student",
    icon: StudentsIcon,
  },
  {
    label: "Staff portal",
    description: "Manage assigned classes, attendance, and results.",
    href: "/portal/staff",
    icon: Briefcase01Icon,
  },
  {
    label: "Parent portal",
    description: "Follow your child's progress and school updates.",
    href: "/portal/parent",
    icon: LocationUser01Icon,
  },
  {
    label: "Admin portal",
    description: "Manage students, staff, classes, and school settings.",
    href: "/portal/admin",
    icon: Settings01Icon,
  },
];

export default function PortalLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-10">
      <div className="w-full max-w-4xl">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-700"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
          Back to home
        </Link>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-light text-blue">
              <HugeiconsIcon icon={StudentsIcon} size={24} />
            </span>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-blue">
                Fairview Academy
              </p>
              <h1 className="mt-1 text-2xl font-medium text-slate-900">
                Choose your portal
              </h1>
            </div>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {portals.map((portal) => (
              <Link
                key={portal.href}
                href={portal.href}
                className="rounded-2xl border border-slate-200 p-4 transition-colors hover:border-blue hover:bg-blue-light/40"
              >
                <HugeiconsIcon
                  icon={portal.icon}
                  size={22}
                  className="text-blue"
                />
                <h2 className="mt-4 text-sm font-medium text-slate-900">
                  {portal.label}
                </h2>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  {portal.description}
                </p>
                <span className="mt-4 block text-xs font-medium text-blue">
                  Sign in
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
