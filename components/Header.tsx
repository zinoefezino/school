"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Menu01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Academics", href: "#academics" },
  { label: "Admissions", href: "#admissions" },
  { label: "News", href: "#news" },
  { label: "Contact", href: "#contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

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
          <a
            href="/portal/login"
            className="rounded-full border border-slate-300 bg-transparent px-5 py-2.5 text-sm font-medium text-slate-800 transition-colors hover:border-blue hover:text-blue"
          >
            Portal access
          </a>
          <a
            href="#admissions"
            className="rounded-full bg-blue px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Apply now
          </a>
        </div>

        <button
          type="button"
          className="relative flex items-center justify-center text-navy transition-all duration-300 lg:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          <span
            className={`transition-all duration-300 ease-out ${
              open
                ? "rotate-90 scale-75 opacity-0"
                : "rotate-0 scale-100 opacity-100"
            }`}
          >
            <HugeiconsIcon icon={Menu01Icon} size={28} />
          </span>

          <span
            className={`absolute transition-all duration-300 ease-out ${
              open
                ? "rotate-0 scale-100 opacity-100"
                : "-rotate-90 scale-75 opacity-0"
            }`}
          >
            <HugeiconsIcon icon={Cancel01Icon} size={26} />
          </span>
        </button>
      </div>

      <div
        className={`fixed inset-0 z-40 bg-slate-950/30 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setOpen(false)}
      />

      <div
        className={`fixed inset-x-3 top-3 z-50 flex origin-top flex-col rounded-2xl bg-white px-6 py-6 shadow-2xl shadow-slate-950/15 transition-all duration-300 ease-out lg:hidden ${
          open
            ? "translate-y-0 scale-100 opacity-100"
            : "pointer-events-none -translate-y-4 scale-95 opacity-0"
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-lg font-medium text-slate-900">Menu</span>

          <button
            type="button"
            className="flex items-center justify-center text-slate-900 transition-all duration-300"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={24} />
          </button>
        </div>

        <nav className="mt-8 flex flex-col gap-1">
          {navLinks.map((link, index) => (
            <a
              key={link.label}
              href={link.href}
              className={`rounded-xl px-1 py-3 text-base font-medium text-slate-700 transition-all duration-300 hover:text-blue ${
                open ? "translate-x-0 opacity-100" : "-translate-x-3 opacity-0"
              }`}
              style={{ transitionDelay: open ? `${index * 45}ms` : "0ms" }}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="mt-8 flex flex-col gap-3 border-t border-slate-200 pt-6">
          <a
            href="/portal/login"
            className="rounded-full border border-slate-300 bg-transparent px-5 py-3 text-center text-sm font-medium text-slate-800 transition-colors hover:border-blue hover:text-blue"
            onClick={() => setOpen(false)}
          >
            Portal access
          </a>

          <a
            href="#admissions"
            className="rounded-full bg-blue px-6 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-blue-700"
            onClick={() => setOpen(false)}
          >
            Apply now
          </a>
        </div>
      </div>
    </header>
  );
}
