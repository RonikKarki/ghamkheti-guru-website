import { NextRequest } from "next/server";
import { withApiHandler } from "@/lib/api-error";
import { apiSuccess, apiCreated, apiBadRequest } from "@/lib/api-response";
import { assertRole } from "@/lib/auth-utils";
import { connectToDatabase } from "@/lib/mongodb";
import { generateUniqueSlug } from "@/lib/slugify";
import Subsidiary from "@/models/Subsidiary";

export const GET = withApiHandler(async () => {
  await assertRole("editor");
  await connectToDatabase();
  const docs = await Subsidiary.find().sort({ order: 1, createdAt: -1 }).lean();
  return apiSuccess(docs);
});

export const POST = withApiHandler(async (req: NextRequest) => {
  await assertRole("editor");
  const body = await req.json();

  const {
    name, industry, shortDescription, description,
    location, ownership, establishedYear,
    logoImage, bannerImage, gallery,
    activities, products, contact,
    isActive, isFeatured, order,
    seoTitle, seoDescription, ogImage,
  } = body;

  if (!name?.trim())     return apiBadRequest("name is required");
  if (!industry?.trim()) return apiBadRequest("industry is required");

  await connectToDatabase();
  const slug = await generateUniqueSlug(Subsidiary, name);

  const doc: Record<string, unknown> = {
    slug,
    name:             name.trim(),
    industry:         industry.trim(),
    shortDescription: shortDescription?.trim() ?? "",
    description:      description?.trim() ?? "",
    location:         location?.trim() ?? "",
    ownership:        ownership?.trim() ?? "",
    gallery:          Array.isArray(gallery)     ? gallery     : [],
    activities:       Array.isArray(activities)  ? activities  : [],
    products:         Array.isArray(products)    ? products    : [],
    contact:          contact ?? {},
    isActive:         isActive ?? true,
    isFeatured:       isFeatured ?? false,
    order:            order ?? 0,
  };

  if (establishedYear) doc.establishedYear = Number(establishedYear);
  if (logoImage)       doc.logoImage       = logoImage;
  if (bannerImage)     doc.bannerImage     = bannerImage;
  if (seoTitle)        doc.seoTitle        = seoTitle;
  if (seoDescription)  doc.seoDescription  = seoDescription;
  if (ogImage)         doc.ogImage         = ogImage;

  const sub = await Subsidiary.create(doc);
  return apiCreated(sub, "Subsidiary created successfully");
});
