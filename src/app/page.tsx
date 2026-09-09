import { BookStack } from "@/components/animation/BookStack";
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
      {/* From here the page becomes a stack: each section is a full screen
          that tips away as the next one slides over it. */}
      <BookStack>
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
      </BookStack>
    </>
  );
}
