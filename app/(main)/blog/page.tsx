import type { Metadata } from "next";
import { PageBanner } from "@/components/common/PageBanner";
import { Section } from "@/components/common/Section";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { NewsCard } from "@/components/common/NewsCard";
import { Grid } from "@/components/common/Grid";
import { CTABanner } from "@/components/common/CTABanner";
import { connectToDatabase } from "@/lib/mongodb";
import News from "@/models/News";
import { getPageBanner } from "@/lib/get-page-banner";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Insights & Blog",
  description: "Latest news, updates, and insights from Ghamkheti Guru Company Limited.",
};

const CATEGORY_LABEL: Record<string, string> = {
  hydropower:     "Hydropower",
  solar:          "Solar Energy",
  agriculture:    "Agriculture",
  corporate:      "Corporate",
  sustainability: "Sustainability",
  investor:       "Investor",
};

function estimateReadTime(content: string) {
  const words = content.trim().split(/\s+/).length;
  const mins = Math.max(1, Math.round(words / 200));
  return `${mins} min read`;
}

function fmtDate(d: Date | string) {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(new Date(d));
}

export default async function BlogPage() {
  await connectToDatabase();
  const [raw, pageBanner] = await Promise.all([
    News.find({ status: "published" }).sort({ isFeatured: -1, publishedAt: -1 }).lean(),
    getPageBanner("blog"),
  ]);

  const articles = (JSON.parse(JSON.stringify(raw)) as Array<{
    _id: string; slug: string; title: string; excerpt: string; content: string;
    category: string; author: string; publishedAt?: string; isFeatured: boolean; coverImage?: string;
  }>).map((n) => ({
    _id:      n._id,
    slug:     n.slug,
    title:    n.title,
    excerpt:  n.excerpt,
    category: CATEGORY_LABEL[n.category] ?? n.category,
    author:   n.author,
    date:     n.publishedAt ? fmtDate(n.publishedAt) : "—",
    readTime: estimateReadTime(n.content),
    href:     `/blog/${n.slug}`,
    image:    n.coverImage,
    featured: n.isFeatured,
  }));

  const featured  = articles.find((a) => a.featured) ?? articles[0];
  const rest      = articles.filter((a) => a !== featured);

  return (
    <>
      <PageBanner
        badge="Insights"
        title="News &amp; Insights"
        description="The latest developments, press releases, and updates from Ghamkheti Guru Company Limited."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Blog" }]}
        bannerImage={pageBanner.imageUrl || undefined}
        bannerImageAlt={pageBanner.imageAlt}
      />

      {articles.length === 0 ? (
        <Section>
          <Container>
            <p className="text-center py-16 text-foreground-muted text-sm">
              No articles published yet. Check back soon.
            </p>
          </Container>
        </Section>
      ) : (
        <>
          {/* Featured post */}
          {featured && (
            <Section>
              <Container>
                <SectionHeader badge="Featured" title="Latest Insight" />
                <NewsCard {...featured} index={0} featured />
              </Container>
            </Section>
          )}

          {/* All posts */}
          {rest.length > 0 && (
            <Section variant="surface">
              <Container>
                <SectionHeader badge="All Articles" title="More Articles" titleGradient />
                <Grid cols={1} colsMd={2} colsLg={3} gap="default">
                  {rest.map((p, i) => (
                    <NewsCard key={p._id} {...p} index={i} />
                  ))}
                </Grid>
              </Container>
            </Section>
          )}
        </>
      )}

      <CTABanner
        badge="Stay Informed"
        title="Get Updates Delivered to Your Inbox"
        description="Subscribe to our newsletter for the latest news on our energy and agriculture projects in Nepal."
        primaryLabel="Subscribe Now"
        primaryHref="/contact"
        secondaryLabel="View All Articles"
        secondaryHref="/blog"
      />
    </>
  );
}
