import type { NavItem } from "@/types";

export const siteConfig = {
  name: "Ghamkheti Guru Company Limited",
  shortName: "Ghamkheti Guru",
  description:
    "Ghamkheti Guru Company Limited — an integrated Energy, Agriculture, and Tourism development company in Nepal. Developing clean hydropower, solar energy, and agro-industrial enterprises for a sustainable future.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  email: "ghamkhetiguru@gmail.com",
  phone: "+977-9851266455",
  address: "2nd Floor, Trade Tower, Thapathali, Kathmandu 44600, Nepal",
  social: {
    twitter: "https://twitter.com/ghamkhetiguru",
    linkedin: "https://linkedin.com/company/ghamkhetiguru",
    facebook: "https://facebook.com/ghamkhetiguru",
    instagram: "https://instagram.com/ghamkhetiguru",
  },
  keywords: [
    "Nepal hydropower",
    "renewable energy Nepal",
    "solar energy",
    "agriculture Nepal",
    "rice mill",
    "Ghamkheti Guru",
    "infrastructure Nepal",
    "sustainable energy",
  ],
} as const;

export const navItems: NavItem[] = [
  { label: "Home",               href: "/" },
  {
    label: "About Us",
    href: "/about",
    children: [
      { label: "About Us", href: "/about" },
      { label: "Our Team", href: "/team" },
    ],
  },
  { label: "Projects", href: "/projects" },
  { label: "Subsidiaries", href: "/subsidiaries" },
  { label: "Investor Relations", href: "/investor-relations" },
  { label: "News & Notices",     href: "/media" },
  { label: "Gallery",            href: "/gallery" },
  { label: "Contact Us",         href: "/contact" },
];
