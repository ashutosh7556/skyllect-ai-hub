import { TopicStage } from "@/components/animation/TopicStage";
import { Hero } from "@/components/sections/Hero";
import { AgentsTopic } from "@/components/sections/AgentsTopic";
import { SystemsIntegration } from "@/components/sections/SystemsIntegration";
import { WorkflowTopic } from "@/components/sections/WorkflowTopic";
import { Integrations } from "@/components/sections/Integrations";
import { SaasDevelopment } from "@/components/sections/SaasDevelopment";
import { Modernization } from "@/components/sections/Modernization";
import { Industries } from "@/components/sections/Industries";
import { OneAiLayer } from "@/components/sections/OneAiLayer";
import { HumanControlledAi } from "@/components/sections/HumanControlledAi";
import { WorkflowAssessment } from "@/components/sections/WorkflowAssessment";
import { HowWeWork } from "@/components/sections/HowWeWork";
import { StartSmall } from "@/components/sections/StartSmall";
import { WhySkyllect } from "@/components/sections/WhySkyllect";
import { FinalCta } from "@/components/sections/FinalCta";

export default function Home() {
  return (
    <>
      <Hero />
      <AgentsTopic />
      <SystemsIntegration />
      <WorkflowTopic />
      {/*
        From here every remaining topic shares one screen. The stage pins
        once, holds a single gateway behind all of them, and hands over from
        one topic to the next in place as the scroll continues — rather than
        giving each its own section to scroll past.
      */}
      <TopicStage>
        <Integrations />
        <SaasDevelopment />
        <Modernization />
        <Industries slug="logistics" showHeading />
        <Industries slug="distribution" />
        <Industries slug="manufacturing" />
        <OneAiLayer />
        <HumanControlledAi />
        <WorkflowAssessment />
        <HowWeWork />
        <StartSmall />
        <WhySkyllect />
        <FinalCta />
      </TopicStage>
    </>
  );
}
