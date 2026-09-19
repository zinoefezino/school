"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Megaphone01Icon,
  Book02Icon,
  Calendar03Icon,
  Certificate01Icon,
  Cancel01Icon,
  DashboardSquare01Icon,
  Logout01Icon,
} from "@hugeicons/core-free-icons";
import {
  announcementReadStorageKey,
  unreadAnnouncementsFor,
} from "../../../../lib/announcements";

const navItems = [
  { label: "Overview", href: "/dashboard/staff", icon: DashboardSquare01Icon },
  { label: "My classes", href: "/dashboard/staff/classes", icon: Book02Icon },
  {
    label: "Attendance",
    href: "/dashboard/staff/attendance",
    icon: Calendar03Icon,
  },
  {
    label: "Timetable",
    href: "/dashboard/staff/timetable",
    icon: Calendar03Icon,
  },
  {
    label: "Assignments",
    href: "/dashboard/staff/assignments",
    icon: Book02Icon,
  },
  {
    label: "Results",
    href: "/dashboard/staff/results",
    icon: Certificate01Icon,
  },
  {
    label: "Announcements",
    href: "/dashboard/staff/announcements",
    icon: Megaphone01Icon,
  },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function StaffSidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/portal/login";
  };
  const [unreadAnnouncements, setUnreadAnnouncements] = useState(0);

  useEffect(() => {
    Promise.resolve().then(() => {
      const hasReadAnnouncements =
        window.localStorage.getItem(announcementReadStorageKey("STAFF")) ===
        "true";
      setUnreadAnnouncements(
        hasReadAnnouncements ? 0 : unreadAnnouncementsFor("STAFF"),
      );
    });
  }, [pathname]);
  const navRef = useRef<HTMLElement | null>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [indicator, setIndicator] = useState({
    top: 0,
    height: 0,
    visible: false,
  });
  const activeIndex = navItems.findIndex((item) =>
    item.href === "/dashboard/staff"
      ? pathname === item.href
      : pathname.startsWith(item.href),
  );

  const closeOnMobile = () => {
    if (window.innerWidth < 1024) onClose();
  };

  useEffect(() => {
    const updateIndicator = () => {
      const nav = navRef.current;
      const activeItem = itemRefs.current[activeIndex];
      if (!nav || !activeItem || activeIndex === -1) {
        setIndicator((current) => ({ ...current, visible: false }));
        return;
      }
      const navRect = nav.getBoundingClientRect();
      const itemRect = activeItem.getBoundingClientRect();
      setIndicator({
        top: itemRect.top - navRect.top,
        height: itemRect.height,
        visible: true,
      });
    };
    updateIndicator();
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [activeIndex, pathname]);

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-navy/20 transition-opacity lg:hidden ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={onClose}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 transform-gpu flex-col bg-navy transition-transform duration-300 lg:static lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-6 py-5">
          <Link
            href="/"
            onClick={closeOnMobile}
            className="flex items-center gap-2.5"
          >
            <span className="text-base font-medium text-white">School</span>
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
            className={`pointer-events-none absolute left-0 right-0 z-0 hidden rounded-l-full bg-white transition-[transform,height,opacity] duration-300 lg:block ${indicator.visible ? "opacity-100" : "opacity-0"}`}
            style={{
              height: indicator.height,
              transform: `translateY(${indicator.top}px)`,
            }}
          >
            <span className="absolute -top-5 right-0 h-5 w-5 bg-white">
              <span className="block h-full w-full rounded-br-2xl bg-navy" />
            </span>
            <span className="absolute -bottom-5 right-0 h-5 w-5 bg-white">
              <span className="block h-full w-full rounded-tr-2xl bg-navy" />
            </span>
          </div>
          {navItems.map((item, index) => {
            const isActive = index === activeIndex;
            return (
              <Link
                key={item.href}
                ref={(element) => {
                  itemRefs.current[index] = element;
                }}
                href={item.href}
                onClick={() => {
                  if (item.label === "Announcements") {
                    window.localStorage.setItem(
                      announcementReadStorageKey("STAFF"),
                      "true",
                    );
                    setUnreadAnnouncements(0);
                  }
                  closeOnMobile();
                }}
                className={`relative z-10 mr-4 flex items-center gap-3 rounded-full py-3 pl-4 text-sm font-medium transition-colors lg:mr-0 ${isActive ? "text-white/60 lg:font-semibold lg:text-navy" : "text-white/60 hover:bg-white/5 hover:text-white"}`}
              >
                <HugeiconsIcon icon={item.icon} size={20} />
                <span>{item.label}</span>
                {item.label === "Announcements" && unreadAnnouncements > 0 && (
                  <span className="ml-auto mr-3 rounded-full bg-blue px-2 py-0.5 text-[10px] font-semibold leading-4 text-white">
                    {unreadAnnouncements}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 px-3 py-4">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-full px-4 py-2.5 text-left text-sm font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-white"
          >
            <HugeiconsIcon icon={Logout01Icon} size={20} />
            Log out
          </button>
        </div>
      </aside>
    </>
  );
}
