import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TECHNOLOGY_PAGES, getTechnologyPage } from "@/data/technology";
import { TechHero } from "@/components/technology/TechHero";
import { TechCapabilities } from "@/components/technology/TechCapabilities";
import { TechStack } from "@/components/technology/TechStack";
import { TechProcess } from "@/components/technology/TechProcess";
import { TechChallenges } from "@/components/technology/TechChallenges";
import { TechCardGrid } from "@/components/technology/TechCardGrid";
import { TechCta } from "@/components/technology/TechCta";

// Every technology page is known at build time, so prerender the lot and turn
// away anything that is not one of them.
export const dynamicParams = false;

export function generateStaticParams() {
  return TECHNOLOGY_PAGES.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const content = getTechnologyPage(slug);
  if (!content) return {};

  return {
    title: content.metaTitle,
    description: content.metaDescription,
  };
}

export default async function TechnologyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const content = getTechnologyPage(slug);
  if (!content) notFound();

  // `muted` alternates so consecutive bands separate without needing rules
  // between them, matching the reference layout's banded rhythm.
  return (
    <>
      <TechHero content={content} />
      <TechCapabilities content={content} muted />
      <TechChallenges content={content} />
      <TechStack content={content} muted />
      <TechProcess content={content} />
      <TechCardGrid copy={content.whyUs} items={content.whyUs.items} numbered muted />
      <TechCta content={content} />
    </>
  );
}
