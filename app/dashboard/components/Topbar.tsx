"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { Menu01Icon, Search01Icon } from "@hugeicons/core-free-icons";

const titles: Record<string, string> = {
  "/dashboard/admin": "Overview",
  "/dashboard/admin/students": "Students",
  "/dashboard/admin/staff": "Staff",
  "/dashboard/admin/parents/new": "Add parent",
  "/dashboard/admin/classes": "Classes",
  "/dashboard/admin/academics": "Academics",
  "/dashboard/admin/assignments": "Assignments",
  "/dashboard/admin/timetable": "Timetable",
  "/dashboard/admin/attendance": "Attendance",
  "/dashboard/admin/fees": "Fees",
  "/dashboard/admin/finance": "Finance",
  "/dashboard/admin/announcements": "Announcements",
  "/dashboard/admin/news": "News",
  "/dashboard/admin/settings": "Settings",
};

interface TopbarProps {
  onMenuClick: () => void;
}
type CurrentUser = {
  displayName: string;
  initials: string;
  lastLoginAt?: string;
};
type SearchResult = {
  id: string;
  type: string;
  title: string;
  subtitle: string;
  href: string;
};

function formatLastLogin(value?: string) {
  if (!value) return "Last login not recorded";
  return `Last login: ${new Date(value).toLocaleString()}`;
}

function titleFor(pathname: string) {
  if (pathname.startsWith("/dashboard/admin/finance")) return "Finance";
  if (pathname.startsWith("/dashboard/admin/operations")) return "Operations";
  if (pathname.startsWith("/dashboard/admin/communications"))
    return "Communications";
  if (pathname.startsWith("/dashboard/admin/academics")) return "Academics";
  return titles[pathname] ?? "Dashboard";
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const title = titleFor(pathname);
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/dashboard/me")
      .then(async (response) => (response.ok ? response.json() : null))
      .then((data) => setUser(data?.user ?? null))
      .catch(() => setUser(null));
  }, []);

  useEffect(() => {
    const term = query.trim();
    if (term.length < 2) {
      return;
    }
    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      setSearching(true);
      fetch(`/api/admin/search?q=${encodeURIComponent(term)}`, {
        signal: controller.signal,
      })
        .then(async (response) => (response.ok ? response.json() : null))
        .then((data) => setResults(data?.results ?? []))
        .catch((error) => {
          if (error instanceof Error && error.name === "AbortError") return;
          setResults([]);
        })
        .finally(() => setSearching(false));
    }, 250);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  useEffect(() => {
    function close(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      )
        setSearchOpen(false);
    }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  function openResult(href: string) {
    setSearchOpen(false);
    setQuery("");
    setResults([]);
    router.push(href);
  }

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (results[0]) openResult(results[0].href);
  }

  return (
    <header className="flex items-center justify-between border-b border-black/5 bg-white px-6 py-4">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          aria-label="Open menu"
          className="text-navy lg:hidden"
        >
          <HugeiconsIcon icon={Menu01Icon} size={26} />
        </button>
        <h1 className="text-lg font-medium text-foreground">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        <div ref={searchRef} className="relative hidden sm:block">
          <form
            onSubmit={submitSearch}
            className="flex items-center gap-2 rounded-full border border-black/10 px-3.5 py-2"
          >
            <HugeiconsIcon
              icon={Search01Icon}
              size={18}
              className="text-foreground/40"
            />
            <input
              type="search"
              value={query}
              onChange={(event) => {
                const nextQuery = event.target.value;
                setQuery(nextQuery);
                if (nextQuery.trim().length < 2) {
                  setResults([]);
                  setSearching(false);
                }
                setSearchOpen(true);
              }}
              onFocus={() => setSearchOpen(true)}
              placeholder="Search records..."
              className="w-44 text-sm text-foreground outline-none placeholder:text-foreground/40"
            />
          </form>
          {searchOpen && query.trim().length >= 2 && (
            <div className="absolute right-0 top-12 z-50 w-[min(420px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-navy/10 bg-white shadow-xl">
              <div className="border-b border-black/5 px-4 py-3 text-xs font-medium uppercase tracking-wide text-foreground/45">
                Global search
              </div>
              {searching ? (
                <p className="px-4 py-5 text-sm text-foreground/60">
                  Searching...
                </p>
              ) : results.length === 0 ? (
                <p className="px-4 py-5 text-sm text-foreground/60">
                  No results found.
                </p>
              ) : (
                <div className="max-h-96 overflow-y-auto py-2">
                  {results.map((item) => (
                    <button
                      key={`${item.type}-${item.id}`}
                      type="button"
                      onClick={() => openResult(item.href)}
                      className="block w-full px-4 py-3 text-left hover:bg-blue-light/60"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="truncate text-sm font-medium text-foreground">
                          {item.title}
                        </span>
                        <span className="shrink-0 rounded-full bg-blue-light px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-blue">
                          {item.type}
                        </span>
                      </div>
                      <p className="mt-1 truncate text-xs text-foreground/55">
                        {item.subtitle}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-light text-sm font-medium text-navy">
            {user?.initials ?? "A"}
          </span>
          <span className="hidden sm:block">
            <span className="block text-sm font-medium text-foreground">
              {user?.displayName ?? "Admin"}
            </span>
            <span className="block text-xs italic text-foreground/45">
              {formatLastLogin(user?.lastLoginAt)}
            </span>
          </span>
        </div>
      </div>
    </header>
  );
}
