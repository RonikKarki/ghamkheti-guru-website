import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";
import { siteConfig } from "@/config";
import { Container } from "@/components/common/Container";
import { NewsletterForm } from "@/components/forms/NewsletterForm";

const footerLinks = {
  company: [
    { label: "About Us",           href: "/about" },
    { label: "Projects",           href: "/projects" },
    { label: "Investor Relations", href: "/investor-relations" },
    { label: "Media / News",       href: "/media" },
    { label: "Contact Us",         href: "/contact" },
  ],
  sectors: [
    { label: "Hydropower Projects",  href: "/projects#hydropower" },
    { label: "Solar Energy",         href: "/projects#solar" },
    { label: "Agriculture & Agro",   href: "/projects#agriculture" },
    { label: "Annual Reports",       href: "/investor-relations#reports" },
    { label: "Corporate Governance", href: "/investor-relations#governance" },
  ],
  legal: [
    { label: "Privacy Policy",  href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

const socialLinks = [
  {
    svg: <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.738l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.912-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>,
    href: siteConfig.social.twitter, label: "X (Twitter)",
  },
  {
    svg: <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>,
    href: siteConfig.social.linkedin, label: "LinkedIn",
  },
  {
    svg: <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>,
    href: siteConfig.social.facebook, label: "Facebook",
  },
];

export function Footer() {
  const year = new Date().getFullYear();

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
                <a href={`mailto:${siteConfig.email}`} className="hover:text-foreground transition-colors">
                  {siteConfig.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="h-3.5 w-3.5 mt-0.5 shrink-0 text-primary" />
                <a href={`tel:${siteConfig.phone}`} className="hover:text-foreground transition-colors">
                  {siteConfig.phone}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0 text-primary" />
                <span>{siteConfig.address}</span>
              </li>
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h3 className="text-[10px] font-semibold text-foreground-subtle uppercase tracking-[0.18em] mb-5">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-foreground-muted hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Sectors */}
          <div>
            <h3 className="text-[10px] font-semibold text-foreground-subtle uppercase tracking-[0.18em] mb-5">Sectors</h3>
            <ul className="space-y-3">
              {footerLinks.sectors.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-foreground-muted hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-[10px] font-semibold text-foreground-subtle uppercase tracking-[0.18em] mb-5">Stay Updated</h3>
            <p className="text-sm text-foreground-muted mb-4 leading-relaxed">
              Receive the latest news on our projects and sustainability reports.
            </p>
            <NewsletterForm />
          </div>
        </div>
      </Container>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <Container className="py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-foreground-subtle">
              © {year} {siteConfig.name}. All rights reserved.
            </p>
            <div className="flex items-center gap-5">
              {footerLinks.legal.map((link) => (
                <Link key={link.href} href={link.href} className="text-xs text-foreground-subtle hover:text-foreground transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-2">
              {socialLinks.map(({ svg, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-7 w-7 items-center justify-center rounded-md border border-border text-foreground-subtle hover:text-primary hover:border-primary/30 transition-colors"
                >
                  {svg}
                </a>
              ))}
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
}
