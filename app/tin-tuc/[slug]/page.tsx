import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublishedCaseBySlug } from "../../../server/case-lab-public";
import { buildArticleViewModel, buildCaseArticleJsonLd } from "../../../lib/case-article-view";
import { getCaseContentType } from "../../../lib/case-content-types";
import { CaseArticleView } from "./CaseArticleView";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const SITE_URL = "https://auto365.vn";
const publishedDisplay = new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const published = await getPublishedCaseBySlug(slug);
  if (!published) return { robots: { index: false, follow: false } };

  const vm = buildArticleViewModel(published.content);
  const canonical = published.canonicalUrl || `${SITE_URL}/tin-tuc/${slug}`;

  return {
    title: vm.metaTitle || vm.title,
    description: vm.metaDescription || vm.summary,
    metadataBase: new URL(SITE_URL),
    alternates: { canonical },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
    },
    openGraph: {
      type: "article",
      locale: "vi_VN",
      title: vm.title,
      description: vm.metaDescription || vm.summary,
      url: canonical,
      siteName: "Auto365.vn",
      publishedTime: published.publishedAt,
      images: vm.heroUrl ? [vm.heroUrl] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: vm.title,
      description: vm.metaDescription || vm.summary,
      images: vm.heroUrl ? [vm.heroUrl] : undefined,
    },
  };
}

export default async function PublicCaseArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const published = await getPublishedCaseBySlug(slug);
  if (!published) notFound();

  const vm = buildArticleViewModel(published.content);
  const canonical = published.canonicalUrl || `${SITE_URL}/tin-tuc/${slug}`;
  const jsonLd = buildCaseArticleJsonLd(vm, canonical, published.publishedAt);

  return (
    <CaseArticleView
      vm={vm}
      contentTypeLabel={getCaseContentType(published.contentType).label}
      caseCode={published.caseCode}
      branchRef={published.branchRef}
      publishedDisplay={publishedDisplay.format(new Date(published.publishedAt))}
      jsonLd={jsonLd}
    />
  );
}
