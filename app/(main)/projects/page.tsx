import type { Metadata } from "next";
import { PageBanner } from "@/components/common/PageBanner";
import { ProjectsContent } from "@/components/sections/ProjectsContent";
import type { PublicProject } from "@/components/sections/ProjectsContent";
import { connectToDatabase } from "@/lib/mongodb";
import Project from "@/models/Project";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Our Projects",
  description:
    "Explore Ghamkheti Guru's portfolio of hydropower, solar energy, and agriculture projects across Nepal — from feasibility to full commercial operation.",
  alternates: { canonical: "/projects" },
  keywords: ["Nepal hydropower projects", "solar energy Nepal", "agriculture projects Nepal", "Sisakhola hydropower", "Solukhumbu solar"],
};

export default async function ProjectsPage() {
  await connectToDatabase();
  const raw = await Project.find().sort({ order: 1, createdAt: -1 }).lean();
  const projects: PublicProject[] = (JSON.parse(JSON.stringify(raw)) as Array<{
    _id: string; name: string; category: string; status: string; description: string;
    location: { district: string; province?: string; river?: string };
    capacity?: { value: number; unit: string };
    highlights: Array<{ label: string; value: string }>;
    order: number;
  }>).map((p) => ({
    _id:        p._id,
    name:       p.name,
    category:   p.category,
    status:     p.status,
    description: p.description,
    location:   p.location,
    capacity:   p.capacity,
    highlights: p.highlights,
    order:      p.order,
  }));

  return (
    <>
      <PageBanner
        badge="Project Portfolio"
        title="Building Nepal's Sustainable Future"
        description="Sisakhola Hydropower (4.9 MW), Solar Energy (10 MW), a modern rice mill in Nawalpur, and growing tourism ambitions — developed with care and commitment."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Projects" }]}
      />
      <ProjectsContent projects={projects} />
    </>
  );
}
