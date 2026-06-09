import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, ArrowUpRight, Building2 } from "lucide-react";
import { connectToDatabase } from "@/lib/mongodb";
import Subsidiary from "@/models/Subsidiary";
import { PageBanner } from "@/components/common/PageBanner";
import { Section } from "@/components/common/Section";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { CTABanner } from "@/components/common/CTABanner";
import { getPageBanner } from "@/lib/get-page-banner";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Our Subsidiaries",
  description: "Explore the subsidiary companies of Ghamkheti Guru Company Limited — from rice milling and food processing to agro-industrial enterprises across Nepal.",
  alternates: { canonical: "/subsidiaries" },
};

export default async function SubsidiariesPage() {
  await connectToDatabase();
  const [raw, pageBanner] = await Promise.all([
    Subsidiary.find({ isActive: true }).sort({ order: 1, createdAt: -1 }).lean(),
    getPageBanner("subsidiaries").catch(() => ({ imageUrl: null, imageAlt: "" })),
  ]);

  const subs = JSON.parse(JSON.stringify(raw)) as Array<{
    _id: string; slug: string; name: string; industry: string;
    shortDescription: string; location: string; ownership: string;
    logoImage?: string; bannerImage?: string; isFeatured: boolean;
    products: Array<{ name: string }>;
  }>;

  return (
    <>
      <PageBanner
        badge="Group Companies"
        title="Our Subsidiaries"
        description="Ghamkheti Guru Company Limited operates through focused subsidiaries that drive value across agri-industrial and food processing sectors in Nepal."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Subsidiaries" }]}
        bannerImage={pageBanner.imageUrl || undefined}
        bannerImageAlt={pageBanner.imageAlt}
      />

      {subs.length === 0 ? (
        <Section>
          <Container>
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="h-14 w-14 rounded-2xl bg-surface-raised border border-border flex items-center justify-center mb-4">
                <Building2 className="h-6 w-6 text-foreground-subtle" />
              </div>
              <p className="text-foreground-muted font-medium mb-1">No subsidiaries listed yet</p>
              <p className="text-sm text-foreground-subtle">Check back soon.</p>
            </div>
          </Container>
        </Section>
      ) : (
        <Section>
          <Container>
            <SectionHeader badge="Subsidiaries" title="Group Companies" titleGradient description="Each subsidiary operates in a focused domain, contributing to the group's integrated vision for sustainable development." />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subs.map((s) => (
                <Link
                  key={s._id}
                  href={`/subsidiaries/${s.slug}`}
                  className="group rounded-2xl bg-card border border-border overflow-hidden hover:border-primary/30 transition-colors duration-300 flex flex-col"
                >
                  {/* Banner / logo area */}
                  <div className="relative h-40 bg-linear-to-br from-brand-deep via-surface to-background overflow-hidden">
                    {s.bannerImage ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={s.bannerImage} alt={s.name} className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-60 transition-opacity" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      </>
                    ) : (
                      <>
                        <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-primary/6 blur-3xl" />
                        <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-gold/5 blur-2xl" />
                      </>
                    )}
                    {s.logoImage && (
                      <div className="absolute bottom-3 left-4">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={s.logoImage} alt="" className="h-12 w-12 rounded-xl object-contain bg-white/10 backdrop-blur p-1 border border-white/20" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <ArrowUpRight className="h-4 w-4 text-white/60 group-hover:text-white transition-colors" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-1">
                    <p className="text-[11px] font-semibold text-primary uppercase tracking-wider mb-1">{s.industry}</p>
                    <h3 className="font-semibold text-foreground text-base leading-snug mb-2 group-hover:text-primary transition-colors">{s.name}</h3>
                    {s.shortDescription && (
                      <p className="text-sm text-foreground-muted leading-relaxed mb-3 line-clamp-2 flex-1">{s.shortDescription}</p>
                    )}
                    <div className="mt-auto space-y-1.5">
                      {s.location && (
                        <p className="flex items-center gap-1.5 text-xs text-foreground-subtle">
                          <MapPin className="h-3 w-3 shrink-0" /> {s.location}
                        </p>
                      )}
                      {s.ownership && (
                        <p className="text-xs text-foreground-subtle">{s.ownership}</p>
                      )}
                    </div>
                    <div className="mt-4 pt-3 border-t border-border">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary group-hover:gap-2 transition-all">
                        View Details <ArrowUpRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </Section>
      )}

      <CTABanner
        badge="Partner with Us"
        title="Explore Business Opportunities"
        description="Our subsidiaries offer partnership, investment, and supply chain opportunities across food processing and agri-industrial sectors."
        primaryLabel="Contact Our Team"
        primaryHref="/contact"
        secondaryLabel="Investor Relations"
        secondaryHref="/investor-relations"
      />
    </>
  );
}
