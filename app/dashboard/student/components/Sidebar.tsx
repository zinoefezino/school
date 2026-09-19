"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  DashboardSquare01Icon,
  IdCardIcon,
  Book02Icon,
  Calendar03Icon,
  TaskDaily01Icon,
  Certificate01Icon,
  CalendarCheckIcon,
  Coins01Icon,
  Invoice01Icon,
  Megaphone01Icon,
  Logout01Icon,
  Cancel01Icon,
  ChevronDownIcon,
  Setting06Icon,
  PanelLeftCloseIcon,
  PanelLeftOpenIcon,
} from "@hugeicons/core-free-icons";
import {
  studentReadResultTermsStorageKey,
} from "../../../../lib/announcements";

type NavItem = {
  label: string;
  href: string;
  icon: typeof DashboardSquare01Icon;
};

type NavGroup = {
  label: string;
  icon: typeof DashboardSquare01Icon;
  children: NavItem[];
};

const topLevel: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard/student",
    icon: DashboardSquare01Icon,
  },
  { label: "Profile", href: "/dashboard/student/profile", icon: IdCardIcon },
];

const groups: NavGroup[] = [
  {
    label: "Academics",
    icon: Book02Icon,
    children: [
      {
        label: "Classes",
        href: "/dashboard/student/classes",
        icon: Book02Icon,
      },
      {
        label: "Timetable",
        href: "/dashboard/student/timetable",
        icon: Calendar03Icon,
      },
      {
        label: "Assignments",
        href: "/dashboard/student/assignments",
        icon: TaskDaily01Icon,
      },
      {
        label: "Results",
        href: "/dashboard/student/results",
        icon: Certificate01Icon,
      },
      {
        label: "Attendance",
        href: "/dashboard/student/attendance",
        icon: CalendarCheckIcon,
      },
    ],
  },
  {
    label: "Fees",
    icon: Coins01Icon,
    children: [
      {
        label: "Current bill",
        href: "/dashboard/student/fees",
        icon: Coins01Icon,
      },
      {
        label: "Payment history",
        href: "/dashboard/student/payment-history",
        icon: Invoice01Icon,
      },
    ],
  },
];

