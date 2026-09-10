import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SOLUTIONS, getSolution } from "@/data/solutions";
import { SolutionBody } from "@/components/solutions/SolutionBody";

export const dynamicParams = false;

export function generateStaticParams() {
  return SOLUTIONS.map((solution) => ({ slug: solution.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const solution = getSolution(slug);
  if (!solution) return {};

  return { title: solution.metaTitle, description: solution.metaDescription };
}

export default async function SolutionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const solution = getSolution(slug);
  if (!solution) notFound();

  return <SolutionBody solution={solution} />;
}
