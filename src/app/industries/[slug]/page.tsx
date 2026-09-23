import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { INDUSTRY_PAGES, getIndustryPage } from "@/data/industry-pages";
import { SolutionBody } from "@/components/solutions/SolutionBody";
import { Breadcrumb } from "@/components/technology/SectionShell";

export const dynamicParams = false;

export function generateStaticParams() {
  return INDUSTRY_PAGES.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getIndustryPage(slug);
  if (!page) return {};

  return { title: page.metaTitle, description: page.metaDescription };
}

export default async function IndustryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getIndustryPage(slug);
  if (!page) notFound();

  // Industry pages reuse the solution body so the two families of content
  // page stay visually identical rather than drifting apart.
  return (
    <div className="py-10 sm:py-14">
      <div className="container-site">
        <Breadcrumb section="Industries" current={page.navLabel} />

        <SolutionBody solution={page} />
      </div>
    </div>
  );
}
