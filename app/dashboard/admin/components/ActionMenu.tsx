"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export default function ActionMenu({
  editHref,
  deactivateHref,
  label,
  isActive = true,
  onStatusChange,
}: {
  editHref: string;
  deactivateHref: string;
  label: string;
  isActive?: boolean;
  onStatusChange?: (isActive: boolean) => void;
}) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    Promise.resolve().then(() => setMounted(true));
  }, []);

  useEffect(() => {
    if (!open) return;
    const updatePosition = () => {
      const rect = buttonRef.current?.getBoundingClientRect();
      if (!rect) return;
      setPosition({
        top: rect.bottom + 8,
        left: Math.max(12, rect.right - 144),
      });
    };
    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent) => {
      if (buttonRef.current?.contains(event.target as Node)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  async function toggleLogin() {
    setMessage("");
    const response = await fetch(deactivateHref, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    });
    if (response.ok) {
      setMessage(isActive ? "Login disabled" : "Login enabled");
      onStatusChange?.(!isActive);
      setOpen(false);
    } else {
      const data = await response.json();
      setMessage(data.error ?? "Unable to update");
    }
  }

  const menu =
    open && mounted
      ? createPortal(
          <div
            className="fixed z-100 w-36 rounded-xl border border-black/10 bg-white p-1 text-left shadow-lg"
            style={{ top: position.top, left: position.left }}
          >
            <a
              href={editHref}
              className="block rounded-lg px-3 py-2 text-left text-sm text-foreground hover:bg-blue-light"
            >
              Edit
            </a>
            <button
              type="button"
              onClick={toggleLogin}
              className="block w-full rounded-lg px-3 py-2 text-left text-sm text-[#B4483B] hover:bg-[#B4483B]/5"
            >
              {isActive ? "Disable login" : "Enable login"}
            </button>
            {message && (
              <span className="block px-3 py-2 text-xs text-[#B4483B]">
                {message}
              </span>
            )}
          </div>,
          document.body,
        )
      : null;

  return (
    <div className="inline-flex">
      <button
        ref={buttonRef}
        type="button"
        aria-label={`More options for ${label}`}
        onClick={() => setOpen((current) => !current)}
        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-foreground/40 hover:bg-blue-light hover:text-foreground"
      >
        •••
      </button>
      {menu}
    </div>
  );
}
