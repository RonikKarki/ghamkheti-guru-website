import type { Metadata } from "next";
import { connectToDatabase } from "@/lib/mongodb";
import News from "@/models/News";
import { PageBanner } from "@/components/common/PageBanner";
import { getPageBanner } from "@/lib/get-page-banner";
import { Section } from "@/components/common/Section";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { NewsCard } from "@/components/common/NewsCard";
import { Grid } from "@/components/common/Grid";
import { CTABanner } from "@/components/common/CTABanner";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "News & Notices",
  description:
    "Latest news, press releases, notices, and project updates from Ghamkheti Guru Company Limited.",
  alternates: { canonical: "/media" },
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
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(new Date(d));
}

export default async function NewsPage() {
  await connectToDatabase();
  const [rawNews, pageBanner] = await Promise.all([
    News.find({ status: "published" })
      .sort({ isFeatured: -1, publishedAt: -1 })
      .lean(),
    getPageBanner("media"),
  ]);

  const articles = (JSON.parse(JSON.stringify(rawNews)) as Array<{
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
    href:     `/blog/${n.slug}`,
    image:    n.coverImage,
    featured: n.isFeatured,
  }));

  const featured = articles.find((a) => a.featured) ?? articles[0];
  const rest     = articles.filter((a) => a !== featured);

  return (
    <>
      <PageBanner
        badge="News & Notices"
        title="News &amp; Notices"
        description="Press releases, notices, and the latest updates from Ghamkheti Guru Company Limited."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "News & Notices" }]}
        bannerImage={pageBanner.imageUrl || undefined}
        bannerImageAlt={pageBanner.imageAlt}
      />

      {articles.length === 0 ? (
        <Section>
          <Container>
            <p className="text-center py-20 text-foreground-muted text-sm">
              No articles published yet. Check back soon.
            </p>
          </Container>
        </Section>
      ) : (
        <>
          {featured && (
            <Section>
              <Container>
                <SectionHeader badge="Top Story" title="Featured" />
                <NewsCard {...featured} index={0} />
              </Container>
            </Section>
          )}

          {rest.length > 0 && (
            <Section variant="surface">
              <Container>
                <SectionHeader badge="Latest" title="All Articles &amp; Notices" titleGradient />
                <Grid cols={1} colsMd={2} colsLg={3} gap="default">
                  {rest.map((n, i) => (
                    <NewsCard key={n._id} {...n} index={i} />
                  ))}
                </Grid>
              </Container>
            </Section>
          )}
        </>
      )}

      <CTABanner
        badge="Stay Updated"
        title="Want to Receive Updates?"
        description="Contact us to be added to our investor and stakeholder mailing list for announcements."
        primaryLabel="Contact Our Team"
        primaryHref="/contact"
        secondaryLabel="Investor Relations"
        secondaryHref="/investor-relations"
      />
    </>
  );
}
