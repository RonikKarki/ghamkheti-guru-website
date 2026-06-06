import { NextRequest } from "next/server";
import { withApiHandler } from "@/lib/api-error";
import { apiSuccess } from "@/lib/api-response";
import { assertRole } from "@/lib/auth-utils";
import { connectToDatabase } from "@/lib/mongodb";
import Gallery from "@/models/Gallery";

export const GET = withApiHandler(async () => {
  await assertRole("editor");
  await connectToDatabase();
  const items = await Gallery.find().sort({ createdAt: -1 }).lean();
  return apiSuccess(items);
});

export const POST = withApiHandler(async (req: NextRequest) => {
  await assertRole("editor");
  const body = await req.json();
  await connectToDatabase();
  const item = await Gallery.create(body);
  return apiSuccess(item, "Media item created", 201);
});
