import Link from "next/link";
import { ArrowRight, Newspaper } from "lucide-react";
import { connectToDatabase } from "@/lib/mongodb";
import News from "@/models/News";
import { Container } from "@/components/common/Container";
import { Section } from "@/components/common/Section";
import { SectionHeader } from "@/components/common/SectionHeader";
import { NewsCard } from "@/components/common/NewsCard";
import { Button } from "@/components/ui/button";
import { Grid } from "@/components/common/Grid";

const categoryDisplay: Record<string, string> = {
  hydropower:    "Hydropower",
  solar:         "Solar Energy",
  agriculture:   "Agriculture",
  corporate:     "Corporate",
  sustainability: "Sustainability",
  investor:      "Investor",
};

function formatDate(date?: Date | string | null): string {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export async function NewsPreview() {
  await connectToDatabase();

  const raw = await News.find({ status: "published" })
    .sort({ isFeatured: -1, publishedAt: -1, createdAt: -1 })
    .limit(3)
    .select("slug title excerpt category coverImage publishedAt createdAt")
    .lean();

  const articles = JSON.parse(JSON.stringify(raw)) as Array<{
    _id: string;
    slug: string;
    title: string;
    excerpt: string;
    category: string;
    coverImage?: string;
    publishedAt?: string;
    createdAt: string;
  }>;

  return (
    <Section variant="surface">
      <Container>
        <SectionHeader
          badge="Latest News"
          title="Recent Developments"
          titleGradient
          description="Stay up to date with our latest project milestones, corporate announcements, and sustainability reports."
        />

        {articles.length > 0 ? (
          <>
            <Grid cols={1} colsMd={3} gap="default">
              {articles.map((n, i) => (
                <NewsCard
                  key={n._id}
                  title={n.title}
                  excerpt={n.excerpt}
                  category={categoryDisplay[n.category] ?? n.category}
                  date={formatDate(n.publishedAt ?? n.createdAt)}
                  href={`/media/${n.slug}`}
                  image={n.coverImage}
                  index={i}
                />
              ))}
            </Grid>
            <div className="mt-10 text-center">
              <Button asChild variant="outline-brand" size="lg">
                <Link href="/media">
                  All News &amp; Media
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </>
        ) : (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="h-14 w-14 rounded-2xl bg-surface-raised border border-border flex items-center justify-center mb-5">
              <Newspaper className="h-6 w-6 text-foreground-subtle" />
            </div>
            <p className="text-foreground-muted font-medium mb-1">No news published yet</p>
            <p className="text-sm text-foreground-subtle mb-6">
              Check back soon for project updates and announcements.
            </p>
            <Button asChild variant="outline" size="sm">
              <Link href="/media">Visit Media Page</Link>
            </Button>
          </div>
        )}
      </Container>
    </Section>
  );
}
