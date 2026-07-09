"use client";

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const pathname = usePathname();

  // Helper to determine title based on pathname
  let pageTitle = "Malware Analysis Dashboard";
  if (pathname === "/static-analysis") pageTitle = "Static Analysis";
  if (pathname === "/dynamic-analysis") pageTitle = "Dynamic Analysis";
  if (pathname === "/iocs") pageTitle = "IOCs / Indicators";
  if (pathname === "/detection-rules") pageTitle = "Detection Rules";
  if (pathname === "/forensic-report") pageTitle = "Forensic Report";
  if (pathname === "/recommendations") pageTitle = "Recommendations";

  return (
    <div className="min-h-screen flex">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <main
        className={`flex-1 min-h-screen overflow-y-auto pb-24 md:pb-8 transition-[margin] duration-200 ${
          sidebarCollapsed ? "md:ml-[72px]" : "md:ml-[260px]"
        }`}
      >
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-card-border px-6 py-3">
          <div className="flex items-center justify-between max-w-[1400px] mx-auto">
            <div className="flex items-center gap-3">
              <div className="hidden md:block">
                <h2 className="text-sm font-semibold text-white">
                  {pageTitle}
                </h2>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-xs">
                <div className="w-2 h-2 rounded-full bg-danger animate-pulse" />
                <span className="text-danger font-semibold hidden sm:inline">ACTIVE INVESTIGATION</span>
              </div>
              <div className="text-[11px] text-text-muted font-mono hidden sm:block">
                Trojan.Android.SMSForwarder
              </div>
            </div>
          </div>
        </header>

        <div className="px-4 sm:px-6 py-6 max-w-[1400px] mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
