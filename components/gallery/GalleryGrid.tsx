"use client";

import { useState } from "react";
import { X, Star, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs } from "@/components/ui/tabs";

export interface PublicGalleryItem {
  _id:          string;
  title:        string;
  alt:          string;
  category:     string;
  fileUrl:      string;
  thumbnailUrl?: string;
  fileType:     string;
  isFeatured:   boolean;
  dimensions?:  { width: number; height: number };
}

const CATEGORY_TABS = [
  { value: "all",         label: "All" },
  { value: "hydropower",  label: "Hydropower" },
  { value: "solar",       label: "Solar" },
  { value: "agriculture", label: "Agriculture" },
  { value: "corporate",   label: "Corporate" },
  { value: "community",   label: "Community" },
  { value: "events",      label: "Events" },
];

const CATEGORY_COLORS: Record<string, string> = {
  hydropower:  "bg-teal/80 text-white",
  solar:       "bg-gold/80 text-white",
  agriculture: "bg-primary/80 text-white",
  corporate:   "bg-blue-500/80 text-white",
  community:   "bg-purple-500/80 text-white",
  events:      "bg-amber-500/80 text-white",
};

function Lightbox({
  item,
  onClose,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: {
  item: PublicGalleryItem;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      {/* Panel — stop click propagation so clicking image doesn't close */}
      <div
        className="relative max-w-5xl w-full max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 p-2 text-white/70 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Image */}
        <div className="relative rounded-2xl overflow-hidden bg-brand-deep flex items-center justify-center">
          <img
            src={item.fileUrl}
            alt={item.alt || item.title}
            className="max-h-[75vh] w-auto max-w-full object-contain"
          />
          {item.isFeatured && (
            <div className="absolute top-3 left-3">
              <Star className="h-5 w-5 text-gold fill-gold drop-shadow-lg" />
            </div>
          )}
          {/* Category tag */}
          <div className="absolute bottom-3 left-3">
            <span className={cn(
              "px-2.5 py-1 rounded-full text-[10px] font-semibold capitalize",
              CATEGORY_COLORS[item.category] ?? "bg-white/20 text-white"
            )}>
              {item.category}
            </span>
          </div>
        </div>

        {/* Caption + navigation */}
        <div className="flex items-center justify-between mt-3 px-1">
          <p className="text-sm font-medium text-white/90">{item.title}</p>
          <div className="flex items-center gap-2">
            <button
              onClick={onPrev}
              disabled={!hasPrev}
              className="px-3 py-1.5 text-xs text-white/70 hover:text-white disabled:opacity-30 border border-white/20 rounded-lg transition-colors"
            >
              ← Prev
            </button>
            <button
              onClick={onNext}
              disabled={!hasNext}
              className="px-3 py-1.5 text-xs text-white/70 hover:text-white disabled:opacity-30 border border-white/20 rounded-lg transition-colors"
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function GalleryGrid({ items }: { items: PublicGalleryItem[] }) {
  const [activeTab, setActiveTab] = useState("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered = items.filter(
    (i) => i.fileType === "image" && (activeTab === "all" || i.category === activeTab)
  );

  const featured = items.filter((i) => i.isFeatured && i.fileType === "image");

  function openLightbox(index: number) { setLightboxIndex(index); }
  function closeLightbox() { setLightboxIndex(null); }
  function goPrev() { setLightboxIndex((i) => (i !== null && i > 0 ? i - 1 : i)); }
  function goNext() { setLightboxIndex((i) => (i !== null && i < filtered.length - 1 ? i + 1 : i)); }

  const tabsWithCounts = CATEGORY_TABS.map((t) => ({
    ...t,
    count: t.value === "all"
      ? items.filter((i) => i.fileType === "image").length
      : items.filter((i) => i.fileType === "image" && i.category === t.value).length,
  })).filter((t) => t.value === "all" || t.count > 0);

  return (
    <>
      {/* Featured row */}
      {featured.length > 0 && activeTab === "all" && (
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-foreground-subtle mb-3 flex items-center gap-1.5">
            <Star className="h-3 w-3 text-gold fill-gold" /> Featured
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {featured.slice(0, 3).map((item) => {
              const idx = filtered.findIndex((f) => f._id === item._id);
              return (
                <button
                  key={item._id}
                  onClick={() => idx >= 0 && openLightbox(idx)}
                  className="group relative aspect-video rounded-2xl overflow-hidden border border-border bg-surface hover:border-primary/30 transition-colors"
                >
                  <img
                    src={item.thumbnailUrl || item.fileUrl}
                    alt={item.alt || item.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute top-2 left-2">
                    <Star className="h-4 w-4 text-gold fill-gold drop-shadow" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-200">
                    <p className="text-xs font-semibold text-white truncate">{item.title}</p>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ZoomIn className="h-8 w-8 text-white drop-shadow-lg" strokeWidth={1.5} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Category tabs */}
      <Tabs tabs={tabsWithCounts} active={activeTab} onChange={setActiveTab} className="mb-6" />

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center text-sm text-foreground-muted">
          No images in this category yet.
        </div>
      ) : (
        <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
          {filtered.map((item, index) => (
            <button
              key={item._id}
              onClick={() => openLightbox(index)}
              className="group relative w-full break-inside-avoid rounded-xl overflow-hidden border border-border bg-surface hover:border-primary/30 transition-colors block"
            >
              <img
                src={item.thumbnailUrl || item.fileUrl}
                alt={item.alt || item.title}
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              {item.isFeatured && (
                <div className="absolute top-2 left-2">
                  <Star className="h-3.5 w-3.5 text-gold fill-gold drop-shadow" />
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 p-2.5 translate-y-full group-hover:translate-y-0 transition-transform duration-200">
                <p className="text-[11px] font-semibold text-white truncate">{item.title}</p>
                <span className={cn(
                  "mt-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase inline-block",
                  CATEGORY_COLORS[item.category] ?? "bg-white/20 text-white"
                )}>
                  {item.category}
                </span>
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn className="h-6 w-6 text-white drop-shadow-lg" strokeWidth={1.5} />
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          item={filtered[lightboxIndex]}
          onClose={closeLightbox}
          onPrev={goPrev}
          onNext={goNext}
          hasPrev={lightboxIndex > 0}
          hasNext={lightboxIndex < filtered.length - 1}
        />
      )}
    </>
  );
}
