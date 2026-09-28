export interface Agent {
  name: string;
  description: string;
  /** Per-agent colour the card takes on when hovered. */
  accent: string;
  /** Looping clip shown faintly behind the card content. */
  video?: string;
}

// Written for non-technical readers: what each automation does for the
// business, in everyday words.
export const AGENTS: Agent[] = [
  {
    name: "WhatsApp Automation",
    description:
      "Replies to customer messages on WhatsApp instantly, day or night - answers questions, shares updates, and takes orders.",
    accent: "#16a34a",
  },
  {
    name: "Sales Automation Assistant",
    description:
      "Answers questions from new enquiries and passes the serious buyers to your sales team.",
    accent: "#f97316",
    video: "/videos/cards/sales.mp4",
  },
  {
    name: "Customer Support Automation Assistant",
    description:
      "Handles common customer questions straight away and hands tricky ones to your team with the full story.",
    accent: "#0891b2",
    video: "/videos/cards/support.mp4",
  },
  {
    name: "Delivery Updates Automation",
    description:
      "Keeps an eye on every shipment, spots delays early, and lets customers know automatically.",
    accent: "#4f46e5",
    video: "/videos/cards/logistics.mp4",
  },
  {
    name: "Supplier Price Comparison Automation",
    description:
      "Compares quotes from your suppliers and shows you the best deal on price and delivery time.",
    accent: "#ca8a04",
    video: "/videos/cards/procurement.mp4",
  },
  {
    name: "Daily Business Overview Automation",
    description:
      "Tells you each morning what needs your attention — orders, stock, and production.",
    accent: "#e11d48",
    video: "/videos/cards/operations.mp4",
  },
  {
    name: "Paperwork & Invoice Reader Automation",
    description:
      "Reads invoices, orders, and contracts for you and fills the details into your systems.",
    accent: "#9333ea",
    video: "/videos/cards/documents.mp4",
  },
  {
    name: "Company Q&A Automation Assistant",
    description:
      "Gives your staff instant answers about company policies, processes, and files.",
    accent: "#2563eb",
    video: "/videos/cards/knowledge.mp4",
  },
];
