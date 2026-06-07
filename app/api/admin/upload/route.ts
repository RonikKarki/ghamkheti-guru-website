import { NextRequest } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join, extname } from "path";
import { withApiHandler } from "@/lib/api-error";
import { apiSuccess } from "@/lib/api-response";
import { assertRole } from "@/lib/auth-utils";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
const ALLOWED_DOC_TYPES   = ["application/pdf", "application/msword",
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
  const ext  = extname(original);
  const base = slugify(original.slice(0, original.length - ext.length)).slice(0, 60);
  const ts   = Date.now();
  return `${base}-${ts}${ext}`;
}

export const POST = withApiHandler(async (req: NextRequest) => {
  await assertRole("editor");

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const kind = (formData.get("kind") as string | null) ?? "image"; // "image" | "document"

  if (!file) throw new Error("No file provided");

  const isImage = kind === "image";
  const allowed = isImage ? ALLOWED_IMAGE_TYPES : ALLOWED_DOC_TYPES;
  const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_DOC_SIZE;

  if (!allowed.includes(file.type)) {
    throw new Error(`File type not allowed: ${file.type}`);
  }
  if (file.size > maxSize) {
    throw new Error(`File too large (max ${maxSize / 1024 / 1024} MB)`);
  }

  const subdir  = isImage ? "images" : "documents";
  const filename = uniqueName(file.name);
  const uploadDir = join(process.cwd(), "public", "uploads", subdir);

  await mkdir(uploadDir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(join(uploadDir, filename), buffer);

  return apiSuccess({
    url:      `/uploads/${subdir}/${filename}`,
    filename,
    size:     file.size,
    mimeType: file.type,
  }, "File uploaded");
});
