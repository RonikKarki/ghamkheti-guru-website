import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, Space_Grotesk, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/layout/Providers";
import { siteConfig } from "@/config";


const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  display: "swap",
  weight: ["600", "700", "800", "900"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
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
  verification: { google: "urnxtEeuS-9e7YBD0YB-dRpiMWOJ5CbfbAI1cgIkUYs" },
  icons: {
    icon: [
      { url: "/favicon.ico",                    sizes: "any" },
      { url: "/images/logos/ghamkheti-logo.png", type: "image/png" },
    ],
    apple:   "/apple-touch-icon.png",
    shortcut: "/favicon.ico",
  },
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
  "alternateName": ["Ghamkheti Guru", "Ghamkheti Guru Co. Ltd.", "Ghamkheti Guru Limited"],
  "url": "https://ghamkhetiguru.com.np",
  "logo": {
    "@type": "ImageObject",
    "url": "https://ghamkhetiguru.com.np/images/logos/ghamkheti-logo.png",
    "width": 512,
    "height": 512,
    "caption": "Ghamkheti Guru Company Limited Logo",
  },
  "image": "https://ghamkhetiguru.com.np/images/logos/ghamkheti-logo.png",
  "description": siteConfig.description,
  "foundingDate": "2018",
  "numberOfEmployees": { "@type": "QuantitativeValue", "minValue": 10, "maxValue": 50 },
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "2nd Floor, Trade Tower, Thapathali",
    "addressLocality": "Kathmandu",
    "postalCode": "44600",
    "addressCountry": "NP",
    "addressRegion": "Bagmati Province",
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude":  27.6939,
    "longitude": 85.3157,
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
  "areaServed": { "@type": "Country", "name": "Nepal" },
  "sameAs": [
    "https://www.linkedin.com/company/ghamkheti-guru",
    "https://www.facebook.com/ghamkhetiguru",
    "https://twitter.com/ghamkhetiguru",
  ],
  "knowsAbout": ["Hydropower", "Solar Energy", "Renewable Energy Nepal", "Rice Milling", "Agribusiness Nepal", "Tourism Nepal"],
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

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Ghamkheti Guru Company Limited",
  "url": "https://ghamkhetiguru.com.np",
  "description": siteConfig.description,
  "potentialAction": {
    "@type": "SearchAction",
    "target": { "@type": "EntryPoint", "urlTemplate": "https://ghamkhetiguru.com.np/media?q={search_term_string}" },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${barlowCondensed.variable} ${spaceGrotesk.variable} ${geistMono.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased bg-background text-foreground">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
