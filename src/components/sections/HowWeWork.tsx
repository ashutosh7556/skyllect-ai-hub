import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { PROCESS_STEPS } from "@/data/process";

// A leaf only shows a taste of each list — the rest lives behind View More.
const PREVIEW_COUNT = 3;

export function HowWeWork() {
  return (
    <section className="w-full px-5 py-8 sm:px-8 sm:py-10">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="How we work" title="From First Workflow to Full Scale" />

        {/* Laid out as a grid rather than one tall column so the six steps fit
            a single page in the stack. */}
        <ol className="mt-5 grid gap-x-10 gap-y-3 sm:mt-10 sm:grid-cols-2 sm:gap-y-6 lg:grid-cols-3">
          {PROCESS_STEPS.slice(0, PREVIEW_COUNT).map((step) => (
            <li
              key={step.index}
              className="flex gap-3 border-t border-white/10 pt-3 sm:gap-4 sm:pt-5"
            >
              <span className="font-mono text-xs text-white/30 sm:text-sm">
                {String(step.index).padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-sm font-medium text-white sm:text-lg">{step.title}</h3>
                <p className="mt-1 text-xs text-white/50 sm:mt-1.5 sm:text-sm">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <Button href="" variant="secondary" className="mt-5 sm:mt-8">
          View More
        </Button>
      </div>
    </section>
  );
}
