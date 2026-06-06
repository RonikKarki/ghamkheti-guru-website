import mongoose, { Model } from "mongoose";
type FilterQuery<T> = mongoose.QueryFilter<T>;

/** Converts a string to a URL-safe slug. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")   // strip non-word chars except hyphens
    .replace(/[\s_]+/g, "-")    // spaces/underscores → hyphen
    .replace(/-+/g, "-")        // collapse consecutive hyphens
    .replace(/^-|-$/g, "");     // strip leading/trailing hyphens
}

/**
 * Generates a slug that is guaranteed unique within the given collection.
 * If `base` is already taken it appends -2, -3, … until a free slot is found.
 *
 * @param Model  - Mongoose model to check against
 * @param base   - Raw string to slugify (e.g. a title)
 * @param field  - The document field that holds the slug (default: "slug")
 * @param excludeId - Skip this document id during uniqueness check (for updates)
 */
export async function generateUniqueSlug<T>(
  Model:     Model<T>,
  base:      string,
  field:     keyof T = "slug" as keyof T,
  excludeId?: string
): Promise<string> {
  const root = slugify(base);
  let candidate = root;
  let suffix = 2;

  while (true) {
    const filter: FilterQuery<T> = { [field]: candidate } as FilterQuery<T>;
    if (excludeId) {
      (filter as Record<string, unknown>)["_id"] = { $ne: excludeId };
    }
    const exists = await Model.exists(filter);
    if (!exists) return candidate;
    candidate = `${root}-${suffix++}`;
  }
}
