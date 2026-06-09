"use client";

import { Pencil, MapPin, Phone, Mail, Globe, Image as ImageIcon, Layers, Package } from "lucide-react";
import { Sheet } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export interface AdminSubsidiary {
  _id:              string;
  slug:             string;
  name:             string;
  industry:         string;
  shortDescription: string;
  description:      string;
  location:         string;
  ownership:        string;
  establishedYear?: number;
  logoImage?:       string;
  bannerImage?:     string;
  gallery:          Array<{ url: string; alt: string }>;
  activities:       Array<{ title: string; description: string; order: number }>;
  products:         Array<{ name: string; description: string; image?: string; order: number }>;
  contact:          { phone?: string; email?: string; website?: string };
  isActive:         boolean;
  isFeatured:       boolean;
  order:            number;
  seoTitle?:        string;
  seoDescription?:  string;
  ogImage?:         string;
  createdAt:        string;
  updatedAt:        string;
}

function SectionTitle({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <div className="flex items-center gap-2 pb-2 border-b border-border">
      <Icon className="h-3.5 w-3.5 text-primary" />
      <h3 className="text-xs font-semibold text-foreground uppercase tracking-wide">{label}</h3>
    </div>
  );
}

function KV({ label, value }: { label: string; value?: string | number | null }) {
  if (!value && value !== 0) return null;
  return (
    <div>
      <p className="text-[10px] text-foreground-subtle">{label}</p>
      <p className="text-xs font-medium text-foreground mt-0.5">{value}</p>
    </div>
  );
}

interface SubsidiaryDrawerProps {
  subsidiary: AdminSubsidiary | null;
  open:       boolean;
  onClose:    () => void;
  onEdit:     (s: AdminSubsidiary) => void;
}

export function SubsidiaryDrawer({ subsidiary, open, onClose, onEdit }: SubsidiaryDrawerProps) {
  if (!subsidiary) return null;

  return (
    <Sheet
      open={open}
      onClose={onClose}
      size="lg"
      footer={
        <button
          onClick={() => { onEdit(subsidiary); onClose(); }}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
        >
          <Pencil className="h-3.5 w-3.5" /> Edit Subsidiary
        </button>
      }
    >
      {/* Hero */}
      {subsidiary.bannerImage ? (
        <div className="relative h-44 w-full bg-surface">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={subsidiary.bannerImage} alt={subsidiary.name} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent" />
        </div>
      ) : (
        <div className="h-28 w-full bg-surface flex items-center justify-center border-b border-border">
          <ImageIcon className="h-8 w-8 text-foreground-subtle/30" />
        </div>
      )}

      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start gap-3">
          {subsidiary.logoImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={subsidiary.logoImage} alt="" className="h-12 w-12 rounded-lg object-contain bg-surface border border-border p-1 shrink-0" />
          )}
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h2 className="text-base font-semibold text-foreground leading-tight">{subsidiary.name}</h2>
              {subsidiary.isFeatured && (
                <span className="text-[10px] font-semibold text-gold border border-gold/30 bg-gold/10 px-2 py-0.5 rounded-full">Featured</span>
              )}
            </div>
            <p className="text-xs text-primary font-medium">{subsidiary.industry}</p>
            {subsidiary.location && <p className="text-xs text-foreground-subtle mt-0.5">{subsidiary.location}</p>}
            <span className={cn(
              "inline-block mt-2 text-[10px] font-semibold px-2 py-0.5 rounded-full border",
              subsidiary.isActive
                ? "bg-primary/10 text-primary border-primary/25"
                : "bg-surface-raised text-foreground-subtle border-border"
            )}>
              {subsidiary.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>

        {/* Description */}
        {subsidiary.shortDescription && (
          <p className="text-sm text-foreground-muted leading-relaxed">{subsidiary.shortDescription}</p>
        )}

        {/* Info */}
        <div className="space-y-3">
          <SectionTitle icon={MapPin} label="Details" />
          <div className="grid grid-cols-2 gap-3">
            <KV label="Industry"         value={subsidiary.industry} />
            <KV label="Location"         value={subsidiary.location} />
            <KV label="Ownership"        value={subsidiary.ownership} />
            <KV label="Established"      value={subsidiary.establishedYear} />
            <KV label="Display Order"    value={subsidiary.order} />
          </div>
        </div>

        {/* Contact */}
        {(subsidiary.contact.phone || subsidiary.contact.email || subsidiary.contact.website) && (
          <div className="space-y-3">
            <SectionTitle icon={Phone} label="Contact" />
            <div className="space-y-2">
              {subsidiary.contact.phone   && <div className="flex items-center gap-2 text-xs text-foreground-muted"><Phone className="h-3 w-3 shrink-0" />{subsidiary.contact.phone}</div>}
              {subsidiary.contact.email   && <div className="flex items-center gap-2 text-xs text-foreground-muted"><Mail  className="h-3 w-3 shrink-0" />{subsidiary.contact.email}</div>}
              {subsidiary.contact.website && <div className="flex items-center gap-2 text-xs text-foreground-muted"><Globe className="h-3 w-3 shrink-0" />{subsidiary.contact.website}</div>}
            </div>
          </div>
        )}

        {/* Activities */}
        {subsidiary.activities.length > 0 && (
          <div className="space-y-3">
            <SectionTitle icon={Layers} label={`Activities (${subsidiary.activities.length})`} />
            <div className="space-y-1.5">
              {subsidiary.activities.map((a, i) => (
                <div key={i} className="rounded-lg bg-surface border border-border px-3 py-2">
                  <p className="text-xs font-medium text-foreground">{a.title}</p>
                  {a.description && <p className="text-[11px] text-foreground-subtle mt-0.5">{a.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Products */}
        {subsidiary.products.length > 0 && (
          <div className="space-y-3">
            <SectionTitle icon={Package} label={`Products (${subsidiary.products.length})`} />
            <div className="grid grid-cols-2 gap-2">
              {subsidiary.products.map((p, i) => (
                <div key={i} className="rounded-lg bg-surface border border-border p-2.5">
                  {p.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.image} alt={p.name} className="h-16 w-full object-cover rounded mb-2 border border-border" />
                  )}
                  <p className="text-[11px] font-semibold text-foreground">{p.name}</p>
                  {p.description && <p className="text-[10px] text-foreground-subtle mt-0.5 line-clamp-2">{p.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Gallery */}
        {subsidiary.gallery.length > 0 && (
          <div className="space-y-3">
            <SectionTitle icon={ImageIcon} label={`Gallery (${subsidiary.gallery.length})`} />
            <div className="grid grid-cols-4 gap-2">
              {subsidiary.gallery.map((g, i) => (
                <div key={i} className="aspect-square rounded-lg border border-border overflow-hidden bg-surface">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={g.url} alt={g.alt || `Image ${i + 1}`} className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Slug */}
        <div className="pt-3 border-t border-border">
          <p className="text-[10px] text-foreground-subtle">URL Slug</p>
          <p className="text-xs font-mono text-foreground mt-0.5">/subsidiaries/{subsidiary.slug}</p>
        </div>
      </div>
    </Sheet>
  );
}
