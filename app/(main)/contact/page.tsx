import type { Metadata } from "next";
import { PageBanner } from "@/components/common/PageBanner";
import { ContactSection } from "@/components/sections/ContactSection";
import { CTABanner } from "@/components/common/CTABanner";
import { getPageBanner } from "@/lib/get-page-banner";
import { connectToDatabase } from "@/lib/mongodb";
import ContactContent from "@/models/ContactContent";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Ghamkheti Guru Company Limited. We welcome enquiries from investors, partners, media, and community stakeholders.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  await connectToDatabase();
  const [raw, pageBanner] = await Promise.all([
    ContactContent.find().lean(),
    getPageBanner("contact"),
  ]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cms: Record<string, any> = Object.fromEntries(
    (JSON.parse(JSON.stringify(raw)) as Array<{ section: string }>).map((d) => [d.section, d])
  );

  const pageHeader = cms.page_header ?? {};
  const bannerTitle = pageHeader.title || "We'd Love to Hear From You";
  const bannerDesc  = pageHeader.body  || "Our team is ready to engage with investors, government bodies, media professionals, and community partners. Reach out — we respond within one business day.";

  return (
    <>
      <PageBanner
        badge="Contact Us"
        title={bannerTitle}
        description={bannerDesc}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contact Us" }]}
        bannerImage={pageBanner.imageUrl || undefined}
        bannerImageAlt={pageBanner.imageAlt}
      />
      <ContactSection cms={cms} />
      <CTABanner
        badge="Investor Enquiries"
        title="Looking to Invest in Our Projects?"
        description="For structured investment opportunities, financial data rooms, or NDA-covered project memoranda — contact our Investor Relations team directly."
        primaryLabel="Investor Relations"
        primaryHref="/investor-relations"
        secondaryLabel="Our Projects"
        secondaryHref="/projects"
      />
    </>
  );
}
