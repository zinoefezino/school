"use client";

import { useState } from "react";

export default function ActionMenu({
  editHref,
  deactivateHref,
  label,
}: {
  editHref: string;
  deactivateHref: string;
  label: string;
}) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  async function deactivate() {
    setMessage("");
    const response = await fetch(deactivateHref, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: false }),
    });
    if (response.ok) {
      setMessage("Deactivated");
      setOpen(false);
      window.location.reload();
    } else {
      const data = await response.json();
      setMessage(data.error ?? "Unable to update");
    }
  }
  return (
    <div className="relative">
      <button
        type="button"
        aria-label={`More options for ${label}`}
        onClick={() => setOpen((current) => !current)}
        className="text-foreground/40 hover:text-foreground"
      >
        •••
      </button>
      {open && (
        <div className="absolute right-0 z-20 mt-2 w-36 rounded-xl border border-black/10 bg-white p-1 shadow-lg">
          <a
            href={editHref}
            className="block rounded-lg px-3 py-2 text-left text-sm text-foreground hover:bg-blue-light"
          >
            Edit
          </a>
          <button
            type="button"
            onClick={deactivate}
            className="block w-full rounded-lg px-3 py-2 text-left text-sm text-[#B4483B] hover:bg-[#B4483B]/5"
          >
            Deactivate
          </button>
          {message && (
            <span className="block px-3 py-2 text-xs text-[#B4483B]">
              {message}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
