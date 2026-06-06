import { Container } from "@/components/common/Container";

export default function MainLoading() {
  return (
    <div className="min-h-screen bg-background pt-24">
      <Container>
        {/* Page banner skeleton */}
        <div className="mb-16 space-y-4">
          <div className="skeleton h-5 w-28 rounded-full" />
          <div className="skeleton h-12 w-2/3 rounded-xl" />
          <div className="skeleton h-5 w-1/2 rounded-lg" />
        </div>

        {/* Content skeleton grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-card border border-border p-6 space-y-4">
              <div className="skeleton h-11 w-11 rounded-xl" />
              <div className="skeleton h-5 w-3/4 rounded-lg" />
              <div className="space-y-2">
                <div className="skeleton h-3.5 w-full rounded" />
                <div className="skeleton h-3.5 w-5/6 rounded" />
                <div className="skeleton h-3.5 w-4/6 rounded" />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
