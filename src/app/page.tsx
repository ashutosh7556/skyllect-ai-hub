import { TopicStage } from "@/components/animation/TopicStage";
import { Hero } from "@/components/sections/Hero";
import { AgentsTopic } from "@/components/sections/AgentsTopic";
import { SystemsIntegration } from "@/components/sections/SystemsIntegration";
import { WorkflowTopic } from "@/components/sections/WorkflowTopic";
import { Integrations } from "@/components/sections/Integrations";
import { INTEGRATIONS } from "@/data/integrations";

export default function Home() {
  return (
    <>
      <Hero />
      <AgentsTopic />
      <SystemsIntegration />
      <WorkflowTopic />
      {/*
        The stage pins once and holds the gateway behind whatever is on it.
        It carried every remaining topic; for now it carries only the
        integrations run, which releases one card per integration off the gate
        and so takes a screen of scroll for each.

        The topics that used to follow — SaaS, Modernization, the three
        Industries panels, One AI Layer, Human-Controlled AI, the assessment,
        How We Work, Start Small, Why Skyllect and the closing call to action
        — are still in `components/sections`, untouched. Putting them back is
        a matter of listing them here again.
      */}
      <TopicStage dwell={{ 0: INTEGRATIONS.length }}>
        <Integrations />
      </TopicStage>
    </>
  );
}
