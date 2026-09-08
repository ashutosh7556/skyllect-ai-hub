import type { Industry } from "@/types";

export const INDUSTRIES: Industry[] = [
  {
    slug: "logistics",
    name: "Logistics & Freight",
    headline: "Reduce manual coordination across freight operations.",
    ctaLabel: "Explore Logistics AI",
    agents: [
      {
        name: "AI Freight Quote Agent",
        description:
          "Customer sends an RFQ by email, WhatsApp, PDF, or website.",
        steps: [
          "Extracts shipment information",
          "Checks customer data",
          "Retrieves available rates",
          "Calculates pricing",
          "Applies margin rules",
          "Creates quotation",
          "Requests approval",
          "Sends quote",
          "Creates follow-up",
        ],
      },
      {
        name: "Shipment Operations Agent",
        description: "AI can help your team stay ahead of every shipment.",
        steps: [
          "Track shipments",
          "Monitor delivery status",
          "Detect delays",
          "Follow up with carriers",
          "Update customers automatically",
          "Identify shipments requiring attention",
        ],
      },
      {
        name: "Logistics Document Agent",
        description: "Automatically process logistics paperwork.",
        steps: [
          "Bill of Lading",
          "Proof of Delivery",
          "Commercial invoices",
          "Packing lists",
          "Carrier invoices",
          "Delivery receipts",
          "Customs documents",
        ],
      },
    ],
  },
  {
    slug: "distribution",
    name: "Distribution & Supply",
    headline:
      "Turn manual RFQ, quotation, order, and purchasing processes into intelligent workflows.",
    ctaLabel: "Explore Distribution AI",
    agents: [
      {
        name: "AI RFQ & Quotation Agent",
        description: "“Please quote 500 units of SKU AB-482 and 250 units of ZX-10.”",
        steps: [
          "Identifies products",
          "Checks ERP",
          "Checks inventory",
          "Retrieves customer pricing",
          "Checks margins",
          "Finds alternatives if unavailable",
          "Creates quotation",
          "Sends for approval",
          "Updates CRM",
          "Follows up automatically",
        ],
      },
      {
        name: "Purchasing Copilot",
        description: "“What should we purchase this week?”",
        steps: [
          "Current inventory",
          "Sales orders",
          "Historical demand",
          "Incoming stock",
          "Supplier lead times",
          "Minimum order quantities",
        ],
      },
    ],
  },
  {
    slug: "manufacturing",
    name: "Manufacturing",
    headline: "Give management better visibility across operations.",
    ctaLabel: "Explore Manufacturing AI",
    agents: [
      {
        name: "Manufacturing Operations Copilot",
        description: "“What requires my attention today?”",
        steps: [
          "Customer orders",
          "Production schedules",
          "Raw material availability",
          "Inventory",
          "Purchase orders",
          "Machine information",
          "Quality issues",
          "Supplier delays",
        ],
      },
      {
        name: "Procurement Agent",
        description:
          "Compare supplier quotations automatically. “Supplier B costs 2.8% more but can deliver 11 days earlier.”",
        steps: [
          "Price",
          "Delivery date",
          "MOQ",
          "Payment terms",
          "Previous performance",
          "Lead time",
        ],
      },
    ],
  },
];
