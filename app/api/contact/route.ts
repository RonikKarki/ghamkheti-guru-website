import { NextRequest } from "next/server";
import { withApiHandler } from "@/lib/api-error";
import { apiCreated, apiBadRequest, apiError } from "@/lib/api-response";
import { createOne } from "@/lib/db-helpers";
import { contactRateLimit } from "@/lib/rate-limit";
import Contact from "@/models/Contact";
import type { EnquiryType } from "@/models/Contact";

const VALID_ENQUIRY_TYPES: EnquiryType[] = [
  "general", "investment", "partnership", "media", "career", "procurement", "government",
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Strip HTML tags and control characters from user input. */
function sanitize(value: unknown): string {
  if (typeof value !== "string") return "";
  return value
    .replace(/<[^>]*>/g, "")            // strip HTML tags
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")  // strip control chars
    .trim();
}

export const POST = withApiHandler(async (req: NextRequest) => {
  // Rate limit by IP — 10 submissions per 15 minutes
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  const limit = contactRateLimit(ip);
  if (!limit.success) {
    return apiError("Too many submissions. Please try again later.", 429);
  }

  const body = await req.json();

  const name         = sanitize(body.name);
  const email        = sanitize(body.email).toLowerCase();
  const phone        = sanitize(body.phone);
  const organisation = sanitize(body.organisation);
  const subject      = sanitize(body.subject);
  const message      = sanitize(body.message);
  const enquiryType  = sanitize(body.enquiryType) as EnquiryType;

  // Field-level validation
  if (!name)    return apiBadRequest("Name is required");
  if (!email)   return apiBadRequest("Email is required");
  if (!subject) return apiBadRequest("Subject is required");
  if (!message) return apiBadRequest("Message is required");

  if (name.length > 120)    return apiBadRequest("Name must be 120 characters or fewer");
  if (email.length > 254)   return apiBadRequest("Email address is too long");
  if (subject.length > 250) return apiBadRequest("Subject must be 250 characters or fewer");
  if (message.length > 5000) return apiBadRequest("Message must be 5,000 characters or fewer");
  if (!EMAIL_RE.test(email)) return apiBadRequest("Please provide a valid email address");

  const resolvedType: EnquiryType = VALID_ENQUIRY_TYPES.includes(enquiryType)
    ? enquiryType
    : "general";

  await createOne(Contact, {
    name,
    email,
    phone:        phone        || undefined,
    organisation: organisation || undefined,
    enquiryType:  resolvedType,
    subject,
    message,
    ipAddress: ip !== "unknown" ? ip : undefined,
    userAgent: req.headers.get("user-agent") ?? undefined,
  });

  return apiCreated(null, "Your message has been received. We will be in touch within one business day.");
});
