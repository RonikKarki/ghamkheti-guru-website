import type { Metadata } from "next";
import { connectToDatabase } from "@/lib/mongodb";
import InvestorDocument from "@/models/InvestorDocument";
import type { DocumentType } from "@/models/InvestorDocument";
import { PageBanner } from "@/components/common/PageBanner";
import { getPageBanner } from "@/lib/get-page-banner";
import { Section } from "@/components/common/Section";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { DocumentCard } from "@/components/common/DocumentCard";
import { Grid } from "@/components/common/Grid";
import { Lock } from "lucide-react";

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

const ANNUAL_TYPES:     DocumentType[] = ["annual_report", "sustainability_report"];
const FINANCIAL_TYPES:  DocumentType[] = ["quarterly_results", "prospectus"];
const GOVERNANCE_TYPES: DocumentType[] = ["governance_policy", "board_resolution", "agm_notice", "agm_minutes"];
const OTHER_TYPES:      DocumentType[] = ["project_brief", "other"];

export default async function InvestorRelationsPage() {
  await connectToDatabase();

  const [publicDocs, restrictedDocs, pageBanner] = await Promise.all([
    InvestorDocument.find({ isRestricted: false }).sort({ order: 1, publishedAt: -1 }).lean(),
    InvestorDocument.find({ isRestricted: true }).sort({ order: 1, publishedAt: -1 }).lean(),
    getPageBanner("investor_relations"),
  ]);

  const annualReports  = publicDocs.filter((d) => ANNUAL_TYPES.includes(d.type));
  const financialDocs  = publicDocs.filter((d) => FINANCIAL_TYPES.includes(d.type));
  const governanceDocs = publicDocs.filter((d) => GOVERNANCE_TYPES.includes(d.type));
  const otherDocs      = publicDocs.filter((d) => OTHER_TYPES.includes(d.type));

  const hasAny = annualReports.length > 0 || financialDocs.length > 0 ||
                 governanceDocs.length > 0 || otherDocs.length > 0 || restrictedDocs.length > 0;

  return (
    <>
      <PageBanner
        badge="Investor Relations"
        title="Investor Relations"
        description="Documents, reports, and disclosures from Ghamkheti Guru Company Limited."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Investor Relations" }]}
        bannerImage={pageBanner.imageUrl || undefined}
        bannerImageAlt={pageBanner.imageAlt}
      />

      {!hasAny && (
        <Section>
          <Container size="md">
            <p className="text-center text-foreground-muted py-16">
              No documents have been published yet. Check back soon.
            </p>
          </Container>
        </Section>
      )}

      {annualReports.length > 0 && (
        <Section id="reports">
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

      {financialDocs.length > 0 && (
        <Section variant="alt" id="financials">
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

      {governanceDocs.length > 0 && (
        <Section id="governance">
          <Container>
            <SectionHeader
              badge="Governance"
              title="Corporate Governance"
              description="Policies, board resolutions, AGM notices and minutes."
            />
            <Grid cols={1} colsMd={2} colsLg={3} gap="sm">
              {governanceDocs.map((d, i) => (
                <DocumentCard key={String(d._id)} {...toCardProps(d, i)} />
              ))}
            </Grid>
          </Container>
        </Section>
      )}

      {otherDocs.length > 0 && (
        <Section variant="alt" id="other-documents">
          <Container>
            <SectionHeader
              badge="Documents"
              title="Other Publications"
              description="Additional disclosures, project briefs, and supplementary documents."
            />
            <Grid cols={1} colsMd={2} colsLg={3} gap="sm">
              {otherDocs.map((d, i) => (
                <DocumentCard key={String(d._id)} {...toCardProps(d, i)} />
              ))}
            </Grid>
          </Container>
        </Section>
      )}

      {restrictedDocs.length > 0 && (
        <Section>
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
                with your name, organisation, and the document(s) required.
              </p>
            </div>
          </Container>
        </Section>
      )}
    </>
  );
}
