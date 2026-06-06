import type { Metadata } from "next";
import { connectToDatabase } from "@/lib/mongodb";
import InvestorDocument from "@/models/InvestorDocument";
import type { DocumentType } from "@/models/InvestorDocument";
import { PageBanner } from "@/components/common/PageBanner";
import { Section } from "@/components/common/Section";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { DocumentCard } from "@/components/common/DocumentCard";
import { Grid } from "@/components/common/Grid";
import { GlassCard } from "@/components/common/GlassCard";
import { CTABanner } from "@/components/common/CTABanner";
import { StatsSection } from "@/components/sections/StatsSection";
import {
  TrendingUp, Shield, FileText, Users, Award, BarChart3,
  Calendar, Globe2, Lock,
} from "lucide-react";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Investor Relations",
  description:
    "Financial disclosures, annual reports, corporate governance information, and investment opportunities at Ghamkheti Guru Company Limited.",
};

type Accent = "green" | "gold" | "teal";

const TYPE_ACCENT: Record<DocumentType, Accent> = {
  annual_report:         "green",
  sustainability_report: "green",
  project_brief:         "green",
  other:                 "green",
  quarterly_results:     "gold",
  prospectus:            "gold",
  agm_notice:            "teal",
  agm_minutes:           "teal",
  governance_policy:     "teal",
  board_resolution:      "teal",
};

