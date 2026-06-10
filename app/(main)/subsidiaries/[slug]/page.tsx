import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Phone, Mail, Globe, Building2, Package, Layers } from "lucide-react";
import { connectToDatabase } from "@/lib/mongodb";
import Subsidiary from "@/models/Subsidiary";
import { Container } from "@/components/common/Container";
import { Section } from "@/components/common/Section";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

function normalizeUrl(url?: string) {
  if (!url) return url;
  if (/^https?:\/\//i.test(url)) return url;
  return `https://${url}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await connectToDatabase();
  const { slug } = await params;
  const raw = await Subsidiary.findOne({ slug, isActive: true })
    .select("name industry seoTitle seoDescription bannerImage ogImage location")
    .lean();
  if (!raw) return { title: "Subsidiary Not Found" };
  const s = JSON.parse(JSON.stringify(raw)) as {
    name: string; industry: string; seoTitle?: string; seoDescription?: string;
    bannerImage?: string; ogImage?: string; location: string;
  };
  const img = s.ogImage ?? s.bannerImage;
  return {
    title: s.seoTitle ?? `${s.name} — Ghamkheti Guru`,
    description: s.seoDescription ?? `${s.industry} subsidiary of Ghamkheti Guru, ${s.location}`,
    openGraph: img ? { images: [img] } : undefined,
  };
}

export default async function SubsidiaryDetailPage({ params }: Props) {
  await connectToDatabase();
  const { slug } = await params;
  const raw = await Subsidiary.findOne({ slug, isActive: true }).lean();
  if (!raw) notFound();

  const s = JSON.parse(JSON.stringify(raw)) as {
    _id: string; slug: string; name: string; industry: string;
    shortDescription: string; description: string;
    location: string; ownership: string; establishedYear?: number;
    logoImage?: string; bannerImage?: string;
    gallery:    Array<{ url: string; alt: string }>;
    activities: Array<{ title: string; description: string; order: number }>;
    products:   Array<{ name: string; description: string; image?: string; order: number }>;
    contact:    { phone?: string; email?: string; website?: string };
    isFeatured: boolean;
  };

  const sortedActivities = [...s.activities].sort((a, b) => a.order - b.order);
  const sortedProducts   = [...s.products].sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative min-h-[380px] flex items-end" style={{ backgroundColor: "#07080d" }}>
        {s.bannerImage ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s.bannerImage} alt={s.name} className="absolute inset-0 w-full h-full object-cover opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#07080d] via-[#07080d]/50 to-transparent" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-brand-deep via-surface to-background opacity-80" />
            <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-primary/8 blur-3xl" />
          </>
        )}

        <Container className="relative py-16 pt-28">
          <Link href="/subsidiaries" className="inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition-colors mb-8">
            <ArrowLeft className="h-4 w-4" /> All Subsidiaries
          </Link>

          <div className="flex items-start gap-4">
            {s.logoImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={s.logoImage} alt="" className="h-16 w-16 rounded-xl object-contain bg-white/10 backdrop-blur p-1.5 shrink-0 border border-white/15" />
            )}
            <div className="flex-1">
              <p className="text-sm font-semibold text-primary mb-1">{s.industry}</p>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white leading-tight mb-3">{s.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-white/55">
                {s.location && (
                  <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{s.location}</span>
                )}
                {s.establishedYear && (
                  <span className="flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5" />Est. {s.establishedYear}</span>
                )}
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Overview + Key Info */}
      <Section>
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Description */}
            <div className="lg:col-span-2 space-y-6">
              {(s.description || s.shortDescription) && (
                <div>
                  <h2 className="text-xl font-display font-bold text-foreground mb-3">Company Overview</h2>
                  <p className="text-foreground-muted leading-relaxed">{s.description || s.shortDescription}</p>
                </div>
              )}
              {s.ownership && (
                <div className="rounded-xl bg-primary/5 border border-primary/15 px-5 py-4">
                  <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">Ownership</p>
                  <p className="text-sm text-foreground">{s.ownership}</p>
                </div>
              )}
            </div>

            {/* Key Info card */}
            <div className="rounded-2xl bg-card border border-border p-6 h-fit space-y-3">
              <h3 className="text-sm font-semibold text-foreground mb-4">Key Information</h3>
              {[
                { label: "Company Name",  value: s.name },
                { label: "Industry",      value: s.industry },
                { label: "Location",      value: s.location },
                { label: "Ownership",     value: s.ownership },
                { label: "Established",   value: s.establishedYear ? String(s.establishedYear) : null },
                { label: "Phone",         value: s.contact?.phone },
                { label: "Email",         value: s.contact?.email },
              ].filter((x) => x.value).map((item) => (
                <div key={item.label} className="flex justify-between gap-4 text-sm border-b border-border pb-2.5 last:border-0 last:pb-0">
                  <span className="text-foreground-subtle shrink-0">{item.label}</span>
                  <span className="text-foreground font-medium text-right">{item.value}</span>
                </div>
              ))}
              {s.contact?.website && (
                <a
                  href={normalizeUrl(s.contact.website)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-primary hover:underline mt-2"
                >
                  <Globe className="h-3.5 w-3.5" /> Visit Website
                </a>
              )}
            </div>
          </div>
        </Container>
      </Section>

      {/* Business Activities */}
      {sortedActivities.length > 0 && (
        <Section variant="surface">
          <Container>
            <div className="flex items-center gap-2 mb-6">
              <Layers className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-display font-bold text-foreground">Business Activities</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sortedActivities.map((a, i) => (
                <div key={i} className="rounded-xl bg-card border border-border p-5 hover:border-primary/25 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-primary">{i + 1}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-sm mb-1">{a.title}</h3>
                      {a.description && <p className="text-sm text-foreground-muted leading-relaxed">{a.description}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* Products */}
      {sortedProducts.length > 0 && (
        <Section>
          <Container>
            <div className="flex items-center gap-2 mb-6">
              <Package className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-display font-bold text-foreground">Our Products</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {sortedProducts.map((p, i) => (
                <div key={i} className="rounded-2xl bg-card border border-border overflow-hidden hover:border-primary/25 transition-colors">
                  {p.image && (
                    <div className="relative h-40 overflow-hidden bg-surface">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                  )}
                  {!p.image && (
                    <div className="h-32 bg-linear-to-br from-primary/5 to-surface flex items-center justify-center">
                      <Package className="h-8 w-8 text-primary/20" />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground text-sm mb-1.5">{p.name}</h3>
                    {p.description && <p className="text-sm text-foreground-muted leading-relaxed">{p.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* Gallery */}
      {s.gallery.length > 0 && (
        <Section variant="surface">
          <Container>
            <h2 className="text-2xl font-display font-bold text-foreground mb-6">Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {s.gallery.map((g, i) => (
                <div key={i} className="relative aspect-video rounded-xl overflow-hidden bg-surface-raised">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={g.url} alt={g.alt || s.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                  {g.alt && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                      <p className="text-white text-xs">{g.alt}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* CTA */}
      <Section>
        <Container>
          <div className="rounded-2xl bg-card border border-border p-8 text-center">
            <h3 className="text-xl font-display font-bold text-foreground mb-2">Get in touch with {s.name}</h3>
            <p className="text-sm text-foreground-muted mb-6 max-w-md mx-auto">
              For business inquiries, partnerships, or product information, reach out directly or through Ghamkheti Guru Company Limited.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {s.contact?.phone && (
                <a
                  href={`tel:${s.contact.phone}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  <Phone className="h-4 w-4" /> {s.contact.phone}
                </a>
              )}
              {s.contact?.email && (
                <a
                  href={`mailto:${s.contact.email}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border text-sm font-medium text-foreground-muted hover:text-foreground hover:border-primary/30 transition-colors"
                >
                  <Mail className="h-4 w-4" /> {s.contact.email}
                </a>
              )}
              {s.contact?.website && (
                <a
                  href={normalizeUrl(s.contact.website)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border text-sm font-medium text-foreground-muted hover:text-foreground hover:border-primary/30 transition-colors"
                >
                  <Globe className="h-4 w-4" /> Visit Website
                </a>
              )}
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border text-sm font-medium text-foreground-muted hover:text-foreground hover:border-primary/30 transition-colors"
              >
                Contact Ghamkheti Guru
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
