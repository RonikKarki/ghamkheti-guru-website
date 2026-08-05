import { withApiHandler } from "@/lib/api-error";
import { apiSuccess } from "@/lib/api-response";
import { assertRole } from "@/lib/auth-utils";
import { findMany } from "@/lib/db-helpers";
import Newsletter from "@/models/Newsletter";

export const GET = withApiHandler(async () => {
  await assertRole("admin");
  const subscribers = await findMany(Newsletter, {}, { sort: { createdAt: -1 } });
  return apiSuccess(subscribers);
});
