"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  DashboardSquare01Icon,
  StudentsIcon,
  TeacherIcon,
  LocationUser01Icon,
  Book02Icon,
  Coins01Icon,
  Megaphone01Icon,
  Setting06Icon,
  Logout01Icon,
  Cancel01Icon,
  WorkflowCircle02Icon,
  PanelLeftCloseIcon,
  PanelLeftOpenIcon,
} from "@hugeicons/core-free-icons";

const navItems = [
  { label: "Overview", href: "/dashboard/admin", icon: DashboardSquare01Icon },
  { label: "Students", href: "/dashboard/admin/students", icon: StudentsIcon },
  { label: "Staff", href: "/dashboard/admin/staff", icon: TeacherIcon },
  {
    label: "Parents",
    href: "/dashboard/admin/parents",
    icon: LocationUser01Icon,
  },
  {
    label: "Academics",
    href: "/dashboard/admin/academics",
    icon: Book02Icon,
  },
  {
    label: "Operations",
    href: "/dashboard/admin/operations",
    icon: WorkflowCircle02Icon,
  },
  { label: "Finance", href: "/dashboard/admin/finance", icon: Coins01Icon },
  {
    label: "Communication",
    href: "/dashboard/admin/communications",
    icon: Megaphone01Icon,
  },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/portal/login");
  };
  const navRef = useRef<HTMLElement | null>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [indicator, setIndicator] = useState({
    top: 0,
    height: 0,
    visible: false,
  });
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const activeIndex = navItems.findIndex((item) => {
    if (item.href === "/dashboard/admin") return pathname === item.href;
    if (item.href === "/dashboard/admin/academics") {
      return [
        "/dashboard/admin/academics",
        "/dashboard/admin/classes",
        "/dashboard/admin/assignments",
        "/dashboard/admin/timetable",
      ].some((path) => pathname.startsWith(path));
    }
    if (item.href === "/dashboard/admin/operations") {
      return [
        "/dashboard/admin/operations",
        "/dashboard/admin/attendance",
        "/dashboard/admin/students/promote",
      ].some((path) => pathname.startsWith(path));
    }
    if (item.href === "/dashboard/admin/communications") {
      return [
        "/dashboard/admin/communications",
        "/dashboard/admin/announcements",
        "/dashboard/admin/news",
      ].some((path) => pathname.startsWith(path));
    }
    return pathname.startsWith(item.href);
  });

  const closeOnMobile = () => {
    if (window.innerWidth < 1024) {
      onClose();
    }
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

    return () => {
      window.removeEventListener("resize", updateIndicator);
    };
  }, [activeIndex, pathname, collapsed]);

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-slate-950/30 backdrop-blur-sm transition-opacity duration-300 ease-out lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed left-0 top-0 z-50 flex h-dvh w-[82vw] max-w-sm transform-gpu flex-col bg-navy shadow-2xl shadow-slate-950/20 transition-transform duration-300 ease-out lg:static lg:transition-[width,transform] lg:h-auto lg:max-w-none lg:translate-x-0 lg:shadow-none ${
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

          {navItems.map((item, index) => {
            const isActive = index === activeIndex;

            return (
              <Link
                key={item.label}
                ref={(element) => {
                  itemRefs.current[index] = element;
                }}
                href={item.href}
                onClick={closeOnMobile}
                title={collapsed ? item.label : undefined}
                className={`relative z-10 mr-4 flex items-center gap-3 rounded-full py-3 pl-4 text-sm font-medium transition-colors duration-200 ease-out hover:bg-white/5 hover:text-white lg:mr-0 lg:hover:bg-transparent ${
                  isActive
                    ? "text-white/60 lg:font-semibold lg:text-navy"
                    : "text-white/60"
                } ${collapsed ? "lg:justify-center lg:pl-0" : ""}`}
              >
                <HugeiconsIcon icon={item.icon} size={20} />
                <span className={collapsed ? "lg:hidden" : ""}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 px-3 py-4">
          <Link
            href="/dashboard/admin/settings"
            onClick={closeOnMobile}
            title={collapsed ? "Settings" : undefined}
            className={`flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium text-white/60 transition-colors duration-200 ease-out hover:bg-white/5 hover:text-white ${collapsed ? "lg:justify-center lg:px-0" : ""}`}
          >
            <HugeiconsIcon icon={Setting06Icon} size={20} />
            <span className={collapsed ? "lg:hidden" : ""}>Settings</span>
          </Link>

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

