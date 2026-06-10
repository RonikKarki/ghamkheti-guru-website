import type { Metadata } from "next";
import { requireAuth } from "@/lib/auth-utils";
import { connectToDatabase } from "@/lib/mongodb";
import FooterSettings from "@/models/FooterSettings";
import FooterSettingsClient from "@/components/admin/footer/FooterSettingsClient";

export const metadata: Metadata = { title: "Footer Settings" };

const DEFAULTS = {
  email:   "ghamkhetiguru@gmail.com",
  phone:   "+977-9851266455",
  address: "2nd Floor, Trade Tower, Thapathali, Kathmandu 44600, Nepal",
  companyLinks: [
    { label: "About Us",           href: "/about" },
    { label: "Projects",           href: "/projects" },
    { label: "Subsidiaries",       href: "/subsidiaries" },
    { label: "Investor Relations", href: "/investor-relations" },
    { label: "Media / News",       href: "/media" },
    { label: "Contact Us",         href: "/contact" },
  ],
  sectorLinks: [
    { label: "Hydropower Projects",  href: "/projects#hydropower" },
    { label: "Solar Energy",         href: "/projects#solar" },
    { label: "Agriculture & Agro",   href: "/projects#agriculture" },
    { label: "Annual Reports",       href: "/investor-relations#reports" },
    { label: "Corporate Governance", href: "/investor-relations#governance" },
  ],
  legalLinks: [
    { label: "Privacy Policy",   href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
  socialLinks: [
    { platform: "twitter"  as const, href: "https://twitter.com/ghamkhetiguru",           enabled: true },
    { platform: "linkedin" as const, href: "https://linkedin.com/company/ghamkheti-guru", enabled: true },
    { platform: "facebook" as const, href: "https://facebook.com/ghamkhetiguru",          enabled: true },
  ],
  newsletterEnabled: true,
  copyrightText: "",
};

export default async function FooterSettingsPage() {
  await requireAuth();
  await connectToDatabase();

  let raw = await FooterSettings.findOne().lean();
  if (!raw) raw = await FooterSettings.create(DEFAULTS);

  const data = JSON.parse(JSON.stringify(raw));
  return <FooterSettingsClient initialData={data} />;
}
