import { NextRequest } from "next/server";
import { put } from "@vercel/blob";
import { withApiHandler } from "@/lib/api-error";
import { apiSuccess } from "@/lib/api-response";
import { assertRole } from "@/lib/auth-utils";

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg", "image/jpg", "image/png",
  "image/webp", "image/gif", "image/svg+xml",
];
const ALLOWED_DOC_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
];
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;  // 10 MB
const MAX_DOC_SIZE   = 50 * 1024 * 1024;  // 50 MB

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/^-|-$/g, "");
}

function uniqueName(original: string): string {
  const lastDot = original.lastIndexOf(".");
  const ext  = lastDot >= 0 ? original.slice(lastDot) : "";
  const base = slugify(original.slice(0, lastDot >= 0 ? lastDot : undefined)).slice(0, 60);
  return `${base}-${Date.now()}${ext}`;
}

export const POST = withApiHandler(async (req: NextRequest) => {
  await assertRole("editor");

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const kind = (formData.get("kind") as string | null) ?? "image";

  if (!file) throw new Error("No file provided");

  const isImage  = kind === "image";
  const allowed  = isImage ? ALLOWED_IMAGE_TYPES : ALLOWED_DOC_TYPES;
  const maxSize  = isImage ? MAX_IMAGE_SIZE : MAX_DOC_SIZE;
  const subdir   = isImage ? "images" : "documents";

  if (!allowed.includes(file.type)) {
    throw new Error(`File type not allowed: ${file.type}`);
  }
  if (file.size > maxSize) {
    throw new Error(`File too large (max ${maxSize / 1024 / 1024} MB)`);
  }

  const filename = uniqueName(file.name);
  const pathname = `uploads/${subdir}/${filename}`;

  /* Upload to Vercel Blob (production) or local fallback (dev without BLOB_READ_WRITE_TOKEN) */
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(pathname, file, {
      access: "public",
      contentType: file.type,
    });

    return apiSuccess({
      url:      blob.url,
      filename,
      size:     file.size,
      mimeType: file.type,
    }, "File uploaded");
  }

  /* ── Local fallback for development ── */
  const { writeFile, mkdir } = await import("fs/promises");
  const { join }             = await import("path");

  const uploadDir = join(process.cwd(), "public", "uploads", subdir);
  await mkdir(uploadDir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(join(uploadDir, filename), buffer);

  return apiSuccess({
    url:      `/uploads/${subdir}/${filename}`,
    filename,
    size:     file.size,
    mimeType: file.type,
  }, "File uploaded (local)");
});
