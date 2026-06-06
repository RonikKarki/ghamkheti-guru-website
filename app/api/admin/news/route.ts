import { NextRequest } from "next/server";
import { withApiHandler } from "@/lib/api-error";
import { apiSuccess, apiCreated, apiBadRequest } from "@/lib/api-response";
import { assertRole } from "@/lib/auth-utils";
import { findMany, createOne } from "@/lib/db-helpers";
import { generateUniqueSlug } from "@/lib/slugify";
import News from "@/models/News";
import type { NewsCategory, NewsStatus } from "@/models/News";

export const GET = withApiHandler(async () => {
  await assertRole("editor");
  const articles = await findMany(News, {}, { sort: { createdAt: -1 } });
  return apiSuccess(articles);
});

export const POST = withApiHandler(async (req: NextRequest) => {
  await assertRole("editor");
  const body = await req.json();
  const { title, excerpt, content, category, author, status } = body;

  if (!title || !excerpt || !content || !category) {
    return apiBadRequest("title, excerpt, content, and category are required");
  }

  const slug   = await generateUniqueSlug(News, title);
  const isPublished = status === "published";

  const article = await createOne(News, {
    slug, title, excerpt, content,
    category:    category as NewsCategory,
    status:      (status as NewsStatus) ?? "draft",
    author:      author ?? "Ghamkheti Guru",
    publishedAt: isPublished ? new Date() : undefined,
  });

  return apiCreated(article, "Article created successfully");
});
