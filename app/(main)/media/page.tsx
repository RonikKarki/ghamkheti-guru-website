import type { Metadata } from "next";
import { connectToDatabase } from "@/lib/mongodb";
import Gallery from "@/models/Gallery";
import News from "@/models/News";
import { PageBanner } from "@/components/common/PageBanner";
import { Section } from "@/components/common/Section";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { NewsCard } from "@/components/common/NewsCard";
import { Grid } from "@/components/common/Grid";
import { CTABanner } from "@/components/common/CTABanner";
import { Badge } from "@/components/ui/badge";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import type { PublicGalleryItem } from "@/components/gallery/GalleryGrid";
import { Mic, Download, ArrowUpRight } from "lucide-react";

export const revalidate = 1800;

export const metadata: Metadata = {
  title: "Media & News",
  description:
    "Latest news, press releases, project updates, and media resources from Ghamkheti Guru Company Limited.",
  alternates: { canonical: "/media" },
  keywords: ["Nepal energy news", "hydropower press release", "Ghamkheti Guru news", "Nepal infrastructure updates"],
};

const CATEGORY_LABEL: Record<string, string> = {
  hydropower:     "Hydropower",
  solar:          "Solar Energy",
  agriculture:    "Agriculture",
  corporate:      "Corporate",
  sustainability: "Sustainability",
  investor:       "Finance",
};

function fmtDate(d: Date | string) {
  return new Intl.DateTimeFormat("en-GB", { year: "numeric", month: "long" }).format(new Date(d));
}

const pressContacts = [
  { name: "Media Relations",         email: "media@ghamkhetiguru.com.np",    role: "General press enquiries"   },
  { name: "Investor Relations",      email: "ir@ghamkhetiguru.com.np",       role: "Financial media enquiries" },
  { name: "Project Communications",  email: "projects@ghamkhetiguru.com.np", role: "Project site enquiries"    },
];

const mediaAssets = [
  { label: "Company Logo Pack",   desc: "SVG, PNG — light & dark versions",   href: "#" },
  { label: "Executive Headshots", desc: "High-res photography for media use", href: "#" },
  { label: "Project Photography", desc: "Aerial and site images — licensed",  href: "#" },
  { label: "Brand Guidelines",    desc: "Colour, typography, usage rules",     href: "#" },
];

