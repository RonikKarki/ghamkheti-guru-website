import type { Metadata } from "next";
import { requireRole } from "@/lib/auth-utils";
import { connectToDatabase } from "@/lib/mongodb";
import Contact from "@/models/Contact";
import ContactsClient from "@/components/admin/contacts/ContactsClient";

export const metadata: Metadata = { title: "Contacts" };

export default async function ContactsPage() {
  await requireRole("admin");
  await connectToDatabase();
  const raw = await Contact.find().sort({ createdAt: -1 }).lean();
  return <ContactsClient initialData={JSON.parse(JSON.stringify(raw))} />;
}
