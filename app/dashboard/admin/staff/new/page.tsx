import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft02Icon, UserAdd01Icon } from "@hugeicons/core-free-icons";
import AccountForm from "../../components/AccountForm";

export default function NewStaffPage() {
  return (
    <div className="max-w-3xl">
      <a
        href="/dashboard/admin/staff"
        className="flex items-center gap-1.5 text-sm font-medium text-blue"
      >
        <HugeiconsIcon icon={ArrowLeft02Icon} size={16} />
        Back to staff
      </a>
      <div className="mt-5">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-light text-blue">
            <HugeiconsIcon icon={UserAdd01Icon} size={20} />
          </span>
          <div>
            <h2 className="text-xl font-medium text-foreground">
              Add staff member
            </h2>
            <p className="mt-1 text-sm text-foreground/60">
              Create a staff account for teaching and class assignments.
            </p>
          </div>
        </div>
        <AccountForm role="STAFF" />
      </div>
    </div>
  );
}
