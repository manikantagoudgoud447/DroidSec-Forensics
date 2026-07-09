"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2, Zap, Clock, Calendar, Shield, ArrowRight,
  AlertTriangle, Target, Network, Lock, Share2, Circle,
  type LucideIcon
} from "lucide-react";
import { recommendations } from "@/lib/forensicData";

const priorityConfig = {
  immediate: { color: "#ff3366", bg: "bg-danger/10", border: "border-danger/25", icon: Zap, label: "IMMEDIATE" },
  "short-term": { color: "#ffaa00", bg: "bg-warning/10", border: "border-warning/25", icon: Clock, label: "SHORT-TERM" },
  "long-term": { color: "#00d4ff", bg: "bg-accent/10", border: "border-accent/25", icon: Calendar, label: "LONG-TERM" },
};

const categoryIcons: Record<string, LucideIcon> = {
  "Network Defense": Network,
  "Endpoint Security": Shield,
  "Incident Response": AlertTriangle,
  "Detection Engineering": Target,
  "Security Policy": Lock,
  "Application Security": Shield,
  "Threat Intelligence": Share2,
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

export default function Recommendations() {
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

  const toggleStep = (recId: string, stepIdx: number) => {
    const key = `${recId}-${stepIdx}`;
    setCompletedSteps((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isStepComplete = (recId: string, stepIdx: number) => {
    return completedSteps[`${recId}-${stepIdx}`] || false;
  };

  const getRecCompletionPercent = (recId: string, totalSteps: number) => {
    let done = 0;
    for (let i = 0; i < totalSteps; i++) {
      if (completedSteps[`${recId}-${i}`]) done++;
    }
    return Math.round((done / totalSteps) * 100);
  };

  const grouped = {
    immediate: recommendations.filter((r) => r.priority === "immediate"),
    "short-term": recommendations.filter((r) => r.priority === "short-term"),
    "long-term": recommendations.filter((r) => r.priority === "long-term"),
  };

  const totalSteps = recommendations.reduce((acc, r) => acc + r.steps.length, 0);
  const completedCount = Object.values(completedSteps).filter(Boolean).length;
  const overallPercent = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-white">
            <span className="text-accent glow-text-blue">Recommendations</span>
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Remediation strategy and security improvements based on forensic findings
          </p>
        </div>
        {/* Overall Progress */}
        <div className="flex items-center gap-3 min-w-[200px]">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">REMEDIATION PROGRESS</span>
              <span className="text-xs font-mono text-accent">{overallPercent}%</span>
            </div>
            <div className="w-full h-2.5 bg-surface-2 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-danger via-warning to-success"
                animate={{ width: `${overallPercent}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
          <span className="text-xs text-text-muted font-mono">{completedCount}/{totalSteps}</span>
        </div>
      </motion.div>

      {/* Priority Summary */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        {(["immediate", "short-term", "long-term"] as const).map((priority) => {
          const config = priorityConfig[priority];
          const Icon = config.icon;
          const items = grouped[priority];
          const priorityCompleted = items.reduce((acc, r) => {
            let c = 0;
            r.steps.forEach((_, i) => { if (isStepComplete(r.id, i)) c++; });
            return acc + c;
          }, 0);
          const priorityTotal = items.reduce((acc, r) => acc + r.steps.length, 0);
          const pPercent = priorityTotal > 0 ? Math.round((priorityCompleted / priorityTotal) * 100) : 0;

          return (
            <motion.div
              key={priority}
              variants={itemVariants}
              className={`glass-card p-5 ${config.bg} ${config.border}`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: `${config.color}15`, border: `1px solid ${config.color}30` }}
                >
                  <Icon className="w-5 h-5" style={{ color: config.color }} />
                </div>
                <div>
                  <div className="text-xs text-text-muted uppercase tracking-wider">{config.label}</div>
                  <div className="text-2xl font-bold font-mono" style={{ color: config.color }}>
                    {items.length}
                  </div>
                </div>
              </div>
              <div className="text-[11px] text-text-secondary mb-2">
                {priority === "immediate" ? "Actions needed within 24 hours" :
                 priority === "short-term" ? "Deploy within 1-2 weeks" :
                 "Strategic improvements over 1-3 months"}
              </div>
              {/* Progress bar */}
              <div className="w-full h-1.5 bg-surface-2 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: config.color }}
                  animate={{ width: `${pPercent}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <div className="text-[10px] text-text-muted mt-1 font-mono">{priorityCompleted}/{priorityTotal} steps completed</div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Recommendations by Priority */}
      {(["immediate", "short-term", "long-term"] as const).map((priority, sectionIdx) => {
        const config = priorityConfig[priority];
        const Icon = config.icon;
        const items = grouped[priority];

        return (
          <motion.div
            key={priority}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * (sectionIdx + 1) }}
            className="glass-card p-6"
          >
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Icon className="w-4 h-4" style={{ color: config.color }} />
              {config.label} Actions
              <span
                className="ml-2 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase"
                style={{
                  background: `${config.color}15`,
                  color: config.color,
                  border: `1px solid ${config.color}30`,
                }}
              >
                {items.length} items
              </span>
            </h3>

            <div className="space-y-4">
              {items.map((rec) => {
                const CatIcon = categoryIcons[rec.category] || Shield;
                const pct = getRecCompletionPercent(rec.id, rec.steps.length);
                return (
                  <div
                    key={rec.id}
                    className="p-5 rounded-lg bg-surface-1 border border-card-border hover:border-card-border/80 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ background: `${config.color}10`, border: `1px solid ${config.color}20` }}
                        >
                          <CatIcon className="w-4 h-4" color={config.color} />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-white">{rec.title}</div>
                          <div className="text-[10px] text-text-muted uppercase tracking-wider mt-0.5">{rec.category}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono" style={{ color: pct === 100 ? "#00ff88" : config.color }}>{pct}%</span>
                        <code className="text-[10px] text-text-muted font-mono">{rec.id}</code>
                      </div>
                    </div>

                    <p className="text-xs text-text-secondary mb-3">{rec.description}</p>

                    {/* Completion bar */}
                    <div className="w-full h-1 bg-surface-2 rounded-full overflow-hidden mb-3">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: pct === 100 ? "#00ff88" : config.color }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>

                    <div className="space-y-1.5">
                      {rec.steps.map((step, j) => {
                        const done = isStepComplete(rec.id, j);
                        return (
                          <div
                            key={j}
                            className={`flex items-start gap-2 text-xs cursor-pointer rounded px-2 py-1.5 transition-colors ${
                              done ? "bg-success/5" : "hover:bg-surface-2"
                            }`}
                            onClick={() => toggleStep(rec.id, j)}
                          >
                            {done ? (
                              <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                            ) : (
                              <Circle className="w-4 h-4 text-text-muted flex-shrink-0 mt-0.5" />
                            )}
                            <span className={`${done ? "text-text-muted line-through" : "text-text-secondary"}`}>{step}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
