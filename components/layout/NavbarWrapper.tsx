import { connectToDatabase } from "@/lib/mongodb";
import Project from "@/models/Project";
import { Navbar } from "./Navbar";

export async function NavbarWrapper() {
  let projectLinks: Array<{ label: string; href: string }> = [];

  try {
    await connectToDatabase();
    const projects = await Project.find({ isActive: true })
      .sort({ order: 1 })
      .select("name slug")
      .limit(10)
      .lean();

    projectLinks = (JSON.parse(JSON.stringify(projects)) as Array<{ name: string; slug: string }>)
      .map((p) => ({ label: p.name, href: `/projects/${p.slug}` }));
  } catch {
    // fail silently — static fallback in Navbar
  }

  return <Navbar projectLinks={projectLinks} />;
}
