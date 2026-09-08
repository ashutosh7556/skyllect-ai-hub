export interface NavItem {
  label: string;
  href: string;
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

export type PermissionLevel = "automatic" | "approval" | "restricted";

export interface PermissionAction {
  label: string;
  level: PermissionLevel;
}
