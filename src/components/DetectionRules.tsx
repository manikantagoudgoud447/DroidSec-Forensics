"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShieldAlert, FileCode, Shield, Radio, Wifi, AlertTriangle, CheckCircle2, Activity } from "lucide-react";
import CodeBlock from "./CodeBlock";
import SeverityBadge from "./SeverityBadge";
import { yaraRules, sigmaRules, permissionHeuristics } from "@/lib/forensicData";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

export default function DetectionRules() {
  const [matchCount, setMatchCount] = useState(0);
  const totalMatches = yaraRules.reduce((a, r) => a + r.matchCount, 0) + sigmaRules.length;

  useEffect(() => {
    if (matchCount < totalMatches) {
      const timer = setTimeout(() => setMatchCount((p) => Math.min(p + 1, totalMatches)), 80);
      return () => clearTimeout(timer);
    }
  }, [matchCount, totalMatches]);
  const networkHeuristics = [
    {
      name: "C2 Beacon Detection",
      severity: "critical" as const,
      condition: "HTTP POST to .xyz/.top TLD with encrypted payload + periodic interval (< 20min)",
      description: "Detects regular beaconing patterns to known suspicious TLDs commonly used by Android malware C2 infrastructure",
      triggered: true,
    },
    {
      name: "Data Exfiltration Volume",
      severity: "high" as const,
      condition: "Outbound data > 10KB per SMS event OR > 50KB aggregate within 1 hour",
      description: "Monitors for unusual outbound data volumes correlating with SMS reception events",
      triggered: true,
    },
    {
      name: "Fallback Channel Detection",
      severity: "high" as const,
      condition: "HTTP (non-TLS) connection to non-standard port (>1024) with SMS payload",
      description: "Detects fallback exfiltration channels using unencrypted HTTP on non-standard ports",
      triggered: true,
    },
    {
      name: "Multi-endpoint C2",
      severity: "medium" as const,
      condition: "Connections to >= 3 distinct external IPs within 24 hours",
      description: "Identifies distributed C2 infrastructure with multiple backend servers",
      triggered: true,
    },
  ];

  const smsReceiverPattern = `// Detection Pattern: SMS_RECEIVED BroadcastReceiver
// 
// Criteria for flagging an Android app as potentially malicious:
//
// 1. MANIFEST CHECK:
//    - Receiver registered for "android.provider.Telephony.SMS_RECEIVED"
//    - Priority >= 900 (attempting to intercept before default SMS app)
//    - android:exported="true"
//
// 2. PERMISSION COMBINATION:
//    - RECEIVE_SMS + READ_SMS + INTERNET (minimum triad)
//    - Bonus flags: SEND_SMS, READ_CONTACTS, RECEIVE_BOOT_COMPLETED
//
// 3. CODE ANALYSIS:
//    - Calls to SmsMessage.createFromPdu()
//    - Calls to abortBroadcast() (hiding SMS from user)
//    - HTTP POST containing SMS body/OTP data
//    - String matching for: "OTP", "UPI", "PIN", "transaction"
//
// 4. BEHAVIORAL INDICATORS:
//    - App processes SMS within < 2 seconds of receipt
//    - Network connection initiated within 5 seconds of SMS
//    - SMS content forwarded to external server
//
// SCORING:
//   - Manifest match alone:     40 points
//   - Permission triad:         +25 points  
//   - Code analysis matches:    +20 points
//   - Behavioral confirmation:  +15 points
//   - Score >= 80: HIGH CONFIDENCE malware
//   - Score >= 60: MEDIUM CONFIDENCE (needs review)
//   - Score <  60: LOW CONFIDENCE (likely benign)`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-white">
            Detection <span className="text-accent glow-text-blue">Rules</span>
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            YARA, Sigma, and heuristic rules for detecting SMS-forwarding malware variants
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-surface-1 border border-card-border px-3 py-2 rounded-lg">
            <Activity className="w-4 h-4 text-success" />
            <span className="text-xl font-bold font-mono text-success">{matchCount}</span>
            <span className="text-[10px] text-text-muted uppercase tracking-wider">MATCHES</span>
          </div>
          <div className="flex items-center gap-2 bg-surface-1 border border-card-border px-3 py-2 rounded-lg">
            <ShieldAlert className="w-4 h-4 text-accent" />
            <span className="text-xl font-bold font-mono text-accent">{yaraRules.length + sigmaRules.length + permissionHeuristics.length}</span>
            <span className="text-[10px] text-text-muted uppercase tracking-wider">RULES</span>
          </div>
        </div>
      </motion.div>

      {/* YARA Rules */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <FileCode className="w-4 h-4 text-accent" />
          YARA Rules
          <span className="ml-auto text-xs text-accent font-mono">{yaraRules.length} rules</span>
        </h3>

        <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-4">
          {yaraRules.map((rule) => (
            <motion.div key={rule.name} variants={itemVariants} className="border border-card-border rounded-lg overflow-hidden hover:border-accent/20 transition-colors">
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
                maxHeight="350px"
              />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Sigma-like Detection Logic */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6"
      >
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-info" />
          Sigma-like Detection Logic
          <span className="ml-auto text-xs text-info font-mono">{sigmaRules.length} rules</span>
        </h3>

        <div className="space-y-4">
          {sigmaRules.map((rule) => (
            <div key={rule.name} className="border border-card-border rounded-lg overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-surface-1">
                <div className="flex items-center gap-3">
                  <SeverityBadge severity={rule.severity} size="md" />
                  <div>
                    <span className="text-sm text-white font-semibold">{rule.title}</span>
                    <p className="text-[11px] text-text-secondary font-mono">{rule.name}</p>
                  </div>
                </div>
              </div>
              <CodeBlock
                code={rule.rule}
                language="SIGMA"
                collapsible={true}
                defaultExpanded={false}
                maxHeight="350px"
              />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Permission-based Heuristics */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-6"
      >
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <Shield className="w-4 h-4 text-warning" />
          Permission-based Heuristics
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {permissionHeuristics.map((h, i) => (
            <div
              key={i}
              className={`p-4 rounded-lg border ${
                h.triggered
                  ? "bg-danger/5 border-danger/20"
                  : "bg-surface-1 border-card-border"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-white">{h.name}</span>
                <div className="flex items-center gap-2">
                  <SeverityBadge severity={h.severity} />
                  {h.triggered && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-danger/20 text-danger border border-danger/30 font-bold">
                      TRIGGERED
                    </span>
                  )}
                </div>
              </div>
              <div className="p-2 rounded bg-[#0d1117] border border-[#21262d] mb-2">
                <code className="text-xs text-warning font-mono">{h.condition}</code>
              </div>
              <p className="text-xs text-text-secondary">{h.description}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* SMS_RECEIVED Receiver Pattern */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-6"
      >
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <Radio className="w-4 h-4 text-danger" />
          SMS_RECEIVED Receiver Detection Pattern
        </h3>

        <CodeBlock
          code={smsReceiverPattern}
          language="Detection Logic"
          collapsible={true}
          defaultExpanded={true}
          maxHeight="500px"
        />
      </motion.div>

      {/* Network Exfiltration Heuristics */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-6"
      >
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <Wifi className="w-4 h-4 text-accent" />
          Network Exfiltration Heuristics
        </h3>

        <div className="space-y-3">
          {networkHeuristics.map((h, i) => (
            <div
              key={i}
              className="p-4 rounded-lg bg-surface-1 border border-card-border hover:border-accent/20 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className={`w-4 h-4 ${
                    h.severity === "critical" ? "text-danger" :
                    h.severity === "high" ? "text-[#ff6644]" : "text-warning"
                  }`} />
                  <span className="text-sm font-semibold text-white">{h.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <SeverityBadge severity={h.severity} />
                  {h.triggered && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-danger/20 text-danger border border-danger/30 font-bold">
                      TRIGGERED
                    </span>
                  )}
                </div>
              </div>
              <div className="p-2 rounded bg-[#0d1117] border border-[#21262d] mb-2">
                <code className="text-xs text-accent font-mono">{h.condition}</code>
              </div>
              <p className="text-xs text-text-secondary">{h.description}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
