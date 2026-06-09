import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";
import { connectToDatabase } from "@/lib/mongodb";
import News from "@/models/News";
import { Container } from "@/components/common/Container";

export const dynamic = "force-dynamic";

const CATEGORY_LABEL: Record<string, string> = {
  hydropower:     "Hydropower",
  solar:          "Solar Energy",
  agriculture:    "Agriculture",
  corporate:      "Corporate",
  sustainability: "Sustainability",
  investor:       "Investor",
};

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await connectToDatabase();
  const { slug } = await params;
  const raw = await News.findOne({ slug, status: "published" }).select("title excerpt seoTitle seoDescription coverImage").lean();
  if (!raw) return { title: "Article Not Found" };
  const article = JSON.parse(JSON.stringify(raw)) as { title: string; excerpt: string; seoTitle?: string; seoDescription?: string; coverImage?: string };
  return {
    title: article.seoTitle ?? article.title,
    description: article.seoDescription ?? article.excerpt,
    openGraph: article.coverImage ? { images: [article.coverImage] } : undefined,
  };
}

function estimateReadTime(content: string) {
  const words = content.trim().split(/\s+/).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
}

function fmtDate(d: string | Date) {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(new Date(d));
}

export default async function ArticlePage({ params }: Props) {
  await connectToDatabase();
  const { slug } = await params;
  const raw = await News.findOne({ slug, status: "published" }).lean();
  if (!raw) notFound();

  const article = JSON.parse(JSON.stringify(raw)) as {
    title: string; excerpt: string; content: string; category: string;
    author: string; publishedAt?: string; createdAt: string;
    coverImage?: string; tags: string[]; isFeatured: boolean;
  };

  const paragraphs = article.content.split(/\n\n+/).filter(Boolean);

  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative" style={{ backgroundColor: "#07080d" }}>
        {article.coverImage && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={article.coverImage} alt={article.title} className="absolute inset-0 w-full h-full object-cover opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#07080d] via-[#07080d]/60 to-transparent" />
          </>
        )}
        <Container className="relative pt-32 pb-16">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-foreground-muted hover:text-primary transition-colors mb-8">
            <ArrowLeft className="h-4 w-4" /> Back to News & Articles
          </Link>
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20 mb-5">
              <Tag className="h-3 w-3" />
              {CATEGORY_LABEL[article.category] ?? article.category}
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white leading-tight mb-6">
              {article.title}
            </h1>
            <p className="text-lg text-white/70 leading-relaxed mb-8">{article.excerpt}</p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-white/50">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {article.publishedAt ? fmtDate(article.publishedAt) : fmtDate(article.createdAt)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {estimateReadTime(article.content)}
              </span>
              <span className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-[10px] font-bold">
                  {article.author.charAt(0)}
                </div>
                {article.author}
              </span>
            </div>
          </div>
        </Container>
      </div>

      {/* Content */}
      <Container className="py-16">
        <div className="max-w-3xl mx-auto">
          <article className="prose prose-invert prose-lg max-w-none">
            {paragraphs.map((para, i) => {
              if (para.startsWith("# "))    return <h1 key={i} className="text-3xl font-bold text-foreground mt-8 mb-4">{para.slice(2)}</h1>;
              if (para.startsWith("## "))   return <h2 key={i} className="text-2xl font-bold text-foreground mt-8 mb-4">{para.slice(3)}</h2>;
              if (para.startsWith("### "))  return <h3 key={i} className="text-xl font-bold text-foreground mt-6 mb-3">{para.slice(4)}</h3>;
              if (para.startsWith("- ") || para.startsWith("* ")) {
                const items = para.split("\n").filter(l => l.startsWith("- ") || l.startsWith("* "));
                return <ul key={i} className="list-disc list-inside space-y-1 text-foreground-muted my-4">{items.map((item, j) => <li key={j}>{item.slice(2)}</li>)}</ul>;
              }
              return <p key={i} className="text-foreground-muted leading-relaxed mb-4">{para}</p>;
            })}
          </article>

          {article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-border">
              {article.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 rounded-full text-xs bg-surface-raised text-foreground-muted border border-border">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="mt-12 pt-8 border-t border-border">
            <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
              <ArrowLeft className="h-4 w-4" /> Back to all articles
            </Link>
          </div>
        </div>
      </Container>
    </main>
  );
}
