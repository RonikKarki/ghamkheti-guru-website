import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";
import { siteConfig } from "@/config";
import { Container } from "@/components/common/Container";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { connectToDatabase } from "@/lib/mongodb";
import FooterSettings from "@/models/FooterSettings";

const SOCIAL_SVGS: Record<string, React.ReactNode> = {
  twitter: (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.738l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.912-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  ),
  youtube: (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  ),
};

const FALLBACK = {
  email:   siteConfig.email,
  phone:   siteConfig.phone,
  address: siteConfig.address,
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
    { platform: "twitter",  href: siteConfig.social.twitter,  enabled: true },
    { platform: "linkedin", href: siteConfig.social.linkedin, enabled: true },
    { platform: "facebook", href: siteConfig.social.facebook, enabled: true },
  ],
  newsletterEnabled: true,
  copyrightText: "",
};

type FooterData = typeof FALLBACK;

export async function Footer() {
  let settings: FooterData = FALLBACK;
  try {
    await connectToDatabase();
    const raw = await FooterSettings.findOne().lean() as FooterData | null;
    if (raw) settings = raw;
  } catch {
    // use fallback
  }

  const year = new Date().getFullYear();
  const copyright = settings.copyrightText || `© ${year} ${siteConfig.name}. All rights reserved.`;
  const activeSocials = settings.socialLinks.filter((s) => s.enabled && s.href);

  return (
    <footer className="bg-surface border-t border-border">
      <Container className="py-14 md:py-20">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-6">
              <Image
                src="/images/logos/ghamkheti-logo.png"
                alt="Ghamkheti Guru Logo"
                width={28}
                height={28}
                className="rounded-md"
              />
              <span className="font-semibold text-sm text-foreground tracking-tight">
                {siteConfig.shortName}
              </span>
            </Link>
            <p className="text-sm text-foreground-muted leading-relaxed mb-6 max-w-xs">
              {siteConfig.description}
            </p>
            <ul className="space-y-3 text-sm text-foreground-subtle">
              <li className="flex items-start gap-2.5">
                <Mail className="h-3.5 w-3.5 mt-0.5 shrink-0 text-primary" />
                <a href={`mailto:${settings.email}`} className="hover:text-foreground transition-colors">
                  {settings.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="h-3.5 w-3.5 mt-0.5 shrink-0 text-primary" />
                <a href={`tel:${settings.phone}`} className="hover:text-foreground transition-colors">
                  {settings.phone}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0 text-primary" />
                <span>{settings.address}</span>
              </li>
            </ul>
          </div>

          {/* Company links */}
          {settings.companyLinks.length > 0 && (
            <div>
              <h3 className="text-[10px] font-semibold text-foreground-subtle uppercase tracking-[0.18em] mb-5">Company</h3>
              <ul className="space-y-3">
                {settings.companyLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-foreground-muted hover:text-foreground transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Sector links */}
          {settings.sectorLinks.length > 0 && (
            <div>
              <h3 className="text-[10px] font-semibold text-foreground-subtle uppercase tracking-[0.18em] mb-5">Sectors</h3>
              <ul className="space-y-3">
                {settings.sectorLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-foreground-muted hover:text-foreground transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Newsletter */}
          {settings.newsletterEnabled && (
            <div>
              <h3 className="text-[10px] font-semibold text-foreground-subtle uppercase tracking-[0.18em] mb-5">Stay Updated</h3>
              <p className="text-sm text-foreground-muted mb-4 leading-relaxed">
                Receive the latest news on our projects and sustainability reports.
              </p>
              <NewsletterForm />
            </div>
          )}
        </div>
      </Container>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <Container className="py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-foreground-subtle">{copyright}</p>
            <div className="flex items-center gap-5">
              {settings.legalLinks.map((link) => (
                <Link key={link.href} href={link.href} className="text-xs text-foreground-subtle hover:text-foreground transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
            {activeSocials.length > 0 && (
              <div className="flex items-center gap-2">
                {activeSocials.map(({ platform, href }) => (
                  <a
                    key={platform}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={platform}
                    className="flex h-7 w-7 items-center justify-center rounded-md border border-border text-foreground-subtle hover:text-primary hover:border-primary/30 transition-colors"
                  >
                    {SOCIAL_SVGS[platform]}
                  </a>
                ))}
              </div>
            )}
          </div>
        </Container>
      </div>
    </footer>
  );
}
