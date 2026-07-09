"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Code2,
  Activity,
  Target,
  ShieldAlert,
  FileText,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Bug,
  Shield,
} from "lucide-react";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navItems = [
  { id: "/", label: "Dashboard", icon: LayoutDashboard },
  { id: "/static-analysis", label: "Static Analysis", icon: Code2 },
  { id: "/dynamic-analysis", label: "Dynamic Analysis", icon: Activity },
  { id: "/iocs", label: "IOCs / Indicators", icon: Target },
  { id: "/detection-rules", label: "Detection Rules", icon: ShieldAlert },
  { id: "/forensic-report", label: "Forensic Report", icon: FileText },
  { id: "/recommendations", label: "Recommendations", icon: CheckCircle2 },
];

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 72 : 260 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="hidden md:flex fixed left-0 top-0 h-screen flex-col z-40 bg-[#0c1120] border-r border-card-border"
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-card-border flex-shrink-0">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-accent to-info flex items-center justify-center flex-shrink-0">
            <Shield className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="text-sm font-bold text-white whitespace-nowrap">DroidSec</div>
              <div className="text-[10px] text-accent font-mono whitespace-nowrap">FORENSICS LAB</div>
            </motion.div>
          )}
        </div>

        {/* Nav Items */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.id;
            return (
              <Link
                href={item.id}
                key={item.id}
                className={`sidebar-item w-full ${isActive ? "active" : ""}`}
                title={collapsed ? item.label : undefined}
              >
                <Icon className={`w-[18px] h-[18px] flex-shrink-0 ${isActive ? "text-accent" : ""}`} />
                {!collapsed && (
                  <span className="whitespace-nowrap overflow-hidden">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Collapse Toggle */}
        <div className="px-3 pb-4 border-t border-card-border pt-3">
          <button
            onClick={onToggle}
            className="sidebar-item w-full justify-center"
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span className="text-xs">Collapse</span>
              </>
            )}
          </button>
        </div>

        {/* Case Badge */}
        {!collapsed && (
          <div className="px-4 pb-4">
            <div className="p-3 rounded-lg bg-danger/5 border border-danger/20">
              <div className="flex items-center gap-2 text-danger text-xs font-semibold">
                <Bug className="w-3.5 h-3.5" />
                ACTIVE CASE
              </div>
              <div className="text-[11px] text-text-secondary mt-1 font-mono">
                DFIR-2025-06-0847
              </div>
            </div>
          </div>
        )}
      </motion.aside>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0c1120]/95 backdrop-blur-md border-t border-card-border">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.id;
            return (
              <Link
                href={item.id}
                key={item.id}
                className={`flex flex-col items-center gap-1 px-2 py-1.5 rounded-lg transition-colors ${
                  isActive ? "text-accent" : "text-text-muted"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[9px] font-medium">{item.label.split(" ")[0]}</span>
              </Link>
            );
          })}
          {/* More menu for remaining items */}
          <div className="relative group">
            <button className="flex flex-col items-center gap-1 px-2 py-1.5 rounded-lg text-text-muted">
              <FileText className="w-5 h-5" />
              <span className="text-[9px] font-medium">More</span>
            </button>
            <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block bg-surface-2 border border-card-border rounded-lg p-2 min-w-[160px]">
              {navItems.slice(5).map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    href={item.id}
                    key={item.id}
                    className="sidebar-item w-full text-sm"
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
