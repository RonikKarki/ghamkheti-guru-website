"use client";

import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
  open:         boolean;
  onClose:      () => void;
  onConfirm:    () => void;
  title?:       string;
  description?: string;
  confirmLabel?: string;
  isLoading?:   boolean;
  variant?:     "danger" | "warning";
}

export function ConfirmDialog({
  open, onClose, onConfirm,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmLabel = "Delete",
  isLoading,
  variant = "danger",
}: ConfirmDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      size="sm"
      footer={
        <>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-foreground-muted hover:text-foreground hover:bg-surface rounded-lg transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500/25 border border-red-500/25 transition-colors disabled:opacity-50"
          >
            {isLoading && (
              <span className="h-3.5 w-3.5 rounded-full border-2 border-red-400/30 border-t-red-400 animate-spin" />
            )}
            {confirmLabel}
          </button>
        </>
      }
    >
      <div className="flex flex-col items-center text-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20">
          <AlertTriangle className="h-6 w-6 text-red-400" strokeWidth={1.5} />
        </div>
        <div>
          <p className="font-semibold text-foreground">{title}</p>
          <p className="text-sm text-foreground-muted mt-1">{description}</p>
        </div>
      </div>
    </Dialog>
  );
}
