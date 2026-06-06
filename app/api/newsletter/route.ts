import { NextRequest } from "next/server";
import { withApiHandler } from "@/lib/api-error";
import { apiCreated, apiBadRequest, apiConflict } from "@/lib/api-response";
import { createOne, exists } from "@/lib/db-helpers";
import Newsletter from "@/models/Newsletter";

export const POST = withApiHandler(async (req: NextRequest) => {
  const { email } = await req.json();

  if (!email || typeof email !== "string") {
    return apiBadRequest("A valid email address is required");
  }

  const alreadySubscribed = await exists(Newsletter, { email: email.toLowerCase().trim() });
  if (alreadySubscribed) {
    return apiConflict("This email address is already subscribed");
  }

  await createOne(Newsletter, { email });

  return apiCreated(null, "Subscribed successfully. Thank you!");
});
