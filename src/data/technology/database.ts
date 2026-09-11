import type { TechnologyPageContent } from "@/types";

export const DATABASE: TechnologyPageContent = {
  slug: "database",
  navLabel: "Database",
  icon: "database",
  metaTitle: "Database Engineering Services — Skyllect",
  metaDescription:
    "Skyllect designs, tunes and migrates the data layer behind AI systems: schema design, query performance, retrieval and search, and migrations that run without downtime.",

  hero: {
    eyebrow: "Technologies",
    heading: "Data Your AI Can Actually Answer From",
    accent: "Answer",
    body: "An AI system is only as good as what it can look up. Most disappointing results are not a model problem — they are a data problem: the record was stale, the schema could not express the question, or the query was too slow to wait for.",
    image: "/images/database-technologies.jpg",
    imageAlt: "Database and data platform engineering at Skyllect",
  },

  capabilities: {
    heading: "Tailored and Scalable Database Services",
    accent: "Scalable",
    description:
      "From modelling a new schema to rescuing one that has outgrown its assumptions.",
    items: [
      {
        title: "Schema Design & Modelling",
        description:
          "A data model built around the questions you need to ask, not just the forms you fill in.",
        points: [
          "Normalised where it matters, denormalised where it pays",
          "Constraints that make invalid states impossible",
          "Indexes designed alongside the access patterns",
          "Documented so the next engineer can read the intent",
        ],
      },
      {
        title: "Query & Index Optimisation",
        description:
          "Finding the queries costing you the most and making them stop.",
        points: [
          "Plan analysis on the slowest real-world queries",
          "Index strategy that does not slow every write",
          "N+1 and accidental full-scan elimination",
          "Before-and-after numbers on production-shaped data",
        ],
      },
      {
        title: "Retrieval & Vector Search",
        description:
          "The lookup layer behind grounded AI answers, built for accuracy over novelty.",
        points: [
          "Chunking and indexing tuned to your documents",
          "Hybrid keyword and semantic retrieval",
          "Metadata filters so permissions apply to results",
          "Evaluation against a labelled question set",
        ],
      },
      {
        title: "Migrations Without Downtime",
        description:
          "Changing the shape of live data while the product keeps serving traffic.",
        points: [
          "Expand-and-contract rollouts, never a big-bang cutover",
          "Backfills that can be paused and resumed",
          "Dual-write and verification before the switch",
          "A rehearsed rollback for every step",
        ],
      },
      {
        title: "Data Integration & Sync",
        description:
          "Keeping systems that disagree in agreement.",
        points: [
          "Change data capture and event-driven sync",
          "Reconciliation jobs that surface divergence",
          "Conflict rules decided by you, not by timing",
          "Mapping layers isolating their schema from yours",
        ],
      },
      {
        title: "Reporting & Analytics Layer",
        description:
          "Separating the questions analysts ask from the database serving your product.",
        points: [
          "Read replicas and warehouse loading",
          "Modelled tables instead of ad-hoc joins",
          "Scheduled refreshes with freshness guarantees",
          "Reporting load kept off the transactional path",
        ],
      },
      {
        title: "Reliability & Recovery",
        description:
          "Knowing your backups work before you need them.",
        points: [
          "Backup and point-in-time recovery configured",
          "Restores actually rehearsed, not just scheduled",
          "Replication and failover behaviour tested",
          "Retention aligned to your obligations",
        ],
      },
      {
        title: "Maintenance & Team Augmentation",
        description:
          "Engineers who join your team rather than work around it.",
        points: [
          "Version upgrades and extension management",
          "Capacity planning ahead of growth",
          "Review of schema changes before they ship",
          "Handover documentation as standard",
        ],
      },
    ],
  },

  challenges: {
    heading: "Challenges in Modern Database Engineering",
    accent: "Challenges",
    description:
      "Data problems compound quietly. By the time they are visible they are expensive.",
    items: [
      {
        title: "Retrieval That Returns the Wrong Thing",
        body: "Grounded AI answers are only as good as the passages fetched to ground them. Poor retrieval does not produce an error — it produces a confident answer built on the wrong document.",
        points: [
          "Chunks split mid-sentence, losing the context that mattered",
          "Semantic search alone missing exact identifiers and codes",
          "No permission filter, so results leak across tenants",
          "We evaluate retrieval against labelled questions before trusting it",
        ],
      },
      {
        title: "Schemas Nobody Dares Change",
        body: "The model fit the first feature. Several features later every query works around it, and the migration that would fix it feels too risky to attempt.",
        points: [
          "Meaning encoded in nullable columns and magic values",
          "Application code compensating for the shape of the data",
          "Migrations written but never run in production",
          "We change schemas incrementally, with both shapes valid in between",
        ],
      },
      {
        title: "Performance That Falls Off a Cliff",
        body: "Queries are fine at ten thousand rows and unusable at ten million. Nothing was wrong with the code — the access pattern simply stopped matching the index.",
        points: [
          "Indexes added reactively, one incident at a time",
          "Reporting queries competing with live traffic",
          "Connection pools exhausted under normal load",
          "We test against production-shaped volumes, not seed data",
        ],
      },
    ],
  },

  stack: {
    heading: "The Data Stack We Build On",
    accent: "Stack",
    description:
      "Chosen for what a project needs, not for novelty. Everything here is something we run in production and can support.",
    items: [
      { slug: "postgresql" },
      { slug: "mysql" },
      { slug: "mariadb" },
      { slug: "sqlite" },
      { slug: "mongodb" },
      { slug: "redis" },
      { slug: "elasticsearch" },
      { slug: "opensearch" },
      { slug: "neo4j" },
      { slug: "cassandra", label: "Cassandra" },
      { slug: "couchbase" },
      { slug: "clickhouse" },
      { slug: "duckdb" },
      { slug: "influxdb" },
      { slug: "cockroach", label: "CockroachDB" },
      { slug: "planetscale" },
      { slug: "supabase" },
      { slug: "firebase" },
      { slug: "snowflake" },
      { slug: "bigquery", label: "BigQuery" },
      { slug: "prisma" },
      { slug: "drizzle" },
      { slug: "typeorm" },
      // No mark available — renders as a monogram tile.
      { label: "DynamoDB" },
    ],
  },

  process: {
    heading: "Our Proven Data Process",
    accent: "Proven",
    description:
      "Six stages, each ending in something you can review. No long silences between kickoff and delivery.",
    steps: [
      {
        title: "Discovery & Audit",
        icon: "discovery",
        description:
          "We profile what you have — volumes, access patterns, slowest queries and where the data disagrees with itself — and agree what good looks like in numbers.",
      },
      {
        title: "Modelling & Architecture",
        icon: "architecture",
        description:
          "Schema, indexes, retention and the split between transactional and analytical workloads are decided up front rather than discovered under load.",
      },
      {
        title: "Prototype",
        icon: "prototype",
        description:
          "The new shape proven against a realistic copy of your data, including the queries you care about most, before anything touches production.",
      },
      {
        title: "Build & Migrate",
        icon: "build",
        description:
          "Delivered in reversible steps. Expand, backfill, verify, then contract — with the product serving traffic throughout.",
      },
      {
        title: "Verification",
        icon: "quality",
        description:
          "Row-level reconciliation, query plans re-checked at volume, and a rehearsed restore so the backup is known to work.",
      },
      {
        title: "Launch & Operate",
        icon: "launch",
        description:
          "Monitoring on growth, slow queries and replication lag, plus a documented handover so your team can run it without us.",
      },
    ],
  },

  whyUs: {
    heading: "Why Teams Choose Skyllect for Data",
    accent: "Skyllect",
    description:
      "We are a software engineering team that works on AI, not an AI team learning to write software.",
    items: [
      {
        title: "We Build the Whole System",
        description:
          "The same team builds the services and interfaces on top, so the schema is designed against how it will actually be queried.",
      },
      {
        title: "Migrations Are Reversible",
        description:
          "Every step has a rollback that has been rehearsed. We do not ask you to accept a cutover with no way back.",
      },
      {
        title: "Retrieval Is Measured",
        description:
          "Search quality is evaluated against a labelled question set, so improvements are demonstrated rather than asserted.",
      },
      {
        title: "Tested at Real Volume",
        description:
          "Performance work is validated against production-shaped data. Numbers from a seed database tell you nothing useful.",
      },
      {
        title: "Your Data Stays Yours",
        description:
          "Standard engines, standard formats, no proprietary storage layer. Exporting everything is always a supported path.",
      },
      {
        title: "You Keep the Code",
        description:
          "Your repository, your migrations, your documentation. Nothing here requires us to stay.",
      },
    ],
  },

  cta: {
    heading: "Let's Talk About Your Data",
    accent: "Data",
    body: "Tell us what you are building or what is slowing down in what you have. We will come back with an honest view of the effort involved and where we would start.",
  },
};
