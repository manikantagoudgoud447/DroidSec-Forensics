"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity, Monitor, ScrollText, MessageSquare, Globe, GitBranch, Clock,
  Cpu, HardDrive, Wifi, MemoryStick, ChevronRight
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip,
  ResponsiveContainer, BarChart, Bar, Legend
} from "recharts";
import SeverityBadge from "./SeverityBadge";
import {
  emulatorStatus, runtimeLogs, smsEvents, networkEndpoints,
  processTree, syscallTimeline, networkActivityData
} from "@/lib/forensicData";
import type { ProcessNode } from "@/lib/forensicData";

const logLevelColors: Record<string, string> = {
  ERROR: "log-error",
  WARN: "log-warn",
  INFO: "log-info",
  DEBUG: "log-debug",
  VERBOSE: "log-verbose",
};

function ProcessTreeNode({ node, depth = 0 }: { node: ProcessNode; depth?: number }) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div style={{ paddingLeft: depth * 20 }}>
      <div
        className={`flex items-center gap-2 py-1.5 px-2 rounded text-xs cursor-pointer hover:bg-surface-1 transition-colors ${
          node.suspicious ? "text-danger" : "text-text-secondary"
        }`}
        onClick={() => setExpanded(!expanded)}
      >
        {hasChildren && (
          <ChevronRight className={`w-3 h-3 transition-transform ${expanded ? "rotate-90" : ""}`} />
        )}
        {!hasChildren && <span className="w-3" />}
        <span className="font-mono text-text-muted w-12">{node.pid}</span>
        <span className={`font-mono font-medium ${node.suspicious ? "text-danger" : "text-white"}`}>
          {node.name}
        </span>
        <span className="text-text-muted">{node.user}</span>
        {node.suspicious && (
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-danger/15 text-danger border border-danger/20 ml-auto">
            SUSPICIOUS
          </span>
        )}
      </div>
      {expanded && hasChildren && (
        <div>
          {node.children!.map((child) => (
            <ProcessTreeNode key={child.pid} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function DynamicAnalysis() {
  const [logFilter, setLogFilter] = useState("ALL");
  const [logCount, setLogCount] = useState(5);
  const [smsCount, setSmsCount] = useState(2);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const logTimer = setInterval(() => {
      setLogCount((prev) => Math.min(prev + 1, runtimeLogs.length));
    }, 1200);
    
    const smsTimer = setInterval(() => {
      setSmsCount((prev) => Math.min(prev + 1, smsEvents.length));
    }, 3500);

    return () => {
      clearInterval(logTimer);
      clearInterval(smsTimer);
    };
  }, []);

  const visibleLogs = runtimeLogs.slice(0, logCount);
  const filteredLogs = logFilter === "ALL"
    ? visibleLogs
    : visibleLogs.filter((l) => l.level === logFilter);

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [filteredLogs.length]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">
          Dynamic <span className="text-accent glow-text-blue">Analysis</span>
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Runtime behavior monitoring in sandboxed Android emulator
        </p>
      </motion.div>

      {/* Emulator Status */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <Monitor className="w-4 h-4 text-accent" />
          Emulator Status
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {[
            { label: "Device", value: emulatorStatus.name, icon: Monitor },
            { label: "Android", value: emulatorStatus.androidVersion, icon: Activity },
            { label: "Arch", value: emulatorStatus.architecture, icon: Cpu },
            { label: "Status", value: emulatorStatus.status, icon: Activity, color: "text-success" },
            { label: "Uptime", value: emulatorStatus.uptime, icon: Clock },
            { label: "CPU", value: emulatorStatus.cpu, icon: Cpu },
            { label: "Memory", value: emulatorStatus.memory, icon: MemoryStick },
            { label: "Network", value: emulatorStatus.network, icon: Wifi },
          ].map((item) => (
            <div key={item.label} className="p-3 rounded-lg bg-surface-1 border border-card-border">
              <item.icon className="w-3.5 h-3.5 text-text-muted mb-1" />
              <div className={`text-xs font-mono font-medium ${item.color || "text-white"}`}>{item.value}</div>
              <div className="text-[10px] text-text-muted uppercase tracking-wider mt-0.5">{item.label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Runtime Logs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <ScrollText className="w-4 h-4 text-accent" />
            Runtime Logs (Logcat)
          </h3>
          <div className="flex items-center gap-1">
            {["ALL", "ERROR", "WARN", "INFO", "DEBUG"].map((level) => (
              <button
                key={level}
                onClick={() => setLogFilter(level)}
                className={`px-2 py-1 rounded text-[10px] font-bold uppercase transition-colors ${
                  logFilter === level
                    ? "bg-accent/15 text-accent border border-accent/30"
                    : "text-text-muted hover:text-text-secondary"
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <div className="code-block max-h-[400px] overflow-y-auto p-4 font-mono text-xs leading-relaxed">
          <AnimatePresence initial={false}>
            {filteredLogs.map((log, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex gap-3 hover:bg-white/[0.02] py-0.5"
              >
                <span className="text-text-muted w-24 flex-shrink-0">{log.timestamp}</span>
                <span className={`w-12 flex-shrink-0 font-bold ${logLevelColors[log.level]}`}>{log.level}</span>
                <span className="text-info w-32 flex-shrink-0 truncate">{log.tag}</span>
                <span className="text-[#c9d1d9] flex-1">{log.message}</span>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={logsEndRef} />
        </div>
      </motion.div>

      {/* SMS Interception Events */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-6"
      >
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-danger" />
          SMS Interception Events
          <span className="ml-auto text-xs text-danger font-mono">
            {smsCount} intercepted
            {smsCount < smsEvents.length && (
              <span className="ml-2 inline-block w-2 h-2 rounded-full bg-danger animate-pulse" />
            )}
          </span>
        </h3>

        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {smsEvents.slice(0, smsCount).map((sms) => (
              <motion.div
                key={sms.id}
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="p-4 rounded-lg bg-surface-1 border border-card-border hover:border-danger/20 transition-colors"
              >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-text-muted">{sms.id}</span>
                  <span className="text-sm font-semibold text-white">{sms.sender}</span>
                  {sms.isOTP && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-danger/15 text-danger border border-danger/20 font-bold">
                      OTP
                    </span>
                  )}
                  {sms.isUPI && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-warning/15 text-warning border border-warning/20 font-bold">
                      UPI
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {sms.forwarded && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-danger/15 text-danger font-bold">FORWARDED</span>
                  )}
                  {sms.blocked && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-danger/15 text-danger font-bold">BLOCKED</span>
                  )}
                  <SeverityBadge severity={sms.severity} />
                </div>
              </div>
              <div className="text-xs text-text-secondary font-mono bg-[#0d1117] p-2 rounded border border-[#21262d]">
                {sms.body}
              </div>
              <div className="text-[10px] text-text-muted mt-2">
                {new Date(sms.timestamp).toLocaleString()}
              </div>
            </motion.div>
          ))}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Network Activity + Process Tree */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Outbound Network */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6"
        >
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Globe className="w-4 h-4 text-accent" />
            Outbound Network Activity
          </h3>

          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={networkActivityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <ReTooltip
                  contentStyle={{
                    background: "#1a2332",
                    border: "1px solid #1e293b",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="requests" fill="#00d4ff" name="Requests" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>URL</th>
                  <th>Method</th>
                  <th>Purpose</th>
                </tr>
              </thead>
              <tbody>
                {networkEndpoints.slice(0, 4).map((ep, i) => (
                  <tr key={i}>
                    <td><code className="text-xs text-accent font-mono">{ep.url.slice(0, 40)}…</code></td>
                    <td>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                        ep.method === "POST" ? "bg-danger/15 text-danger" : "bg-accent/15 text-accent"
                      }`}>
                        {ep.method}
                      </span>
                    </td>
                    <td className="text-xs text-text-secondary">{ep.purpose}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Process Tree */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6"
        >
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-info" />
            Process Tree
          </h3>

          <div className="code-block p-4 max-h-[400px] overflow-y-auto">
            {processTree.map((node) => (
              <ProcessTreeNode key={node.pid} node={node} />
            ))}
          </div>
        </motion.div>
      </div>

      {/* System Call Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card p-6"
      >
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-warning" />
          System Call Timeline
        </h3>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={syscallTimeline}>
              <defs>
                <linearGradient id="readGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00d4ff" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#00d4ff" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="writeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ff3366" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#ff3366" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="sendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ffaa00" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#ffaa00" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <ReTooltip
                contentStyle={{
                  background: "#1a2332",
                  border: "1px solid #1e293b",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Area type="monotone" dataKey="read" stroke="#00d4ff" fill="url(#readGrad)" strokeWidth={2} name="read()" />
              <Area type="monotone" dataKey="write" stroke="#ff3366" fill="url(#writeGrad)" strokeWidth={2} name="write()" />
              <Area type="monotone" dataKey="sendto" stroke="#ffaa00" fill="url(#sendGrad)" strokeWidth={2} name="sendto()" />
              <Area type="monotone" dataKey="connect" stroke="#8855ff" fill="none" strokeWidth={1.5} name="connect()" strokeDasharray="4 2" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}
