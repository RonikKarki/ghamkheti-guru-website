import { Container } from "@/components/common/Container";

interface CmsStat {
  value:        number | string;
  suffix?:      string;
  label:        string;
  description?: string;
}
interface CmsStats { items?: CmsStat[] }

const DEFAULT_STATS = [
  { value: "4.9",  suffix: "MW",    label: "Hydropower Pipeline",   description: "Sisakhola, Solukhumbu" },
  { value: "10",   suffix: "MW",    label: "Solar Energy Pipeline", description: "Solukhumbu district" },
  { value: "8",    suffix: "T/Hr",  label: "Rice Mill Capacity",    description: "Japanese Satake technology" },
  { value: "03",   suffix: "",      label: "Sectors",               description: "Energy · Agriculture · Tourism" },
];

export function StatsSection({ cms }: { cms?: CmsStats | null }) {
  const stats = cms?.items?.length
    ? cms.items.map((s) => ({
        value:       String(s.value),
        suffix:      s.suffix ?? "",
        label:       s.label,
        description: s.description ?? "",
      }))
    : DEFAULT_STATS;

  return (
    /* Dark band — "Network Integrity / Pulse of the Valley" style */
    <section style={{ backgroundColor: "#0a0a0a", borderTop: "1px solid rgba(255,255,255,0.07)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
      <Container>
        {/* Heading */}
        <div className="pt-16 pb-10 border-b" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
          <div className="flex items-center gap-2.5 mb-4" style={{ color: "rgba(255,255,255,0.30)" }}>
            <span style={{ display: "inline-block", width: "2rem", height: "1px", background: "rgba(255,255,255,0.20)" }} />
            <span className="text-[10px] font-mono tracking-[0.20em] uppercase">03 / Network Integrity</span>
          </div>
          <h2 className="text-display-md font-display font-bold text-white tracking-tight">
            The Pulse of the Valley
          </h2>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
          {stats.map((s, i) => (
            <div key={i} className="py-10 px-6 lg:px-10 first:pl-0 last:pr-0">
              <div className="flex items-end gap-1 mb-3 leading-none">
                <span className="font-mono font-bold text-white" style={{ fontSize: "clamp(2.5rem, 4vw, 4rem)" }}>
                  {s.value}
                </span>
                {s.suffix && (
                  <span className="font-mono font-bold pb-1 text-xl" style={{ color: "rgba(0,212,106,0.85)" }}>
                    {s.suffix}
                  </span>
                )}
              </div>
              <div className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.70)" }}>
                {s.label}
              </div>
              {s.description && (
                <div className="text-[11px]" style={{ color: "rgba(255,255,255,0.30)" }}>{s.description}</div>
              )}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
