"use client";

import React from "react";

interface SeverityBadgeProps {
  severity: "critical" | "high" | "medium" | "low" | "info";
  size?: "sm" | "md";
}

export default function SeverityBadge({ severity, size = "sm" }: SeverityBadgeProps) {
  const sizeClasses = size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs";

  return (
    <span
      className={`severity-${severity} rounded-full font-bold uppercase tracking-wider inline-flex items-center ${sizeClasses}`}
    >
      {severity}
    </span>
  );
}
