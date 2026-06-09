"use client";

import { Pencil, MapPin, Zap, TrendingUp, Calendar, FileText, Image as ImageIcon, Star } from "lucide-react";
import { Sheet } from "@/components/ui/sheet";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { cn } from "@/lib/utils";

export interface AdminProject {
  _id:              string;
  slug:             string;
  name:             string;
  category:         string;
  status:           string;
  isActive:         boolean;
  description:      string;
  objectives?:      string;
  bannerImage?:     string;
  logoImage?:       string;
  isFeatured:       boolean;
  location:         { district: string; province: string; river?: string; elevation?: number };
  capacity?:        { value: number; unit: string };
  highlights:       Array<{ label: string; value: string }>;
  images:           Array<{ url: string; alt: string; isCover: boolean }>;
  documents:        Array<{ url: string; name: string; type: string; size?: number }>;
  timeline:         Array<{ title: string; date?: string; completed: boolean; description?: string }>;
  codDate?:         string;
  constructionStart?: string;
  investmentValue?: number;
  ppa?:             { authority: string; term: number; tariff?: number };
  order:            number;
  seoTitle?:        string;
  seoDescription?:  string;
  createdAt:        string;
  updatedAt:        string;
}

const CATEGORY_COLORS: Record<string, string> = {
  hydropower:  "bg-blue-500/15 text-blue-400 border-blue-500/25",
  solar:       "bg-gold/15 text-gold border-gold/25",
  agriculture: "bg-primary/15 text-primary border-primary/25",
  "agri-solar": "bg-teal/15 text-teal border-teal/25",
};

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

function fmtDate(d?: string) {
  if (!d) return null;
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(new Date(d));
}

interface ProjectDrawerProps {
  project:  AdminProject | null;
  open:     boolean;
  onClose:  () => void;
  onEdit:   (p: AdminProject) => void;
}

export function ProjectDrawer({ project, open, onClose, onEdit }: ProjectDrawerProps) {
  if (!project) return null;

  const coverImage = project.images.find((i) => i.isCover) ?? project.images[0];

  return (
    <Sheet
      open={open}
      onClose={onClose}
      size="lg"
      footer={
        <button
          onClick={() => { onEdit(project); onClose(); }}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
        >
          <Pencil className="h-3.5 w-3.5" /> Edit Project
        </button>
      }
    >
      {/* Hero image */}
      {coverImage ? (
        <div className="relative h-44 w-full bg-surface">
          <img
            src={coverImage.url}
            alt={coverImage.alt || project.name}
            className="h-full w-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).parentElement!.style.display = "none"; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent" />
        </div>
      ) : (
        <div className="h-32 w-full bg-surface flex items-center justify-center border-b border-border">
          <ImageIcon className="h-8 w-8 text-foreground-subtle/30" />
        </div>
      )}

      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-start justify-between gap-3 mb-2">
            <h2 className="text-lg font-semibold text-foreground leading-tight">{project.name}</h2>
            {project.isFeatured && (
              <span className="shrink-0 flex items-center gap-1 text-[10px] font-semibold text-gold border border-gold/30 bg-gold/10 px-2 py-0.5 rounded-full">
                <Star className="h-2.5 w-2.5" fill="currentColor" /> Featured
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={cn("inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full border capitalize", CATEGORY_COLORS[project.category] ?? "bg-surface text-foreground-muted border-border")}>
              {project.category}
            </span>
            <StatusBadge status={project.status} size="sm" />
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-foreground-muted leading-relaxed whitespace-pre-wrap">{project.description}</p>

        {/* Location */}
        <div className="space-y-3">
          <SectionTitle icon={MapPin} label="Location" />
          <div className="grid grid-cols-2 gap-3">
            <KV label="District"   value={project.location.district} />
            <KV label="Province"   value={project.location.province} />
            <KV label="River"      value={project.location.river} />
            <KV label="Elevation"  value={project.location.elevation ? `${project.location.elevation} m` : undefined} />
          </div>
        </div>

        {/* Technical */}
        {(project.capacity || project.investmentValue || project.codDate || project.constructionStart) && (
          <div className="space-y-3">
            <SectionTitle icon={Zap} label="Technical Details" />
            <div className="grid grid-cols-2 gap-3">
              <KV label="Installed Capacity" value={project.capacity ? `${project.capacity.value} ${project.capacity.unit}` : undefined} />
              <KV label="Investment"         value={project.investmentValue ? `NPR ${project.investmentValue} Cr` : undefined} />
              <KV label="COD Date"           value={fmtDate(project.codDate) ?? undefined} />
              <KV label="Construction Start" value={fmtDate(project.constructionStart) ?? undefined} />
            </div>
          </div>
        )}

        {/* PPA */}
        {project.ppa?.authority && (
          <div className="space-y-3">
            <SectionTitle icon={FileText} label="Power Purchase Agreement" />
            <div className="grid grid-cols-2 gap-3">
              <KV label="PPA Authority"  value={project.ppa.authority} />
              <KV label="PPA Term"       value={project.ppa.term ? `${project.ppa.term} years` : undefined} />
              <KV label="Tariff"         value={project.ppa.tariff ? `NPR ${project.ppa.tariff}/kWh` : undefined} />
            </div>
          </div>
        )}

        {/* Highlights */}
        {project.highlights.length > 0 && (
          <div className="space-y-3">
            <SectionTitle icon={TrendingUp} label="Key Highlights" />
            <div className="grid grid-cols-2 gap-2">
              {project.highlights.map((h, i) => (
                <div key={i} className="rounded-lg border border-border bg-surface p-2.5">
                  <p className="text-[10px] text-foreground-subtle">{h.label}</p>
                  <p className="text-xs font-semibold text-foreground mt-0.5">{h.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Gallery thumbnails */}
        {project.images.length > 1 && (
          <div className="space-y-3">
            <SectionTitle icon={ImageIcon} label={`Gallery (${project.images.length} images)`} />
            <div className="grid grid-cols-4 gap-2">
              {project.images.map((img, i) => (
                <div key={i} className="relative aspect-square rounded-lg border border-border overflow-hidden bg-surface">
                  <img
                    src={img.url}
                    alt={img.alt || `Image ${i + 1}`}
                    className="h-full w-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                  {img.isCover && (
                    <div className="absolute top-1 right-1">
                      <Star className="h-3 w-3 text-gold" fill="currentColor" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Meta */}
        <div className="space-y-3">
          <SectionTitle icon={Calendar} label="Record Info" />
          <div className="grid grid-cols-2 gap-3">
            <KV label="Slug"       value={project.slug} />
            <KV label="Order"      value={project.order} />
            <KV label="Created"    value={fmtDate(project.createdAt) ?? undefined} />
            <KV label="Updated"    value={fmtDate(project.updatedAt) ?? undefined} />
          </div>
        </div>
      </div>
    </Sheet>
  );
}
