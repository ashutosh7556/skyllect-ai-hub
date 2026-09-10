import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CASE_STUDIES, getCaseStudy } from "@/data/case-studies";
import { CaseStudyBody } from "@/components/case-studies/CaseStudyBody";

export const dynamicParams = false;

export function generateStaticParams() {
  return CASE_STUDIES.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};

  return { title: study.metaTitle, description: study.metaDescription };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  return <CaseStudyBody study={study} />;
}
