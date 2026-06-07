import type { Metadata } from "next";
import { requireRole } from "@/lib/auth-utils";
import { connectToDatabase } from "@/lib/mongodb";
import PageBannerContent from "@/models/PageBannerContent";
import PageBannersClient from "@/components/admin/page-banners/PageBannersClient";

export const metadata: Metadata = { title: "Page Banners" };

export default async function PageBannersPage() {
  await requireRole("admin");
  await connectToDatabase();

  const raw = await PageBannerContent.find().lean();
  const data = JSON.parse(JSON.stringify(raw)) as Array<{
    page: string; imageUrl?: string; imageAlt?: string; isActive?: boolean;
  }>;

  return <PageBannersClient initialData={data} />;
}
