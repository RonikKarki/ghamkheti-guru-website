import type { Metadata } from "next";
import { siteConfig } from "@/config";

interface PageMetadataOptions {
  title: string;
  description: string;
  path?: string;
  /** Absolute URL to OG image. Defaults to /og-image.png at root. */
  image?: string;
  /** Set true for admin / auth routes to prevent indexing. */
  noIndex?: boolean;
  type?: "website" | "article";
  /** ISO 8601 date strings for article pages. */
  publishedTime?: string;
  modifiedTime?: string;
  keywords?: string[];
}

/**
 * Builds a complete Next.js Metadata object with canonical URL, OG tags,
 * Twitter card, and optional noindex. Use in page-level `export const metadata`.
 */
export function buildMetadata({
  title,
  description,
  path = "",
  image,
  noIndex = false,
  type = "website",
  publishedTime,
  modifiedTime,
  keywords,
}: PageMetadataOptions): Metadata {
  const canonicalUrl = `${siteConfig.url}${path}`;
  const ogImage = image ?? `${siteConfig.url}/og-image.png`;

  return {
    title,
    description,
    ...(keywords?.length && { keywords }),
    robots: noIndex
      ? { index: false, follow: false, noarchive: true }
      : { index: true, follow: true },
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: siteConfig.name,
      type,
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

/**
 * JSON-LD structured data for the organisation.
 * Drop this into a <script type="application/ld+json"> in any page.
 */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    description: siteConfig.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Babarmahal",
      addressLocality: "Kathmandu",
      postalCode: "44600",
      addressCountry: "NP",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: siteConfig.phone,
        contactType: "customer service",
        email: siteConfig.email,
        availableLanguage: ["English", "Nepali"],
      },
    ],
    sameAs: [
      siteConfig.social.twitter,
      siteConfig.social.linkedin,
      siteConfig.social.facebook,
    ],
  };
}

/**
 * JSON-LD structured data for a news/press article.
 */
export function articleSchema(opts: {
  title: string;
  description: string;
  url: string;
  image?: string;
  publishedTime: string;
  modifiedTime?: string;
  authorName?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: opts.title,
    description: opts.description,
    url: opts.url,
    image: opts.image ?? `${siteConfig.url}/og-image.png`,
    datePublished: opts.publishedTime,
    dateModified: opts.modifiedTime ?? opts.publishedTime,
    author: {
      "@type": "Organization",
      name: opts.authorName ?? siteConfig.name,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/logo.png`,
      },
    },
  };
}
