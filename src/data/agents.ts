export interface Agent {
  name: string;
  description: string;
  /** Per-agent accent used for the card border, label and interior wash. */
  accent: string;
  /** Looping clip shown faintly behind the card content. */
  video: string;
}

export const AGENTS: Agent[] = [
  {
    name: "Sales Agent",
    description:
      "Qualifies leads, answers product questions, and hands off warm opportunities to your team.",
    accent: "#6366f1",
    video: "/videos/cards/sales.mp4",
  },
  {
    name: "Customer Support Agent",
    description:
      "Resolves common tickets instantly and escalates complex issues with full context.",
    accent: "#22d3ee",
    video: "/videos/cards/support.mp4",
  },
  {
    name: "Logistics Agent",
    description:
      "Tracks shipments, flags delays, and keeps customers updated automatically.",
    accent: "#34d399",
    video: "/videos/cards/logistics.mp4",
  },
  {
    name: "Procurement Agent",
    description:
      "Compares supplier quotes and recommends the best option on price, lead time, and terms.",
    accent: "#fbbf24",
    video: "/videos/cards/procurement.mp4",
  },
  {
    name: "Operations Copilot",
    description:
      "Surfaces what needs attention today across orders, inventory, and production.",
    accent: "#fb7185",
    video: "/videos/cards/operations.mp4",
  },
  {
    name: "Document Processing Agent",
    description:
      "Reads invoices, purchase orders, and contracts, then extracts what your systems need.",
    accent: "#a855f7",
    video: "/videos/cards/documents.mp4",
  },
  {
    name: "Internal Knowledge Assistant",
    description:
      "Answers employee questions instantly from your internal docs and systems.",
    accent: "#38bdf8",
    video: "/videos/cards/knowledge.mp4",
  },
];
