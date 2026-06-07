import { connectToDatabase } from "@/lib/mongodb";
import PageBannerContent, { type BannerPage } from "@/models/PageBannerContent";

export async function getPageBanner(page: string): Promise<{ imageUrl: string; imageAlt: string }> {
  await connectToDatabase();
  const doc = await PageBannerContent.findOne({ page: page as BannerPage, isActive: true }).lean();
  return {
    imageUrl: (doc as { imageUrl?: string } | null)?.imageUrl ?? "",
    imageAlt: (doc as { imageAlt?: string } | null)?.imageAlt ?? "",
  };
}
