import { Container } from "@/components/common/Container";

export default function ProjectsLoading() {
  return (
    <div className="min-h-screen bg-background pt-24">
      {/* Page banner skeleton */}
      <div className="bg-linear-to-br from-brand-deep to-background border-b border-border py-16">
        <Container>
          <div className="space-y-4 max-w-2xl">
            <div className="skeleton h-5 w-32 rounded-full" />
            <div className="skeleton h-14 w-full rounded-xl" />
            <div className="skeleton h-5 w-3/4 rounded-lg" />
          </div>
        </Container>
      </div>

      {/* Filter tabs skeleton */}
      <Container className="py-10">
        <div className="flex gap-3 mb-10">
          {[80, 100, 80, 100, 90].map((w, i) => (
            <div key={i} className="skeleton h-8 rounded-full" style={{ width: w }} />
          ))}
        </div>

        {/* Project cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-card border border-border overflow-hidden">
              <div className="skeleton h-48 w-full" />
              <div className="p-5 space-y-3">
                <div className="flex gap-2">
                  <div className="skeleton h-5 w-20 rounded-full" />
                  <div className="skeleton h-5 w-24 rounded-full" />
                </div>
                <div className="skeleton h-5 w-5/6 rounded-lg" />
                <div className="space-y-2">
                  <div className="skeleton h-3.5 w-full rounded" />
                  <div className="skeleton h-3.5 w-4/5 rounded" />
                </div>
                <div className="grid grid-cols-3 gap-2 pt-1">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="skeleton h-10 rounded-lg" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
