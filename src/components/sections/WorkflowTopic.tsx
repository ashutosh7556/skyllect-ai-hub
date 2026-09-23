import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WORKFLOW_STEPS } from "@/data/workflow";

// A looping flight path across the top of the section, in a 1440-wide
// coordinate space. It starts and ends just off-canvas so the plane glides in
// from the left edge and out past the right.
const FLIGHT_PATH =
  "M -40 150 C 100 168, 200 172, 250 150 C 290 132, 285 100, 258 102 C 232 104, 236 142, 275 152 " +
  "C 430 190, 610 118, 770 100 C 910 85, 1010 132, 1130 112 C 1230 96, 1285 62, 1330 44 " +
  "C 1375 28, 1402 70, 1382 82 C 1362 94, 1348 66, 1372 60 C 1405 52, 1440 92, 1500 104";

/**
 * Decorative dashed flight path with a paper plane gliding along it, lifted to
 * run along the seam with the section above. Uses SVG's own animateMotion, so
 * it follows the curve, turns with it and scales with the viewBox — the
 * site-wide CSS animation freeze does not apply to it.
 */
function PaperPlaneFlight() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 220"
      preserveAspectRatio="xMidYMid slice"
      className="pointer-events-none absolute inset-x-0 -top-[45px] h-[180px] w-full sm:-top-[60px] sm:h-[220px]"
    >
      <path
        id="workflow-flight-path"
        d={FLIGHT_PATH}
        fill="none"
        stroke="#ff7a1a"
        strokeOpacity={0.45}
        strokeWidth={2}
        strokeDasharray="7 9"
        strokeLinecap="round"
      />

      <g className="paper-plane">
        {/* Speed lines trailing behind the plane. */}
        <path d="M -30 -4 H -48 M -28 3 H -42" stroke="#ff7a1a" strokeOpacity={0.5} strokeWidth={2} strokeLinecap="round" />
        {/* The plane, drawn nose-first along +x so it faces its direction of travel. */}
        <polygon points="-20,-12 22,0 -4,3" fill="#ff8a33" />
        <polygon points="-4,3 22,0 -8,14" fill="#f06a10" />
        <polygon points="-4,3 -1,10 -8,14" fill="#c9540a" />

        <animateMotion dur="11s" repeatCount="indefinite" rotate="auto" calcMode="linear">
          <mpath href="#workflow-flight-path" />
        </animateMotion>
        {/* Fades in off the left edge and out past the right, so the loop
            restarts without a visible jump. */}
        <animate
          attributeName="opacity"
          dur="11s"
          repeatCount="indefinite"
          values="0;1;1;0"
          keyTimes="0;0.06;0.92;1"
        />
      </g>
    </svg>
  );
}

export function WorkflowTopic() {
  return (
    <Section id="automation" className="relative">
      <PaperPlaneFlight />

      <div className="relative">
        <SectionHeading
          align="center"
          eyebrow="02"
          title="AI Workflow Automation"
          description="Replace repetitive manual processes with intelligent workflows."
        />

        <ol className="mt-10 grid gap-4 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {WORKFLOW_STEPS.map((step, i) => (
            <li key={step} className="card flex items-center gap-4 p-5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-peach text-sm font-bold text-brand-orange">
                {i + 1}
              </span>
              <span className="text-base font-bold text-heading">{step}</span>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
