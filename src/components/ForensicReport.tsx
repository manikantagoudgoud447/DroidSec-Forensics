"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText, AlertTriangle, FileSearch, ClipboardList, CheckCircle,
  Download, Shield, Calendar, User, Lock, ChevronDown, ChevronUp,
  Printer, Copy, Check
} from "lucide-react";
import SeverityBadge from "./SeverityBadge";
import { forensicReport, apkMetadata } from "@/lib/forensicData";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  show: { opacity: 1, x: 0 },
};

export default function ForensicReport() {
  const [expandedFinding, setExpandedFinding] = useState<string | null>(null);
  const [methodStep, setMethodStep] = useState(0);
  const [copied, setCopied] = useState(false);

  // Animate methodology steps appearing one by one
  useEffect(() => {
    if (methodStep < forensicReport.methodology.length) {
      const timer = setTimeout(() => setMethodStep((s) => s + 1), 300);
      return () => clearTimeout(timer);
    }
  }, [methodStep]);

  const handlePrint = () => {
    window.print();
  };

  const handleCopySummary = async () => {
    await navigator.clipboard.writeText(forensicReport.executiveSummary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
            Forensic <span className="text-accent glow-text-blue">Report</span>
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Digital Forensics & Incident Response — Case {forensicReport.caseNumber}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="export-btn" onClick={handlePrint}>
            <Printer className="w-4 h-4" />
            Print Report
          </button>
          <button className="export-btn" onClick={() => alert("PDF generation would be handled by a backend service in production.")}>
            <Download className="w-4 h-4" />
            Export PDF
          </button>
        </div>
      </motion.div>

      {/* Report Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 relative overflow-hidden"
      >
        {/* Background gradient accent */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent via-info to-danger" />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
              <FileText className="w-5 h-5 text-accent" />
            </div>
            <div>
              <div className="text-[10px] text-text-muted uppercase tracking-wider">Case Number</div>
              <div className="text-sm text-white font-mono font-bold">{forensicReport.caseNumber}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-info/10 border border-info/20 flex items-center justify-center">
              <User className="w-5 h-5 text-info" />
            </div>
            <div>
              <div className="text-[10px] text-text-muted uppercase tracking-wider">Analyst</div>
              <div className="text-sm text-white">{forensicReport.analyst}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-warning/10 border border-warning/20 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-warning" />
            </div>
            <div>
              <div className="text-[10px] text-text-muted uppercase tracking-wider">Date</div>
              <div className="text-sm text-white font-mono">{forensicReport.date}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-danger/10 border border-danger/20 flex items-center justify-center">
              <Lock className="w-5 h-5 text-danger" />
            </div>
            <div>
              <div className="text-[10px] text-text-muted uppercase tracking-wider">Classification</div>
              <div className="text-sm text-danger font-bold">{forensicReport.classification}</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Executive Summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-accent" />
            Executive Summary
          </h3>
          <button
            onClick={handleCopySummary}
            className="flex items-center gap-1 text-xs text-text-muted hover:text-accent transition-colors px-2 py-1 rounded hover:bg-accent/10"
          >
            {copied ? (
              <><Check className="w-3.5 h-3.5 text-success" /><span className="text-success">Copied!</span></>
            ) : (
              <><Copy className="w-3.5 h-3.5" /><span>Copy</span></>
            )}
          </button>
        </div>
        <div className="p-4 rounded-lg bg-surface-1 border border-card-border">
          <p className="text-sm text-text-secondary leading-relaxed">
            {forensicReport.executiveSummary}
          </p>
        </div>

        {/* Quick stats */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4"
        >
          {[
            { label: "Risk Score", value: "92/100", color: "danger" },
            { label: "Key Findings", value: forensicReport.findings.length, color: "danger" },
            { label: "Evidence Items", value: forensicReport.evidence.length, color: "warning" },
            { label: "Analysis Steps", value: forensicReport.methodology.length, color: "accent" },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              className={`p-3 rounded-lg bg-${stat.color}/5 border border-${stat.color}/20 text-center hover:border-${stat.color}/40 transition-colors`}
            >
              <div className={`text-xl font-bold text-${stat.color} font-mono`}>{stat.value}</div>
              <div className="text-[10px] text-text-muted uppercase mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Evidence Summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-6"
      >
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <FileSearch className="w-4 h-4 text-info" />
          Evidence Summary
          <span className="ml-auto text-[10px] px-2 py-0.5 rounded bg-info/15 text-info font-bold border border-info/20">
            {forensicReport.evidence.length} ITEMS
          </span>
        </h3>

        <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-3">
          {forensicReport.evidence.map((ev) => (
            <motion.div
              key={ev.id}
              variants={itemVariants}
              className="p-4 rounded-lg bg-surface-1 border border-card-border hover:border-info/20 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <code className="text-xs text-accent font-mono font-bold">{ev.id}</code>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-surface-2 text-text-secondary font-medium border border-card-border">
                    {ev.type}
                  </span>
                </div>
                <code className="text-[10px] text-text-muted font-mono">{ev.hash}</code>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-secondary">{ev.source}</span>
                <span className="text-xs text-text-muted">{ev.description}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Methodology */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-6"
      >
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <ClipboardList className="w-4 h-4 text-warning" />
          Analysis Methodology
          <span className="ml-auto text-xs text-text-muted font-mono">
            {methodStep}/{forensicReport.methodology.length} steps
          </span>
        </h3>

        <div className="space-y-2">
          {forensicReport.methodology.slice(0, methodStep).map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-start gap-3 p-3 rounded-lg bg-surface-1 border border-card-border"
            >
              <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold font-mono ${
                i < methodStep - 1
                  ? "bg-success/15 border border-success/30 text-success"
                  : "bg-accent/10 border border-accent/20 text-accent"
              }`}>
                {i < methodStep - 1 ? <Check className="w-3.5 h-3.5" /> : i + 1}
              </div>
              <span className="text-sm text-text-secondary pt-0.5">{step.replace(/^\d+\.\s*/, "")}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Findings */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-6"
      >
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-danger" />
          Key Findings
          <span className="ml-auto text-[10px] px-2 py-0.5 rounded bg-danger/15 text-danger font-bold border border-danger/20">
            {forensicReport.findings.filter(f => f.severity === "critical").length} CRITICAL
          </span>
        </h3>

        <div className="space-y-3">
          {forensicReport.findings.map((finding) => (
            <motion.div
              key={finding.id}
              className={`rounded-lg border overflow-hidden transition-all cursor-pointer ${
                finding.severity === "critical"
                  ? "bg-danger/5 border-danger/20 hover:border-danger/40"
                  : "bg-[#ff6644]/5 border-[#ff6644]/20 hover:border-[#ff6644]/40"
              } ${expandedFinding === finding.id ? "shadow-lg" : ""}`}
              onClick={() => setExpandedFinding(expandedFinding === finding.id ? null : finding.id)}
            >
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <code className="text-xs text-text-muted font-mono">{finding.id}</code>
                  <span className="text-sm font-semibold text-white">{finding.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <SeverityBadge severity={finding.severity} size="md" />
                  {expandedFinding === finding.id ? (
                    <ChevronUp className="w-4 h-4 text-text-muted" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-text-muted" />
                  )}
                </div>
              </div>
              <AnimatePresence>
                {expandedFinding === finding.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t border-card-border"
                  >
                    <div className="p-4">
                      <p className="text-sm text-text-secondary leading-relaxed">{finding.description}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Conclusion */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card p-6 relative overflow-hidden"
      >
        {/* Bottom gradient accent */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-danger via-warning to-success" />

        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-success" />
          Conclusion
        </h3>

        <div className="p-4 rounded-lg bg-surface-1 border border-card-border">
          <p className="text-sm text-text-secondary leading-relaxed mb-4">
            {forensicReport.conclusion}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-danger/5 border border-danger/20">
              <div className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Classification</div>
              <div className="text-sm text-danger font-bold">{apkMetadata.classification}</div>
            </div>
            <div className="p-3 rounded-lg bg-warning/5 border border-warning/20">
              <div className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Malware Family</div>
              <div className="text-sm text-warning font-bold">{apkMetadata.malwareFamily}</div>
            </div>
            <div className="p-3 rounded-lg bg-danger/5 border border-danger/20">
              <div className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Verdict</div>
              <div className="text-sm text-danger font-bold flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-danger animate-pulse" />
                CONFIRMED MALICIOUS
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
