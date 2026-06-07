import type { Metadata } from "next";
import { PageBanner } from "@/components/common/PageBanner";
import { ContactSection } from "@/components/sections/ContactSection";
import { CTABanner } from "@/components/common/CTABanner";
import { getPageBanner } from "@/lib/get-page-banner";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Ghamkheti Guru Company Limited. We welcome enquiries from investors, partners, media, and community stakeholders.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const pageBanner = await getPageBanner("contact");

  return (
    <>
      <PageBanner
        badge="Contact Us"
        title="We'd Love to Hear From You"
        description="Our team is ready to engage with investors, government bodies, media professionals, and community partners. Reach out — we respond within one business day."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contact Us" }]}
        bannerImage={pageBanner.imageUrl || undefined}
        bannerImageAlt={pageBanner.imageAlt}
      />
      <ContactSection />
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
