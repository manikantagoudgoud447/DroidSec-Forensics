"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Code2, FileCode, ShieldAlert, Bug, Search, Cpu, ChevronDown, ChevronUp, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import CodeBlock from "./CodeBlock";
import SeverityBadge from "./SeverityBadge";
import {
  permissions,
  broadcastReceivers,
  decompiledCode,
  yaraRules,
  mobsfFindings,
} from "@/lib/forensicData";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

export default function StaticAnalysis() {
  const suspPerms = permissions.filter((p) => p.isSuspicious);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanComplete, setScanComplete] = useState(false);
  const [expandedReceiver, setExpandedReceiver] = useState<number | null>(null);
  const [permFilter, setPermFilter] = useState<string>("all");

  useEffect(() => {
    if (scanProgress < 100) {
      const timer = setTimeout(() => setScanProgress((p) => Math.min(p + Math.floor(Math.random() * 8) + 2, 100)), 120);
      return () => clearTimeout(timer);
    } else {
      setScanComplete(true);
    }
  }, [scanProgress]);

  const filteredPerms = permFilter === "all"
    ? suspPerms
    : suspPerms.filter((p) => p.category === permFilter);

  const permCategories = [...new Set(suspPerms.map((p) => p.category))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-white">
            Static <span className="text-accent glow-text-blue">Analysis</span>
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            APK decompilation, manifest inspection, and signature-based detection
          </p>
        </div>
        {/* Scan Progress */}
        <div className="flex items-center gap-3 min-w-[220px]">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">
                {scanComplete ? "SCAN COMPLETE" : "SCANNING APK..."}
              </span>
              <span className="text-xs font-mono text-accent">{scanProgress}%</span>
            </div>
            <div className="w-full h-2 bg-surface-2 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: scanComplete
                    ? "linear-gradient(90deg, #00ff88, #00d4ff)"
                    : "linear-gradient(90deg, #00d4ff, #8855ff)",
                }}
                animate={{ width: `${scanProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
          {scanComplete ? (
            <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
          ) : (
            <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin flex-shrink-0" />
          )}
        </div>
      </motion.div>

      {/* Manifest Inspection */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <FileCode className="w-4 h-4 text-accent" />
          AndroidManifest.xml Inspection
          <span className="ml-auto text-[10px] px-2 py-0.5 rounded bg-danger/15 text-danger font-bold border border-danger/20">
            15 DANGEROUS PERMISSIONS
          </span>
        </h3>
        <CodeBlock
          code={decompiledCode.manifestXml}
          language="XML"
          title="AndroidManifest.xml"
          defaultExpanded={false}
          maxHeight="350px"
        />
      </motion.div>

      {/* BroadcastReceiver Detection */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6"
      >
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <Bug className="w-4 h-4 text-danger" />
          BroadcastReceiver Detection
          <span className="ml-auto text-xs text-danger font-mono">{broadcastReceivers.length} receivers found</span>
        </h3>

        <div className="space-y-3">
          {broadcastReceivers.map((br, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className={`rounded-lg border transition-all cursor-pointer ${
                expandedReceiver === i
                  ? "bg-surface-1 border-accent/30 shadow-lg shadow-accent/5"
                  : "bg-surface-1 border-card-border hover:border-accent/20"
              }`}
              onClick={() => setExpandedReceiver(expandedReceiver === i ? null : i)}
            >
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                  <SeverityBadge severity={br.severity} />
                  <div>
                    <code className="text-xs text-accent font-mono font-semibold">{br.className.split(".").pop()}</code>
                    <div className="text-[10px] text-text-muted font-mono mt-0.5">{br.className}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`font-mono text-xs font-bold ${br.priority >= 900 ? "text-danger" : "text-warning"}`}>
                    P:{br.priority}
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${br.exported ? "bg-danger/15 text-danger" : "bg-success/15 text-success"}`}>
                    {br.exported ? "EXPORTED" : "PRIVATE"}
                  </span>
                  {expandedReceiver === i ? <ChevronUp className="w-4 h-4 text-text-muted" /> : <ChevronDown className="w-4 h-4 text-text-muted" />}
                </div>
              </div>
              {expandedReceiver === i && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-4 pb-4 border-t border-card-border"
                >
                  <div className="pt-3 space-y-2">
                    <p className="text-xs text-text-secondary">{br.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {br.intentFilters.map((f, j) => (
                        <span key={j} className="text-[10px] px-2 py-1 rounded bg-[#0d1117] text-accent font-mono border border-[#21262d]">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Suspicious Permissions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-warning" />
            Suspicious Permissions
            <span className="ml-2 text-xs text-warning font-mono">{suspPerms.length} / {permissions.length} flagged</span>
          </h3>
          {/* Category Filter */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPermFilter("all")}
              className={`px-2 py-1 rounded text-[10px] font-bold uppercase transition-colors ${
                permFilter === "all" ? "bg-accent/15 text-accent border border-accent/30" : "text-text-muted hover:text-text-secondary"
              }`}
            >
              All
            </button>
            {permCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setPermFilter(cat)}
                className={`px-2 py-1 rounded text-[10px] font-bold uppercase transition-colors ${
                  permFilter === cat ? "bg-accent/15 text-accent border border-accent/30" : "text-text-muted hover:text-text-secondary"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
        >
          {filteredPerms.map((perm) => (
            <motion.div
              key={perm.name}
              variants={itemVariants}
              whileHover={{ scale: 1.02, borderColor: "rgba(0, 212, 255, 0.3)" }}
              className={`p-3 rounded-lg border transition-colors ${
                perm.severity === "critical"
                  ? "bg-danger/5 border-danger/20"
                  : perm.severity === "high"
                  ? "bg-[#ff6644]/5 border-[#ff6644]/20"
                  : "bg-warning/5 border-warning/20"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] text-text-muted uppercase tracking-wider">{perm.category}</span>
                <SeverityBadge severity={perm.severity} />
              </div>
              <code className="text-xs font-mono text-white block truncate">{perm.name}</code>
              <p className="text-[10px] text-text-secondary mt-1">{perm.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Decompiled Code */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-6 space-y-4"
      >
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <Code2 className="w-4 h-4 text-accent" />
          Decompiled Code Snippets
          <span className="ml-auto text-[10px] px-2 py-0.5 rounded bg-info/15 text-info font-bold border border-info/20">
            JADX DECOMPILED
          </span>
        </h3>

        <CodeBlock
          code={decompiledCode.smsInterceptor}
          language="Java"
          title="SmsReceiver.java — SMS Interception Logic"
          defaultExpanded={false}
        />

        <CodeBlock
          code={decompiledCode.dataExfiltrator}
          language="Java"
          title="DataExfiltrator.java — C2 Data Upload"
          defaultExpanded={false}
        />
      </motion.div>

      {/* YARA Rule Matches */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-6"
      >
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <Search className="w-4 h-4 text-info" />
          YARA Rule Matches
          <span className="ml-auto flex items-center gap-2">
            <span className="text-[10px] px-2 py-0.5 rounded bg-success/15 text-success font-bold border border-success/20">
              {yaraRules.reduce((acc, r) => acc + r.matchCount, 0)} TOTAL MATCHES
            </span>
          </span>
        </h3>

        <div className="space-y-4">
          {yaraRules.map((rule) => (
            <div key={rule.name} className="border border-card-border rounded-lg overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-surface-1">
                <div className="flex items-center gap-3">
                  <SeverityBadge severity={rule.severity} size="md" />
                  <div>
                    <code className="text-sm text-white font-mono">{rule.name}</code>
                    <p className="text-[11px] text-text-secondary">{rule.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-success font-mono flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {rule.matchCount} matches
                  </span>
                </div>
              </div>
              <CodeBlock
                code={rule.rule}
                language="YARA"
                collapsible={true}
                defaultExpanded={false}
                maxHeight="300px"
              />
            </div>
          ))}
        </div>
      </motion.div>

      {/* JADX / MobSF Findings */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card p-6"
      >
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <Cpu className="w-4 h-4 text-danger" />
          JADX / MobSF Findings
          <span className="ml-auto text-xs text-text-muted">
            Security Score: <span className="text-danger font-bold">{mobsfFindings.securityScore}/100</span>
          </span>
        </h3>

        {/* Category summary with animated bars */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {mobsfFindings.categories.map((cat) => (
            <div key={cat.name} className="p-3 rounded-lg bg-surface-1 border border-card-border text-center group hover:border-accent/20 transition-colors">
              <div className="text-2xl font-bold font-mono" style={{ color: cat.color }}>{cat.count}</div>
              <div className="text-[10px] text-text-secondary uppercase tracking-wider mt-1">{cat.name}</div>
              <div className="w-full h-1 bg-surface-2 rounded-full mt-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(cat.count / mobsfFindings.totalFindings) * 100}%` }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  className="h-full rounded-full"
                  style={{ background: cat.color }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Findings list */}
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-2">
          {mobsfFindings.findings.map((finding, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="flex items-start gap-3 p-3 rounded-lg bg-surface-1 border border-card-border hover:border-accent/20 transition-colors"
            >
              <SeverityBadge severity={finding.severity} />
              <div className="flex-1">
                <div className="text-sm text-white font-medium">{finding.title}</div>
                <p className="text-xs text-text-secondary mt-0.5">{finding.description}</p>
              </div>
              {finding.severity === "high" ? (
                <XCircle className="w-4 h-4 text-danger flex-shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
              )}
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
