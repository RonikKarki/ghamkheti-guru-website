import type { Metadata } from "next";
import { requireAuth } from "@/lib/auth-utils";
import { connectToDatabase } from "@/lib/mongodb";
import Gallery from "@/models/Gallery";
import GalleryClient from "@/components/admin/gallery/GalleryClient";

export const metadata: Metadata = { title: "Gallery" };

export default async function GalleryPage() {
  await requireAuth();
  await connectToDatabase();
  const raw = await Gallery.find().sort({ createdAt: -1 }).lean();
  return <GalleryClient initialData={JSON.parse(JSON.stringify(raw))} />;
}