export default async function MediaPage() {
  await connectToDatabase();

  const [rawGallery, rawNews] = await Promise.all([
    Gallery.find({ fileType: "image" })
      .sort({ isFeatured: -1, order: 1, createdAt: -1 })
      .lean(),
    News.find({ status: "published" })
      .sort({ isFeatured: -1, publishedAt: -1 })
      .lean(),
  ]);

  const galleryItems: PublicGalleryItem[] = (JSON.parse(JSON.stringify(rawGallery)) as Array<{
    _id: string; title: string; alt: string; category: string;
    fileUrl: string; thumbnailUrl?: string; fileType: string;
    isFeatured: boolean; dimensions?: { width: number; height: number };
  }>).map((d) => ({
    _id:          d._id,
    title:        d.title,
    alt:          d.alt ?? "",
    category:     d.category,
    fileUrl:      d.fileUrl,
    thumbnailUrl: d.thumbnailUrl,
    fileType:     d.fileType,
    isFeatured:   d.isFeatured ?? false,
    dimensions:   d.dimensions,
  }));

  const newsArticles = (JSON.parse(JSON.stringify(rawNews)) as Array<{
    _id: string; slug: string; title: string; excerpt: string;
    category: string; publishedAt?: string; isFeatured: boolean;
  }>).map((n) => ({
    _id:      n._id,
    title:    n.title,
    excerpt:  n.excerpt,
    category: CATEGORY_LABEL[n.category] ?? n.category,
    date:     n.publishedAt ? fmtDate(n.publishedAt) : "2026",
    href:     "#",
    featured: n.isFeatured,
  }));

  const featuredArticle = newsArticles.find((a) => a.featured) ?? newsArticles[0];
  const otherNews       = newsArticles.filter((a) => a !== featuredArticle);

  return (
    <>
      <PageBanner
        badge="Media & News"
        title="News, Stories & Press Resources"
        description="The latest developments from across our hydropower, solar, and agriculture portfolios — plus resources for media professionals."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Media / News" }]}
      />

      {/* Featured article */}
      {featuredArticle && (
        <Section>
          <Container>
            <SectionHeader badge="Top Story" title="Featured Article" />
            <NewsCard {...featuredArticle} index={0} />
          </Container>
        </Section>
      )}

      {/* All news */}
      {otherNews.length > 0 && (
        <Section variant="surface">
          <Container>
            <SectionHeader badge="Latest News" title="All Press Releases & Updates" titleGradient />
            <Grid cols={1} colsMd={2} colsLg={3} gap="default">
              {otherNews.map((n, i) => (
                <NewsCard key={n._id} {...n} index={i} />
              ))}
            </Grid>
          </Container>
        </Section>
      )}

      {newsArticles.length === 0 && (
        <Section>
          <Container>
            <p className="text-center py-16 text-foreground-muted text-sm">
              No articles published yet. Check back soon.
            </p>
          </Container>
        </Section>
      )}

      {/* Photo Gallery — DB-driven */}
      <Section id="gallery">
        <Container>
          <SectionHeader
            badge="Visual Media"
            title="Photo Gallery"
            description="High-quality imagery from our construction sites, operating facilities, and community programmes."
          />
          {galleryItems.length > 0 ? (
            <GalleryGrid items={galleryItems} />
          ) : (
            <p className="text-center text-sm text-foreground-muted py-12">
              Gallery content is being prepared. Check back soon.
            </p>
          )}
        </Container>
      </Section>

      {/* Podcasts & speeches placeholder */}
      <Section variant="alt">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <Badge variant="overline" dot className="mb-4">Audio & Video</Badge>
              <h2 className="text-display-lg font-display text-foreground text-balance mb-4">
                Executive Speeches &amp;{" "}
                <span className="text-gradient">Podcast Appearances</span>
              </h2>
              <p className="text-foreground-muted leading-relaxed">
                Our leadership regularly speaks at major energy and infrastructure conferences,
                investor forums, and sustainability summits across South Asia. Recordings and
                transcripts are archived here.
              </p>
            </div>
            <div className="space-y-3">
              {[
                { title: "Nepal Energy Summit 2026 — Keynote Address",     event: "Kathmandu, May 2026"       },
                { title: "Renewable Energy Podcast — Episode 84",          event: "Asia Clean Energy Forum"   },
                { title: "IFC Syndication Conference — Project Finance Panel", event: "Singapore, March 2026" },
              ].map((s) => (
                <div key={s.title} className="flex items-center gap-4 rounded-xl bg-card border border-border p-4 hover:border-primary/20 transition-colors cursor-pointer group">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Mic className="h-4.5 w-4.5 text-primary" strokeWidth={1.8} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors leading-snug truncate">{s.title}</p>
                    <p className="text-xs text-foreground-subtle">{s.event}</p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-foreground-subtle group-hover:text-primary transition-colors shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* Media contacts & assets */}
      <Section>
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <SectionHeader badge="Press Contacts" title="Media Contacts" centered={false} className="mb-6" />
              <div className="space-y-3">
                {pressContacts.map((c) => (
                  <div key={c.name} className="rounded-xl bg-card border border-border p-4 hover:border-primary/20 transition-colors">
                    <p className="font-semibold text-foreground text-sm">{c.name}</p>
                    <p className="text-xs text-foreground-subtle mb-2">{c.role}</p>
                    <a href={`mailto:${c.email}`} className="text-xs text-primary hover:underline">{c.email}</a>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <SectionHeader badge="Downloads" title="Media Assets" centered={false} className="mb-6" />
              <div className="space-y-3">
                {mediaAssets.map((a) => (
                  <a key={a.label} href={a.href}
                    className="flex items-center justify-between gap-4 rounded-xl bg-card border border-border p-4 hover:border-primary/20 transition-colors group"
                  >
                    <div>
                      <p className="font-medium text-foreground text-sm group-hover:text-primary transition-colors">{a.label}</p>
                      <p className="text-xs text-foreground-subtle">{a.desc}</p>
                    </div>
                    <Download className="h-4 w-4 text-foreground-subtle group-hover:text-primary transition-colors shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <CTABanner
        badge="Media Enquiries"
        title="Need More Information?"
        description="Our communications team is available for interviews, site visits, and background briefings. Responses within 4 hours during business hours."
        primaryLabel="Contact Press Team"
        primaryHref="/contact"
        secondaryLabel="Investor Relations"
        secondaryHref="/investor-relations"
      />
    </>
  );
}
