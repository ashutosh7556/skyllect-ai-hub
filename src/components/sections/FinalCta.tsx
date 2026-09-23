import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";

export function FinalCta() {
  return (
    <Section>
      {/* Set on its own soft gradient panel so the closing message stands apart. */}
      <div className="card-header-soft rounded-[2rem] border border-line px-6 py-14 text-center sm:px-12 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-display text-[clamp(1.5rem,1.1rem+1.8vw,2.75rem)] font-bold leading-[1.25] text-heading">
            The Future Isn&apos;t AI Replacing Your Business.
            <br />
            <span className="text-gradient">It&apos;s AI Working Inside Your Business.</span>
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-[15px] text-body sm:text-base">
            Let Skyllect help you identify where AI can save time, reduce manual work, and improve
            operational efficiency.
          </p>

          <div className="mt-8 flex justify-center">
            <Button href="#contact">Book an AI Workflow Consultation</Button>
          </div>

          <p className="mt-5 text-sm text-muted">
            No obligation. We&apos;ll start by understanding your business and identifying the
            workflows worth automating.
          </p>
        </div>
      </div>
    </Section>
  );
}
