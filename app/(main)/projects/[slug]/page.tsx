import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, MapPin, Zap, Calendar, DollarSign,
  CheckCircle, Circle, FileText, Download, Image as ImageIcon,
} from "lucide-react";
import { connectToDatabase } from "@/lib/mongodb";
import Project from "@/models/Project";
import { Container } from "@/components/common/Container";
import { Section } from "@/components/common/Section";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

const STATUS_LABEL: Record<string, string> = {
  operational:         "Operational",
  under_construction:  "Under Construction",
  commissioning:       "Commissioning",
  under_development:   "Under Development",
  licensed:            "Licensed",
  on_hold:             "On Hold",
};

const STATUS_COLOR: Record<string, string> = {
  operational:         "bg-primary/15 text-primary border-primary/25",
  under_construction:  "bg-gold/15 text-gold border-gold/25",
  commissioning:       "bg-teal/15 text-teal border-teal/25",
  under_development:   "bg-teal/15 text-teal border-teal/25",
  licensed:            "bg-earth/15 text-earth border-earth/25",
  on_hold:             "bg-surface-raised text-foreground-subtle border-border",
};

const CATEGORY_LABEL: Record<string, string> = {
  hydropower:   "Hydropower",
  solar:        "Solar Energy",
  agriculture:  "Agriculture",
  "agri-solar": "Agri-Solar",
  tourism:      "Tourism",
};

function fmtDate(d: string | Date | null | undefined) {
  if (!d) return null;
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(new Date(d));
}

function fmtCurrency(v?: number) {
  if (!v) return null;
  return `NPR ${v.toLocaleString()} Crore`;
}

