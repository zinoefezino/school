import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft02Icon, UserAdd01Icon } from "@hugeicons/core-free-icons";
import AccountForm from "../../components/AccountForm";

export default function NewStudentPage() {
  return (
    <div className="max-w-3xl">
      <a
        href="/dashboard/admin/students"
        className="flex items-center gap-1.5 text-sm font-medium text-blue"
      >
        <HugeiconsIcon icon={ArrowLeft02Icon} size={16} />
        Back to students
      </a>
      <div className="mt-5">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-light text-blue">
            <HugeiconsIcon icon={UserAdd01Icon} size={20} />
          </span>
          <div>
            <h2 className="text-xl font-medium text-foreground">Add student</h2>
            <p className="mt-1 text-sm text-foreground/60">
              Create the student record and portal account.
            </p>
          </div>
        </div>
        <AccountForm role="STUDENT" />
      </div>
    </div>
  );
}
