import type { Metadata } from "next";
import { requireRole } from "@/lib/auth-utils";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import UsersClient from "@/components/admin/users/UsersClient";
import { auth } from "@/lib/auth";

export const metadata: Metadata = { title: "Users & Access" };

export default async function UsersPage() {
  await requireRole("super_admin");
  const session = await auth();
  await connectToDatabase();
  const raw = await User.find().sort({ createdAt: -1 }).lean();
  return (
    <UsersClient
      initialData={JSON.parse(JSON.stringify(raw))}
      currentUserId={session!.user.id}
    />
  );
}
