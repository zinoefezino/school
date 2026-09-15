"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  Briefcase01Icon,
  ArrowRight01Icon,
  GraduationCapIcon,
  LocationUser01Icon,
  StudentsIcon,
} from "@hugeicons/core-free-icons";

const portalTypes = [
  {
    title: "Parent portal",
    description: "Track attendance, fees, and school updates.",
    icon: LocationUser01Icon,
    href: "/portal/parent",
  },
  {
    title: "Student portal",
    description: "Access lessons, timetable, and results.",
    icon: StudentsIcon,
    href: "/portal/student",
  },
  {
    title: "Staff portal",
    description: "Manage classes, reports, and communication.",
    icon: Briefcase01Icon,
    href: "/portal/staff",
  },
];

export default function PortalLogin() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-center px-6 py-16">
        <div className="w-full max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="grid gap-0 lg:grid-cols-[1.1fr_1.4fr]">
            <div className="flex flex-col justify-between bg-navy p-8 text-white lg:p-12">
              <a href="/" className="flex items-center gap-2.5">
                <span className="text-lg font-medium text-white">School</span>
              </a>

              <div className="mt-12 max-w-sm">
                <p className="text-3xl font-medium leading-tight">
                  Choose your portal to continue.
                </p>
                <p className="mt-4 text-sm leading-6 text-white/70">
                  Access the right tools for parents, students, and staff.
                </p>
              </div>

              <p className="mt-10 text-sm text-white/55">
                Need help? Contact the school office.
              </p>
            </div>

            <div className="p-8 lg:p-12">
              <div className="max-w-xl">
                <p className="text-sm font-medium uppercase bg-slate-100 inline-block px-3 py-1 rounded-full text-blue">
                  Portal access
                </p>
                <h1 className="mt-3 text-3xl font-medium text-slate-900">
                  Select your account type
                </h1>
                <p className="mt-3 text-base leading-7 text-slate-600">
                  Use the portal that matches your role to sign in securely.
                </p>

                <div className="mt-8 space-y-4">
                  {portalTypes.map((portal) => (
                    <a
                      key={portal.title}
                      href={portal.href}
                      className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-colors hover:border-blue hover:bg-blue-light"
                    >
                      <div className="flex items-center gap-4">
                        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-blue shadow-sm">
                          <HugeiconsIcon icon={portal.icon} size={22} />
                        </span>
                        <div>
                          <p className="text-base font-medium text-slate-900">
                            {portal.title}
                          </p>
                          <p className="mt-1 text-sm text-slate-600">
                            {portal.description}
                          </p>
                        </div>
                      </div>

                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm transition-transform group-hover:translate-x-1 group-hover:text-blue">
                        <HugeiconsIcon icon={ArrowRight01Icon} size={18} />
                      </span>
                    </a>
                  ))}
                </div>

                <p className="mt-8 text-sm text-slate-600">
                  New student or parent?{" "}
                  <a href="/#admissions" className="font-medium text-blue">
                    Start an application
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
