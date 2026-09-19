"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CalendarCheckIcon,
  Cancel01Icon,
  Certificate01Icon,
  Coins01Icon,
  DashboardSquare01Icon,
  Logout01Icon,
  Megaphone01Icon,
  Setting06Icon,
  StudentsIcon,
} from "@hugeicons/core-free-icons";

const navItems = [
  { label: "Overview", href: "/dashboard/parent", icon: DashboardSquare01Icon },
  {
    label: "My children",
    href: "/dashboard/parent/children",
    icon: StudentsIcon,
  },
  {
    label: "Fees & payments",
    href: "/dashboard/parent/fees",
    icon: Coins01Icon,
  },
  {
    label: "Results",
    href: "/dashboard/parent/results",
    icon: Certificate01Icon,
  },
  {
    label: "Attendance",
    href: "/dashboard/parent/attendance",
    icon: CalendarCheckIcon,
  },
  {
    label: "Announcements",
    href: "/dashboard/parent/announcements",
    icon: Megaphone01Icon,
  },
];

export default function ParentSidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const navRef = useRef<HTMLElement | null>(null);
  const itemRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const indicator = useRef({ top: 0, height: 0, visible: false });
  const indicatorRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const updateIndicator = () => {
      const nav = navRef.current;
      const activeItem = itemRefs.current[pathname];
      if (!nav || !activeItem) return;
      const navRect = nav.getBoundingClientRect();
      const itemRect = activeItem.getBoundingClientRect();
      indicator.current = {
        top: itemRect.top - navRect.top,
        height: itemRect.height,
        visible: true,
      };
      if (indicatorRef.current) {
        indicatorRef.current.style.height = `${itemRect.height}px`;
        indicatorRef.current.style.transform = `translateY(${indicator.current.top}px)`;
        indicatorRef.current.style.opacity = "1";
      }
    };
    updateIndicator();
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [pathname]);
  const closeOnMobile = () => {
    if (window.innerWidth < 1024) onClose();
  };
  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/portal/login");
  };
  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-navy/20 transition-opacity lg:hidden ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={onClose}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 transform-gpu flex-col bg-navy transition-transform lg:static lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-6 py-5">
          <Link
            href="/"
            onClick={closeOnMobile}
            className="text-base font-medium text-white"
          >
            School
          </Link>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="text-white lg:hidden"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={22} />
          </button>
        </div>
        <nav ref={navRef} className="relative mt-4 flex flex-1 flex-col pl-4">
          <div
            ref={indicatorRef}
            className="pointer-events-none absolute left-0 right-0 z-0 hidden rounded-l-full bg-white opacity-0 transition-[transform,height,opacity] duration-300 lg:block"
          >
            <span className="absolute -top-5 right-0 h-5 w-5 bg-white">
              <span className="block h-full w-full rounded-br-2xl bg-navy" />
            </span>
            <span className="absolute -bottom-5 right-0 h-5 w-5 bg-white">
              <span className="block h-full w-full rounded-tr-2xl bg-navy" />
            </span>
          </div>
          {navItems.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/dashboard/parent" &&
                pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                ref={(element) => {
                  itemRefs.current[item.href] = element;
                }}
                href={item.href}
                onClick={closeOnMobile}
                className={`relative z-10 mr-4 flex items-center gap-3 rounded-full py-3 pl-4 text-sm font-medium ${active ? "text-white/60 lg:font-semibold lg:text-navy" : "text-white/60 hover:bg-white/5 hover:text-white"}`}
              >
                <HugeiconsIcon icon={item.icon} size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-white/10 px-3 py-4">
          <Link
            href="/dashboard/parent/settings"
            onClick={closeOnMobile}
            className="flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium text-white/60 hover:bg-white/5 hover:text-white"
          >
            <HugeiconsIcon icon={Setting06Icon} size={20} />
            Settings
          </Link>
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-full px-4 py-2.5 text-left text-sm font-medium text-white/60 hover:bg-white/5 hover:text-white"
          >
            <HugeiconsIcon icon={Logout01Icon} size={20} />
            Log out
          </button>
        </div>
      </aside>
    </>
  );
}