function fmtSize(bytes?: number) {
  if (!bytes) return "";
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await connectToDatabase();
  const { slug } = await params;
  const raw = await Project.findOne({ slug, isActive: true }).select("name seoTitle seoDescription bannerImage category location").lean();
  if (!raw) return { title: "Project Not Found" };
  const p = JSON.parse(JSON.stringify(raw)) as {
    name: string; seoTitle?: string; seoDescription?: string;
    bannerImage?: string; category: string; location: { district: string; province: string };
  };
  return {
    title: p.seoTitle ?? `${p.name} — Ghamkheti Guru`,
    description: p.seoDescription ?? `${CATEGORY_LABEL[p.category] ?? p.category} project in ${p.location.district}, Nepal`,
    openGraph: p.bannerImage ? { images: [p.bannerImage] } : undefined,
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  await connectToDatabase();
  const { slug } = await params;

  const raw = await Project.findOne({ slug, isActive: true }).lean();
  if (!raw) notFound();

  const p = JSON.parse(JSON.stringify(raw)) as {
    _id: string; slug: string; name: string; category: string; status: string;
    description: string; objectives?: string;
    bannerImage?: string; logoImage?: string;
    location: { district: string; province: string; river?: string; elevation?: number };
    capacity?: { value: number; unit: string };
    investmentValue?: number;
    codDate?: string; constructionStart?: string;
    ppa?: { authority: string; term?: number; tariff?: number };
    highlights: Array<{ label: string; value: string }>;
    images: Array<{ url: string; alt: string; isCover: boolean }>;
    documents: Array<{ url: string; name: string; type: string; size?: number }>;
    timeline: Array<{ title: string; date?: string; completed: boolean; description?: string }>;
    isFeatured: boolean;
  };

  const displayStatus   = STATUS_LABEL[p.status]   ?? p.status;
  const displayCategory = CATEGORY_LABEL[p.category] ?? p.category;
  const coverImage      = p.images.find((i) => i.isCover)?.url ?? p.images[0]?.url;

  const infoItems: Array<{ label: string; value: string | null }> = [
    { label: "Category",   value: displayCategory },
    { label: "Status",     value: displayStatus },
    { label: "District",   value: p.location.district },
    { label: "Province",   value: p.location.province },
    { label: "River",      value: p.location.river ?? null },
    { label: "Capacity",   value: p.capacity ? `${p.capacity.value} ${p.capacity.unit}` : null },
    { label: "Investment", value: fmtCurrency(p.investmentValue) },
    { label: "Construction Start", value: fmtDate(p.constructionStart) },
    { label: "Expected COD",       value: fmtDate(p.codDate) },
    { label: "PPA Authority",      value: p.ppa?.authority ?? null },
    { label: "PPA Term",           value: p.ppa?.term ? `${p.ppa.term} years` : null },
    { label: "PPA Tariff",         value: p.ppa?.tariff ? `NPR ${p.ppa.tariff}/kWh` : null },
  ].filter((item) => item.value !== null);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative min-h-[420px] flex items-end" style={{ backgroundColor: "#07080d" }}>
        {(p.bannerImage ?? coverImage) && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={p.bannerImage ?? coverImage!}
              alt={p.name}
              className="absolute inset-0 w-full h-full object-cover opacity-35"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#07080d] via-[#07080d]/50 to-transparent" />
          </>
        )}
        {!(p.bannerImage ?? coverImage) && (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-brand-deep via-surface to-background opacity-80" />
            <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-primary/8 blur-3xl" />
          </>
        )}

        <Container className="relative py-16 pt-28">
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Projects
          </Link>

          <div className="flex items-start gap-4">
            {p.logoImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={p.logoImage}
                alt={`${p.name} logo`}
                className="h-16 w-16 rounded-xl object-contain bg-white/10 backdrop-blur p-1 shrink-0"
              />
            )}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${STATUS_COLOR[p.status] ?? STATUS_COLOR.on_hold}`}>
                  {displayStatus}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/10 text-white/70 border border-white/10">
                  {displayCategory}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white leading-tight mb-3">
                {p.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-white/55">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  {p.location.district}, {p.location.province}
                </span>
                {p.capacity && (
                  <span className="flex items-center gap-1.5">
                    <Zap className="h-3.5 w-3.5" />
                    {p.capacity.value} {p.capacity.unit}
                  </span>
                )}
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Highlights bar */}
      {p.highlights.length > 0 && (
        <div className="bg-surface-raised border-y border-border">
          <Container className="py-4">
            <div className="flex flex-wrap gap-6 md:gap-10">
              {p.highlights.map((h, i) => (
                <div key={i} className="text-center">
                  <p className="text-lg font-display font-bold text-gradient leading-none">{h.value}</p>
                  <p className="text-[11px] text-foreground-subtle mt-0.5">{h.label}</p>
                </div>
              ))}
            </div>
          </Container>
        </div>
      )}

      {/* Overview + Info */}
      <Section>
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Description + Objectives */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="text-xl font-display font-bold text-foreground mb-3">Project Overview</h2>
                <p className="text-foreground-muted leading-relaxed">{p.description}</p>
              </div>
              {p.objectives && (
                <div>
                  <h2 className="text-xl font-display font-bold text-foreground mb-3">Objectives</h2>
                  <p className="text-foreground-muted leading-relaxed">{p.objectives}</p>
                </div>
              )}
            </div>

            {/* Info card */}
            <div className="rounded-2xl bg-card border border-border p-6 h-fit space-y-3">
              <h3 className="text-sm font-semibold text-foreground mb-4">Project Details</h3>
              {infoItems.map((item) => (
                <div key={item.label} className="flex justify-between gap-4 text-sm border-b border-border pb-2.5 last:border-0 last:pb-0">
                  <span className="text-foreground-subtle shrink-0">{item.label}</span>
                  <span className="text-foreground font-medium text-right">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* Gallery */}
      {p.images.length > 0 && (
        <Section variant="surface">
          <Container>
            <h2 className="text-2xl font-display font-bold text-foreground mb-6">Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {p.images.map((img, i) => (
                <div key={i} className="relative aspect-video rounded-xl overflow-hidden bg-surface-raised">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.url}
                    alt={img.alt || p.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    onError={undefined}
                  />
                  {img.isCover && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary text-primary-foreground">
                      Cover
                    </span>
                  )}
                  {img.alt && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                      <p className="text-white text-xs leading-snug">{img.alt}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* Timeline */}
      {p.timeline.length > 0 && (
        <Section>
          <Container>
            <h2 className="text-2xl font-display font-bold text-foreground mb-8">Project Timeline</h2>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
              <div className="space-y-6 pl-12">
                {p.timeline.map((m, i) => (
                  <div key={i} className="relative">
                    <div className={`absolute -left-[35px] top-0.5 h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                      m.completed ? "bg-primary/20 border-primary" : "bg-surface border-border"
                    }`}>
                      {m.completed
                        ? <CheckCircle className="h-3 w-3 text-primary" />
                        : <Circle className="h-3 w-3 text-foreground-subtle" />
                      }
                    </div>
                    <div className="bg-card border border-border rounded-xl p-4">
                      <div className="flex items-start justify-between gap-3 mb-1">
                        <p className={`font-semibold text-sm ${m.completed ? "text-foreground" : "text-foreground-muted"}`}>
                          {m.title}
                        </p>
                        {m.date && (
                          <span className="flex items-center gap-1 text-[11px] text-foreground-subtle shrink-0">
                            <Calendar className="h-3 w-3" />
                            {fmtDate(m.date)}
                          </span>
                        )}
                      </div>
                      {m.description && (
                        <p className="text-sm text-foreground-subtle">{m.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </Section>
      )}

      {/* Documents */}
      {p.documents.length > 0 && (
        <Section variant="surface">
          <Container>
            <h2 className="text-2xl font-display font-bold text-foreground mb-6">Documents</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {p.documents.map((doc, i) => (
                <a
                  key={i}
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border hover:border-primary/30 hover:bg-primary/5 transition-colors group"
                >
                  <div className="h-10 w-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">{doc.name}</p>
                    <p className="text-[11px] text-foreground-subtle uppercase">{doc.type}{doc.size ? ` · ${fmtSize(doc.size)}` : ""}</p>
                  </div>
                  <Download className="h-4 w-4 text-foreground-subtle group-hover:text-primary transition-colors shrink-0" />
                </a>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* No gallery/docs empty state */}
      {p.images.length === 0 && p.timeline.length === 0 && p.documents.length === 0 && (
        <Section variant="surface">
          <Container>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="h-12 w-12 rounded-xl bg-surface-raised border border-border flex items-center justify-center mb-4">
                <ImageIcon className="h-5 w-5 text-foreground-subtle" />
              </div>
              <p className="text-sm text-foreground-muted">More project details coming soon.</p>
            </div>
          </Container>
        </Section>
      )}

      {/* Footer CTA */}
      <Section>
        <Container>
          <div className="rounded-2xl bg-card border border-border p-8 text-center">
            <h3 className="text-xl font-display font-bold text-foreground mb-2">Interested in this project?</h3>
            <p className="text-sm text-foreground-muted mb-6 max-w-md mx-auto">
              Contact our team to learn about investment opportunities, partnerships, or to request detailed project documentation.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Contact Our Team
              </Link>
              <Link
                href="/investor-relations"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border text-sm font-medium text-foreground-muted hover:text-foreground hover:border-primary/30 transition-colors"
              >
                Investor Relations
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
