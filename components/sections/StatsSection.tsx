import { Container } from "@/components/common/Container";

interface CmsStat {
  value:        number | string;
  suffix?:      string;
  label:        string;
  description?: string;
}
interface CmsStats {
  title?: string;
  items?: CmsStat[];
}

const DEFAULT_STATS = [
  { value: "4.9",  suffix: "MW",    label: "Hydropower Pipeline",   description: "Sisakhola, Solukhumbu" },
  { value: "10",   suffix: "MW",    label: "Solar Energy Pipeline", description: "Solukhumbu district" },
  { value: "8",    suffix: "T/Hr",  label: "Rice Mill Capacity",    description: "Japanese Satake technology" },
  { value: "03",   suffix: "",      label: "Sectors",               description: "Energy · Agriculture · Tourism" },
];

export function StatsSection({ cms }: { cms?: CmsStats | null }) {
  const stats   = cms?.items?.length
    ? cms.items.map((s) => ({
        value:       String(s.value),
        suffix:      s.suffix ?? "",
        label:       s.label,
        description: s.description ?? "",
      }))
    : DEFAULT_STATS;

  const heading = cms?.title || "Our Growing\nImpact";

  return (
    <section className="py-24 md:py-32 bg-background border-t border-border" id="stats">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-16 lg:gap-24 items-start">

          {/* LEFT: section label + stacked heading */}
          <div>
            <div className="section-num mb-8">03 / Network Integrity</div>
            <h2
              className="font-display font-bold text-foreground tracking-tight"
              style={{
                fontSize: "clamp(2.8rem, 5vw, 5rem)",
                lineHeight: 1,
                whiteSpace: "pre-line",
                letterSpacing: "-0.03em",
              }}
            >
              {heading}
            </h2>
          </div>

          {/* RIGHT: vertical stat rows with ghost numbers */}
          <div className="divide-y divide-border">
            {stats.map((s, i) => (
              <div key={i} className="py-8 first:pt-0 flex items-start gap-6">
                {/* Ghost ordinal number */}
                <span
                  className="font-display font-black leading-none select-none shrink-0"
                  style={{
                    fontSize: "clamp(4rem, 8vw, 7rem)",
                    color: "rgba(0,0,0,0.05)",
                    lineHeight: 1,
                    minWidth: "4rem",
                    textAlign: "right",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                {/* Stat content */}
                <div className="pt-1">
                  <div className="flex items-baseline gap-1.5 mb-2 leading-none">
                    <span
                      className="font-mono font-bold text-foreground"
                      style={{ fontSize: "clamp(1.8rem, 3vw, 2.8rem)", lineHeight: 1 }}
                    >
                      {s.value}
                    </span>
                    {s.suffix && (
                      <span className="font-mono font-semibold text-primary text-lg">{s.suffix}</span>
                    )}
                  </div>
                  <div className="text-xs font-semibold uppercase tracking-widest text-foreground mb-1">
                    {s.label}
                  </div>
                  {s.description && (
                    <div className="text-sm text-foreground-muted">{s.description}</div>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>
      </Container>
    </section>
  );
}
