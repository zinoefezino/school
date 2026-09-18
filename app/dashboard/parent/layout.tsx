"use client";

import { useState } from "react";
import ParentSidebar from "./components/Sidebar";
import ParentTopbar from "./components/Topbar";

export default function ParentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex min-h-screen bg-navy">
      <ParentSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-1 flex-col overflow-hidden rounded-l-[28px] bg-white">
        <ParentTopbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto bg-blue-light/40 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
