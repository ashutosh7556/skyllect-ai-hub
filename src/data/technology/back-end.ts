import type { TechnologyPageContent } from "@/types";

export const BACK_END: TechnologyPageContent = {
  slug: "back-end",
  navLabel: "Back-end",
  icon: "backend",
  metaTitle: "Back-end Development Services — Skyllect",
  metaDescription:
    "Skyllect builds APIs, services and data pipelines that AI systems can be trusted to act on: typed contracts, enforced permissions, and a complete audit trail.",

  hero: {
    eyebrow: "Technologies",
    heading: "Back-end Systems AI Can Be Trusted With",
    accent: "Trusted",
    body: "The moment a model is allowed to do something rather than just say something, the back-end stops being plumbing. It becomes the thing deciding what is permitted, what gets logged, and what happens when a step fails halfway through.",
    image: "/images/backend-technologies.jpg",
    imageAlt: "Back-end services and APIs Skyllect builds",
  },

  capabilities: {
    heading: "Tailored and Scalable Back-end Services",
    accent: "Scalable",
    description:
      "From a single API to the whole server estate behind a product, scoped to what you actually need built.",
    items: [
      {
        title: "API Design & Development",
        description:
          "REST and GraphQL interfaces designed around your domain rather than your database tables.",
        points: [
          "Typed contracts generated from one source of truth",
          "Versioning that does not break existing clients",
          "Pagination, filtering and rate limits from day one",
          "OpenAPI documentation kept in sync with the code",
        ],
      },
      {
        title: "AI Tool & Agent Backends",
        description:
          "The services an agent calls, built so a wrong call cannot become a wrong outcome.",
        points: [
          "Tool endpoints with strict input validation",
          "Permission checks before any state changes",
          "Idempotency so a retry cannot double-charge",
          "Every invocation logged with its arguments",
        ],
      },
      {
        title: "Service Architecture",
        description:
          "Deciding what should be one service and what should not, then building it that way.",
        points: [
          "Boundaries drawn around ownership, not fashion",
          "Synchronous and queued paths chosen per workload",
          "Graceful degradation when a dependency is down",
          "Monolith first unless the split earns itself",
        ],
      },
      {
        title: "Data Pipelines & Jobs",
        description:
          "Scheduled and event-driven work that keeps running when nobody is watching.",
        points: [
          "Queues and workers sized to real throughput",
          "Retries with backoff and a dead-letter path",
          "Backfills that can be re-run safely",
          "Alerting on the failure, not on the symptom",
        ],
      },
      {
        title: "Authentication & Authorisation",
        description:
          "Who can do what, enforced server-side rather than hidden in the interface.",
        points: [
          "Session, token and service-to-service auth",
          "Role and attribute-based permission models",
          "Least-privilege credentials for every integration",
          "Tested against the cases that actually matter",
        ],
      },
      {
        title: "Third-party Integration",
        description:
          "Connecting the systems your business already runs on without a migration.",
        points: [
          "ERP, CRM and helpdesk integrations",
          "Webhook intake with replay and deduplication",
          "Rate-limit-aware clients with circuit breakers",
          "Mapping layers that isolate their schema from yours",
        ],
      },
      {
        title: "Performance & Reliability",
        description:
          "Making an existing back-end hold up, and knowing when it will not.",
        points: [
          "Query and hot-path profiling with a fix list",
          "Caching where it is safe, not everywhere",
          "Load testing against realistic traffic shapes",
          "Health checks, tracing and structured logs",
        ],
      },
      {
        title: "Maintenance & Team Augmentation",
        description:
          "Engineers who join your team rather than work around it.",
        points: [
          "Runtime and dependency upgrades",
          "Code review and architectural guidance",
          "Incremental extraction from legacy services",
          "Handover documentation as standard",
        ],
      },
    ],
  },

  challenges: {
    heading: "Challenges in Modern Back-end Development",
    accent: "Challenges",
    description:
      "The failures that hurt most are rarely outages. They are the quiet ones nobody notices for a month.",
    items: [
      {
        title: "Giving AI Write Access Too Early",
        body: "Read-only assistants are easy. The risk appears the first time a model is allowed to create an order, issue a refund or update a record, and the guardrails live in a prompt rather than the API.",
        points: [
          "Prompt instructions treated as a permission model",
          "No idempotency, so a retry duplicates the action",
          "Nothing recorded about why an action was taken",
          "We enforce limits in the service, where they cannot be talked around",
        ],
      },
      {
        title: "Integrations That Break Silently",
        body: "A third party changes a field, a webhook stops arriving, a token expires overnight. Nothing errors loudly — data just quietly stops being right.",
        points: [
          "Failures swallowed by a catch block and a log line",
          "No reconciliation between systems that should agree",
          "Retries that give up without telling anyone",
          "We alert on drift and divergence, not just on exceptions",
        ],
      },
      {
        title: "Schemas That Outlive Their Assumptions",
        body: "The data model made sense for the first use case. Three features later it is being worked around in every query, and changing it feels impossible.",
        points: [
          "Business rules encoded in nullable columns",
          "Migrations nobody is willing to run in production",
          "Reporting queries scanning tables they should not",
          "We migrate in expand-and-contract steps, never a big-bang cutover",
        ],
      },
    ],
  },

  stack: {
    heading: "The Back-end Stack We Build On",
    accent: "Stack",
    description:
      "Chosen for what a project needs, not for novelty. Everything here is something we run in production and can support.",
    items: [
      { slug: "nodejs" },
      { slug: "typescript" },
      { slug: "nestjs" },
      { slug: "express" },
      { slug: "python" },
      { slug: "fastapi" },
      { slug: "django" },
      { slug: "go" },
      { slug: "rust" },
      { slug: "spring", label: "Java / Spring" },
      { slug: "php" },
      { slug: "laravel" },
      { slug: "dotnet" },
      { slug: "graphql" },
      { slug: "trpc" },
      { slug: "swagger", label: "OpenAPI" },
      { slug: "jwt", label: "JWT" },
      { slug: "prisma" },
      { slug: "postgresql" },
      { slug: "redis" },
      { slug: "rabbitmq" },
      { slug: "kafka", label: "Kafka" },
      { slug: "docker" },
      { slug: "kubernetes" },
    ],
  },

  process: {
    heading: "Our Proven Back-end Process",
    accent: "Proven",
    description:
      "Six stages, each ending in something you can review. No long silences between kickoff and delivery.",
    steps: [
      {
        title: "Discovery & Audit",
        icon: "discovery",
        description:
          "We map the workloads, integrations and data you already have, and agree what good looks like in measurable terms — latency, throughput and what must never be lost.",
      },
      {
        title: "Architecture & Contracts",
        icon: "architecture",
        description:
          "Service boundaries, data model and API contracts are settled up front, so the interface and the back-end are never built against different assumptions.",
      },
      {
        title: "Prototype",
        icon: "prototype",
        description:
          "A thin slice running end to end against real dependencies. It is the cheapest point at which to discover an integration will not behave.",
      },
      {
        title: "Build",
        icon: "build",
        description:
          "Delivered in reviewable increments against the agreed contracts, with tests written alongside the endpoints rather than promised for later.",
      },
      {
        title: "Hardening",
        icon: "quality",
        description:
          "Load testing, failure injection, permission review and a pass over every path where a retry or a partial failure could corrupt state.",
      },
      {
        title: "Launch & Operate",
        icon: "launch",
        description:
          "Deployment, tracing, alerting and a documented handover — then we tune against real traffic instead of guessing at its shape.",
      },
    ],
  },

  whyUs: {
    heading: "Why Teams Choose Skyllect for Back-end",
    accent: "Skyllect",
    description:
      "We are a software engineering team that works on AI, not an AI team learning to write software.",
    items: [
      {
        title: "We Build the Whole System",
        description:
          "The same team handles the interface and the infrastructure, so the API is never designed against a front-end nobody will build.",
      },
      {
        title: "Permissions Live in the Service",
        description:
          "What a caller may do is enforced server-side. That holds whether the caller is a person, another service, or a model.",
      },
      {
        title: "Everything Is Auditable",
        description:
          "Actions are logged with their inputs and their outcome, so answering what happened and why is a query rather than an investigation.",
      },
      {
        title: "Typed End to End",
        description:
          "Types run from the database through the API to the client, so an entire class of runtime bug never reaches production.",
      },
      {
        title: "Tested Where It Counts",
        description:
          "Critical paths are covered by integration tests against real dependencies. We would rather have twenty tests you trust than a coverage number nobody reads.",
      },
      {
        title: "You Keep the Code",
        description:
          "Your repository, your dependencies, your documentation. No proprietary runtime and nothing that requires us to stay.",
      },
    ],
  },

  cta: {
    heading: "Let's Talk About Your Back-end",
    accent: "Back-end",
    body: "Tell us what you are building or what is not holding up in what you have. We will come back with an honest view of the effort involved and where we would start.",
  },
};
