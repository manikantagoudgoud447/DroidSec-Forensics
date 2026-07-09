"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Copy, Check } from "lucide-react";

interface CodeBlockProps {
  code: string;
  language: string;
  title?: string;
  collapsible?: boolean;
  defaultExpanded?: boolean;
  maxHeight?: string;
}

export default function CodeBlock({
  code,
  language,
  title,
  collapsible = true,
  defaultExpanded = false,
  maxHeight = "400px",
}: CodeBlockProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.split("\n");

  return (
    <div className="code-block overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#21262d] bg-[#161b22]">
        <div className="flex items-center gap-3">
          {collapsible && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-text-muted hover:text-accent transition-colors"
            >
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          )}
          {title && <span className="text-sm font-medium text-text-secondary">{title}</span>}
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-accent/10 text-accent border border-accent/20">
            {language}
          </span>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-text-muted hover:text-accent transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-success" />
              <span className="text-success">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Content */}
      <AnimatePresence initial={false}>
        {(!collapsible || expanded) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div
              className="overflow-auto p-4"
              style={{ maxHeight }}
            >
              <pre className="text-[13px] leading-relaxed">
                {lines.map((line, i) => (
                  <div key={i} className="flex">
                    <span className="line-number select-none">{i + 1}</span>
                    <code className="text-[#c9d1d9] flex-1">{line}</code>
                  </div>
                ))}
              </pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapsed indicator */}
      {collapsible && !expanded && (
        <button
          onClick={() => setExpanded(true)}
          className="w-full py-2 text-xs text-text-muted hover:text-accent transition-colors flex items-center justify-center gap-1 bg-[#0d1117]/50"
        >
          <ChevronDown className="w-3 h-3" />
          {lines.length} lines — Click to expand
        </button>
      )}
    </div>
  );
}
