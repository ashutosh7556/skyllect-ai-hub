import type { CaseStudyContent } from "@/types";

/**
 * Case studies. Written from the briefs for each product rather than from
 * scraped copy — kwot.com renders client-side and jobtalk.ai refuses
 * automated requests, so nothing here is lifted from their sites.
 *
 * Outcomes are deliberately qualitative. These are real named clients and we
 * do not publish figures we have not been given.
 */
export const CASE_STUDIES: CaseStudyContent[] = [
  {
    slug: "kwot-music",
    name: "Kwot Music",
    tagline: "Streaming built around African music and the people making it",
    metaTitle: "Kwot Music — Case Study | Skyllect",
    metaDescription:
      "A streaming platform for African music, podcasts, video and radio, built around content discovery, playlists, and a creator ecosystem serving a global audience.",
    logo: "/images/kwot.png",
    logoAlt: "Kwot",
    siteUrl: "https://content.kwot.com/",
    summary:
      "Kwot is a streaming platform for African music, podcasts, video and radio. The hard part was never playback — it was discovery. Getting a listener in another country to the right track, show or station, and giving the creators behind them somewhere to grow an audience.",
    facts: [
      { label: "Sector", value: "Media & streaming" },
      { label: "Surface", value: "Web and mobile" },
      { label: "Audience", value: "Global, Africa-first" },
      { label: "Focus", value: "Discovery and creators" },
    ],
    challenge: {
      heading: "Catalogue is easy. Being found is not.",
      accent: "found",
      body: [
        "A streaming catalogue is only as good as the path a listener takes into it. Four content types — music, podcasts, video and radio — each behave differently, and a single browse experience has to make all of them feel like one product rather than four apps bolted together.",
        "The second problem is the supply side. Creators will not keep uploading to a platform that gives them no sense of who is listening or how to reach further, so the tooling behind the catalogue matters as much as the catalogue itself.",
      ],
    },
    delivered: {
      heading: "What we built",
      accent: "built",
      items: [
        {
          title: "Unified Discovery",
          description:
            "One browse and search experience spanning music, podcasts, video and radio, so a listener moves between formats without changing mental model.",
        },
        {
          title: "Playlists and Curation",
          description:
            "Listener-built and editorially curated playlists, with the surfacing rules that decide what a given listener sees first.",
        },
        {
          title: "Creator Ecosystem",
          description:
            "Upload, catalogue management and audience visibility for the artists, podcasters and stations publishing to the platform.",
        },
        {
          title: "Streaming at Distance",
          description:
            "Playback tuned for listeners far from the origin, where bandwidth is uneven and a stall costs the session.",
        },
      ],
    },
    stack: ["React", "Next.js", "TypeScript", "Node.js", "PostgreSQL", "Media CDN", "Cloud storage"],
    outcomes: [
      "Four content types presented through one coherent discovery surface",
      "Creators can publish and manage their own catalogue without a gatekeeper",
      "Playback holds up for a global audience, not only local listeners",
    ],
  },

  {
    slug: "jobtalk-ai",
    name: "JobTalk AI",
    tagline: "Voice-first screening that moves candidates instead of queueing them",
    metaTitle: "JobTalk AI — Case Study | Skyllect",
    metaDescription:
      "An AI recruiting platform with voice-first candidate screening, engagement, scheduling, ATS and HRIS integrations, and analytics across the recruiting workflow.",
    logo: "/images/jobtalk.avif",
    logoAlt: "JobTalk AI",
    siteUrl: "https://www.jobtalk.ai/",
    summary:
      "JobTalk AI screens candidates by voice. The bottleneck in hiring is rarely the decision — it is the days spent arranging and running first-round calls. JobTalk runs that round conversationally, then pushes structured results back into the systems recruiters already work in.",
    facts: [
      { label: "Sector", value: "Recruiting technology" },
      { label: "Surface", value: "Voice and web" },
      { label: "Users", value: "Recruiters and candidates" },
      { label: "Focus", value: "Screening and workflow" },
    ],
    challenge: {
      heading: "The first round is where hiring stalls",
      accent: "stalls",
      body: [
        "Early-stage screening is high volume and low variance. The same questions get asked hundreds of times, calls are hard to schedule across time zones, and strong candidates go cold while waiting for a slot.",
        "Automating it is not simply a matter of a chatbot. A screening conversation has to feel like a conversation, has to be consistent enough to compare candidates fairly, and has to land in the ATS as structured data rather than a transcript nobody reads.",
      ],
    },
    delivered: {
      heading: "What we built",
      accent: "built",
      items: [
        {
          title: "Voice-First Screening",
          description:
            "A spoken first-round interview candidates can take when it suits them, asking a consistent set of questions per role.",
        },
        {
          title: "Candidate Engagement",
          description:
            "Follow-up and status communication that keeps candidates warm through the gap between applying and hearing back.",
        },
        {
          title: "Scheduling",
          description:
            "Availability matching and booking for the rounds that do need a human, without the back-and-forth email thread.",
        },
        {
          title: "ATS and HRIS Integration",
          description:
            "Results written back as structured fields into the systems of record, so screening output is usable rather than archived.",
        },
        {
          title: "Recruiter Analytics",
          description:
            "Funnel, pipeline and outcome reporting across roles, so the process itself can be measured and adjusted.",
        },
      ],
    },
    stack: [
      "Next.js",
      "TypeScript",
      "Node.js",
      "Speech processing",
      "PostgreSQL",
      "ATS/HRIS APIs",
      "Cloud infrastructure",
    ],
    outcomes: [
      "First-round screening runs without a recruiter present on the call",
      "Every candidate answers the same questions, making comparison fair",
      "Screening results land in the ATS as structured data, not transcripts",
    ],
  },
];

export function getCaseStudy(slug: string) {
  return CASE_STUDIES.find((study) => study.slug === slug);
}
