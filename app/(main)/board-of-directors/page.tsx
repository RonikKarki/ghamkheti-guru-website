import type { Metadata } from "next";
import { PageBanner } from "@/components/common/PageBanner";
import { Section } from "@/components/common/Section";
import { Container } from "@/components/common/Container";
import { TeamCard } from "@/components/common/TeamCard";
import { Grid } from "@/components/common/Grid";
import { CTABanner } from "@/components/common/CTABanner";
import { connectToDatabase } from "@/lib/mongodb";
import TeamContent from "@/models/TeamContent";
import { getPageBanner } from "@/lib/get-page-banner";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Board of Directors",
  description: "Meet the Board of Directors of Ghamkheti Guru Company Limited — the leadership guiding our vision across energy, agriculture, and tourism.",
};

interface LeadershipItem {
  name: string;
  role: string;
  department: string;
  bio: string;
  linkedin?: string;
  photo?: string;
}

export default async function BoardOfDirectorsPage() {
  await connectToDatabase();
  const [raw, pageBanner] = await Promise.all([
    TeamContent.find({ section: "leadership" }).lean(),
    getPageBanner("board-of-directors"),
  ]);

  const cms = JSON.parse(JSON.stringify(raw)) as Array<{ section: string; items?: LeadershipItem[] }>;
  const leadDoc = cms.find((d) => d.section === "leadership");
  const directors: LeadershipItem[] = leadDoc?.items?.length ? leadDoc.items : [];

  return (
    <>
      <PageBanner
        badge="Leadership"
        title="Board of Directors"
        description="The experienced leaders guiding Ghamkheti Guru Company Limited across energy, agriculture, and sustainable development."
        breadcrumbs={[
          { label: "Home",     href: "/" },
          { label: "About Us", href: "/about" },
          { label: "Board of Directors" },
        ]}
        bannerImage={pageBanner.imageUrl || undefined}
        bannerImageAlt={pageBanner.imageAlt}
      />

      <Section>
        <Container>
          <div className="mb-12">
            <div className="section-num mb-4">Board of Directors</div>
            <h2
              className="font-display font-bold text-foreground tracking-tight"
              style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", lineHeight: 1.05, letterSpacing: "-0.03em" }}
            >
              Guided by Experience,<br />
              Driven by Purpose
            </h2>
          </div>

          {directors.length > 0 ? (
            <Grid cols={1} colsMd={2} colsLg={3} gap="lg">
              {directors.map((m, i) => (
                <TeamCard
                  key={m.name}
                  name={m.name}
                  role={m.role}
                  department={m.department}
                  bio={m.bio}
                  image={m.photo}
                  linkedin={m.linkedin}
                  size="lg"
                  index={i}
                />
              ))}
            </Grid>
          ) : (
            <div className="py-24 text-center">
              <p className="text-foreground-muted text-sm">
                Board member information is being updated. Please check back soon.
              </p>
            </div>
          )}
        </Container>
      </Section>

      <CTABanner
        badge="Get In Touch"
        title="Connect with Our Leadership"
        description="For investor enquiries, partnership proposals, or strategic discussions, our leadership team is available to connect."
        primaryLabel="Contact Us"
        primaryHref="/contact"
        secondaryLabel="Investor Relations"
        secondaryHref="/investor-relations"
      />
    </>
  );
}
