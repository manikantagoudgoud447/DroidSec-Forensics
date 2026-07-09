"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Hash, Package, Shield, Radio, Wifi, Eye, AlertTriangle, Clock,
  Fingerprint, Lock, Globe, Search, CheckCircle
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import StatCard from "./StatCard";
import SeverityBadge from "./SeverityBadge";
import {
  apkMetadata, riskScore, permissions, broadcastReceivers,
  networkEndpoints, obfuscationAnalysis, timelineEvents,
  riskDistribution
} from "@/lib/forensicData";

const timelineChartData = timelineEvents.map((e, i) => ({
  name: e.timestamp.split("T")[1]?.split("Z")[0]?.slice(0, 5) || `T${i}`,
  severity: e.severity === "critical" ? 4 : e.severity === "high" ? 3 : e.severity === "medium" ? 2 : 1,
  category: e.category,
}));

const severityColors: Record<string, string> = {
  critical: "#ff3366",
  high: "#ff6644",
  medium: "#ffaa00",
  low: "#00d4ff",
};

export default function Dashboard() {
  const suspiciousSmsPerms = permissions.filter(
    (p) => p.category === "SMS" && p.isSuspicious
  );

  const [gaugePercent, setGaugePercent] = useState(riskScore.overall);
  const [targetUrl, setTargetUrl] = useState("");
  const [scanState, setScanState] = useState<"idle" | "scanning" | "complete">("idle");
  const [scanProgress, setScanProgress] = useState(0);
  const [activeTarget, setActiveTarget] = useState("api-secure.payguard.xyz");

  useEffect(() => {
    const interval = setInterval(() => {
      setGaugePercent(riskScore.overall + Math.floor(Math.random() * 3));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Scan progress animation
  useEffect(() => {
    if (scanState === "scanning") {
      if (scanProgress < 100) {
        const timer = setTimeout(() => {
          setScanProgress((p) => Math.min(p + Math.floor(Math.random() * 12) + 3, 100));
        }, 150);
        return () => clearTimeout(timer);
      } else {
        setScanState("complete");
        setActiveTarget(targetUrl || "api-secure.payguard.xyz");
      }
    }
  }, [scanState, scanProgress, targetUrl]);

  const handleScan = () => {
    if (!targetUrl.trim()) return;
    setScanState("scanning");
    setScanProgress(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleScan();
  };

  const circumference = 2 * Math.PI * 45;
  const dashOffset = circumference - (gaugePercent / 100) * circumference;
  const gaugeColor =
    gaugePercent >= 80 ? "#ff3366" : gaugePercent >= 60 ? "#ffaa00" : "#00ff88";

  // Staggered variants for stat cards
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-white">
            Malware Analysis <span className="text-accent glow-text-blue">Dashboard</span>
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Case DFIR-2025-06-0847 — SMS-forwarding trojan targeting UPI applications
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs">
            <div className="w-2 h-2 rounded-full bg-danger animate-pulse" />
            <span className="text-danger font-semibold">MALICIOUS</span>
          </div>
          <span className="text-xs text-text-muted font-mono">
            {apkMetadata.classification}
          </span>
        </div>
      </motion.div>

      {/* Target Scanner Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="glass-card p-4 relative overflow-hidden"
      >
        {/* Scanning progress overlay */}
        {scanState === "scanning" && (
          <motion.div
            className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-accent via-info to-accent"
            initial={{ width: 0 }}
            animate={{ width: `${scanProgress}%` }}
            transition={{ duration: 0.2 }}
          />
        )}
        {scanState === "complete" && (
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-success to-accent" />
        )}

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              value={targetUrl}
              onChange={(e) => { setTargetUrl(e.target.value); if (scanState === "complete") setScanState("idle"); }}
              onKeyDown={handleKeyDown}
              placeholder="Enter target URL or domain to scan (e.g., malicious-site.xyz)"
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-surface-1 border border-card-border text-sm text-white placeholder:text-text-muted font-mono focus:border-accent/50 focus:outline-none transition-colors"
              disabled={scanState === "scanning"}
            />
          </div>
          <button
            onClick={handleScan}
            disabled={scanState === "scanning" || !targetUrl.trim()}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-all ${
              scanState === "scanning"
                ? "bg-accent/20 text-accent border border-accent/30 cursor-wait"
                : scanState === "complete"
                ? "bg-success/20 text-success border border-success/30 hover:bg-success/30"
                : targetUrl.trim()
                ? "bg-accent/20 text-accent border border-accent/40 hover:bg-accent/30 hover:border-accent/60 cursor-pointer"
                : "bg-surface-2 text-text-muted border border-card-border cursor-not-allowed"
            }`}
          >
            {scanState === "scanning" ? (
              <>
                <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                Scanning... {scanProgress}%
              </>
            ) : scanState === "complete" ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Scan Complete
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                Scan Target
              </>
            )}
          </button>
        </div>

        {/* Scan status info */}
        {scanState !== "idle" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-3 pt-3 border-t border-card-border"
          >
            <div className="flex items-center gap-4 text-xs">
              {scanState === "scanning" && (
                <>
                  <span className="text-accent flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                    Analyzing target infrastructure...
                  </span>
                  <span className="text-text-muted font-mono">{targetUrl}</span>
                </>
              )}
              {scanState === "complete" && (
                <>
                  <span className="text-success flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Analysis complete — malicious indicators found
                  </span>
                  <span className="text-danger font-mono font-bold">THREAT DETECTED</span>
                  <span className="text-text-muted font-mono ml-auto">Target: {activeTarget}</span>
                </>
              )}
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Stat Cards Row */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <motion.div variants={itemVariants}>
          <StatCard
            label="APK SHA256"
            value={apkMetadata.sha256.slice(0, 12) + "…"}
            icon={Hash}
            accent="blue"
            subtitle={apkMetadata.sha256}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            label="Package Name"
            value={apkMetadata.packageName.split(".").pop() || ""}
            icon={Package}
            accent="purple"
            subtitle={apkMetadata.packageName}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            label="Permissions"
            value={permissions.length}
            icon={Shield}
            accent="red"
            trend={{ value: `${permissions.filter(p => p.isSuspicious).length} suspicious`, direction: "up" }}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            label="Receivers"
            value={broadcastReceivers.length}
            icon={Radio}
            accent="amber"
            trend={{ value: `${broadcastReceivers.filter(r => r.severity === "critical").length} critical`, direction: "up" }}
          />
        </motion.div>
      </motion.div>

      {/* Risk Score + SMS Permissions + Network */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Score Gauge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-6 flex flex-col items-center"
        >
          <h3 className="text-sm font-semibold text-white mb-4 self-start flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-danger" />
            Risk Score
          </h3>

          <div className="relative w-36 h-36">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#1e293b" strokeWidth="8" />
              <circle
                cx="50" cy="50" r="45" fill="none"
                stroke={gaugeColor}
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
                className="gauge-circle"
                style={{ filter: `drop-shadow(0 0 6px ${gaugeColor})` }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-white" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                {gaugePercent}
              </span>
              <span className="text-[10px] text-text-muted uppercase tracking-wider">/ 100</span>
            </div>
          </div>

          {/* Breakdown bars */}
          <div className="w-full mt-4 space-y-2">
            {Object.entries(riskScore.breakdown).map(([key, val]) => (
              <div key={key} className="flex items-center gap-2">
                <span className="text-[11px] text-text-secondary w-20 capitalize">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </span>
                <div className="flex-1 h-1.5 bg-surface-2 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${val}%` }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="h-full rounded-full"
                    style={{
                      background: val >= 90 ? "#ff3366" : val >= 80 ? "#ffaa00" : "#00d4ff",
                    }}
                  />
                </div>
                <span className="text-[11px] text-text-muted w-8 text-right font-mono">{val}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Suspicious SMS Permissions */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6"
        >
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Lock className="w-4 h-4 text-danger" />
            Suspicious SMS Permissions
          </h3>

          <div className="space-y-3">
            {suspiciousSmsPerms.map((perm) => (
              <div key={perm.name} className="p-3 rounded-lg bg-danger/5 border border-danger/15">
                <div className="flex items-center justify-between mb-1">
                  <code className="text-xs text-danger font-mono font-semibold">
                    {perm.name.split(".").pop()}
                  </code>
                  <SeverityBadge severity={perm.severity} />
                </div>
                <p className="text-[11px] text-text-secondary">{perm.description}</p>
              </div>
            ))}
          </div>

          {/* Permission Distribution Mini Chart */}
          <div className="mt-4 h-32">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={50}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {riskDistribution.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
                <ReTooltip
                  contentStyle={{
                    background: "#1a2332",
                    border: "1px solid #1e293b",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Network Endpoints */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6"
        >
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Wifi className="w-4 h-4 text-accent" />
            Network Endpoints
          </h3>

          <div className="space-y-2 max-h-[320px] overflow-y-auto no-scrollbar">
            {networkEndpoints.map((ep, i) => (
              <div
                key={i}
                className="p-3 rounded-lg bg-surface-1 border border-card-border hover:border-accent/20 transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    ep.method === "POST"
                      ? "bg-danger/15 text-danger"
                      : "bg-accent/15 text-accent"
                  }`}>
                    {ep.method}
                  </span>
                  <span className={`w-2 h-2 rounded-full ${
                    ep.status === "active" ? "bg-danger" : "bg-text-muted"
                  }`} />
                </div>
                <code className="text-xs text-text-secondary font-mono block truncate">
                  {ep.url.replace("api-secure.payguard[.]xyz", activeTarget).replace("api-secure.payguard.xyz", activeTarget)}
                </code>
                <p className="text-[10px] text-text-muted mt-1">{ep.purpose}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Obfuscation Level + Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Obfuscation Level */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Eye className="w-4 h-4 text-info" />
            Obfuscation Level — <span className="text-warning">{obfuscationAnalysis.level}</span>
          </h3>

          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-text-secondary">Obfuscation Score</span>
              <span className="text-xs font-mono text-warning">{obfuscationAnalysis.score}/100</span>
            </div>
            <div className="w-full h-2.5 bg-surface-2 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${obfuscationAnalysis.score}%` }}
                transition={{ delay: 0.5, duration: 1 }}
                className="h-full rounded-full bg-gradient-to-r from-warning to-danger"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {obfuscationAnalysis.techniques.map((tech) => (
              <div
                key={tech.name}
                className={`p-2.5 rounded-lg text-xs flex items-start gap-2 ${
                  tech.detected
                    ? "bg-danger/5 border border-danger/15"
                    : "bg-surface-1 border border-card-border"
                }`}
              >
                <Fingerprint className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${
                  tech.detected ? "text-danger" : "text-text-muted"
                }`} />
                <div>
                  <div className={`font-medium ${tech.detected ? "text-danger" : "text-text-muted"}`}>
                    {tech.name}
                  </div>
                  <div className="text-[10px] text-text-muted mt-0.5">{tech.details}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Behavior Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-accent" />
            Malicious Behavior Timeline
          </h3>

          <div className="h-48 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineChartData}>
                <defs>
                  <linearGradient id="severityGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ff3366" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#ff3366" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} domain={[0, 5]} ticks={[1, 2, 3, 4]} tickFormatter={(v) => ["", "LOW", "MED", "HIGH", "CRIT"][v] || ""} />
                <ReTooltip
                  contentStyle={{
                    background: "#1a2332",
                    border: "1px solid #1e293b",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Area
                  type="stepAfter"
                  dataKey="severity"
                  stroke="#ff3366"
                  fill="url(#severityGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Recent Events */}
          <div className="space-y-2 max-h-[140px] overflow-y-auto no-scrollbar">
            {timelineEvents.slice(-5).reverse().map((evt, i) => (
              <div key={i} className="flex items-start gap-3 text-xs">
                <div
                  className="timeline-dot mt-1"
                  style={{ background: severityColors[evt.severity], color: severityColors[evt.severity] }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">{evt.event}</span>
                    <SeverityBadge severity={evt.severity} />
                  </div>
                  <p className="text-text-muted truncate mt-0.5">
                    {evt.details.replace("api-secure.payguard[.]xyz", activeTarget).replace("api-secure.payguard.xyz", activeTarget)}
                  </p>
                </div>
                <span className="text-text-muted font-mono whitespace-nowrap">
                  {evt.timestamp.split("T")[1]?.split("Z")[0]?.slice(0, 5)}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
