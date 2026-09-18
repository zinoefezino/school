import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft02Icon,
  LocationUser01Icon,
} from "@hugeicons/core-free-icons";
import AccountForm from "../../components/AccountForm";

export default function NewParentPage() {
  return (
    <div className="max-w-3xl">
      <a
        href="/dashboard/admin"
        className="flex items-center gap-1.5 text-sm font-medium text-blue"
      >
        <HugeiconsIcon icon={ArrowLeft02Icon} size={16} />
        Back to overview
      </a>
      <div className="mt-5">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-light text-blue">
            <HugeiconsIcon icon={LocationUser01Icon} size={20} />
          </span>
          <div>
            <h2 className="text-xl font-medium text-foreground">Add parent</h2>
            <p className="mt-1 text-sm text-foreground/60">
              Create a parent account before linking it to a student.
            </p>
          </div>
        </div>
        <AccountForm role="PARENT" />
      </div>
    </div>
  );
}
