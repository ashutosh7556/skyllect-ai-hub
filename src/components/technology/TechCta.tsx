import { Button } from "@/components/ui/Button";
import { AccentHeading } from "@/components/technology/SectionShell";
import type { TechnologyPageContent } from "@/types";

/** Closing call to action. */
export function TechCta({ content }: { content: TechnologyPageContent }) {
  const { cta } = content;

  return (
    <section className="py-16 sm:py-24">
      <div className="container-site">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-display text-[clamp(1.5rem,1.1rem+1.8vw,2.75rem)] font-bold leading-[1.25] text-heading">
            <AccentHeading text={cta.heading} accent={cta.accent} />
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-body sm:text-base">
            {cta.body}
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Button href="/#contact">Book a Technical Consultation</Button>
            <Button href="/" variant="secondary">
              Explore Skyllect
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
