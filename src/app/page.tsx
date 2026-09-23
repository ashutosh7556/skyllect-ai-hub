import { Hero } from "@/components/sections/Hero";
import { AgentsTopic } from "@/components/sections/AgentsTopic";
import { SystemsIntegration } from "@/components/sections/SystemsIntegration";
import { WorkflowTopic } from "@/components/sections/WorkflowTopic";
import { ServicesAndIndustries } from "@/components/sections/ServicesAndIndustries";
import { WorkflowAssessment } from "@/components/sections/WorkflowAssessment";
import { FinalCta } from "@/components/sections/FinalCta";
import { Reveal } from "@/components/ui/Reveal";

// Sections alternate between white and the light blue band, and each fades
// in and out as it enters and leaves the viewport.
export default function Home() {
  return (
    <>
      <Reveal>
        <Hero />
      </Reveal>
      <Reveal>
        <AgentsTopic />
      </Reveal>
      <Reveal>
        <SystemsIntegration />
      </Reveal>
      <Reveal>
        <WorkflowTopic />
      </Reveal>
      <Reveal>
        <ServicesAndIndustries />
      </Reveal>
      <Reveal>
        <WorkflowAssessment />
      </Reveal>
      <Reveal>
        <FinalCta />
      </Reveal>
    </>
  );
}
