import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/layout/Providers";
import { siteConfig } from "@/config";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.shortName}`,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: `${siteConfig.url}/og-image.png`,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [`${siteConfig.url}/og-image.png`],
  },
  robots: { index: true, follow: true },
  // Verify ownership if Google Search Console is used
  // verification: { google: "your-google-verification-token" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)",  color: "#070707" },
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
  ],
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Corporation",
  "name": "Ghamkheti Guru Company Limited",
  "alternateName": ["Ghamkheti Guru", "Ghamkheti Guru Co. Ltd."],
  "url": "https://ghamkhetiguru.com.np",
  "logo": {
    "@type": "ImageObject",
    "url": "https://ghamkhetiguru.com.np/images/logos/ghamkheti-logo.png",
    "width": 512,
    "height": 512,
  },
  "image": "https://ghamkhetiguru.com.np/images/logos/ghamkheti-logo.png",
  "description": siteConfig.description,
  "foundingDate": "2018",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "2nd Floor, Trade Tower, Thapathali",
    "addressLocality": "Kathmandu",
    "postalCode": "44600",
    "addressCountry": "NP",
    "addressRegion": "Bagmati Province",
  },
  "contactPoint": [
    {
      "@type": "ContactPoint",
      "telephone": "+977-9851266455",
      "contactType": "customer service",
      "areaServed": "NP",
      "availableLanguage": ["English", "Nepali"],
    },
    {
      "@type": "ContactPoint",
      "email": "ghamkhetiguru@gmail.com",
      "contactType": "customer service",
    },
  ],
  "areaServed": {
    "@type": "Country",
    "name": "Nepal",
  },
  "sameAs": [
    "https://www.linkedin.com/company/ghamkheti-guru",
    "https://www.facebook.com/ghamkhetiguru",
    "https://twitter.com/ghamkhetiguru",
  ],
  "knowsAbout": [
    "Hydropower",
    "Solar Energy",
    "Renewable Energy Nepal",
    "Rice Milling",
    "Agribusiness Nepal",
    "Tourism Nepal",
  ],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Services",
    "itemListElement": [
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Hydropower Development" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Solar Energy Projects" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Agro-Industrial Enterprises" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Tourism Development" } },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`dark ${geistSans.variable} ${geistMono.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased bg-background text-foreground">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
