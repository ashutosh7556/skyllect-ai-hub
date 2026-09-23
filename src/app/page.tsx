import { Hero } from "@/components/sections/Hero";
import { AgentsTopic } from "@/components/sections/AgentsTopic";
import { SystemsIntegration } from "@/components/sections/SystemsIntegration";
import { WorkflowTopic } from "@/components/sections/WorkflowTopic";
import { ServicesAndIndustries } from "@/components/sections/ServicesAndIndustries";
import { WorkflowAssessment } from "@/components/sections/WorkflowAssessment";
import { FinalCta } from "@/components/sections/FinalCta";

// Sections alternate between white and the light blue band.
export default function Home() {
  return (
    <>
      <Hero />
      <AgentsTopic />
      <SystemsIntegration />
      <WorkflowTopic />
      <ServicesAndIndustries />
      <WorkflowAssessment />
      <FinalCta />
    </>
  );
}
