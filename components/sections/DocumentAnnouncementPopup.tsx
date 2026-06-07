"use client";

import { useState } from "react";
import { X, FileText, Download, ArrowUpRight, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface AnnouncementDoc {
  _id:           string;
  title:         string;
  type:          string;
  fileUrl:       string;
  fileType?:     string;
  fiscalYear?:   string;
  isRestricted:  boolean;
  homepageLabel?: string;
}

interface Props { documents: AnnouncementDoc[] }

const TYPE_LABEL: Record<string, string> = {
  annual_report:         "Annual Report",
  quarterly_results:     "Quarterly Results",
  prospectus:            "Prospectus",
  agm_notice:            "AGM Notice",
  agm_minutes:           "AGM Minutes",
  board_resolution:      "Board Resolution",
  governance_policy:     "Governance Policy",
  sustainability_report: "Sustainability Report",
  project_brief:         "Project Brief",
  other:                 "Document",
};

const isPdf = (url: string) =>
  url.toLowerCase().endsWith(".pdf") || url.includes(".pdf?");

export function DocumentAnnouncementPopup({ documents }: Props) {
  const [visible, setVisible] = useState<AnnouncementDoc[]>(documents);
  const [current, setCurrent] = useState(0);

  function dismiss(id: string) {
    setVisible((prev) => {
      const next = prev.filter((d) => d._id !== id);
      if (current >= next.length && current > 0) setCurrent(next.length - 1);
      return next;
    });
  }

  if (visible.length === 0) return null;

  const doc = visible[current];
  const typeLabel = TYPE_LABEL[doc.type] ?? "Document";
  const canEmbed  = !doc.isRestricted && isPdf(doc.fileUrl);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: "rgba(0,0,0,0.70)", backdropFilter: "blur(6px)" }}
        onClick={() => dismiss(doc._id)}
      >
        <motion.div
          key={doc._id}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1,    y: 0  }}
          exit={   { opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-4xl rounded-2xl bg-card border border-border shadow-2xl overflow-hidden flex flex-col"
          style={{ maxHeight: "90vh" }}
        >
          {/* Accent bar */}
          <div className="h-1 w-full bg-gradient-to-r from-primary via-teal to-gold shrink-0" />

          {/* Header */}
          <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-border shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-9 w-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                <FileText className="h-4 w-4 text-primary" strokeWidth={1.8} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-primary">
                  {typeLabel}{doc.fiscalYear ? ` · ${doc.fiscalYear}` : ""}
                </p>
                <h3 className="font-display font-semibold text-foreground text-base leading-snug truncate">
                  {doc.title}
                </h3>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {!doc.isRestricted && (
                <a
                  href={doc.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Open in new tab"
                  className="p-2 rounded-lg text-foreground-subtle hover:text-primary hover:bg-primary/10 transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
              <button
                onClick={() => dismiss(doc._id)}
                className="p-2 rounded-lg text-foreground-subtle hover:text-foreground hover:bg-surface transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Body — PDF embed or restricted message */}
          <div className="flex-1 overflow-hidden">
            {canEmbed ? (
              <iframe
                src={`${doc.fileUrl}#toolbar=1&navpanes=1`}
                className="w-full h-full border-0"
                style={{ minHeight: "60vh" }}
                title={doc.title}
              />
            ) : (
              <div className="flex flex-col items-center justify-center gap-4 py-16 px-8 text-center">
                <div className="h-16 w-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <FileText className="h-8 w-8 text-primary" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-2">{doc.title}</p>
                  <p className="text-sm text-foreground-muted max-w-sm">
                    {doc.isRestricted
                      ? "This document is available to registered investors. Contact our Investor Relations team to request access."
                      : "Click the button below to download and view this document."}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between gap-3 px-5 py-4 border-t border-border bg-surface shrink-0">
            <div className="flex items-center gap-3">
              {doc.isRestricted ? (
                <a
                  href="/contact"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
                >
                  Contact IR Team <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              ) : (
                <a
                  href={doc.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => dismiss(doc._id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
                >
                  <Download className="h-3.5 w-3.5" />
                  {doc.homepageLabel || `Download ${doc.fileType?.toUpperCase() ?? "PDF"}`}
                </a>
              )}
              <button
                onClick={() => dismiss(doc._id)}
                className="px-4 py-2 rounded-lg border border-border text-sm text-foreground-muted hover:text-foreground hover:bg-card transition-colors"
              >
                Dismiss
              </button>
            </div>

            {visible.length > 1 && (
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-foreground-subtle">
                  {current + 1} / {visible.length}
                </span>
                <div className="flex gap-1.5">
                  {visible.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrent(i)}
                      className={`h-1.5 rounded-full transition-all ${
                        i === current ? "w-4 bg-primary" : "w-1.5 bg-border"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
