import type { TechnologyPageContent } from "@/types";
import { FRONT_END } from "@/data/technology/front-end";
import { BACK_END } from "@/data/technology/back-end";
import { DATABASE } from "@/data/technology/database";
import { UI_UX } from "@/data/technology/ui-ux";
import { MOBILE } from "@/data/technology/mobile";
import { CLOUD } from "@/data/technology/cloud";

/**
 * Every /technology/<slug> page, keyed by slug. Order matches the Technologies
 * menu. The page itself is a template — each discipline supplies only content.
 */
export const TECHNOLOGY_PAGES: TechnologyPageContent[] = [
  FRONT_END,
  BACK_END,
  DATABASE,
  UI_UX,
  MOBILE,
  CLOUD,
];

export function getTechnologyPage(slug: string) {
  return TECHNOLOGY_PAGES.find((page) => page.slug === slug);
}
