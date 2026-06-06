export default function RootLoading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6">
        {/* Logo mark */}
        <div className="relative flex h-16 w-16 items-center justify-center">
          <div className="absolute inset-0 rounded-2xl bg-primary/10 animate-pulse" />
          <span className="relative font-display font-bold text-2xl text-gradient">GG</span>
        </div>

        {/* Spinner ring */}
        <div className="relative h-8 w-8">
          <div className="absolute inset-0 rounded-full border-2 border-border-strong" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin" />
        </div>

        <p className="text-overline text-foreground-subtle tracking-widest">Loading</p>
      </div>
    </div>
  );
}
