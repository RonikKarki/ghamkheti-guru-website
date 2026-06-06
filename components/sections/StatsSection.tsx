import { Container } from "@/components/common/Container";
import { StatCard } from "@/components/common/StatCard";
import { Grid } from "@/components/common/Grid";
import { Section } from "@/components/common/Section";

interface CmsStat {
  value:       number | string;
  suffix?:     string;
  label:       string;
  description?: string;
}

interface CmsStats {
  items?: CmsStat[];
}

const DEFAULT_STATS = [
  { value: 4.9, suffix: " MW",    label: "Hydropower Pipeline",   description: "Sisakhola, Solukhumbu",        variant: "glass" as const },
  { value: 10,  suffix: " MW",    label: "Solar Energy Pipeline", description: "Solukhumbu district",          variant: "glass" as const },
  { value: 8,   suffix: " T/Hr",  label: "Rice Mill Capacity",    description: "Japanese Satake technology",   variant: "glass" as const },
  { value: 3,   suffix: "",       label: "Business Sectors",      description: "Energy · Agriculture · Tourism", variant: "glass" as const },
];

export function StatsSection({ cms }: { cms?: CmsStats | null }) {
  const stats =
    cms?.items?.length
      ? cms.items.map((s) => ({
          value:       Number(s.value) || 0,
          suffix:      s.suffix ?? "",
          label:       s.label,
          description: s.description,
          variant:     "glass" as const,
        }))
      : DEFAULT_STATS;

  return (
    <Section variant="gradient" size="sm">
      <Container>
        <Grid cols={2} colsLg={4} gap="default">
          {stats.map((s, i) => (
            <StatCard
              key={s.label}
              value={s.value}
              suffix={s.suffix}
              label={s.label}
              description={s.description}
              variant={s.variant}
              index={i}
            />
          ))}
        </Grid>
      </Container>
    </Section>
  );
}
