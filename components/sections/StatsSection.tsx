"use client";

import { useState } from "react";
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
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

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

          {/* RIGHT: vertical stat rows — large ghost-style numbers, amber on hover */}
          <div className="divide-y divide-border">
            {stats.map((s, i) => {
              const isHovered = hoveredIdx === i;
              return (
                <div
                  key={i}
                  className="py-8 first:pt-0 flex items-center gap-6 cursor-default"
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                >
                  {/* Large ghost-style stat value — turns amber on hover */}
                  <div
                    className="font-display font-black leading-none select-none shrink-0 flex items-baseline gap-1"
                    style={{ minWidth: "8rem" }}
                  >
                    <span
                      style={{
                        fontSize: "clamp(4rem, 8vw, 7rem)",
                        lineHeight: 1,
                        color: isHovered ? "#e8960a" : "rgba(0,0,0,0.08)",
                        transition: "color 0.25s ease",
                      }}
                    >
                      {s.value}
                    </span>
                    {s.suffix && (
                      <span
                        className="font-mono font-bold"
                        style={{
                          fontSize: "clamp(1rem, 2vw, 1.5rem)",
                          color: isHovered ? "#e8960a" : "rgba(0,0,0,0.15)",
                          transition: "color 0.25s ease",
                          lineHeight: 1,
                          alignSelf: "flex-end",
                          paddingBottom: "0.4em",
                        }}
                      >
                        {s.suffix}
                      </span>
                    )}
                  </div>

                  {/* Label + description */}
                  <div>
                    <div
                      className="text-xs font-semibold uppercase tracking-widest mb-1 transition-colors duration-200"
                      style={{ color: isHovered ? "#e8960a" : "var(--foreground)" }}
                    >
                      {s.label}
                    </div>
                    {s.description && (
                      <div className="text-sm text-foreground-muted">{s.description}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </Container>
    </section>
  );
}
