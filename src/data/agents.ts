/**
 * Which read-out the module's viewport draws over its clip. Every variant
 * shares the same restrained HUD language — corner brackets, a scan sweep, a
 * travelling frame light — and differs only in the one figure that describes
 * what this particular agent actually does.
 */
export type HudVariant =
  | "flow"
  | "chat"
  | "route"
  | "nodes"
  | "sync"
  | "scan"
  | "neural";

export interface Agent {
  name: string;
  description: string;
  /** Looping clip shown inside the module's viewport. */
  video: string;
  hud: HudVariant;
}

export const AGENTS: Agent[] = [
  {
    name: "Sales Agent",
    description:
      "Qualifies leads, answers product questions, and hands off warm opportunities to your team.",
    video: "/videos/cards/sales.mp4",
    hud: "flow",
  },
  {
    name: "Customer Support Agent",
    description:
      "Resolves common tickets instantly and escalates complex issues with full context.",
    video: "/videos/cards/support.mp4",
    hud: "chat",
  },
  {
    name: "Logistics Agent",
    description:
      "Tracks shipments, flags delays, and keeps customers updated automatically.",
    video: "/videos/cards/logistics.mp4",
    hud: "route",
  },
  {
    name: "Procurement Agent",
    description:
      "Compares supplier quotes and recommends the best option on price, lead time, and terms.",
    video: "/videos/cards/procurement.mp4",
    hud: "nodes",
  },
  {
    name: "Operations Copilot",
    description:
      "Surfaces what needs attention today across orders, inventory, and production.",
    video: "/videos/cards/operations.mp4",
    hud: "sync",
  },
  {
    name: "Document Processing Agent",
    description:
      "Reads invoices, purchase orders, and contracts, then extracts what your systems need.",
    video: "/videos/cards/documents.mp4",
    hud: "scan",
  },
  {
    name: "Internal Knowledge Assistant",
    description:
      "Answers employee questions instantly from your internal docs and systems.",
    video: "/videos/cards/knowledge.mp4",
    hud: "neural",
  },
];
