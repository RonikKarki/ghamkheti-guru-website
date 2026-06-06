import type { MetadataRoute } from "next";
import { siteConfig } from "@/config";

// Static routes with priorities and change frequencies
const STATIC_ROUTES: MetadataRoute.Sitemap = [
  {
    url: siteConfig.url,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 1.0,
  },
  {
    url: `${siteConfig.url}/about`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.9,
  },
  {
    url: `${siteConfig.url}/projects`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.9,
  },
  {
    url: `${siteConfig.url}/investor-relations`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  },
  {
    url: `${siteConfig.url}/media`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.8,
  },
  {
    url: `${siteConfig.url}/services`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    url: `${siteConfig.url}/team`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  },
  {
    url: `${siteConfig.url}/blog`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    url: `${siteConfig.url}/contact`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  },
];

export default function sitemap(): MetadataRoute.Sitemap {
  // When /projects/[slug] and /blog/[slug] routes are added, fetch from DB here:
  // await connectToDatabase();
  // const projects = await Project.find({ isFeatured: true }).select("slug updatedAt").lean();
  // const projectPages = projects.map(p => ({ url: `${siteConfig.url}/projects/${p.slug}`, ... }));

  return STATIC_ROUTES;
}
