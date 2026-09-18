import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, Briefcase01Icon } from "@hugeicons/core-free-icons";
import PortalLoginForm from "../components/PortalLoginForm";

export default function StaffPortalPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-10">
      <div className="mx-auto w-full max-w-md">
        <Link
          href="/portal/login"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-700"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
          Back to portals
        </Link>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-light text-blue">
              <HugeiconsIcon icon={Briefcase01Icon} size={24} />
            </span>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-blue">
                Staff portal
              </p>
              <h1 className="mt-1 text-2xl font-medium text-slate-900">
                Sign in
              </h1>
            </div>
          </div>
          <PortalLoginForm
            role="STAFF"
            identifierLabel="Work email"
            placeholder="name@fairviewacademy.com"
            submitLabel="Sign in to staff portal"
          />
        </div>
      </div>
    </div>
  );
}
