import { SectionHeading } from "@/components/ui/SectionHeading";

const CAPABILITIES = [
  "AI Engineering",
  "Web Application Development",
  "API Development",
  "Database Engineering",
  "Cloud Infrastructure",
  "Business System Integration",
  "Automation",
  "SaaS Development",
];

export function WhySkyllect() {
  return (
    <section className="px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Why Skyllect"
          title="AI projects require more than prompts and chatbots."
          description="They require real software engineering. This allows us to build AI systems that work inside existing business operations — not isolated AI experiments."
        />

        <ul className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CAPABILITIES.map((capability) => (
            <li
              key={capability}
              className="rounded-2xl border border-white/10 p-5 text-center text-sm text-white/70"
            >
              {capability}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
