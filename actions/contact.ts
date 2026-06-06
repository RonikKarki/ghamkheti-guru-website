"use server";

import { connectToDatabase } from "@/lib/mongodb";
import Contact from "@/models/Contact";

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export async function submitContactForm(data: ContactFormData) {
  try {
    await connectToDatabase();
    await Contact.create(data);
    return { success: true };
  } catch (error) {
    console.error("[submitContactForm]", error);
    return { success: false, error: "Failed to submit contact form" };
  }
}
