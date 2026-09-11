import type { TechnologyPageContent } from "@/types";

export const CLOUD: TechnologyPageContent = {
  slug: "cloud",
  navLabel: "Cloud Services",
  icon: "cloud",
  metaTitle: "Cloud Infrastructure Services — Skyllect",
  metaDescription:
    "Skyllect builds and runs the infrastructure behind AI systems: infrastructure as code, CI/CD, observability, cost control and security, on AWS, Azure or Google Cloud.",

  hero: {
    eyebrow: "Technologies",
    heading: "Infrastructure You Can Reason About",
    accent: "Reason",
    body: "AI workloads are spiky, expensive and stateful in awkward ways. The infrastructure underneath has to make cost visible, scale without drama, and let you answer what changed when something breaks at four in the morning.",
    image: "/images/cloud-technologies-front.jpg",
    imageAlt: "Cloud infrastructure and platform engineering at Skyllect",
  },

  capabilities: {
    heading: "Tailored and Scalable Cloud Services",
    accent: "Scalable",
    description:
      "From a first deployment pipeline to running the whole platform behind a product.",
    items: [
      {
        title: "Infrastructure as Code",
        description:
          "Environments defined in a repository rather than assembled by hand in a console.",
        points: [
          "Terraform or Pulumi modules you can read and review",
          "Identical staging and production definitions",
          "Changes proposed and approved like any other code",
          "Rebuilding an environment is a command, not a project",
        ],
      },
      {
        title: "CI/CD Pipelines",
        description:
          "Shipping that is boring, repeatable and fast enough to do several times a day.",
        points: [
          "Build, test and deploy on every merge",
          "Staged rollouts with automatic rollback",
          "Preview environments per pull request",
          "Secrets handled outside the repository",
        ],
      },
      {
        title: "Container Orchestration",
        description:
          "Running services reliably without over-engineering the platform.",
        points: [
          "Docker images built lean and reproducibly",
          "Kubernetes where the scale justifies it",
          "Managed runtimes where it does not",
          "Autoscaling tuned to real traffic shapes",
        ],
      },
      {
        title: "AI Workload Infrastructure",
        description:
          "The infrastructure specifics of running models and agents in production.",
        points: [
          "Queued inference so spikes do not drop requests",
          "Long-running jobs that survive a deployment",
          "Per-feature cost attribution and budget alerts",
          "Provider fallback when an upstream is degraded",
        ],
      },
      {
        title: "Observability",
        description:
          "Knowing what is happening before a customer tells you.",
        points: [
          "Structured logs, metrics and distributed tracing",
          "Dashboards for the things you actually act on",
          "Alerting on symptoms users feel, not on CPU",
          "Retention that supports an investigation",
        ],
      },
      {
        title: "Cost Engineering",
        description:
          "Making the bill explainable, then making it smaller.",
        points: [
          "Spend broken down by service and by feature",
          "Right-sizing based on measured usage",
          "Committed-use and storage tiering where it pays",
          "Budget alerts before the invoice, not after",
        ],
      },
      {
        title: "Security & Compliance",
        description:
          "Least privilege as the default rather than a later hardening exercise.",
        points: [
          "Scoped roles and short-lived credentials",
          "Network isolation and private service access",
          "Automated dependency and image scanning",
          "Audit logging retained to your obligations",
        ],
      },
      {
        title: "Migration & Modernisation",
        description:
          "Moving what you have without stopping the business to do it.",
        points: [
          "On-premise to cloud, or between providers",
          "Assessment of what should move and what should not",
          "Incremental cutover with a rehearsed rollback",
          "Handover documentation as standard",
        ],
      },
    ],
  },

  challenges: {
    heading: "Challenges in Modern Cloud Infrastructure",
    accent: "Challenges",
    description:
      "Cloud problems rarely announce themselves. They arrive as a bill, an outage, or an audit question nobody can answer.",
    items: [
      {
        title: "AI Costs That Arrive as a Surprise",
        body: "Inference spend does not scale with users in any intuitive way. Without attribution, the first signal that a feature is uneconomic is a monthly invoice several times larger than expected.",
        points: [
          "No breakdown of spend by feature or customer",
          "Retries and long contexts multiplying token cost invisibly",
          "Idle GPU capacity provisioned for a peak that rarely comes",
          "We attribute cost per feature and alert on budget, not on the invoice",
        ],
      },
      {
        title: "Infrastructure Nobody Can Reproduce",
        body: "The environment was built by hand over two years by people who have since left. It works, but nobody can recreate it, and nobody is willing to change it.",
        points: [
          "Console changes that exist in no repository",
          "Staging that differs from production in unknown ways",
          "Disaster recovery that has never been tested",
          "We codify what exists first, then change it safely",
        ],
      },
      {
        title: "Alerts That Nobody Reads",
        body: "A channel full of CPU warnings trains a team to ignore alerts entirely. When something genuinely breaks, the signal is buried in noise.",
        points: [
          "Alerting on resource metrics rather than user impact",
          "No ownership, so every alert is everyone's problem",
          "Dashboards built once and never opened again",
          "We alert on what users feel and delete the rest",
        ],
      },
    ],
  },

  stack: {
    heading: "The Cloud Stack We Build On",
    accent: "Stack",
    description:
      "Chosen for what a project needs, not for novelty. Everything here is something we run in production and can support.",
    items: [
      { slug: "gcp", label: "Google Cloud" },
      { slug: "docker" },
      { slug: "kubernetes" },
      { slug: "helm" },
      { slug: "terraform" },
      { slug: "pulumi" },
      { slug: "ansible" },
      { slug: "argo", label: "Argo CD" },
      { slug: "githubactions", label: "GitHub Actions" },
      { slug: "gitlab", label: "GitLab CI" },
      { slug: "jenkins" },
      { slug: "circleci" },
      { slug: "vercel" },
      { slug: "netlify" },
      { slug: "cloudflare" },
      { slug: "digitalocean" },
      { slug: "nginx" },
      { slug: "linux" },
      { slug: "prometheus" },
      { slug: "grafana" },
      { slug: "otel", label: "OpenTelemetry" },
      { slug: "sentry" },
      // AWS and Azure marks were withdrawn from simple-icons at the trademark
      // holders' request, so these render as monogram tiles.
      { label: "AWS" },
      { label: "Microsoft Azure" },
    ],
  },

  process: {
    heading: "Our Proven Cloud Process",
    accent: "Proven",
    description:
      "Six stages, each ending in something you can review. No long silences between kickoff and delivery.",
    steps: [
      {
        title: "Discovery & Audit",
        icon: "discovery",
        description:
          "We inventory what is running, what it costs and what is undocumented, then agree targets for availability, recovery time and spend.",
      },
      {
        title: "Architecture & Landing Zone",
        icon: "architecture",
        description:
          "Accounts, networking, identity and environment boundaries are designed up front, because these are the hardest things to change later.",
      },
      {
        title: "Prototype",
        icon: "prototype",
        description:
          "One service taken end to end through the new pipeline into a real environment, proving the approach before everything follows it.",
      },
      {
        title: "Build & Migrate",
        icon: "build",
        description:
          "Infrastructure codified and workloads moved incrementally, with both paths live during cutover and a rehearsed way back.",
      },
      {
        title: "Hardening",
        icon: "quality",
        description:
          "Permission review, failure injection, restore rehearsal and load testing — so recovery is something we have done rather than something we assume.",
      },
      {
        title: "Launch & Operate",
        icon: "launch",
        description:
          "Dashboards, alerting and cost reporting handed over with runbooks, so your team can operate it without us on call.",
      },
    ],
  },

  whyUs: {
    heading: "Why Teams Choose Skyllect for Cloud",
    accent: "Skyllect",
    description:
      "We are a software engineering team that works on AI, not an AI team learning to write software.",
    items: [
      {
        title: "We Build the Whole System",
        description:
          "The same team builds the applications running on it, so the platform is shaped around real workloads rather than a reference diagram.",
      },
      {
        title: "Everything Is in the Repository",
        description:
          "Infrastructure is code, reviewed like code. If it only exists because someone clicked something once, it is not finished.",
      },
      {
        title: "Cost Is a First-class Metric",
        description:
          "Spend is attributed per feature and alerted on, so an uneconomic AI feature is caught in week one rather than at the quarter.",
      },
      {
        title: "Recovery Is Rehearsed",
        description:
          "Backups get restored and failovers get exercised. An untested recovery plan is a hope, not a plan.",
      },
      {
        title: "Provider-neutral Advice",
        description:
          "We have no reseller margin on any cloud. The recommendation is based on your workload and your team's experience.",
      },
      {
        title: "You Keep the Keys",
        description:
          "Your accounts, your repositories, your runbooks. Nothing here requires us to stay.",
      },
    ],
  },

  cta: {
    heading: "Let's Talk About Your Infrastructure",
    accent: "Infrastructure",
    body: "Tell us what you are running or what is costing more than it should. We will come back with an honest view of the effort involved and where we would start.",
  },
};
