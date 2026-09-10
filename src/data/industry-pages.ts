import type { SolutionContent } from "@/types";

/**
 * Industry pages reuse the solution content shape, so they render through the
 * same body component and stay visually consistent with /solutions rather
 * than becoming a third page design.
 */
export const INDUSTRY_PAGES: SolutionContent[] = [
  {
    slug: "healthcare",
    navLabel: "Healthcare",
    railLabel: "Healthcare",
    icon: "healthcare",
    metaTitle: "AI for Healthcare — Skyllect",
    metaDescription:
      "AI solutions for patient workflows, healthcare operations, support and intelligent automation — built for environments where accuracy, auditability and privacy are requirements.",
    heading: "AI for Healthcare Operations",
    accent: "Healthcare",
    summary:
      "Clinical teams lose hours to coordination rather than care: chasing referrals, rekeying forms, confirming appointments, answering the same administrative questions. Skyllect automates that layer with the controls a healthcare environment demands — every action logged, sensitive steps gated behind a human.",
    image: "/images/healthcare.jpg",
    imageAlt: "AI supporting healthcare operations and patient workflows",
    handles: [
      "Patient workflow coordination",
      "Appointment scheduling and reminders",
      "Administrative and records automation",
      "Patient and staff enquiry handling",
      "Escalation to clinical or admin staff",
    ],
    useCases: [
      {
        title: "Appointment Coordination",
        description:
          "Books, confirms, reschedules and reminds — cutting the no-show rate without adding to the front desk's call volume.",
      },
      {
        title: "Referral and Intake Processing",
        description:
          "Reads incoming referrals and forms, extracts the structured fields, and files them against the right record for review.",
      },
      {
        title: "Administrative Enquiries",
        description:
          "Answers the routine questions — opening hours, preparation instructions, documentation needed — so staff time goes to clinical work.",
      },
      {
        title: "Records and Reporting",
        description:
          "Assembles the recurring operational reports from your systems instead of somebody rebuilding them by hand each month.",
      },
    ],
    howItWorks: [
      {
        title: "Scope What AI May Touch",
        description:
          "We start from your data governance position. The AI is given the narrowest access that lets it do the job, and nothing beyond it.",
      },
      {
        title: "Keep Clinicians in Control",
        description:
          "Anything with clinical or financial consequence requires human approval. The system drafts and proposes; a person decides.",
      },
      {
        title: "Integrate, Don't Replace",
        description:
          "It works against the systems you already run rather than requiring a migration, so existing processes and records stay intact.",
      },
      {
        title: "Audit Everything",
        description:
          "Every action is logged with the data it read and the decision it made, so review and compliance have a complete trail.",
      },
    ],
    integrations: [
      "Practice management systems",
      "Electronic records",
      "Scheduling",
      "Document intelligence",
      "Secure messaging",
      "Reporting and BI",
    ],
    outcomes: [
      { value: "Logged", label: "Every action, with the data it used" },
      { value: "Gated", label: "Consequential steps need human approval" },
      { value: "Scoped", label: "Least-privilege access to records" },
      { value: "24/7", label: "Administrative cover outside hours" },
    ],
  },

  {
    slug: "ecommerce",
    navLabel: "E-Commerce",
    railLabel: "E-Commerce",
    icon: "ecommerce",
    metaTitle: "AI for E-Commerce — Skyllect",
    metaDescription:
      "AI-powered e-commerce solutions for customer support, sales, order operations and business automation, connected to your store, order management and helpdesk.",
    heading: "AI for E-Commerce",
    accent: "E-Commerce",
    summary:
      "Online retail runs on volume, and volume is exactly what breaks a support team. Skyllect handles the repeating work — order enquiries, product questions, returns, follow-ups — against your live systems, and escalates anything that genuinely needs a person.",
    // Distinct from the support-AI solution's image, which keeps E-commerce.jpg.
    image: "/images/E-commerce-industies.jpg",
    imageAlt: "AI supporting e-commerce customer support and order operations",
    handles: [
      "Customer support automation",
      "Order and delivery enquiries",
      "Product and availability questions",
      "Returns, refunds and exchanges",
      "Sales and lead follow-up",
    ],
    useCases: [
      {
        title: "Support That Scales With Volume",
        description:
          "Absorbs the repeat questions that make up most of the queue, so response times hold through sales periods and seasonal peaks.",
      },
      {
        title: "Order Operations",
        description:
          "Checks status against your order system and carrier tracking, and flags the exceptions that need somebody to intervene.",
      },
      {
        title: "Converting Pre-purchase Questions",
        description:
          "Answers sizing, stock and delivery questions immediately, at the point where a slow reply loses the sale.",
      },
      {
        title: "Post-purchase Follow-up",
        description:
          "Handles delivery confirmation, review requests and reorder prompts without another tool or another person to run it.",
      },
    ],
    howItWorks: [
      {
        title: "Connect Your Store",
        description:
          "Read access to your platform, order management, catalogue and helpdesk. Nothing gets migrated and nothing gets replaced.",
      },
      {
        title: "Encode Your Policies",
        description:
          "Returns windows, refund limits, discount rules. The AI works to your policy rather than improvising an answer.",
      },
      {
        title: "Work Inside Your Helpdesk",
        description:
          "Replies are drafted or sent from the tool your agents already use, so there is one queue and one history.",
      },
      {
        title: "Measure and Extend",
        description:
          "Start with the highest-volume question types, measure resolution, and widen scope only where the results justify it.",
      },
    ],
    integrations: [
      "Shopify",
      "WooCommerce",
      "Magento",
      "Zendesk",
      "Gorgias",
      "Carrier tracking APIs",
      "Your ERP",
      "Email and WhatsApp",
    ],
    outcomes: [
      { value: "24/7", label: "First response, including peak periods" },
      { value: "Live data", label: "Answers from real order and stock state" },
      { value: "Your rules", label: "Refunds and returns within policy" },
      { value: "One queue", label: "Agents keep a single inbox" },
    ],
  },
];

export function getIndustryPage(slug: string) {
  return INDUSTRY_PAGES.find((page) => page.slug === slug);
}
