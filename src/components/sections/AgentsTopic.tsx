import Image from "next/image";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AGENTS } from "@/data/agents";

export function AgentsTopic() {
  return (
    <section id="ai-agents" className="py-16 sm:py-20">
      {/* Wider than the usual container from xl up, so the two illustrations
          have room beside the cards instead of squeezing them. */}
      <div className="mx-auto w-full max-w-[1840px] px-5 sm:px-8">
        <SectionHeading
          align="center"
          eyebrow="01"
          title="AI Agents"
          description="AI assistants designed around your actual business processes."
        />

        <div className="mt-10 sm:mt-14 xl:grid xl:grid-cols-[1fr_minmax(0,960px)_1fr] xl:items-center xl:gap-6 3xl:grid-cols-[1fr_minmax(0,1320px)_1fr]">
          <Image
            src="/images/agents-person-left.png"
            alt=""
            width={311}
            height={648}
            className="hidden h-auto w-full max-w-[260px] justify-self-end xl:block"
          />

          {/* Flex rather than grid so an incomplete last row sits centred. */}
          <div className="flex flex-wrap justify-center gap-5 lg:gap-6">
            {AGENTS.map((agent, i) => (
              <div
                key={agent.name}
                style={{ ["--agent-accent" as string]: agent.accent }}
                className="card agent-card-hover w-full px-6 py-8 text-center sm:w-[calc(50%-10px)] sm:px-8 sm:py-10 lg:w-[calc(25%-18px)] xl:w-[calc((100%-48px)/3)] 3xl:w-[calc(25%-18px)]"
              >
                <p className="agent-label text-xs font-bold uppercase tracking-[0.25em] text-brand-orange">
                  Agent {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="agent-title font-display mt-3 text-xl font-bold text-heading sm:text-2xl">
                  {agent.name}
                </h3>
                <p className="mt-4 text-base leading-relaxed text-body sm:text-[17px]">{agent.description}</p>
              </div>
            ))}
          </div>

          <Image
            src="/images/agents-person-right.png"
            alt=""
            width={306}
            height={663}
            className="hidden h-auto w-full max-w-[260px] justify-self-start xl:block"
          />
        </div>
      </div>
    </section>
  );
}
