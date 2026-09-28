import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { WORKFLOW_STEPS } from "@/data/workflow";

// One line icon per step, in the same order as WORKFLOW_STEPS (24px grid).
const STEP_ICONS = [
  // Incoming email
  <><rect key="a" x="3" y="5" width="18" height="14" rx="2.5" /><path key="b" d="m4 7 8 6 8-6" /></>,
  // AI understands the request
  <path key="a" d="M12 3.5 13.8 8.2 18.5 10l-4.7 1.8L12 16.5l-1.8-4.7L5.5 10l4.7-1.8L12 3.5ZM18.5 16l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8.8-2Z" />,
  // Extracting information
  <><path key="a" d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" /><path key="b" d="M14 3v5h5M9 13h6M9 17h4" /></>,
  // Checking business systems
  <><ellipse key="a" cx="10" cy="6" rx="6" ry="2.5" /><path key="b" d="M4 6v5c0 1.4 2.7 2.5 6 2.5M4 11v5c0 1.4 2.7 2.5 6 2.5" /><circle key="c" cx="17" cy="16" r="3" /><path key="d" d="m19.2 18.2 1.8 1.8" /></>,
  // Preparing a recommendation
  <path key="a" d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3Z" />,
  // Requesting approval
  <path key="a" d="M12 3 5 6v5c0 4.5 3 8.4 7 10 4-1.6 7-5.5 7-10V6l-7-3ZM9 12l2 2 4-4" />,
  // Updating CRM & ERP
  <path key="a" d="M20 12a8 8 0 0 1-14 5.3M4 12a8 8 0 0 1 14-5.3M18 3v3.7h-3.7M6 21v-3.7h3.7" />,
  // Sending the response
  <path key="a" d="m21 3-9.5 9.5M21 3l-6.5 18-3-8.5-8.5-3L21 3Z" />,
  // Creating a follow-up
  <><rect key="a" x="3.5" y="5" width="17" height="15.5" rx="2.5" /><path key="b" d="M3.5 10h17M8 3v4M16 3v4M9 15l2 2 4-4" /></>,
];

const COLUMNS = 3;

// A looping flight path across the top of the section, in a 1440-wide
// coordinate space. It starts and ends just off-canvas so the plane glides in
// from the left edge and out past the right.
const FLIGHT_PATH =
  "M -40 150 C 100 168, 200 172, 250 150 C 290 132, 285 100, 258 102 C 232 104, 236 142, 275 152 " +
  "C 430 190, 610 118, 770 100 C 910 85, 1010 132, 1130 112 C 1230 96, 1285 62, 1330 44 " +
  "C 1375 28, 1402 70, 1382 82 C 1362 94, 1348 66, 1372 60 C 1405 52, 1440 92, 1500 104";

/**
 * Decorative dashed flight path with a paper plane gliding along it, kept
 * within the top of this section. Uses SVG's own animateMotion, so
 * it follows the curve, turns with it and scales with the viewBox — the
 * site-wide CSS animation freeze does not apply to it.
 */
function PaperPlaneFlight() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 220"
      preserveAspectRatio="xMidYMid slice"
      className="pointer-events-none absolute inset-x-0 top-0 h-[160px] w-full sm:h-[200px]"
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

      {/* Extra room on top so the flight path runs above the heading. */}
      <div className="relative pt-16 sm:pt-20">
        <SectionHeading
          align="center"
          title="AI Workflow Automation"
          description="Replace repetitive manual processes with intelligent workflows."
        />

        {/* Icon, step number and name per card, in order. */}
        <ol className="mt-10 grid gap-4 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {WORKFLOW_STEPS.map((step, i) => {
            return (
              <li key={step}>
                <Reveal delay={`${(i % COLUMNS) * 0.08}s`} className="h-full">
                  <div className="card flex h-full items-center gap-4 p-5 transition duration-200 hover:border-brand-blue motion-reduce:transition-none">
                    <span className="card-header-strong flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white">
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        className="h-[22px] w-[22px]"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.8}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        {STEP_ICONS[i]}
                      </svg>
                    </span>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-orange">
                        Step {String(i + 1).padStart(2, "0")}
                      </p>
                      <p className="mt-1 text-base font-semibold text-heading sm:text-[17px]">{step}</p>
                    </div>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </div>
    </Section>
  );
}
