import type { TechnologyPageContent } from "@/types";

export const MOBILE: TechnologyPageContent = {
  slug: "mobile",
  navLabel: "Mobile",
  icon: "mobile",
  metaTitle: "Mobile App Development Services — Skyllect",
  metaDescription:
    "Skyllect builds cross-platform and native mobile apps for field teams, operations and customers — offline-capable, fast on mid-range hardware, and connected to your real systems.",

  hero: {
    eyebrow: "Technologies",
    heading: "Mobile Apps That Work Where the Work Happens",
    accent: "Work",
    body: "Warehouses, vehicles, ward corridors and customer sites all have one thing in common: the signal drops. We build mobile software that keeps functioning when the network does not, and reconciles cleanly when it returns.",
    image: "/images/mobile-technologies.jpg",
    imageAlt: "Mobile application development at Skyllect",
  },

  capabilities: {
    heading: "Tailored and Scalable Mobile Services",
    accent: "Scalable",
    description:
      "One app built properly, or a team that can carry your mobile roadmap for a year.",
    items: [
      {
        title: "Cross-platform Development",
        description:
          "One codebase covering iOS and Android where the product does not justify two.",
        points: [
          "Flutter or React Native chosen on fit, not habit",
          "Platform conventions respected on each side",
          "Shared logic without a lowest-common-denominator UI",
          "Native modules where the framework falls short",
        ],
      },
      {
        title: "Native Development",
        description:
          "Swift and Kotlin when performance or platform depth demands it.",
        points: [
          "Full access to platform capabilities",
          "Best-in-class performance on older hardware",
          "Deep OS integration where it matters",
          "Written to each platform's current conventions",
        ],
      },
      {
        title: "Offline-first Architecture",
        description:
          "Apps that keep working with no bars of signal.",
        points: [
          "Local database as the source of truth on device",
          "Queued actions that sync when connectivity returns",
          "Conflict rules decided by you, not by timing",
          "Honest status so users know what has synced",
        ],
      },
      {
        title: "Field & Operations Apps",
        description:
          "Tools for people working with gloves on, outdoors, in a hurry.",
        points: [
          "Large targets and high contrast for real conditions",
          "Barcode, QR and document capture",
          "Location and route awareness where it helps",
          "Task flows that survive being interrupted",
        ],
      },
      {
        title: "AI Features on Mobile",
        description:
          "Assistants, capture and classification that feel instant on a phone.",
        points: [
          "Streaming responses so something appears immediately",
          "On-device processing where latency or privacy demands it",
          "Camera capture with server-side extraction",
          "Graceful degradation when the model is unreachable",
        ],
      },
      {
        title: "Backend & Integration",
        description:
          "The services behind the app, built by the same team.",
        points: [
          "APIs shaped for mobile payloads and battery life",
          "Push notification infrastructure",
          "Authentication with biometric unlock",
          "Integration with the systems you already run",
        ],
      },
      {
        title: "Release & Store Management",
        description:
          "Getting it shipped, and shipping it again next week.",
        points: [
          "App Store and Play Console submission",
          "Staged rollouts with crash monitoring",
          "Over-the-air updates where the platform allows",
          "Release pipelines your team can run",
        ],
      },
      {
        title: "Maintenance & Team Augmentation",
        description:
          "Engineers who join your team rather than work around it.",
        points: [
          "OS and SDK version upgrades",
          "Performance and crash triage",
          "Code review and architectural guidance",
          "Handover documentation as standard",
        ],
      },
    ],
  },

  challenges: {
    heading: "Challenges in Modern Mobile Development",
    accent: "Challenges",
    description:
      "Mobile punishes assumptions that hold fine on a desk with good wifi.",
    items: [
      {
        title: "Connectivity Treated as Guaranteed",
        body: "An app tested in the office behaves very differently in a loading bay. The common failure is not an error message — it is silently lost work.",
        points: [
          "Submissions dropped when the request times out",
          "No indication of what has actually saved",
          "Sync conflicts resolved by whoever wrote last",
          "We design the offline path first and the online path as the fast case",
        ],
      },
      {
        title: "Built for the Newest Phone",
        body: "Development happens on current flagship hardware. The people who use it every day are often on a three-year-old mid-range device with a full storage drive.",
        points: [
          "Animations that stutter on the actual fleet",
          "Memory pressure causing background termination",
          "Bundle sizes that make updates over cellular painful",
          "We profile on the hardware your users really carry",
        ],
      },
      {
        title: "Release Cycles That Stall",
        body: "Unlike the web, you cannot simply push a fix. Without a working pipeline a small bug can sit in production for a fortnight waiting on review.",
        points: [
          "Manual, undocumented build and signing steps",
          "No staged rollout, so a bad release hits everyone",
          "Crashes discovered from user complaints rather than monitoring",
          "We automate the pipeline and gate rollouts on crash-free rates",
        ],
      },
    ],
  },

  stack: {
    heading: "The Mobile Stack We Build On",
    accent: "Stack",
    description:
      "Chosen for what a project needs, not for novelty. Everything here is something we ship and can support.",
    items: [
      { slug: "flutter" },
      { slug: "dart" },
      { slug: "react", label: "React Native" },
      { slug: "expo" },
      { slug: "ionic" },
      { slug: "swift" },
      { slug: "apple", label: "iOS" },
      { slug: "xcode" },
      { slug: "kotlin" },
      { slug: "android" },
      { slug: "androidstudio", label: "Android Studio" },
      { slug: "compose", label: "Jetpack Compose" },
      { slug: "gradle" },
      { slug: "typescript" },
      { slug: "sqlite" },
      { slug: "firebase" },
      { slug: "supabase" },
      { slug: "graphql" },
      { slug: "nodejs" },
      { slug: "sentry" },
      { slug: "figma" },
      { slug: "docker" },
      { label: "SwiftUI" },
      { label: "Fastlane" },
    ],
  },

  process: {
    heading: "Our Proven Mobile Process",
    accent: "Proven",
    description:
      "Six stages, each ending in a build you can hold. No long silences between kickoff and delivery.",
    steps: [
      {
        title: "Discovery & Audit",
        icon: "discovery",
        description:
          "We establish where the app will actually be used, on what hardware, with what connectivity — and agree what good looks like in measurable terms.",
      },
      {
        title: "Architecture & Sync Model",
        icon: "architecture",
        description:
          "Platform approach, local storage, sync strategy and conflict rules are decided up front, because retrofitting offline support is close to a rewrite.",
      },
      {
        title: "Prototype",
        icon: "prototype",
        description:
          "An installable build of the core flow on real devices. Nothing reveals an interaction problem faster than holding it in one hand.",
      },
      {
        title: "Build",
        icon: "build",
        description:
          "Delivered as reviewable builds through TestFlight and internal testing tracks, with tests written alongside the features.",
      },
      {
        title: "Device & Field Testing",
        icon: "quality",
        description:
          "Tested across a real device matrix and in degraded network conditions, including the ones your users work in every day.",
      },
      {
        title: "Release & Iterate",
        icon: "launch",
        description:
          "Store submission, staged rollout gated on crash-free rates, and a documented pipeline your team can run without us.",
      },
    ],
  },

  whyUs: {
    heading: "Why Teams Choose Skyllect for Mobile",
    accent: "Skyllect",
    description:
      "We are a software engineering team that works on AI, not an AI team learning to write software.",
    items: [
      {
        title: "We Build the Whole System",
        description:
          "The same team builds the APIs behind the app, so the mobile client is never designed against a backend nobody will build.",
      },
      {
        title: "Offline Is the Default Case",
        description:
          "Local-first storage and queued sync are designed in from the start, because they cannot be added convincingly later.",
      },
      {
        title: "Tested on Real Hardware",
        description:
          "Performance is measured on the mid-range devices your users actually carry, not on the newest phone in the office.",
      },
      {
        title: "Releases Are Automated",
        description:
          "Signing, building and submission run from a pipeline, so a fix is a day away rather than a fortnight.",
      },
      {
        title: "Platform Conventions Respected",
        description:
          "An Android app should feel like Android. Cross-platform saves effort on logic, not on making both sides feel wrong.",
      },
      {
        title: "You Keep the Code",
        description:
          "Your repository, your store accounts, your signing keys. Nothing here requires us to stay.",
      },
    ],
  },

  cta: {
    heading: "Let's Talk About Your Mobile App",
    accent: "Mobile",
    body: "Tell us what you are building or where your current app struggles. We will come back with an honest view of the effort involved and where we would start.",
  },
};
