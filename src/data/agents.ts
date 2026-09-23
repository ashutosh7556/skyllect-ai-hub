export interface Agent {
  name: string;
  description: string;
  /** Per-agent colour the card takes on when hovered. */
  accent: string;
  /** Looping clip shown faintly behind the card content. */
  video: string;
}

export const AGENTS: Agent[] = [
  {
    name: "Sales Agent",
    description:
      "Qualifies leads, answers product questions, and hands off warm opportunities to your team.",
    accent: "#f97316",
    video: "/videos/cards/sales.mp4",
  },
  {
    name: "Customer Support Agent",
    description:
      "Resolves common tickets instantly and escalates complex issues with full context.",
    accent: "#0891b2",
    video: "/videos/cards/support.mp4",
  },
  {
    name: "Logistics Agent",
    description:
      "Tracks shipments, flags delays, and keeps customers updated automatically.",
    accent: "#059669",
    video: "/videos/cards/logistics.mp4",
  },
  {
    name: "Procurement Agent",
    description:
      "Compares supplier quotes and recommends the best option on price, lead time, and terms.",
    accent: "#ca8a04",
    video: "/videos/cards/procurement.mp4",
  },
  {
    name: "Operations Copilot",
    description:
      "Surfaces what needs attention today across orders, inventory, and production.",
    accent: "#e11d48",
    video: "/videos/cards/operations.mp4",
  },
  {
    name: "Document Processing Agent",
    description:
      "Reads invoices, purchase orders, and contracts, then extracts what your systems need.",
    accent: "#9333ea",
    video: "/videos/cards/documents.mp4",
  },
  {
    name: "Internal Knowledge Assistant",
    description:
      "Answers employee questions instantly from your internal docs and systems.",
    accent: "#2563eb",
    video: "/videos/cards/knowledge.mp4",
  },
];
