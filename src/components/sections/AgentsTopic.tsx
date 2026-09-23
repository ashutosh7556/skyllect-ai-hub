import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AGENTS } from "@/data/agents";

export function AgentsTopic() {
  return (
    <Section id="ai-agents">
      <SectionHeading
        align="center"
        eyebrow="01"
        title="AI Agents"
        description="AI assistants designed around your actual business processes."
      />

      {/* Flex rather than grid so an incomplete last row sits centred. */}
      <div className="mt-10 flex flex-wrap justify-center gap-5 sm:mt-14 lg:gap-6">
        {AGENTS.map((agent, i) => (
          <div
            key={agent.name}
            className="card w-full p-6 text-center sm:w-[calc(50%-10px)] sm:p-7 lg:w-[calc(25%-18px)]"
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-brand-orange">
              Agent {String(i + 1).padStart(2, "0")}
            </p>
            <h3 className="font-display mt-3 text-lg font-bold text-heading sm:text-xl">
              {agent.name}
            </h3>
            <p className="mt-3 text-[15px] leading-relaxed text-body">{agent.description}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
