import type { Metadata } from "next";
import { requireAuth } from "@/lib/auth-utils";
import { connectToDatabase } from "@/lib/mongodb";
import Project from "@/models/Project";
import ProjectsClient from "@/components/admin/projects/ProjectsClient";

export const metadata: Metadata = { title: "Projects" };

export default async function ProjectsPage({ searchParams }: { searchParams: Promise<{ new?: string }> }) {
  await requireAuth();
  await connectToDatabase();
  const raw = await Project.find().sort({ order: 1, createdAt: -1 }).lean();
  const projects = JSON.parse(JSON.stringify(raw));
  const params = await searchParams;
  return <ProjectsClient initialData={projects} initialOpen={params.new === "1"} />;
}
