import { NextRequest } from "next/server";
import { withApiHandler } from "@/lib/api-error";
import { apiSuccess } from "@/lib/api-response";
import { assertRole } from "@/lib/auth-utils";
import { connectToDatabase } from "@/lib/mongodb";
import FooterSettings from "@/models/FooterSettings";

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
    { platform: "twitter"  as const, href: "https://twitter.com/ghamkhetiguru",            enabled: true },
    { platform: "linkedin" as const, href: "https://linkedin.com/company/ghamkheti-guru",  enabled: true },
    { platform: "facebook" as const, href: "https://facebook.com/ghamkhetiguru",           enabled: true },
  ],
  newsletterEnabled: true,
  copyrightText: "",
};

export const GET = withApiHandler(async () => {
  await assertRole("editor");
  await connectToDatabase();
  let settings = await FooterSettings.findOne().lean();
  if (!settings) {
    settings = await FooterSettings.create(DEFAULTS);
    settings = JSON.parse(JSON.stringify(settings));
  }
  return apiSuccess(settings);
});

export const PUT = withApiHandler(async (req: NextRequest) => {
  await assertRole("admin");
  await connectToDatabase();
  const body = await req.json();
  const updated = await FooterSettings.findOneAndUpdate(
    {},
    { $set: body },
    { new: true, upsert: true }
  ).lean();
  return apiSuccess(updated);
});
