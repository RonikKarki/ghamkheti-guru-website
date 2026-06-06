import { withApiHandler } from "@/lib/api-error";
import { apiSuccess } from "@/lib/api-response";
import { assertRole } from "@/lib/auth-utils";
import { findMany } from "@/lib/db-helpers";
import Contact from "@/models/Contact";

export const GET = withApiHandler(async () => {
  await assertRole("admin");
  const contacts = await findMany(Contact, {}, { sort: { createdAt: -1 } });
  return apiSuccess(contacts);
});
