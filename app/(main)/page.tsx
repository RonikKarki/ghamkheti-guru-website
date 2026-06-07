import type { Metadata } from "next";
import { connectToDatabase } from "@/lib/mongodb";
import HomepageContent from "@/models/HomepageContent";
import InvestorDocument from "@/models/InvestorDocument";
import { HomeHero } from "@/components/sections/HomeHero";
import { CompanyOverview } from "@/components/sections/CompanyOverview";
import { HydropowerSection } from "@/components/sections/HydropowerSection";
import { SolarSection } from "@/components/sections/SolarSection";
import { AgriSection } from "@/components/sections/AgriSection";
import { StatsSection } from "@/components/sections/StatsSection";
import { ChairmanSection } from "@/components/sections/ChairmanSection";
import { SustainabilitySection } from "@/components/sections/SustainabilitySection";
import { NewsPreview } from "@/components/sections/NewsPreview";
import { InvestorCTA } from "@/components/sections/InvestorCTA";
import { CTABanner } from "@/components/common/CTABanner";
import { DocumentAnnouncementPopup } from "@/components/sections/DocumentAnnouncementPopup";
import type { AnnouncementDoc } from "@/components/sections/DocumentAnnouncementPopup";

// Revalidate the homepage every hour — CMS content changes infrequently
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Ghamkheti Guru Company Limited — Energy, Agriculture & Tourism in Nepal",
  description:
    "An integrated development company in Nepal developing clean hydropower, solar energy, and agro-industrial enterprises. Energy, Agriculture, and Tourism for a sustainable future.",
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  await connectToDatabase();

  const [rawCms, rawAnnouncements] = await Promise.all([
    HomepageContent.find({ isActive: true }).lean(),
    InvestorDocument.find({ showOnHomepage: true })
      .sort({ publishedAt: -1, createdAt: -1 })
      .select("title type fileUrl fileType fiscalYear isRestricted homepageLabel")
      .lean(),
  ]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cms: Record<string, any> = Object.fromEntries(
    (JSON.parse(JSON.stringify(rawCms)) as Array<{ section: string }>).map((d) => [d.section, d])
  );

  const announcements: AnnouncementDoc[] = (
    JSON.parse(JSON.stringify(rawAnnouncements)) as Array<{
      _id: string; title: string; type: string; fileUrl: string;
      fileType?: string; fiscalYear?: string; isRestricted: boolean; homepageLabel?: string;
    }>
  ).map((d) => ({
    _id:          d._id,
    title:        d.title,
    type:         d.type,
    fileUrl:      d.fileUrl,
    fileType:     d.fileType,
    fiscalYear:   d.fiscalYear,
    isRestricted: d.isRestricted,
    homepageLabel: d.homepageLabel,
  }));

  const heroImages = (cms.hero_images?.items ?? []) as { url: string; alt?: string; isVisible?: boolean; overlay?: number }[];

  return (
    <>
      <HomeHero            cms={cms.hero} heroImages={heroImages} />
      <CompanyOverview     cms={cms.company_overview} />
      <HydropowerSection />
      <StatsSection        cms={cms.stats} />
      <SolarSection />
      <AgriSection />
      <ChairmanSection     cms={cms.chairman_message} />
      <SustainabilitySection cms={cms.sustainability} />
      <NewsPreview />
      <InvestorCTA         cms={cms.investor_cta} />
      <CTABanner
        badge="Talk to Us"
        title="Ready to Partner or Invest?"
        description="Whether you're a developer, investor, or community partner — we'd love to start a conversation."
        primaryLabel="Contact Our Team"
        primaryHref="/contact"
        secondaryLabel="Investor Relations"
        secondaryHref="/investor-relations"
      />

      {announcements.length > 0 && (
        <DocumentAnnouncementPopup documents={announcements} />
      )}
    </>
  );
}
