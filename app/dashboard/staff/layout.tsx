"use client";

import { useState } from "react";
import StaffSidebar from "./components/Sidebar";
import StaffTopbar from "./components/Topbar";

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-navy">
      <StaffSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-1 flex-col overflow-hidden rounded-l-[28px] bg-white">
        <StaffTopbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto bg-blue-light/40 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
