import type { MetadataRoute } from "next";
import { siteConfig } from "@/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/api/",
          "/login",
          "/_next/",
        ],
      },
      // Block AI training bots
      { userAgent: "GPTBot",      disallow: ["/"] },
      { userAgent: "Google-Extended", disallow: ["/"] },
      { userAgent: "CCBot",       disallow: ["/"] },
      { userAgent: "anthropic-ai", disallow: ["/"] },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
