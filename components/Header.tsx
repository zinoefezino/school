"use client";

import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  Cancel01Icon,
  Menu01Icon,
} from "@hugeicons/core-free-icons";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Academics", href: "#academics" },
  { label: "Admissions", href: "#admissions" },
  { label: "News", href: "#news" },
  { label: "Contact", href: "#contact" },
];

const portalLinks = [
  { label: "Staff", href: "/portal/staff" },
  { label: "Students", href: "/portal/student" },
  { label: "Parents", href: "/portal/parent" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [portalOpen, setPortalOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/5 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#" className="flex items-center gap-2.5">
          <span className="text-lg font-medium text-navy">School</span>
        </a>

        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-foreground/70 transition-colors hover:text-blue"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-6 lg:flex">
          <div className="relative">
            <button
              type="button"
              className="flex items-center gap-2 rounded-full border border-slate-300 bg-transparent px-5 py-2.5 text-sm font-medium text-slate-800 transition-colors hover:border-blue hover:text-blue"
              onClick={() => setPortalOpen((value) => !value)}
              aria-expanded={portalOpen}
              aria-haspopup="menu"
            >
              Login
              <HugeiconsIcon
                icon={Add01Icon}
                size={17}
                className={`transition-transform ${portalOpen ? "rotate-45" : ""}`}
              />
            </button>

            {portalOpen && (
              <div
                className="absolute right-0 top-full z-10 mt-3 w-44 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg shadow-slate-900/10"
                role="menu"
              >
                {portalLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="block rounded-xl px-3 py-2.5 text-sm text-slate-700 transition-colors hover:bg-blue-light hover:text-blue"
                    role="menuitem"
                    onClick={() => setPortalOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            )}
          </div>
          <a
            href="#admissions"
            className="rounded-full bg-blue px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Apply now
          </a>
        </div>

        <button
          type="button"
          className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 text-navy transition-colors duration-300 hover:border-blue hover:text-blue active:scale-95 lg:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          <HugeiconsIcon icon={Menu01Icon} size={28} />
        </button>
      </div>

      <div
        className={`fixed inset-0 z-40 bg-slate-950/30 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setOpen(false)}
      />

      <aside
        className={`fixed left-0 top-0 z-50 flex h-dvh w-[82vw] max-w-sm flex-col bg-white px-6 py-6 shadow-2xl shadow-slate-950/20 transition-transform duration-300 ease-out lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-lg font-medium text-slate-900">School</span>

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 text-slate-900 transition-colors duration-300 hover:border-blue hover:text-blue active:scale-95"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={24} />
          </button>
        </div>

        <nav className="mt-10 flex flex-col gap-1">
          {navLinks.map((link, index) => (
            <a
              key={link.label}
              href={link.href}
              className={`rounded-xl px-1 py-3 text-base font-medium text-slate-700 transition-all duration-300 hover:text-blue ${
                open ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"
              }`}
              style={{ transitionDelay: open ? `${index * 45}ms` : "0ms" }}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="mt-5 flex flex-col gap-3 border-t border-slate-200 pt-5">
          <div>
            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-full border border-slate-300 bg-transparent px-5 py-3 text-sm font-medium text-slate-800 transition-colors hover:border-blue hover:text-blue"
              onClick={() => setPortalOpen((value) => !value)}
              aria-expanded={portalOpen}
              aria-haspopup="menu"
            >
              Login
              <HugeiconsIcon
                icon={Add01Icon}
                size={18}
                className={`transition-transform ${portalOpen ? "rotate-45" : ""}`}
              />
            </button>

            {portalOpen && (
              <div
                className="mt-2 space-y-1 rounded-2xl border border-slate-200 bg-slate-50 p-2"
                role="menu"
              >
                {portalLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="block rounded-xl px-3 py-2.5 text-sm text-slate-700 transition-colors hover:bg-white hover:text-blue"
                    role="menuitem"
                    onClick={() => {
                      setPortalOpen(false);
                      setOpen(false);
                    }}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            )}
          </div>

          <a
            href="#admissions"
            className="rounded-full bg-blue px-6 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-blue-700"
            onClick={() => setOpen(false)}
          >
            Apply now
          </a>
        </div>
      </aside>
    </header>
  );
}
