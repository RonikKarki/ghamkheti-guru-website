import type { MetadataRoute } from "next";
import { siteConfig } from "@/config";
import { connectToDatabase } from "@/lib/mongodb";
import Project from "@/models/Project";
import Subsidiary from "@/models/Subsidiary";
import News from "@/models/News";

const STATIC_ROUTES: MetadataRoute.Sitemap = [
  { url: siteConfig.url,                          lastModified: new Date(), changeFrequency: "daily",   priority: 1.0 },
  { url: `${siteConfig.url}/about`,               lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
  { url: `${siteConfig.url}/projects`,            lastModified: new Date(), changeFrequency: "weekly",  priority: 0.9 },
  { url: `${siteConfig.url}/subsidiaries`,        lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  { url: `${siteConfig.url}/investor-relations`,  lastModified: new Date(), changeFrequency: "weekly",  priority: 0.8 },
  { url: `${siteConfig.url}/media`,               lastModified: new Date(), changeFrequency: "daily",   priority: 0.8 },
  { url: `${siteConfig.url}/gallery`,             lastModified: new Date(), changeFrequency: "weekly",  priority: 0.6 },
  { url: `${siteConfig.url}/contact`,             lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    await connectToDatabase();

    const [projects, subsidiaries, news] = await Promise.all([
      Project.find({ isActive: true }).select("slug updatedAt").lean(),
      Subsidiary.find({ isActive: true }).select("slug updatedAt").lean(),
      News.find({ status: "published" }).select("slug updatedAt").lean(),
    ]);

    const projectPages = (projects as Array<{ slug: string; updatedAt?: Date }>).map((p) => ({
      url: `${siteConfig.url}/projects/${p.slug}`,
      lastModified: p.updatedAt ?? new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));

    const subsidiaryPages = (subsidiaries as Array<{ slug: string; updatedAt?: Date }>).map((s) => ({
      url: `${siteConfig.url}/subsidiaries/${s.slug}`,
      lastModified: s.updatedAt ?? new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

    const newsPages = (news as Array<{ slug: string; updatedAt?: Date }>).map((n) => ({
      url: `${siteConfig.url}/blog/${n.slug}`,
      lastModified: n.updatedAt ?? new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    }));

    return [...STATIC_ROUTES, ...projectPages, ...subsidiaryPages, ...newsPages];
  } catch {
    return STATIC_ROUTES;
  }
}
