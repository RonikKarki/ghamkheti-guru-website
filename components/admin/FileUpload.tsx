"use client";

import { useRef, useState, DragEvent, ChangeEvent } from "react";
import { Upload, X, FileText, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  value?: string;          // current URL (shown as preview / filename)
  onChange: (url: string, meta?: { size: number; mimeType: string; filename: string }) => void;
  kind?: "image" | "document";
  accept?: string;
  label?: string;
  className?: string;
}

export function FileUpload({
  value,
  onChange,
  kind = "image",
  accept,
  label,
  className,
}: FileUploadProps) {
  const inputRef   = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const acceptAttr = accept ?? (kind === "image"
    ? "image/jpeg,image/jpg,image/png,image/webp,image/gif,image/svg+xml"
    : ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx");

  async function upload(file: File) {
    setLoading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("kind", kind);
      const res  = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Upload failed");
      onChange(json.data.url, { size: json.data.size, mimeType: json.data.mimeType, filename: json.data.filename });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setLoading(false);
    }
  }

  function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    upload(files[0]);
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  }

  function onDragOver(e: DragEvent) { e.preventDefault(); setDragging(true); }
  function onDragLeave() { setDragging(false); }
  function onChange_(e: ChangeEvent<HTMLInputElement>) { handleFiles(e.target.files); }

  const isImage = kind === "image";
  const hasValue = !!value;

  return (
    <div className={cn("space-y-2", className)}>
      {label && <p className="text-xs font-medium text-foreground">{label}</p>}

      <div
        onClick={() => !loading && inputRef.current?.click()}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        className={cn(
          "relative rounded-xl border-2 border-dashed transition-colors cursor-pointer",
          dragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-surface",
          loading && "pointer-events-none opacity-60"
        )}
      >
        {/* Image preview */}
        {isImage && hasValue ? (
          <div className="relative aspect-video rounded-lg overflow-hidden">
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <p className="text-white text-xs font-medium">Click to replace</p>
            </div>
          </div>
        ) : hasValue && !isImage ? (
          <div className="flex items-center gap-3 p-4">
            <div className="h-10 w-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground truncate">{value.split("/").pop()}</p>
              <p className="text-xs text-foreground-subtle">Click to replace</p>
            </div>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onChange(""); }}
              className="shrink-0 p-1 rounded hover:bg-red-500/10 text-foreground-subtle hover:text-red-400 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 py-8 px-4 text-center">
            {loading ? (
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            ) : (
              <Upload className="h-8 w-8 text-foreground-subtle" />
            )}
            <div>
              <p className="text-sm font-medium text-foreground">
                {loading ? "Uploading…" : "Click or drag & drop"}
              </p>
              <p className="text-xs text-foreground-subtle mt-0.5">
                {isImage ? "JPG, PNG, WebP, GIF, SVG — max 10 MB" : "PDF, Word, Excel, PowerPoint — max 50 MB"}
              </p>
            </div>
          </div>
        )}

        {/* Loading overlay for image preview */}
        {loading && isImage && hasValue && (
          <div className="absolute inset-0 bg-background/60 rounded-lg flex items-center justify-center">
            <Loader2 className="h-6 w-6 text-primary animate-spin" />
          </div>
        )}
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}

      {/* Clear button for images with value */}
      {isImage && hasValue && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="text-xs text-foreground-subtle hover:text-red-400 transition-colors flex items-center gap-1"
        >
          <X className="h-3 w-3" /> Remove image
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={acceptAttr}
        className="hidden"
        onChange={onChange_}
      />
    </div>
  );
}
