export default function AdminLoading() {
  return (
    <div className="max-w-6xl space-y-6 animate-pulse">
      {/* Page header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="skeleton h-6 w-48 rounded-lg" />
          <div className="skeleton h-4 w-64 rounded" />
        </div>
        <div className="skeleton h-9 w-28 rounded-lg" />
      </div>

      {/* Tabs skeleton */}
      <div className="flex gap-2">
        {[80, 60, 90, 70, 80].map((w, i) => (
          <div key={i} className={`skeleton h-8 rounded-full`} style={{ width: w }} />
        ))}
      </div>

      {/* Table skeleton */}
      <div className="rounded-xl border border-border overflow-hidden">
        {/* Header row */}
        <div className="flex gap-4 px-4 py-3 bg-surface border-b border-border">
          {[200, 150, 120, 100, 100, 80].map((w, i) => (
            <div key={i} className="skeleton h-3.5 rounded" style={{ width: w }} />
          ))}
        </div>
        {/* Data rows */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex gap-4 items-center px-4 py-4 border-b border-border last:border-0">
            <div className="skeleton h-4 rounded" style={{ width: 180 }} />
            <div className="skeleton h-4 rounded" style={{ width: 130 }} />
            <div className="skeleton h-4 rounded" style={{ width: 100 }} />
            <div className="skeleton h-5 w-16 rounded-full" />
            <div className="skeleton h-5 w-14 rounded-full" />
            <div className="skeleton h-3.5 rounded" style={{ width: 70 }} />
          </div>
        ))}
      </div>
    </div>
  );
}
