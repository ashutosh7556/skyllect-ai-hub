import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { INDUSTRY_PAGES, getIndustryPage } from "@/data/industry-pages";
import { SolutionBody } from "@/components/solutions/SolutionBody";

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
    <div className="px-5 pt-32 pb-20 sm:px-8 sm:pt-40 sm:pb-28">
      <div className="mx-auto max-w-[1200px]">
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex flex-wrap items-center gap-2 text-xs text-white/40">
            <li>Industries</li>
            <li aria-hidden="true">/</li>
            <li className="text-white/70">{page.navLabel}</li>
          </ol>
        </nav>

        <SolutionBody solution={page} />
      </div>
    </div>
  );
}
