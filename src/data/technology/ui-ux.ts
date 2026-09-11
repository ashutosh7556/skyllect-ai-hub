import type { TechnologyPageContent } from "@/types";

export const UI_UX: TechnologyPageContent = {
  slug: "ui-ux",
  navLabel: "UI/UX Design",
  icon: "design",
  metaTitle: "UI/UX Design Services — Skyllect",
  metaDescription:
    "Skyllect designs interfaces for AI products and operational software: research, design systems, prototypes and accessible UI that engineers can build without guessing.",

  hero: {
    eyebrow: "Technologies",
    heading: "Design for Products That Have to Be Understood",
    accent: "Understood",
    body: "Operational software and AI products share a problem: the screen has to make something complicated legible in a few seconds. We design for the person who uses it forty times a day, not for a portfolio shot.",
    image: "/images/UI-UX-technologies.jpg",
    imageAlt: "UI and UX design work at Skyllect",
  },

  capabilities: {
    heading: "Tailored and Scalable Design Services",
    accent: "Scalable",
    description:
      "From a single flow that is not working to a design system your team can build against for years.",
    items: [
      {
        title: "Product & Interface Design",
        description:
          "Screens designed around the task, not around a layout that looked good empty.",
        points: [
          "Flows mapped before any pixels are pushed",
          "Designed with real content and real edge cases",
          "Empty, loading, partial and error states included",
          "Responsive behaviour specified, not left to chance",
        ],
      },
      {
        title: "AI Interaction Design",
        description:
          "The patterns specific to AI: uncertainty, provenance, correction and approval.",
        points: [
          "Showing what the system is doing while it works",
          "Surfacing sources so an answer can be checked",
          "Making correction faster than starting over",
          "Approval steps that feel like control, not friction",
        ],
      },
      {
        title: "Design Systems",
        description:
          "A shared vocabulary so every screen shipped afterwards is consistent.",
        points: [
          "Tokens for colour, type, spacing and motion",
          "Components documented with usage guidance",
          "Accessible primitives as the foundation",
          "Handed over in a form engineers can consume",
        ],
      },
      {
        title: "UX Research",
        description:
          "Finding out how the work is really done before redesigning it.",
        points: [
          "Interviews and observation with actual users",
          "Task analysis on the journeys that matter",
          "Usability testing on prototypes, not on production",
          "Findings written as decisions, not as a slide deck",
        ],
      },
      {
        title: "Prototyping",
        description:
          "Something clickable early, because opinions about static mockups are cheap.",
        points: [
          "Interactive prototypes at the fidelity needed",
          "Realistic data instead of lorem ipsum",
          "Tested with users before build starts",
          "The cheapest point at which to change direction",
        ],
      },
      {
        title: "Dashboard & Data Design",
        description:
          "Dense operational screens that stay readable under real volume.",
        points: [
          "Exception-first layouts that surface what needs action",
          "Charts chosen for the question, not for decoration",
          "Information density tuned to the user's expertise",
          "Legible at a glance from across a room",
        ],
      },
      {
        title: "Accessibility",
        description:
          "Designed so nobody on your team or in your customer base is locked out.",
        points: [
          "WCAG 2.2 AA as a design constraint, not an audit",
          "Contrast and type sizes checked at design time",
          "Focus order and keyboard paths specified",
          "Annotations engineers can implement directly",
        ],
      },
      {
        title: "Design Audits",
        description:
          "An honest assessment of an existing product and what to fix first.",
        points: [
          "Heuristic review against real user tasks",
          "Consistency and pattern inventory",
          "Prioritised list by impact against effort",
          "Quick wins separated from structural work",
        ],
      },
    ],
  },

  challenges: {
    heading: "Challenges in Modern Product Design",
    accent: "Challenges",
    description:
      "Most design problems in working software are not aesthetic. They are decisions that were never made.",
    items: [
      {
        title: "Designs That Cannot Be Built",
        body: "A file gets approved, then engineering discovers it does not say what happens when the list is empty, the name is long, or the request fails. Those answers get invented during the build.",
        points: [
          "Only the happy path was ever drawn",
          "No responsive behaviour between the two artboards",
          "Components that look alike but behave differently",
          "We specify states and behaviour, not just layouts",
        ],
      },
      {
        title: "AI Interfaces That Hide the Machine",
        body: "Presenting a model's output as a confident answer with no visible reasoning or source teaches users to either over-trust it or abandon it. Both are expensive.",
        points: [
          "No indication of what the system actually did",
          "Nothing to click when the answer is wrong",
          "Confidence presented identically regardless of certainty",
          "We design for correction and provenance from the start",
        ],
      },
      {
        title: "Consistency That Decays",
        body: "Six months after launch there are four button styles and three date formats. Nobody decided that — it accumulated one deadline at a time.",
        points: [
          "Patterns re-invented because nothing was documented",
          "Design files and shipped product drifting apart",
          "New team members guessing at the conventions",
          "We hand over a system, with rules for extending it",
        ],
      },
    ],
  },

  stack: {
    heading: "The Design Stack We Work In",
    accent: "Stack",
    description:
      "Chosen for what a project needs. We work in whatever your team already uses rather than forcing a migration.",
    items: [
      { slug: "figma" },
      { slug: "sketch" },
      { slug: "penpot" },
      { slug: "framer" },
      { slug: "webflow" },
      { slug: "excalidraw" },
      { slug: "miro" },
      { slug: "notion" },
      { slug: "storybook" },
      { slug: "lottie", label: "Lottie" },
      { slug: "blender" },
      { slug: "inkscape" },
      { slug: "gimp", label: "GIMP" },
      { slug: "coreldraw", label: "CorelDRAW" },
      { slug: "tailwind" },
      { slug: "mui", label: "Material UI" },
      { slug: "react" },
      { slug: "css" },
      // Adobe marks were withdrawn from simple-icons at the trademark
      // holder's request, so these render as monogram tiles.
      { label: "Adobe XD" },
      { label: "Photoshop" },
      { label: "Illustrator" },
      { label: "After Effects" },
      { label: "Balsamiq" },
      { label: "Zeplin" },
    ],
  },

  process: {
    heading: "Our Proven Design Process",
    accent: "Proven",
    description:
      "Six stages, each ending in something you can react to. No long silences between kickoff and delivery.",
    steps: [
      {
        title: "Discovery & Research",
        icon: "discovery",
        description:
          "We watch the work being done today, talk to the people doing it, and agree which tasks the redesign has to make faster.",
      },
      {
        title: "Structure & Design System",
        icon: "architecture",
        description:
          "Information architecture, navigation and the token and component foundations are settled before individual screens are drawn.",
      },
      {
        title: "Prototype",
        icon: "prototype",
        description:
          "Clickable flows with realistic content, tested with real users. Changing direction here costs a day rather than a sprint.",
      },
      {
        title: "Design & Specification",
        icon: "build",
        description:
          "Screens delivered with their states, responsive behaviour and interaction notes, so engineering never has to guess at intent.",
      },
      {
        title: "Accessibility & Review",
        icon: "quality",
        description:
          "Contrast, type scale, focus order and keyboard paths checked against WCAG 2.2 AA before handover rather than after launch.",
      },
      {
        title: "Handover & Iterate",
        icon: "launch",
        description:
          "A documented system your engineers can build from, then refinement against how the product is actually used once it ships.",
      },
    ],
  },

  whyUs: {
    heading: "Why Teams Choose Skyllect for Design",
    accent: "Skyllect",
    description:
      "We are a software engineering team that designs, which means what we hand over can be built as drawn.",
    items: [
      {
        title: "We Build What We Design",
        description:
          "The same team engineers the result, so nothing is specified that cannot be implemented — and nothing is left undecided for a developer to invent.",
      },
      {
        title: "States Before Styling",
        description:
          "Loading, empty, partial, error and permission-denied are designed alongside the happy path, because that is where products actually feel broken.",
      },
      {
        title: "Accessible by Default",
        description:
          "Contrast, focus and keyboard operation are constraints during design rather than a remediation project afterwards.",
      },
      {
        title: "Research Over Opinion",
        description:
          "Decisions are grounded in watching people do the work. Taste settles what is left, not what matters.",
      },
      {
        title: "Systems, Not One-offs",
        description:
          "You get a documented set of tokens and components, so the tenth screen your team ships still matches the first.",
      },
      {
        title: "You Keep the Files",
        description:
          "Your workspace, your components, your documentation. Nothing here requires us to stay.",
      },
    ],
  },

  cta: {
    heading: "Let's Talk About Your Product Design",
    accent: "Design",
    body: "Tell us what you are building or which part of your product people struggle with. We will come back with an honest view of the effort involved and where we would start.",
  },
};
