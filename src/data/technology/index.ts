import type { TechnologyPageContent } from "@/types";
import { FRONT_END } from "@/data/technology/front-end";

/**
 * Every /technology/<slug> page, keyed by slug. The remaining disciplines are
 * added here as their content is written — the page template itself does not
 * change.
 */
export const TECHNOLOGY_PAGES: TechnologyPageContent[] = [FRONT_END];

export function getTechnologyPage(slug: string) {
  return TECHNOLOGY_PAGES.find((page) => page.slug === slug);
}
