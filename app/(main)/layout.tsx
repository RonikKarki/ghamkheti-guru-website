import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { organizationSchema } from "@/lib/metadata";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Organisation structured data — injected once for all public pages */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema()) }}
      />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
