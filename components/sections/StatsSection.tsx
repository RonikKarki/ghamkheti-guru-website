import { Container } from "@/components/common/Container";

interface CmsStat {
  value:        number | string;
  suffix?:      string;
  label:        string;
  description?: string;
}

interface CmsStats {
  items?: CmsStat[];
}

const DEFAULT_STATS = [
  { value: 4.9,  suffix: " MW",   label: "Hydropower Pipeline",   description: "Sisakhola, Solukhumbu" },
  { value: 10,   suffix: " MW",   label: "Solar Energy Pipeline", description: "Solukhumbu district" },
  { value: 8,    suffix: " T/Hr", label: "Rice Mill Capacity",    description: "Japanese Satake technology" },
  { value: 3,    suffix: "",      label: "Business Sectors",      description: "Energy · Agriculture · Tourism" },
];

export function StatsSection({ cms }: { cms?: CmsStats | null }) {
  const stats = cms?.items?.length
    ? cms.items.map((s) => ({
        value:       s.value,
        suffix:      s.suffix ?? "",
        label:       s.label,
        description: s.description ?? "",
      }))
    : DEFAULT_STATS;

  return (
    <section className="py-0 bg-background border-y border-border overflow-hidden">
      <Container>
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-border">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className="flex flex-col justify-center py-10 px-6 lg:px-10 first:pl-0 last:pr-0 group"
            >
              <div className="font-mono text-3xl md:text-4xl lg:text-5xl font-bold text-primary leading-none mb-2 tabular-nums">
                {s.value}{s.suffix}
              </div>
              <div className="text-xs font-semibold uppercase tracking-widest text-foreground mb-1">{s.label}</div>
              {s.description && (
                <div className="text-[11px] text-foreground-subtle leading-relaxed">{s.description}</div>
              )}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
