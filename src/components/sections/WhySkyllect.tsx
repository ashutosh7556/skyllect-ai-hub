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
    <section className="w-full px-5 py-14 sm:px-6 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Why Skyllect"
          title="AI projects require more than prompts and chatbots."
          description="They require real software engineering. This allows us to build AI systems that work inside existing business operations — not isolated AI experiments."
        />

        <ul className="mt-6 grid grid-cols-2 gap-2 sm:mt-16 sm:gap-4 lg:grid-cols-4">
          {CAPABILITIES.map((capability) => (
            <li
              key={capability}
              className="rounded-xl border border-white/10 p-3 text-center text-xs text-white/70 sm:rounded-2xl sm:p-5 sm:text-sm"
            >
              {capability}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
