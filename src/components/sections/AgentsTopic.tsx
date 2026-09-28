import Image from "next/image";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AGENTS } from "@/data/agents";
import { Reveal } from "@/components/ui/Reveal";

export function AgentsTopic() {
  return (
    <section id="ai-agents" className="py-16 sm:py-20">
      {/* Wider than the usual container from xl up, so the two illustrations
          have room beside the cards instead of squeezing them. */}
      <div className="mx-auto w-full max-w-[1840px] px-5 sm:px-8">
        <SectionHeading
          align="center"
          title="AI Automation for Your Business"
          description="Smart digital assistants that take care of everyday tasks for your team — around the clock."
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
              // Each card reveals on its own as it scrolls into view, staggered
              // across the row, so they animate when you actually reach them.
              <Reveal
                key={agent.name}
                delay={`${(i % 4) * 0.08}s`}
                className="flex w-full sm:w-[calc(50%-10px)] lg:w-[calc(25%-18px)] xl:w-[calc((100%-48px)/3)] 3xl:w-[calc(25%-18px)]"
              >
                <div
                  style={{ ["--agent-accent" as string]: agent.accent }}
                  className="card agent-card-hover w-full px-6 py-8 text-center sm:px-8 sm:py-10"
                >
                  <p className="agent-label text-xs font-bold uppercase tracking-[0.25em] text-brand-orange">
                    {agent.topic}
                  </p>
                  <h3 className="agent-title font-display mt-3 text-xl font-bold text-heading sm:text-2xl">
                    {agent.name}
                  </h3>
                  <p className="mt-4 text-base leading-relaxed text-body sm:text-[17px]">{agent.description}</p>
                </div>
              </Reveal>
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
