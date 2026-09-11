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
  | "launch"
  | "ecommerce"
  | "chat"
  | "voice"
  | "healthcare";

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
/** A large dropdown entry: logo, name, one-line pitch and an Explore link. */
export interface NavCard {
  label: string;
  href: string;
  description: string;
  image: string;
  imageAlt: string;
}

/**
 * An icon, a name and a line of explanation, laid out two to a row. The whole
 * tile is one link — the icon and description are not separately clickable.
 */
export interface NavFeature {
  label: string;
  href: string;
  description: string;
  icon: NavIconName;
}

export interface NavItem {
  label: string;
  links?: NavLink[];
  groups?: NavGroup[];
  cards?: NavCard[];
  features?: NavFeature[];
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
 * A technology tile. `slug` selects the brand mark and supplies the display
 * name, which `label` can override.
 *
 * Some brands have no mark available — Adobe, AWS and Azure were withdrawn
 * from simple-icons at the trademark holders' request. Those tiles carry a
 * `label` alone and render as a monogram, so the stack stays accurate rather
 * than dropping them or substituting a different product.
 */
export type TechStackItem =
  | { slug: TechLogoSlug; label?: string }
  | { slug?: undefined; label: string };

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
  /** Used for the hero fallback panel when no banner image exists yet. */
  icon: NavIconName;
  metaTitle: string;
  metaDescription: string;
  hero: TechSectionCopy & {
    eyebrow: string;
    body: string;
    /**
     * Banner served from /public. Optional: without it the hero renders a
     * generated panel rather than a broken image.
     */
    image?: string;
    imageAlt: string;
  };
  capabilities: TechSectionCopy & { items: TechCapability[] };
  challenges: TechSectionCopy & { items: TechChallenge[] };
  stack: TechSectionCopy & { items: TechStackItem[] };
  process: TechSectionCopy & { steps: TechProcessStep[] };
  whyUs: TechSectionCopy & { items: TechNamed[] };
  cta: TechSectionCopy & { body: string };
}

/**
 * One AI solution. All three render through the same shell, so this is the
 * only thing that differs between them — the surrounding chrome, rail and
 * layout are shared.
 */
export interface SolutionContent {
  slug: string;
  navLabel: string;
  icon: NavIconName;
  metaTitle: string;
  metaDescription: string;
  /** Short label for the switcher rail. */
  railLabel: string;
  heading: string;
  accent: string;
  summary: string;
  /**
   * Drop a file at this path in /public to use a photograph. Left undefined,
   * the shell renders its own generated panel instead of a broken image.
   */
  image?: string;
  imageAlt: string;
  /** The headline things this solution handles. */
  handles: string[];
  useCases: TechNamed[];
  howItWorks: TechNamed[];
  integrations: string[];
  outcomes: { value: string; label: string }[];
}

export interface CaseStudyContent {
  slug: string;
  name: string;
  tagline: string;
  metaTitle: string;
  metaDescription: string;
  /** Client mark, shown contained on a panel rather than cropped. */
  logo: string;
  logoAlt: string;
  siteUrl: string;
  summary: string;
  facts: { label: string; value: string }[];
  challenge: { heading: string; accent: string; body: string[] };
  delivered: { heading: string; accent: string; items: TechNamed[] };
  stack: string[];
  outcomes: string[];
}

export type PermissionLevel = "automatic" | "approval" | "restricted";

export interface PermissionAction {
  label: string;
  level: PermissionLevel;
}
