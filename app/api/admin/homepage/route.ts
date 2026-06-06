import { withApiHandler } from "@/lib/api-error";
import { apiSuccess } from "@/lib/api-response";
import { assertRole } from "@/lib/auth-utils";
import { findMany } from "@/lib/db-helpers";
import HomepageContent from "@/models/HomepageContent";

export const GET = withApiHandler(async () => {
  await assertRole("admin");
  const sections = await findMany(HomepageContent, {}, { sort: { section: 1 } });
  return apiSuccess(sections);
});
