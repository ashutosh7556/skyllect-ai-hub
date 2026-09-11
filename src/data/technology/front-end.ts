import type { TechnologyPageContent } from "@/types";

export const FRONT_END: TechnologyPageContent = {
  slug: "front-end",
  navLabel: "Front-end",
  icon: "frontend",
  metaTitle: "Front-end Development Services — Skyllect",
  metaDescription:
    "Skyllect builds fast, accessible front-ends for AI products: agent consoles, operator dashboards, and customer applications that stay responsive while models stream and data changes underneath.",

  hero: {
    eyebrow: "Technologies",
    heading: "Front-end Development for Software That Thinks",
    accent: "Thinks",
    body: "Most interfaces assume the answer arrives all at once. AI systems do not work that way — they stream, they call tools, they pause for approval, and sometimes they are wrong. We build front-ends that stay clear and fast while all of that happens in the open.",
    image: "/images/frontend-technologies.jpg",
    imageAlt: "Front-end technologies Skyllect builds with",
  },

  capabilities: {
    heading: "Tailored and Scalable Front-end Services",
    accent: "Scalable",
    description:
      "Whether you need one interface built properly or a team that can carry your front-end for a year, the engagement fits the problem.",
    items: [
      {
        title: "Custom Front-end Development",
        description:
          "Applications built to your requirements rather than bent out of a template.",
        points: [
          "Component architecture designed around your domain",
          "Typed contracts between UI and API",
          "Responsive from small phone to wide desktop",
          "Documented so your team can extend it",
        ],
      },
      {
        title: "AI Product Interfaces",
        description:
          "The surfaces specific to AI: streaming output, tool traces, approvals, and correction.",
        points: [
          "Token-by-token streaming without layout jumps",
          "Visible tool calls and source citations",
          "Human-in-the-loop approval and override flows",
          "Graceful handling of refusals and timeouts",
        ],
      },
      {
        title: "Operator Dashboards",
        description:
          "Dense internal tools for teams who work in one screen all day.",
        points: [
          "Exception-first layouts that surface what needs action",
          "Virtualised tables that stay smooth at scale",
          "Saved views, filters, and keyboard navigation",
          "Live updates without full-page refreshes",
        ],
      },
      {
        title: "Design Systems & Component Libraries",
        description:
          "A shared vocabulary so every screen you ship afterwards is consistent.",
        points: [
          "Tokens for colour, type, spacing, and motion",
          "Accessible primitives as the foundation",
          "Storybook documentation with usage guidance",
          "Versioned and consumable across products",
        ],
      },
      {
        title: "Single Page Applications",
        description:
          "Client-heavy products where responsiveness is the whole experience.",
        points: [
          "Routing, code splitting, and prefetch strategy",
          "Optimistic updates with reliable rollback",
          "Offline and poor-connection behaviour",
          "State management chosen to fit, not by habit",
        ],
      },
      {
        title: "Performance Engineering",
        description:
          "Making an existing front-end fast, and keeping it that way.",
        points: [
          "Core Web Vitals audit with a prioritised plan",
          "Bundle analysis and dependency reduction",
          "Rendering strategy per route",
          "Performance budgets enforced in CI",
        ],
      },
      {
        title: "Accessibility & Compliance",
        description:
          "Interfaces that work for everyone on your team and every customer.",
        points: [
          "WCAG 2.2 AA audit against real journeys",
          "Full keyboard operation and focus management",
          "Screen reader semantics and live regions",
          "Automated checks wired into the pipeline",
        ],
      },
      {
        title: "Maintenance & Team Augmentation",
        description:
          "Engineers who join your team rather than work around it.",
        points: [
          "Framework and dependency upgrades",
          "Code review and architectural guidance",
          "Incremental migration off legacy front-ends",
          "Handover documentation as standard",
        ],
      },
    ],
  },

  challenges: {
    heading: "Challenges in Modern Front-end Development",
    accent: "Challenges",
    description:
      "The problems that slow teams down are rarely the ones in the ticket. These are the three we are called in for most often.",
    items: [
      {
        title: "Performance That Degrades Quietly",
        body: "Front-ends rarely become slow all at once. They accumulate weight one dependency and one unmemoised render at a time, and nobody notices until customers do.",
        points: [
          "Bundles that grow every sprint with nothing tracking them",
          "Third-party scripts blocking the first meaningful paint",
          "Re-render cascades from state kept at the wrong level",
          "We set budgets in CI so regressions fail the build, not the customer",
        ],
      },
      {
        title: "Interfaces That Cannot Absorb AI",
        body: "Screens designed for instant responses break when the response arrives over ten seconds, calls tools midway, and occasionally needs a human to approve it.",
        points: [
          "Layouts that jump as streamed content arrives",
          "No way to show provenance, so nobody trusts the output",
          "Errors and refusals surfaced as dead ends",
          "We design the loading, partial and failed states first, not last",
        ],
      },
      {
        title: "Rewrites Nobody Can Finish",
        body: "A full rebuild is the most common answer to an ageing front-end and the most common thing to stall halfway, leaving two systems to maintain instead of one.",
        points: [
          "Feature work frozen while the rewrite runs",
          "Two codebases drifting apart in parallel",
          "Business logic lost because it only existed in the old UI",
          "We migrate route by route, with both versions shipping throughout",
        ],
      },
    ],
  },

  stack: {
    heading: "The Front-end Stack We Build On",
    accent: "Stack",
    description:
      "Chosen for what a project needs, not for novelty. Everything here is something we run in production and can support.",
    items: [
      { slug: "react" },
      { slug: "nextjs" },
      { slug: "angular" },
      { slug: "vue" },
      { slug: "svelte" },
      { slug: "astro" },
      { slug: "remix" },
      { slug: "nuxt" },
      { slug: "typescript" },
      { slug: "javascript" },
      { slug: "html" },
      { slug: "css" },
      { slug: "sass" },
      { slug: "tailwind" },
      { slug: "bootstrap" },
      { slug: "mui", label: "Material UI" },
      { slug: "redux" },
      { slug: "tanstack", label: "TanStack Query" },
      { slug: "vite" },
      { slug: "webpack" },
      { slug: "storybook" },
      { slug: "vitest" },
      { slug: "graphql" },
      { slug: "figma" },
    ],
  },

  process: {
    heading: "Our Proven Front-end Process",
    accent: "Proven",
    description:
      "Six stages, each ending in something you can look at and respond to. No long silences between kickoff and delivery.",
    steps: [
      {
        title: "Discovery & Audit",
        icon: "discovery",
        description:
          "We map the journeys that matter, review any existing front-end, and agree what good looks like in measurable terms — speed, accessibility, and the tasks people need to finish.",
      },
      {
        title: "Architecture & Design System",
        icon: "architecture",
        description:
          "Component structure, routing, state boundaries, and data flow are decided up front, along with the tokens and primitives every screen will be built from.",
      },
      {
        title: "Prototype",
        icon: "prototype",
        description:
          "A working interface with real interaction, not a static mockup. It is the cheapest point at which to change your mind, so we get there fast.",
      },
      {
        title: "Build",
        icon: "build",
        description:
          "Delivered in reviewable increments against the agreed architecture, with tests written alongside the components rather than promised for later.",
      },
      {
        title: "Quality & Accessibility",
        icon: "quality",
        description:
          "Cross-browser and device testing, keyboard and screen reader passes, and performance measured against the budgets set in discovery.",
      },
      {
        title: "Launch & Iterate",
        icon: "launch",
        description:
          "Deployment, monitoring, and a documented handover — then we tune against real usage instead of guessing what people will do.",
      },
    ],
  },

  whyUs: {
    heading: "Why Teams Choose Skyllect for Front-end",
    accent: "Skyllect",
    description:
      "We are a software engineering team that works on AI, not an AI team learning to write software.",
    items: [
      {
        title: "We Build the Whole System",
        description:
          "The same team handles the APIs, data, and infrastructure behind the interface, so the front-end is never designed against a backend nobody will build.",
      },
      {
        title: "Performance Is a Requirement",
        description:
          "Budgets are agreed in discovery and enforced in CI. A build that breaks them fails, rather than quietly shipping.",
      },
      {
        title: "Accessible by Default",
        description:
          "Keyboard operation, focus management, and screen reader semantics are part of the component, not a remediation project afterwards.",
      },
      {
        title: "Typed End to End",
        description:
          "Types run from the database through the API to the component props, so an entire class of runtime bug never reaches your users.",
      },
      {
        title: "Tested Where It Counts",
        description:
          "Critical journeys are covered by end-to-end tests. We would rather have twenty tests you trust than a coverage number nobody reads.",
      },
      {
        title: "You Keep the Code",
        description:
          "Your repository, your dependencies, your documentation. No proprietary runtime and nothing that requires us to stay.",
      },
    ],
  },

  cta: {
    heading: "Let's Talk About Your Front-end",
    accent: "Front-end",
    body: "Tell us what you are building or what is not working in what you have. We will come back with an honest view of the effort involved and where we would start.",
  },
};