function formatBytes(bytes?: number | null): string | undefined {
  if (!bytes) return undefined;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toCardProps(doc: any, index: number) {
  return {
    title:       doc.title as string,
    description: doc.description as string | undefined,
    type:        ((doc.fileType as string) ?? "pdf").toUpperCase(),
    size:        formatBytes(doc.fileSize),
    year:        doc.fiscalYear as string | undefined,
    restricted:  doc.isRestricted as boolean,
    href:        `/api/documents/${doc._id}/download`,
    accent:      (TYPE_ACCENT[doc.type as DocumentType] ?? "green") as Accent,
    index,
  };
}

const investmentHighlights = [
  { icon: TrendingUp, title: "Long-term Revenue Visibility",   text: "25–30 year Power Purchase Agreements with Nepal Electricity Authority and cross-border offtakers provide exceptional revenue certainty." },
  { icon: Shield,     title: "Government-Licensed Assets",      text: "All hydropower projects hold valid generation licences issued by the Department of Electricity Development (DOED), Nepal." },
  { icon: Globe2,     title: "Growing Energy Portfolio",        text: "Two energy projects at PPA stage in Solukhumbu — a 4.9 MW hydropower project and a 10 MW solar project — provide a foundation for long-term revenue." },
  { icon: BarChart3,  title: "Diversified Revenue Base",       text: "Three complementary sectors — energy, agriculture, and tourism — provide natural hedging and a platform for sustainable long-term growth." },
  { icon: Award,      title: "Quality Operations",              text: "Our subsidiary rice mill operates Japanese Satake milling technology, reflecting our commitment to operational excellence and quality standards." },
  { icon: Users,      title: "Experienced Management",          text: "Our management team brings deep expertise in infrastructure development, project finance, and government relations in Nepal." },
];

const boardMembers = [
  { name: "Board of Directors",         role: "Oversight & Strategic Direction",      count: "7 Members" },
  { name: "Audit Committee",            role: "Financial Oversight & Compliance",     count: "3 Members" },
  { name: "Risk Committee",             role: "Enterprise Risk Management",           count: "3 Members" },
  { name: "Nominations & Remuneration", role: "Executive Compensation & Succession",  count: "3 Members" },
];

const agmDates = [
  { event: "FY2024/25 Annual General Meeting",   date: "September 15, 2025",  status: "Completed" },
  { event: "Q2 FY2025/26 Results Release",       date: "January 30, 2026",    status: "Completed" },
  { event: "Half-Year Report FY2025/26",         date: "February 28, 2026",   status: "Completed" },
  { event: "FY2025/26 Annual General Meeting",   date: "September 2026",      status: "Upcoming" },
];

const ANNUAL_TYPES:     DocumentType[] = ["annual_report", "sustainability_report"];
const FINANCIAL_TYPES:  DocumentType[] = ["quarterly_results", "prospectus"];
const GOVERNANCE_TYPES: DocumentType[] = ["governance_policy", "board_resolution", "agm_notice", "agm_minutes"];
const OTHER_TYPES:      DocumentType[] = ["project_brief", "other"];

export default async function InvestorRelationsPage() {
  await connectToDatabase();

  const [publicDocs, restrictedDocs] = await Promise.all([
    InvestorDocument.find({ isRestricted: false }).sort({ order: 1, publishedAt: -1 }).lean(),
    InvestorDocument.find({ isRestricted: true }).sort({ order: 1, publishedAt: -1 }).lean(),
  ]);

  const annualReports   = publicDocs.filter((d) => ANNUAL_TYPES.includes(d.type));
  const financialDocs   = publicDocs.filter((d) => FINANCIAL_TYPES.includes(d.type));
  const governanceDocs  = publicDocs.filter((d) => GOVERNANCE_TYPES.includes(d.type));
  const otherDocs       = publicDocs.filter((d) => OTHER_TYPES.includes(d.type));

  return (
    <>
      <PageBanner
        badge="Investor Relations"
        title="Invest in Nepal's Energy Future"
        description="Transparent governance, long-term revenue visibility, and a pipeline that defines Nepal's next generation of clean infrastructure."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Investor Relations" }]}
      />

      <StatsSection />

      {/* Investment Highlights */}
      <Section id="highlights">
        <Container>
          <SectionHeader
            badge="Why Invest"
            title="Investment Highlights"
            titleGradient
            description="A compelling risk-return profile backed by government licences, long-term PPAs, and an experienced management team."
          />
          <Grid cols={1} colsMd={2} colsLg={3} gap="default">
            {investmentHighlights.map((h) => (
              <GlassCard key={h.title} animated padding="default">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center">
                    <h.icon className="h-5 w-5 text-primary" strokeWidth={1.8} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1.5 text-sm">{h.title}</h4>
                    <p className="text-xs text-foreground-muted leading-relaxed">{h.text}</p>
                  </div>
                </div>
              </GlassCard>
            ))}
          </Grid>
        </Container>
      </Section>

      {/* Annual Reports */}
      {annualReports.length > 0 && (
        <Section variant="alt" id="reports">
          <Container>
            <SectionHeader
              badge="Publications"
              title="Annual Reports"
              description="Comprehensive reviews of our financial performance, project progress, and ESG outcomes."
            />
            <Grid cols={1} colsMd={2} gap="sm">
              {annualReports.map((d, i) => (
                <DocumentCard key={String(d._id)} {...toCardProps(d, i)} />
              ))}
            </Grid>
          </Container>
        </Section>
      )}

      {/* Financial Documents */}
      {financialDocs.length > 0 && (
        <Section id="financials">
          <Container>
            <SectionHeader
              badge="Financials"
              title="Financial Disclosures"
              description="Quarterly and half-yearly financial results and audited statements."
            />
            <Grid cols={1} colsMd={2} gap="sm">
              {financialDocs.map((d, i) => (
                <DocumentCard key={String(d._id)} {...toCardProps(d, i)} />
              ))}
            </Grid>
          </Container>
        </Section>
      )}

      {/* Corporate Governance */}
      <Section variant="surface" id="governance">
        <Container>
          <SectionHeader
            badge="Governance"
            title="Corporate Governance"
            titleGradient
            description="Our governance framework ensures accountability, transparency, and long-term stakeholder value."
          />

          {/* Board structure */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {boardMembers.map((b) => (
              <div key={b.name} className="rounded-2xl bg-card border border-border p-5 text-center hover:border-primary/20 transition-colors">
                <p className="font-semibold text-foreground text-sm mb-1 leading-snug">{b.name}</p>
                <p className="text-xs text-foreground-muted mb-3 leading-relaxed">{b.role}</p>
                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-primary/10 text-primary">{b.count}</span>
              </div>
            ))}
          </div>

          {governanceDocs.length > 0 && (
            <Grid cols={1} colsMd={2} colsLg={3} gap="sm">
              {governanceDocs.map((d, i) => (
                <DocumentCard key={String(d._id)} {...toCardProps(d, i)} />
              ))}
            </Grid>
          )}
        </Container>
      </Section>

      {/* Other documents */}
      {otherDocs.length > 0 && (
        <Section id="other-documents">
          <Container>
            <SectionHeader badge="Documents" title="Other Publications" description="Additional disclosures, project briefs, and supplementary documents." />
            <Grid cols={1} colsMd={2} colsLg={3} gap="sm">
              {otherDocs.map((d, i) => (
                <DocumentCard key={String(d._id)} {...toCardProps(d, i)} />
              ))}
            </Grid>
          </Container>
        </Section>
      )}

      {/* Restricted documents */}
      {restrictedDocs.length > 0 && (
        <Section variant="alt">
          <Container size="md">
            <SectionHeader
              badge="Restricted Access"
              title="Confidential Documents"
              description="The following documents are available to registered investors and counterparties under NDA."
            />
            <div className="space-y-3">
              {restrictedDocs.map((d, i) => (
                <DocumentCard key={String(d._id)} {...toCardProps(d, i)} restricted />
              ))}
            </div>
            <div className="mt-6 flex items-start gap-3 rounded-xl bg-surface-raised border border-border p-4">
              <Lock className="h-4 w-4 text-foreground-subtle mt-0.5 shrink-0" />
              <p className="text-xs text-foreground-muted leading-relaxed">
                To request access to restricted documents, please contact our Investor Relations team at{" "}
                <a href="mailto:ghamkhetiguru@gmail.com" className="text-primary hover:underline">ghamkhetiguru@gmail.com</a>{" "}
                with your name, organisation, and the document(s) required. An NDA will be provided within 2 business days.
              </p>
            </div>
          </Container>
        </Section>
      )}

      {/* AGM & calendar */}
      <Section>
        <Container size="md">
          <SectionHeader badge="Calendar" title="AGM & Key Dates" description="Upcoming and recent shareholder events and financial reporting dates." />
          <div className="space-y-3">
            {agmDates.map((a) => (
              <div key={a.event} className="flex items-center justify-between gap-4 rounded-xl bg-card border border-border p-4 hover:border-primary/20 transition-colors">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-primary shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{a.event}</p>
                    <p className="text-xs text-foreground-subtle">{a.date}</p>
                  </div>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                  a.status === "Completed" ? "bg-primary/10 text-primary" : "bg-gold/10 text-gold"
                }`}>
                  {a.status}
                </span>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <CTABanner
        badge="Investor Enquiries"
        title="Speak With Our Investor Relations Team"
        description="For institutional briefings, project investment memoranda, or shareholder support — our IR team responds within one business day."
        primaryLabel="Contact IR Team"
        primaryHref="/contact"
        secondaryLabel="View Projects"
        secondaryHref="/projects"
      />
    </>
  );
}
