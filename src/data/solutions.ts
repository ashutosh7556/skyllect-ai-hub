import type { SolutionContent } from "@/types";

/**
 * The AI solutions that have their own page. Each one is a content state of
 * the same shell rather than a separate page design — the chrome and layout
 * in /app/solutions are shared, and only this object changes.
 */
export const SOLUTIONS: SolutionContent[] = [
  {
    slug: "ecommerce-customer-support",
    navLabel: "E-commerce Customer Support AI",
    railLabel: "E-commerce Support",
    icon: "ecommerce",
    metaTitle: "E-commerce Customer Support AI — Skyllect",
    metaDescription:
      "AI customer support for online retail: order status, product questions, returns and refunds, answered from your real systems with escalation to your team.",
    heading: "E-commerce Customer Support AI",
    accent: "E-commerce",
    summary:
      "Most support tickets in retail are the same handful of questions asked thousands of times. Skyllect handles those against your live order and catalogue data, and hands anything unusual straight to a person with the context already gathered.",
    image: "/images/E-commerce.jpg",
    imageAlt: "E-commerce customer support AI working across order and catalogue systems",
    handles: [
      "Order status and tracking",
      "Product questions and availability",
      "Returns, refunds and exchanges",
      "Customer enquiry automation",
      "Escalation to a human agent",
    ],
    useCases: [
      {
        title: "“Where is my order?”",
        description:
          "Reads the order from your platform, checks the carrier's current tracking, and answers with a real delivery position rather than a generic status.",
      },
      {
        title: "Returns Without a Queue",
        description:
          "Checks the item against your returns policy, confirms eligibility, issues the label, and books the refund once the parcel is scanned.",
      },
      {
        title: "Pre-purchase Questions",
        description:
          "Answers sizing, stock, compatibility and delivery-window questions from the catalogue, so the enquiry converts instead of waiting overnight.",
      },
      {
        title: "Peak Season Cover",
        description:
          "Absorbs the volume spike around sales and holidays without temporary hires, keeping first-response times flat when contact rates triple.",
      },
    ],
    howItWorks: [
      {
        title: "Connect Your Stack",
        description:
          "Read access to your store platform, order management, carrier tracking and helpdesk. No migration and no replacement of tools that already work.",
      },
      {
        title: "Set the Boundaries",
        description:
          "You decide what the AI can answer alone, what needs approval, and what it must never touch — refunds above a threshold, for example.",
      },
      {
        title: "Run Alongside Your Team",
        description:
          "It drafts or sends replies inside your existing helpdesk, so agents keep one inbox and see everything the AI has done.",
      },
      {
        title: "Review and Tighten",
        description:
          "Every conversation is logged with the data it used. You review the edge cases and we narrow the gaps from real transcripts.",
      },
    ],
    integrations: [
      "Shopify",
      "WooCommerce",
      "Magento",
      "Zendesk",
      "Gorgias",
      "Freshdesk",
      "Carrier tracking APIs",
      "Your ERP",
    ],
    outcomes: [
      { value: "24/7", label: "First response, including out of hours" },
      { value: "Top 5", label: "Repeat questions handled end to end" },
      { value: "100%", label: "Conversations logged and reviewable" },
      { value: "0", label: "Refunds issued without your rules" },
    ],
  },

  {
    slug: "whatsapp-support",
    navLabel: "WhatsApp Support AI Solutions",
    railLabel: "WhatsApp Support",
    icon: "chat",
    metaTitle: "WhatsApp Support AI Solutions — Skyllect",
    metaDescription:
      "AI customer support on WhatsApp: automated conversations, order and status enquiries, product information, lead qualification, and handoff to your team.",
    heading: "WhatsApp Support AI Solutions",
    accent: "WhatsApp",
    summary:
      "For a lot of businesses WhatsApp is already where customers ask. The problem is that it is a phone somebody has to watch. Skyllect puts an AI on that number that answers from your real systems and passes the conversation over the moment it should.",
    image: "/images/whatsapp.jpg",
    imageAlt: "WhatsApp support AI handling customer conversations",
    handles: [
      "Automated customer conversations",
      "Order and status enquiries",
      "Product and service information",
      "Lead qualification",
      "Human handoff when required",
    ],
    useCases: [
      {
        title: "Enquiries Answered on the Channel People Use",
        description:
          "Customers message the number they already have. They get an answer in seconds instead of being pushed to a web form or a phone queue.",
      },
      {
        title: "Qualifying Inbound Leads",
        description:
          "Asks the few questions your sales team would ask anyway, then routes a qualified lead with the answers already attached.",
      },
      {
        title: "Order Updates Without Chasing",
        description:
          "Looks up the order and replies with its current position, so your team stops relaying the same information by hand.",
      },
      {
        title: "After-hours Cover",
        description:
          "Handles what it can overnight and queues the rest with full context, so mornings start with a triaged list rather than a backlog.",
      },
    ],
    howItWorks: [
      {
        title: "Connect the Business Number",
        description:
          "Set up on the WhatsApp Business Platform against your existing number, with message templates approved for the notifications you send.",
      },
      {
        title: "Ground It in Your Data",
        description:
          "The assistant answers from your order system, catalogue and documented policies — not from a general model guessing at your business.",
      },
      {
        title: "Define the Handoff",
        description:
          "You set the triggers for passing to a person: sentiment, value, topic, or the customer simply asking. Transfer carries the whole thread.",
      },
      {
        title: "Measure and Improve",
        description:
          "Resolution rate, handoff rate and response time are reported per topic, so it is obvious where the assistant earns its place and where it does not.",
      },
    ],
    integrations: [
      "WhatsApp Business Platform",
      "Twilio",
      "360dialog",
      "Your CRM",
      "Order management",
      "Helpdesk",
      "Calendar",
      "Payment links",
    ],
    outcomes: [
      { value: "Seconds", label: "Time to first reply, day or night" },
      { value: "1 number", label: "No new app for your customers to learn" },
      { value: "Full thread", label: "Context carried into every handoff" },
      { value: "Opt-in", label: "Messaging within platform policy" },
    ],
  },

  {
    slug: "voice-agent",
    navLabel: "Voice Agent AI Solutions",
    railLabel: "Voice Agents",
    icon: "voice",
    metaTitle: "Voice Agent AI Solutions — Skyllect",
    metaDescription:
      "AI-powered voice agents that answer incoming calls, verify the caller, retrieve information, and complete appointment, order and support workflows with escalation to your team.",
    heading: "Voice Agent AI Solutions",
    accent: "Voice",
    summary:
      "Phone lines are where the most urgent enquiries arrive and where customers wait longest. A Skyllect voice agent answers on the first ring, verifies who it is speaking to, and completes the routine calls end to end — passing the rest to your team with the call already summarised.",
    image: "/images/voice-ai.jpg",
    imageAlt: "AI voice agent handling incoming customer calls",
    handles: [
      "Incoming customer calls",
      "Customer verification",
      "Information retrieval",
      "Appointment, order and support workflows",
      "Escalation to a human agent",
    ],
    useCases: [
      {
        title: "Calls Answered on the First Ring",
        description:
          "No hold music and no phone tree. The caller states what they need in their own words and the agent acts on it.",
      },
      {
        title: "Booking and Rescheduling",
        description:
          "Checks live availability, books, moves or cancels the appointment, and confirms by text before the call ends.",
      },
      {
        title: "Order and Account Enquiries",
        description:
          "Verifies the caller against your records, then reads back the order, balance or case status from the system of record.",
      },
      {
        title: "Overflow and Out of Hours",
        description:
          "Takes the calls your team cannot reach at peak or overnight, so the alternative is not a voicemail nobody returns.",
      },
    ],
    howItWorks: [
      {
        title: "Route a Number",
        description:
          "Point a new number at the agent, or overflow your existing line to it after a set number of rings. Your current telephony stays in place.",
      },
      {
        title: "Verify Before Acting",
        description:
          "The caller is identified against your records before any account detail is read out, and the verification standard is yours to set.",
      },
      {
        title: "Complete or Escalate",
        description:
          "Routine workflows finish on the call. Anything outside them transfers to the right person warm, with a summary already written.",
      },
      {
        title: "Review the Recordings",
        description:
          "Calls are transcribed and logged against the actions taken, so quality review works the same way it does for your human agents.",
      },
    ],
    integrations: [
      "Twilio Voice",
      "SIP trunking",
      "Your CRM",
      "Calendar and scheduling",
      "Order management",
      "Helpdesk",
      "Payment processing",
      "SMS confirmation",
    ],
    outcomes: [
      { value: "First ring", label: "Answered, with no phone tree" },
      { value: "Verified", label: "Before any account detail is shared" },
      { value: "Warm", label: "Transfers, with the call summarised" },
      { value: "Recorded", label: "Transcribed and reviewable" },
    ],
  },
];

export function getSolution(slug: string) {
  return SOLUTIONS.find((solution) => solution.slug === slug);
}
