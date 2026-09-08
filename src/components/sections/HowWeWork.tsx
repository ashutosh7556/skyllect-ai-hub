import { SectionHeading } from "@/components/ui/SectionHeading";
import { PROCESS_STEPS } from "@/data/process";

export function HowWeWork() {
  return (
    <section className="w-full px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="How we work" title="From First Workflow to Full Scale" />

        {/* Laid out as a grid rather than one tall column so the six steps fit
            a single page in the stack. */}
        <ol className="mt-10 grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
          {PROCESS_STEPS.map((step) => (
            <li key={step.index} className="flex gap-4 border-t border-white/10 pt-5">
              <span className="font-mono text-sm text-white/30">
                {String(step.index).padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-lg font-medium text-white">{step.title}</h3>
                <p className="mt-1.5 text-sm text-white/50">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
