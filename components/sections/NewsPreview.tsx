import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/common/Container";
import { Section } from "@/components/common/Section";
import { SectionHeader } from "@/components/common/SectionHeader";
import { NewsCard } from "@/components/common/NewsCard";
import { Button } from "@/components/ui/button";
import { Grid } from "@/components/common/Grid";

const latestNews = [
  {
    title: "Sisakhola Hydropower Project (4.9 MW) Advances to PPA Stage",
    excerpt:
      "Ghamkheti Guru Company Limited's Sisakhola Hydropower Project in Solukhumbu, Nepal has reached the Power Purchase Agreement stage with Nepal Electricity Authority — a key milestone toward commercial operation.",
    category: "Hydropower",
    date: "2026",
    href: "/media",
  },
  {
    title: "10 MW Solar Power Project in Solukhumbu Reaches PPA Stage",
    excerpt:
      "Our 10 MW solar energy project in Solukhumbu has advanced to the PPA stage, expanding Ghamkheti Guru's clean energy portfolio and supporting Nepal's renewable energy targets.",
    category: "Solar Energy",
    date: "2026",
    href: "/media",
  },
  {
    title: "Shree Suryodaya Khadya Udhyog: Japanese Satake Technology Drives Quality Milling",
    excerpt:
      "Our wholly-owned rice mill subsidiary in Gaindakot, Nawalpur continues to deliver high-quality grain processing at 8 tons per hour using advanced Japanese Satake milling technology.",
    category: "Agriculture",
    date: "2026",
    href: "/media",
  },
];

export function NewsPreview() {
  return (
    <Section variant="surface">
      <Container>
        <SectionHeader
          badge="Latest News"
          title="Recent Developments"
          titleGradient
          description="Stay up to date with our latest project milestones, corporate announcements, and industry leadership."
        />

        <Grid cols={1} colsMd={3} gap="default">
          {latestNews.map((n, i) => (
            <NewsCard key={n.title} {...n} index={i} />
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
      </Container>
    </Section>
  );
}
