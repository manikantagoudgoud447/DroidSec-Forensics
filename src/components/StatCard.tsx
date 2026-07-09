"use client";

import React from "react";
import { motion } from "framer-motion";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: { value: string; direction: "up" | "down" };
  accent?: "blue" | "red" | "green" | "amber" | "purple";
  subtitle?: string;
}

const accentColors = {
  blue: { bg: "rgba(0, 212, 255, 0.08)", border: "rgba(0, 212, 255, 0.2)", text: "#00d4ff", glow: "0 0 20px rgba(0, 212, 255, 0.1)" },
  red: { bg: "rgba(255, 51, 102, 0.08)", border: "rgba(255, 51, 102, 0.2)", text: "#ff3366", glow: "0 0 20px rgba(255, 51, 102, 0.1)" },
  green: { bg: "rgba(0, 255, 136, 0.08)", border: "rgba(0, 255, 136, 0.2)", text: "#00ff88", glow: "0 0 20px rgba(0, 255, 136, 0.1)" },
  amber: { bg: "rgba(255, 170, 0, 0.08)", border: "rgba(255, 170, 0, 0.2)", text: "#ffaa00", glow: "0 0 20px rgba(255, 170, 0, 0.1)" },
  purple: { bg: "rgba(136, 85, 255, 0.08)", border: "rgba(136, 85, 255, 0.2)", text: "#8855ff", glow: "0 0 20px rgba(136, 85, 255, 0.1)" },
};

export default function StatCard({ label, value, icon: Icon, trend, accent = "blue", subtitle }: StatCardProps) {
  const colors = accentColors[accent];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, boxShadow: colors.glow }}
      transition={{ duration: 0.2 }}
      className="glass-card p-5 relative overflow-hidden group"
    >
      {/* Background glow */}
      <div
        className="absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity"
        style={{ background: colors.text }}
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ background: colors.bg, border: `1px solid ${colors.border}` }}
          >
            <Icon className="w-5 h-5" style={{ color: colors.text }} />
          </div>
          {trend && (
            <div className={`flex items-center gap-1 text-xs font-medium ${
              trend.direction === "up" ? "text-danger" : "text-success"
            }`}>
              {trend.direction === "up" ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5" />
              )}
              {trend.value}
            </div>
          )}
        </div>

        <div className="text-2xl font-bold text-white tracking-tight" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          {value}
        </div>
        <div className="text-xs text-text-secondary mt-1 font-medium uppercase tracking-wider">
          {label}
        </div>
        {subtitle && (
          <div className="text-[11px] text-text-muted mt-1 font-mono truncate">{subtitle}</div>
        )}
      </div>
    </motion.div>
  );
}