const bottomLevel: NavItem[] = [
  {
    label: "Announcements",
    href: "/dashboard/student/announcements",
    icon: Megaphone01Icon,
  },
  {
    label: "Settings",
    href: "/dashboard/student/settings",
    icon: Setting06Icon,
  },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

function groupForPath(pathname: string) {
  return (
    groups.find((g) => g.children.some((c) => c.href === pathname))?.label ??
    null
  );
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/portal/login");
  };
  const [badges, setBadges] = useState({ announcements: 0, results: 0 });
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const readArray = (key: string) => {
      try {
        const value = window.localStorage.getItem(key);
        return value ? (JSON.parse(value) as string[]) : [];
      } catch {
        return [];
      }
    };
    Promise.all([
      fetch("/api/announcements/unread").then(async (response) =>
        response.ok ? response.json() : { announcements: 0 },
      ),
      fetch("/api/dashboard/student/results").then(async (response) =>
        response.ok ? response.json() : { periods: [] },
      ),
    ])
      .then(([announcementData, resultData]) => {
        const readResultTerms = new Set(
          readArray(studentReadResultTermsStorageKey()),
        );
        setBadges({
          announcements: announcementData.announcements ?? 0,
          results: (resultData.periods ?? []).filter(
            (period: { termId?: string }) =>
              period.termId && !readResultTerms.has(period.termId),
          ).length,
        });
      })
      .catch(() => setBadges({ announcements: 0, results: 0 }));
  }, [pathname]);
  const navRef = useRef<HTMLElement | null>(null);
  const itemRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [openGroup, setOpenGroup] = useState<string | null>(
    groupForPath(pathname) ?? "Academics",
  );
  const [indicator, setIndicator] = useState({
    top: 0,
    height: 0,
    visible: false,
  });

  useEffect(() => {
    const match = groupForPath(pathname);
    if (match) Promise.resolve().then(() => setOpenGroup(match));
  }, [pathname]);

  const closeOnMobile = () => {
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  useEffect(() => {
    const updateIndicator = () => {
      const nav = navRef.current;
      const activeItem = itemRefs.current[pathname];

      if (!nav || !activeItem) {
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

    return () => {
      window.removeEventListener("resize", updateIndicator);
    };
  }, [pathname, openGroup, collapsed]);

  const renderLink = (item: NavItem, indent = false) => {
    const isActive = pathname === item.href;

    return (
      <Link
        key={item.href}
        ref={(el) => {
          itemRefs.current[item.href] = el;
        }}
        href={item.href}
        onClick={() => {
          closeOnMobile();
        }}
        title={collapsed ? item.label : undefined}
        className={`relative z-10 mr-4 flex items-center gap-3 rounded-full py-3 pl-4 text-sm font-medium transition-colors duration-200 ease-out hover:bg-white/5 hover:text-white lg:mr-0 lg:hover:bg-transparent ${
          isActive
            ? "text-white/60 lg:font-semibold lg:text-navy"
            : "text-white/60"
        } ${indent && !collapsed ? "ml-4" : ""} ${collapsed ? "lg:justify-center lg:pl-0" : ""}`}
      >
        <HugeiconsIcon icon={item.icon} size={20} />
        <span className={collapsed ? "lg:hidden" : ""}>{item.label}</span>
        {item.label === "Announcements" && badges.announcements > 0 && (
          <span
            className={`rounded-full bg-blue px-2 py-0.5 text-[10px] font-semibold leading-4 text-white ${
              collapsed ? "lg:absolute lg:right-1 lg:top-1" : "ml-auto mr-3"
            }`}
          >
            {badges.announcements}
          </span>
        )}
        {item.label === "Results" && badges.results > 0 && (
          <span
            className={`rounded-full bg-blue px-2 py-0.5 text-[10px] font-semibold leading-4 text-white ${
              collapsed ? "lg:absolute lg:right-1 lg:top-1" : "ml-auto mr-3"
            }`}
          >
            {badges.results}
          </span>
        )}
      </Link>
    );
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-navy/20 transition-opacity duration-300 ease-out lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 transform-gpu flex-col bg-navy transition-[width,transform] duration-300 ease-out lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        } ${collapsed ? "lg:w-20" : "lg:w-64"}`}
      >
        <div className="flex items-center justify-between px-6 py-5 lg:px-4">
          <Link
            href="/"
            onClick={closeOnMobile}
            className="flex items-center gap-2.5"
          >
            <span
              className={`text-base font-medium text-white ${collapsed ? "lg:hidden" : ""}`}
            >
              School
            </span>
          </Link>

          <button
            type="button"
            onClick={() => setCollapsed((current) => !current)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="hidden rounded-full p-1.5 text-white/60 hover:bg-white/5 hover:text-white lg:block"
          >
            <HugeiconsIcon
              icon={collapsed ? PanelLeftOpenIcon : PanelLeftCloseIcon}
              size={18}
            />
          </button>

          <button
            onClick={onClose}
            aria-label="Close menu"
            className="text-white lg:hidden"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={22} />
          </button>
        </div>

        <nav
          ref={navRef}
          className={`relative mt-4 flex flex-1 flex-col ${collapsed ? "lg:pl-3" : "pl-4"}`}
        >
          <div
            className={`pointer-events-none absolute left-0 right-0 z-0 hidden rounded-l-full bg-white transition-[transform,height,opacity] duration-300 ease-out lg:block ${
              indicator.visible ? "opacity-100" : "opacity-0"
            }`}
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

          {topLevel.map((item) => renderLink(item))}

          {groups.map((group) => {
            const isOpen = openGroup === group.label;
            const groupActive = group.children.some((c) => c.href === pathname);

            return (
              <div key={group.label} className="relative z-10">
                <button
                  onClick={() => setOpenGroup(isOpen ? null : group.label)}
                  title={collapsed ? group.label : undefined}
                  className={`mr-4 flex w-full items-center justify-between rounded-full py-3 pl-4 pr-4 text-sm font-medium transition-colors duration-200 ease-out hover:bg-white/5 hover:text-white lg:mr-0 ${
                    groupActive ? "text-white" : "text-white/60"
                  } ${collapsed ? "lg:justify-center lg:pl-0 lg:pr-0" : ""}`}
                >
                  <span className="flex items-center gap-3">
                    <HugeiconsIcon icon={group.icon} size={20} />
                    <span className={collapsed ? "lg:hidden" : ""}>
                      {group.label}
                    </span>
                  </span>
                  <HugeiconsIcon
                    icon={ChevronDownIcon}
                    size={16}
                    className={`transition-transform ${isOpen ? "rotate-180" : ""} ${collapsed ? "lg:hidden" : ""}`}
                  />
                </button>

                {isOpen && (
                  <div className="flex flex-col">
                    {group.children.map((child) => renderLink(child, true))}
                  </div>
                )}
              </div>
            );
          })}

          {bottomLevel.map((item) => renderLink(item))}
        </nav>

        <div className="border-t border-white/10 px-3 py-4">
          <button
            onClick={logout}
            title={collapsed ? "Log out" : undefined}
            className={`flex w-full items-center gap-3 rounded-full px-4 py-2.5 text-left text-sm font-medium text-white/60 transition-colors duration-200 ease-out hover:bg-white/5 hover:text-white ${collapsed ? "lg:justify-center lg:px-0" : ""}`}
          >
            <HugeiconsIcon icon={Logout01Icon} size={20} />
            <span className={collapsed ? "lg:hidden" : ""}>Log out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
