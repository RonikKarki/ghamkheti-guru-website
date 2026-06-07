import type { Metadata } from "next";
import { PageBanner } from "@/components/common/PageBanner";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { connectToDatabase } from "@/lib/mongodb";
import Gallery from "@/models/Gallery";
import { getPageBanner } from "@/lib/get-page-banner";

export const revalidate = 1800;

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Photos from Ghamkheti Guru's hydropower, solar, agriculture, and community projects across Nepal.",
  alternates: { canonical: "/gallery" },
};

import type { PublicGalleryItem } from "@/components/gallery/GalleryGrid";

export default async function GalleryPage() {
  await connectToDatabase();
  const [raw, pageBanner] = await Promise.all([
    Gallery.find({ fileType: "image" })
      .sort({ isFeatured: -1, order: 1, createdAt: -1 })
      .lean(),
    getPageBanner("gallery"),
  ]);

  const items: PublicGalleryItem[] = (
    JSON.parse(JSON.stringify(raw)) as Array<{
      _id: string; title: string; alt: string; category: string;
      fileUrl: string; thumbnailUrl?: string; fileType: string; isFeatured: boolean;
      dimensions?: { width: number; height: number };
    }>
  ).map((d) => ({
    _id:          d._id,
    title:        d.title,
    alt:          d.alt ?? "",
    category:     d.category,
    fileUrl:      d.fileUrl,
    thumbnailUrl: d.thumbnailUrl,
    fileType:     d.fileType,
    isFeatured:   d.isFeatured ?? false,
    dimensions:   d.dimensions,
  }));

  return (
    <>
      <PageBanner
        badge="Gallery"
        title="Our Work in Pictures"
        description="A visual record of our projects, teams, and communities across Nepal — from mountain rivers to the Terai plains."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Gallery" }]}
        bannerImage={pageBanner.imageUrl || undefined}
        bannerImageAlt={pageBanner.imageAlt}
      />
      <GalleryGrid items={items} />
    </>
  );
}
