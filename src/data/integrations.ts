export interface Integration {
  /** The card's title, in full. */
  name: string;
  /**
   * One line, drafted from the section's own copy — "AI becomes an
   * intelligent layer across your existing systems". These are placeholders
   * in the sense that the wording is mine, not the business's: the titles are
   * the ten systems the section already listed, and every description is
   * meant to be edited.
   */
  description: string;
}

/**
 * The systems the integrations topic cycles through.
 *
 * Order is the order they are released from the gate, so it is also the order
 * a reader meets them: the two every business recognises first, then the
 * channels, then the long tail.
 */
export const INTEGRATIONS: Integration[] = [
  {
    name: "CRM",
    description:
      "Every enquiry, deal and account stays where your team already works — AI reads it and writes back.",
  },
  {
    name: "ERP",
    description:
      "Stock, purchasing and production records read and updated in place, with no export step in between.",
  },
  {
    name: "E-commerce platforms",
    description:
      "Orders, inventory and returns picked up straight from your storefront as they happen.",
  },
  {
    name: "Accounting software",
    description:
      "Invoices and purchase orders understood, matched and filed against the ledger you already keep.",
  },
  {
    name: "Email providers",
    description:
      "Incoming mail read, sorted and answered from the same inbox your customers already write to.",
  },
  {
    name: "WhatsApp",
    description:
      "Conversations handled on the channel your customers actually use, with context from every other system.",
  },
  {
    name: "Customer support systems",
    description:
      "Tickets triaged, answered and escalated inside the help desk your team is already trained on.",
  },
  {
    name: "Inventory software",
    description:
      "Stock levels and order status checked on demand, so nothing is promised that cannot be shipped.",
  },
  {
    name: "Custom internal applications",
    description:
      "The tools built in-house are connected too — AI works against them the same as anything off the shelf.",
  },
  {
    name: "Third-party APIs",
    description:
      "Anything with an endpoint joins the same layer, so a new supplier or service is a connection, not a project.",
  },
];
