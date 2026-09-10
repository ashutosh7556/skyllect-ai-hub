import type { TechLogoSlug } from "@/components/technology/TechLogo";

export type NavIconName =
  | "agents"
  | "automation"
  | "integrations"
  | "saas"
  | "modernization"
  | "frontend"
  | "backend"
  | "database"
  | "design"
  | "mobile"
  | "cloud"
  | "discovery"
  | "architecture"
  | "prototype"
  | "build"
  | "quality"
  | "launch";

export interface NavLink {
  label: string;
  href: string;
  icon?: NavIconName;
}

/**
 * A titled column inside a wider dropdown, e.g. "Front-end" under
 * Technologies. Only the category heading is a destination — `items` are the
 * technologies themselves, which render as plain labels rather than links.
 */
export interface NavGroup {
  label: string;
  href: string;
  icon: NavIconName;
  items: string[];
}

/**
 * A top-level header entry. Every one opens a dropdown, so it carries either a
 * flat `links` list or, for the wider technologies menu, `groups` of columns —
 * never both.
 */
export interface NavItem {
  label: string;
  links?: NavLink[];
  groups?: NavGroup[];
}

export interface IndustryAgent {
  name: string;
  description: string;
  steps: string[];
}

export interface Industry {
  slug: string;
  name: string;
  headline: string;
  agents: IndustryAgent[];
  ctaLabel: string;
}

export interface ServiceCard {
  title: string;
  description: string;
  examples: string[];
  ctaLabel: string;
  ctaHref: string;
}

export interface ProcessStep {
  index: number;
  title: string;
  description: string;
}

/**
 * Content model for a /technology/<slug> page. Every technology page is the
 * same set of sections in the same order, so the page itself is a template and
 * each discipline supplies only this object.
 *
 * Headings carry an `accent` substring that renders in the brand gradient —
 * the one highlighted word each section heading gets.
 */
export interface TechSectionCopy {
  heading: string;
  accent: string;
  description?: string;
}

export interface TechCapability {
  title: string;
  description: string;
  points: string[];
}

/**
 * A technology tile. `slug` selects the brand mark; the label comes from the
 * icon itself unless overridden — simple-icons already carries the correct
 * display name for each brand.
 */
export interface TechStackItem {
  slug: TechLogoSlug;
  label?: string;
}

export interface TechProcessStep {
  title: string;
  description: string;
  icon: NavIconName;
}

export interface TechNamed {
  title: string;
  description: string;
}

export interface TechFaqItem {
  question: string;
  answer: string;
}

/** A problem teams hit, and how we deal with it. Rendered as alternating rows. */
export interface TechChallenge {
  title: string;
  body: string;
  points: string[];
}

export interface TechTestimonial {
  quote: string;
  author: string;
  role: string;
}

export interface TechnologyPageContent {
  slug: string;
  /** Matches the category label in the Technologies menu. */
  navLabel: string;
  metaTitle: string;
  metaDescription: string;
  hero: TechSectionCopy & {
    eyebrow: string;
    body: string;
    /** Banner served from /public. */
    image: string;
    imageAlt: string;
  };
  capabilities: TechSectionCopy & { items: TechCapability[] };
  challenges: TechSectionCopy & { items: TechChallenge[] };
  stack: TechSectionCopy & { items: TechStackItem[] };
  process: TechSectionCopy & { steps: TechProcessStep[] };
  whyUs: TechSectionCopy & { items: TechNamed[] };
  testimonials: TechSectionCopy & { items: TechTestimonial[] };
  faq: TechSectionCopy & { items: TechFaqItem[] };
  cta: TechSectionCopy & { body: string };
}

export type PermissionLevel = "automatic" | "approval" | "restricted";

export interface PermissionAction {
  label: string;
  level: PermissionLevel;
}
