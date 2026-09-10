import type { NavGroup, NavItem, NavLink } from "@/types";

/**
 * AI solutions point at the sections that already exist on the page.
 * Everything else has no destination yet and carries an empty href until
 * those pages are built.
 */
const AI_SOLUTIONS: NavLink[] = [
  { label: "AI Agents", href: "/#ai-agents", icon: "agents" },
  { label: "AI Workflow Automation", href: "/#automation", icon: "automation" },
  { label: "AI Integrations", href: "/#integrations", icon: "integrations" },
  { label: "AI SaaS Development", href: "/#saas", icon: "saas" },
  { label: "Legacy Software Modernization", href: "/#modernization", icon: "modernization" },
];

/** Only the category is a destination; `items` are labels, not links. */
const TECHNOLOGIES: NavGroup[] = [
  {
    label: "Front-end",
    href: "/technology/front-end",
    icon: "frontend",
    items: ["React", "Angular", "Vue.js", "Next.js", ".NET", "HTML/CSS"],
  },
  {
    label: "Back-end",
    href: "/technology/back-end",
    icon: "backend",
    items: ["Node.js", "NestJS", "Python", "Express", ".NET", "GraphQL"],
  },
  {
    label: "Database",
    href: "/technology/database",
    icon: "database",
    items: ["PostgreSQL", "MongoDB", "MySQL", "Firebase", "SQLite", "Supabase"],
  },
  {
    label: "UI/UX Design",
    href: "/technology/ui-ux",
    icon: "design",
    items: ["Figma", "Adobe XD", "Photoshop", "Sketch", "Balsamiq"],
  },
  {
    label: "Mobile",
    href: "/technology/mobile",
    icon: "mobile",
    items: ["Flutter", "React Native", "Kotlin", "Android", "Swift"],
  },
  {
    label: "Cloud Services",
    href: "/technology/cloud",
    icon: "cloud",
    items: ["AWS EC2", "AWS S3", "AWS Lambda", "Microsoft Azure", "GCP"],
  },
];

const INDUSTRIES: NavLink[] = [
  { label: "Healthcare", href: "" },
  { label: "E-commerce", href: "" },
];

const CASE_STUDIES: NavLink[] = [
  { label: "Freight quoting cut from hours to minutes", href: "" },
  { label: "Order enquiries answered without staff time", href: "" },
];

export const NAV_ITEMS: NavItem[] = [
  { label: "AI Solutions", links: AI_SOLUTIONS },
  { label: "Technologies", groups: TECHNOLOGIES },
  { label: "Industries", links: INDUSTRIES },
  { label: "Case Studies", links: CASE_STUDIES },
];

/** The footer lists destinations that exist, rather than mirroring the menu. */
export const FOOTER_LINKS: NavLink[] = [
  { label: "Home", href: "/#home" },
  ...AI_SOLUTIONS,
  { label: "Industries", href: "/#industries" },
  { label: "Contact", href: "/#contact" },
];

export const PRIMARY_CTA = {
  label: "Book an AI Workflow Consultation",
  href: "/#contact",
};
