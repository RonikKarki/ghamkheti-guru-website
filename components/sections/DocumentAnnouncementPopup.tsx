"use client";

import { useState, useEffect } from "react";
import { X, FileText, Download, ArrowUpRight } from "lucide-react";
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

interface Props {
  documents: AnnouncementDoc[];
}

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

const STORAGE_KEY = "ghamkheti_dismissed_docs";

function getDismissed(): Set<string> {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

function addDismissed(id: string) {
  try {
    const set = getDismissed();
    set.add(id);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(set)));
  } catch {}
}

export function DocumentAnnouncementPopup({ documents }: Props) {
  const [visible, setVisible] = useState<AnnouncementDoc[]>([]);
  const [current, setCurrent] = useState(0);

  // Only reveal after mount so sessionStorage is available
  useEffect(() => {
    const dismissed = getDismissed();
    const toShow = documents.filter((d) => !dismissed.has(d._id));
    setVisible(toShow);
  }, [documents]);

  function dismiss(id: string) {
    addDismissed(id);
    setVisible((prev) => {
      const next = prev.filter((d) => d._id !== id);
      if (current >= next.length && current > 0) setCurrent(next.length - 1);
      return next;
    });
  }

  if (visible.length === 0) return null;

  const doc = visible[current];
  const typeLabel = TYPE_LABEL[doc.type] ?? "Document";

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center px-4"
        style={{ backgroundColor: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
        onClick={() => dismiss(doc._id)}
      >
        <motion.div
          key={doc._id}
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 8 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-md rounded-2xl bg-card border border-border shadow-2xl overflow-hidden"
        >
          {/* Top accent bar */}
          <div className="h-1 w-full bg-gradient-to-r from-primary via-teal to-gold" />

          {/* Close button */}
          <button
            onClick={() => dismiss(doc._id)}
            className="absolute top-4 right-4 h-7 w-7 rounded-full flex items-center justify-center bg-surface hover:bg-surface-raised text-foreground-subtle hover:text-foreground transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>

          <div className="p-6">
            {/* Header */}
            <div className="flex items-start gap-4 mb-5">
              <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                <FileText className="h-5 w-5 text-primary" strokeWidth={1.8} />
              </div>
              <div className="min-w-0 pr-6">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-primary mb-1">
                  {typeLabel}{doc.fiscalYear ? ` · ${doc.fiscalYear}` : ""}
                </p>
                <h3 className="font-display font-semibold text-foreground text-lg leading-snug">
                  {doc.title}
                </h3>
              </div>
            </div>

            <p className="text-sm text-foreground-muted leading-relaxed mb-6">
              {doc.isRestricted
                ? "This document is available to registered investors. Contact our Investor Relations team to request access."
                : "Now available for download. Click below to access this document."}
            </p>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {doc.isRestricted ? (
                <a
                  href="/contact"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
                >
                  Contact IR Team
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              ) : (
                <a
                  href={doc.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => dismiss(doc._id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
                >
                  <Download className="h-3.5 w-3.5" />
                  {doc.homepageLabel || `Download ${doc.fileType?.toUpperCase() ?? "PDF"}`}
                </a>
              )}
              <button
                onClick={() => dismiss(doc._id)}
                className="px-4 py-2.5 rounded-xl border border-border text-sm text-foreground-muted hover:text-foreground hover:bg-surface transition-colors"
              >
                Dismiss
              </button>
            </div>

            {/* Pagination dots for multiple docs */}
            {visible.length > 1 && (
              <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-border">
                <span className="text-[10px] text-foreground-subtle">
                  {current + 1} of {visible.length} announcements
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
