"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target, Globe, Server, Package, Hash, Radio, Code2, Search,
  Download, Copy, Check, Filter, ExternalLink, MapPin, Clock
} from "lucide-react";
import SeverityBadge from "./SeverityBadge";
import {
  iocDomains, iocIPs, iocPackageNames, suspiciousAPICalls,
  broadcastReceivers, apkMetadata
} from "@/lib/forensicData";

type IOCTab = "domains" | "ips" | "packages" | "hashes" | "receivers" | "apis";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

export default function IOCPanel() {
  const [activeTab, setActiveTab] = useState<IOCTab>("domains");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [severityFilter, setSeverityFilter] = useState<string>("all");

  const tabs: { id: IOCTab; label: string; icon: React.ComponentType<{ className?: string }>; count: number }[] = [
    { id: "domains", label: "Domains", icon: Globe, count: iocDomains.length },
    { id: "ips", label: "IP Addresses", icon: Server, count: iocIPs.length },
    { id: "packages", label: "Packages", icon: Package, count: iocPackageNames.length },
    { id: "hashes", label: "SHA256 Hashes", icon: Hash, count: 3 },
    { id: "receivers", label: "Receivers", icon: Radio, count: broadcastReceivers.length },
    { id: "apis", label: "API Calls", icon: Code2, count: suspiciousAPICalls.length },
  ];

  const hashes = [
    { label: "SHA256", value: apkMetadata.sha256 },
    { label: "MD5", value: apkMetadata.md5 },
    { label: "SHA1", value: apkMetadata.sha1 },
  ];

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedHash(text);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const handleExportCSV = () => {
    let csvContent = "";
    if (activeTab === "domains") {
      csvContent = "Domain,Category,Registrar,First Seen,Last Seen,Status,Severity\n";
      iocDomains.forEach((d) => {
        csvContent += `${d.domain},${d.category},${d.registrar},${d.firstSeen},${d.lastSeen},${d.status},${d.severity}\n`;
      });
    } else if (activeTab === "ips") {
      csvContent = "IP,Port,Geo,ASN,Category,Status,Severity\n";
      iocIPs.forEach((ip) => {
        csvContent += `${ip.ip},${ip.port},${ip.geo},${ip.asn},${ip.category},${ip.status},${ip.severity}\n`;
      });
    } else {
      csvContent = "Type,Value\n";
      hashes.forEach((h) => { csvContent += `${h.label},${h.value}\n`; });
    }
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ioc_${activeTab}_export.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredDomains = useMemo(() =>
    iocDomains.filter((d) => {
      const matchSearch = d.domain.toLowerCase().includes(searchQuery.toLowerCase());
      const matchSev = severityFilter === "all" || d.severity === severityFilter;
      return matchSearch && matchSev;
    }),
    [searchQuery, severityFilter]
  );

  const filteredIPs = useMemo(() =>
    iocIPs.filter((ip) => {
      const matchSearch = ip.ip.toLowerCase().includes(searchQuery.toLowerCase());
      const matchSev = severityFilter === "all" || ip.severity === severityFilter;
      return matchSearch && matchSev;
    }),
    [searchQuery, severityFilter]
  );

  const filteredAPIs = useMemo(() =>
    suspiciousAPICalls.filter(
      (a) => a.api.toLowerCase().includes(searchQuery.toLowerCase()) ||
             a.method.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    [searchQuery]
  );

  const totalIOCs = iocDomains.length + iocIPs.length + iocPackageNames.length + 3 + broadcastReceivers.length + suspiciousAPICalls.length;
  const activeIOCs = iocDomains.filter(d => d.status === "active").length + iocIPs.filter(ip => ip.status === "active").length;

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
            IOCs / <span className="text-accent glow-text-blue">Indicators</span>
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Indicators of Compromise extracted from malware analysis
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* IOC Summary Badges */}
          <div className="hidden sm:flex items-center gap-2 mr-2">
            <span className="text-[10px] px-2 py-1 rounded bg-surface-1 border border-card-border text-text-secondary font-mono">
              {totalIOCs} total IOCs
            </span>
            <span className="text-[10px] px-2 py-1 rounded bg-danger/10 border border-danger/20 text-danger font-mono">
              {activeIOCs} active threats
            </span>
          </div>
          <button className="export-btn" onClick={handleExportCSV}>
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </motion.div>

      {/* Search & Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-4"
      >
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search indicators..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-surface-1 border border-card-border text-sm text-white placeholder:text-text-muted"
            />
          </div>
          
          {/* Severity Filter */}
          <div className="flex items-center gap-1">
            {["all", "critical", "high", "medium"].map((sev) => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`px-2 py-1 rounded text-[10px] font-bold uppercase transition-colors ${
                  severityFilter === sev
                    ? "bg-accent/15 text-accent border border-accent/30"
                    : "text-text-muted hover:text-text-secondary"
                }`}
              >
                {sev}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            <Filter className="w-4 h-4 text-text-muted flex-shrink-0 mr-1" />
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? "bg-accent/15 text-accent border border-accent/30"
                      : "text-text-muted hover:text-text-secondary hover:bg-surface-1"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                  <span className="text-[10px] ml-1 px-1.5 py-0.5 rounded-full bg-surface-2 text-text-muted">
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="glass-card p-6"
        >
          {/* Domains */}
          {activeTab === "domains" && (
            <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-3">
              {filteredDomains.map((d, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className="p-4 rounded-lg bg-surface-1 border border-card-border hover:border-accent/20 transition-all group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <Globe className="w-4 h-4 text-accent" />
                      <code className="text-sm text-accent font-mono font-semibold">{d.domain}</code>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        d.status === "active" ? "bg-danger/15 text-danger" :
                        d.status === "sinkholed" ? "bg-warning/15 text-warning" :
                        "bg-text-muted/15 text-text-muted"
                      }`}>
                        {d.status}
                      </span>
                      <SeverityBadge severity={d.severity} />
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-[11px] text-text-muted">
                    <span className="flex items-center gap-1"><Target className="w-3 h-3" /> {d.category}</span>
                    <span className="flex items-center gap-1"><ExternalLink className="w-3 h-3" /> {d.registrar}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {d.firstSeen} → {d.lastSeen}</span>
                  </div>
                </motion.div>
              ))}
              {filteredDomains.length === 0 && (
                <div className="text-center text-text-muted text-sm py-8">No matching domains found</div>
              )}
            </motion.div>
          )}

          {/* IPs */}
          {activeTab === "ips" && (
            <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-3">
              {filteredIPs.map((ip, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className="p-4 rounded-lg bg-surface-1 border border-card-border hover:border-danger/20 transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <Server className="w-4 h-4 text-danger" />
                      <code className="text-sm text-danger font-mono font-bold">{ip.ip}</code>
                      <span className="text-xs text-text-muted font-mono">:{ip.port}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        ip.status === "active" ? "bg-danger/15 text-danger" : "bg-text-muted/15 text-text-muted"
                      }`}>
                        {ip.status}
                      </span>
                      <SeverityBadge severity={ip.severity} />
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-[11px] text-text-muted">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {ip.geo}</span>
                    <span className="font-mono">{ip.asn}</span>
                    <span className="flex items-center gap-1"><Target className="w-3 h-3" /> {ip.category}</span>
                  </div>
                </motion.div>
              ))}
              {filteredIPs.length === 0 && (
                <div className="text-center text-text-muted text-sm py-8">No matching IPs found</div>
              )}
            </motion.div>
          )}

          {/* Packages */}
          {activeTab === "packages" && (
            <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-3">
              {iocPackageNames.map((pkg, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className="flex items-center justify-between p-4 rounded-lg bg-surface-1 border border-card-border hover:border-accent/20 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Package className="w-4 h-4 text-accent" />
                    <div>
                      <code className="text-sm text-white font-mono">{pkg.name}</code>
                      <div className="text-[10px] text-text-muted mt-0.5">v{pkg.version}</div>
                    </div>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                    pkg.status === "primary" ? "bg-danger/15 text-danger" :
                    pkg.status === "variant" ? "bg-warning/15 text-warning" :
                    "bg-accent/15 text-accent"
                  }`}>
                    {pkg.status}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Hashes */}
          {activeTab === "hashes" && (
            <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-4">
              {hashes.map((h) => (
                <motion.div
                  key={h.label}
                  variants={itemVariants}
                  className="p-4 rounded-lg bg-surface-1 border border-card-border hover:border-accent/20 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-text-muted uppercase tracking-wider font-semibold flex items-center gap-2">
                      <Hash className="w-3.5 h-3.5" />
                      {h.label}
                    </span>
                    <button
                      onClick={() => handleCopy(h.value)}
                      className="flex items-center gap-1 text-xs text-text-muted hover:text-accent transition-colors px-2 py-1 rounded hover:bg-accent/10"
                    >
                      {copiedHash === h.value ? (
                        <><Check className="w-3.5 h-3.5 text-success" /><span className="text-success">Copied!</span></>
                      ) : (
                        <><Copy className="w-3.5 h-3.5" /><span>Copy</span></>
                      )}
                    </button>
                  </div>
                  <code className="text-sm text-accent font-mono break-all select-all">{h.value}</code>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Receivers */}
          {activeTab === "receivers" && (
            <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-3">
              {broadcastReceivers.map((br, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className="p-4 rounded-lg bg-surface-1 border border-card-border hover:border-danger/20 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <code className="text-sm text-danger font-mono">{br.className}</code>
                    <SeverityBadge severity={br.severity} />
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {br.intentFilters.map((f, j) => (
                      <span key={j} className="text-[10px] px-2 py-0.5 rounded bg-surface-2 text-text-secondary font-mono border border-card-border">
                        {f}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-text-secondary">{br.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-[10px] text-text-muted">
                    <span>Priority: <strong className={br.priority >= 900 ? "text-danger" : "text-warning"}>{br.priority}</strong></span>
                    <span>Exported: <strong className={br.exported ? "text-danger" : "text-success"}>{br.exported ? "YES" : "NO"}</strong></span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* API Calls */}
          {activeTab === "apis" && (
            <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-3">
              {filteredAPIs.map((api, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className="p-4 rounded-lg bg-surface-1 border border-card-border hover:border-warning/20 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-accent" />
                      <code className="text-sm text-accent font-mono">{api.api.split(".").pop()}</code>
                      <span className="text-text-muted text-xs">→</span>
                      <code className="text-xs text-warning font-mono">{api.method}</code>
                    </div>
                    <SeverityBadge severity={api.risk} />
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-text-muted mb-1">
                    <span className="font-mono">Class: <span className="text-text-secondary">{api.className}</span></span>
                  </div>
                  <p className="text-xs text-text-secondary">{api.description}</p>
                </motion.div>
              ))}
              {filteredAPIs.length === 0 && (
                <div className="text-center text-text-muted text-sm py-8">No matching API calls found</div>
              )}
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
