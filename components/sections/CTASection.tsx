import { CTABanner } from "@/components/common/CTABanner";

export function CTASection() {
  return (
    <CTABanner
      badge="Ready to Start?"
      title="Let's Build Something Extraordinary Together"
      description="Reach out today and one of our senior consultants will get back to you within 24 hours to discuss your project."
      primaryLabel="Contact Us Now"
      primaryHref="/contact"
      secondaryLabel="Explore Services"
      secondaryHref="/services"
    />
  );
}
