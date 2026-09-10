import type { NavCard, NavFeature, NavGroup, NavItem, NavLink } from "@/types";

/**
 * The AI Solutions menu. Each entry has its own page under /solutions, and
 * those pages share one shell — moving between them swaps only the content.
 */
const AI_SOLUTIONS: NavLink[] = [
  {
    label: "E-commerce Customer Support AI",
    href: "/solutions/ecommerce-customer-support",
    icon: "ecommerce",
  },
  { label: "WhatsApp Support AI Solutions", href: "/solutions/whatsapp-support", icon: "chat" },
  { label: "Voice Agent AI Solutions", href: "/solutions/voice-agent", icon: "voice" },
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

/** Two to a row, each tile a single link. */
const INDUSTRIES: NavFeature[] = [
  {
    label: "Healthcare",
    href: "/industries/healthcare",
    description:
      "AI solutions for patient workflows, healthcare operations, support, and intelligent automation.",
    icon: "healthcare",
  },
  {
    label: "E-Commerce",
    href: "/industries/ecommerce",
    description:
      "AI-powered e-commerce solutions for customer support, sales, orders, and business automation.",
    icon: "ecommerce",
  },
];

/** Rendered as large cards rather than text links. */
const CASE_STUDIES: NavCard[] = [
  {
    label: "Kwot Music",
    href: "/case-studies/kwot-music",
    description:
      "African music, podcast, video and radio streaming built for content discovery and global audiences.",
    image: "/images/kwot.png",
    imageAlt: "Kwot",
  },
  {
    label: "JobTalk AI",
    href: "/case-studies/jobtalk-ai",
    description:
      "AI recruiting platform automating voice-first candidate screening, engagement, scheduling and workflow.",
    image: "/images/jobtalk.avif",
    imageAlt: "JobTalk AI",
  },
];

export const NAV_ITEMS: NavItem[] = [
  { label: "AI Solutions", links: AI_SOLUTIONS },
  { label: "Technologies", groups: TECHNOLOGIES },
  { label: "Industries", features: INDUSTRIES },
  { label: "Case Studies", cards: CASE_STUDIES },
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
