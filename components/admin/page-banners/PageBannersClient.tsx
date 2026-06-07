"use client";

import { useState, useTransition } from "react";
import { Save, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { Input } from "@/components/ui/input";
import { FileUpload } from "@/components/admin/FileUpload";
import { useToast } from "@/lib/toast";

interface BannerDoc {
  page:       string;
  imageUrl?:  string;
  imageAlt?:  string;
  isActive?:  boolean;
}

const PAGE_LABELS: Record<string, string> = {
  about:              "About Us",
  projects:           "Projects",
  blog:               "News & Blog",
  media:              "Media",
  contact:            "Contact",
  investor_relations: "Investor Relations",
  services:           "Services",
  team:               "Team",
  gallery:            "Gallery",
};

const PAGE_KEYS = Object.keys(PAGE_LABELS);

export default function PageBannersClient({ initialData }: { initialData: BannerDoc[] }) {
  const { success, error } = useToast();
  const [banners, setBanners] = useState<Record<string, BannerDoc>>(
    Object.fromEntries(
      PAGE_KEYS.map((p) => {
        const found = initialData.find((d) => d.page === p);
        return [p, found ?? { page: p, imageUrl: "", imageAlt: "", isActive: true }];
      })
    )
  );
  const [saving, setSaving] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function patch(page: string, delta: Partial<BannerDoc>) {
    setBanners((prev) => ({ ...prev, [page]: { ...prev[page], ...delta } }));
  }

  function save(page: string) {
    startTransition(async () => {
      setSaving(page);
      const b = banners[page];
      const res = await fetch("/api/admin/page-banner", {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ page, imageUrl: b.imageUrl, imageAlt: b.imageAlt, isActive: b.isActive }),
      });
      setSaving(null);
      const json = await res.json();
      if (!res.ok) { error("Save failed", json.error); return; }
      success(`${PAGE_LABELS[page]} banner saved`);
    });
  }

  return (
    <div className="max-w-3xl space-y-5">
      <PageHeader
        title="Page Banners"
        description="Upload background images for each page's top banner/hero area"
      />

      <div className="space-y-4">
        {PAGE_KEYS.map((page) => {
          const b = banners[page];
          const isSaving = saving === page;
          return (
            <div key={page} className="rounded-xl bg-surface border border-border p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">{PAGE_LABELS[page]}</h3>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => patch(page, { isActive: !(b.isActive ?? true) })}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold border transition-colors ${
                      b.isActive !== false
                        ? "border-primary/40 text-primary bg-primary/10 hover:bg-primary/20"
                        : "border-amber-500/40 text-amber-400 bg-amber-500/10 hover:bg-amber-500/20"
                    }`}
                  >
                    {b.isActive !== false ? "Enabled" : "Disabled"}
                  </button>
                  <button
                    type="button"
                    onClick={() => save(page)}
                    disabled={isSaving}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-50 transition-colors"
                  >
                    {isSaving ? <RefreshCw className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
                    Save
                  </button>
                </div>
              </div>

              <FileUpload
                kind="image"
                value={b.imageUrl ?? ""}
                onChange={(url) => patch(page, { imageUrl: url })}
                label="Banner image (recommended: 1920×600, landscape)"
              />

              <div>
                <span className="text-xs font-medium text-foreground block mb-1.5">
                  Alt text <span className="text-foreground-subtle font-normal">(for accessibility)</span>
                </span>
                <Input
                  value={b.imageAlt ?? ""}
                  onChange={(e) => patch(page, { imageAlt: e.target.value })}
                  placeholder={`${PAGE_LABELS[page]} page banner`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
