"use client";

import { Children, useRef, type ReactNode } from "react";
import { usePinnedTimeline } from "@/hooks/usePinnedTimeline";
import { gsap } from "@/lib/gsap";
import { IntegrationPortal } from "@/components/animation/IntegrationPortal";
import { StageProgressProvider } from "@/components/animation/StageProgress";
import { cn } from "@/lib/utils";

/**
 * One screen, every topic.
 *
 * The topics used to be leaves of a book: each got its own sheet and the page
 * folded over to reach the next one. They now share a single pinned frame.
 * Every panel sits at exactly the same place, and scroll cross-fades from one
 * to the next — the reader stays put and the content changes around them.
 *
 * One gateway runs behind all of it. It is the stage's own animation, not a
 * per-topic decoration: it holds through every hand-over, and its modules
 * connect while the integrations topic is the one on screen.
 *
 * Panels are positioned every frame from a single scrubbed progress value,
 * rather than each owning a ScrollTrigger. With one writer there is nothing
 * to fall out of step, and scrubbing backwards unwinds exactly.
 */

/*
 * A topic holds the screen outright for most of its gap and only trades in
 * the last stretch of it. Two numbers, and both matter:
 *
 *   HOLD — how far, in panels, a topic stays fully opaque
 *   FADE — how far past that it takes to disappear
 *
 * HOLD + FADE has to exceed 0.5, or the midpoint between two topics falls
 * outside both windows and the stage goes blank for an instant. It also
 * wants to stay close to 0.5, because everything past it is scroll where two
 * headings are on screen at once. At 0.36 and 0.2 the crossing is brief and
 * both sides are faint through it — neither blank nor double-read.
 */
const HOLD = 0.38;
const FADE = 0.16;
/** How far a panel travels as it hands over, in px. */
const TRAVEL = 110;
/**
 * Viewports of scroll each topic gets.
 *
 * Slowing the animation by stretching the scroll was the wrong lever: past a
 * viewport per topic it stops reading as a calm animation and starts reading
 * as a page that will not move. One screen of wheel, one topic. The calm
 * comes from the eased values in the scene — every scroll-driven quantity in
 * the gateway is lerped at a few hundredths per frame, so even a hard flick
 * arrives smoothly.
 */
const VIEWPORTS_PER_TOPIC = 1;

export function TopicStage({ children }: { children: ReactNode }) {
  const panels = Children.toArray(children);
  const panelRefs = useRef<Array<HTMLDivElement | null>>([]);
  // What the gateway behind the panels is doing. A ref rather than state: the
  // scene reads it every frame and React has no business re-rendering for it.
  const portalState = useRef({ progress: 0, dock: 0, focus: 0 });
  // The same position, handed to the topics. A topic sitting on a pinned
  // stage cannot build a ScrollTrigger of its own — its element never moves —
  // so anything it wants to drive from scroll reads this instead.
  const atRef = useRef({ value: 0 });

  const steps = Math.max(panels.length - 1, 1);

  const { wrapperRef, pinRef, reduced, heightVh } = usePinnedTimeline(
    Math.round(panels.length * VIEWPORTS_PER_TOPIC),
    null,
    [panels.length],
    (progress) => {
      // Position along the run, in panels: panel i is centred at i.
      const at = progress * steps;
      atRef.current.value = at;

      panelRefs.current.forEach((panel, i) => {
        if (!panel) return;
        const distance = at - i;
        const away = (Math.abs(distance) - HOLD) / FADE;

        if (away >= 1) {
          // Far enough to be nothing. Taken out of the paint entirely rather
          // than left at zero opacity — thirteen invisible full-screen panels
          // is a lot of compositing for nothing.
          gsap.set(panel, { autoAlpha: 0, pointerEvents: "none" });
          return;
        }

        // Smoothstepped rather than linear, so a topic leaves and arrives
        // without a corner at either end of its fade.
        const eased = gsap.utils.clamp(0, 1, away);
        const presence = 1 - eased * eased * (3 - 2 * eased);
        gsap.set(panel, {
          autoAlpha: presence,
          // Outgoing rises and recedes, incoming comes up to meet it. Same
          // curve either side of centre, so a hand-over is symmetrical.
          // Only moves through the hand-over itself, so a topic sitting in
          // its own hold is perfectly still and centred.
          y: -Math.sign(distance) * eased * TRAVEL,
          scale: 1 - eased * 0.05,
          // Only the panel in focus can be clicked, or a link from the topic
          // being faded out would still be catching the pointer.
          pointerEvents: presence > 0.6 ? "auto" : "none",
        });
      });

      const state = portalState.current;
      state.progress = progress;
      // The modules connect across the first topic, and the whole rig fades
      // back once the reader has moved past it.
      state.dock = gsap.utils.clamp(0, 1, at);
      state.focus = gsap.utils.clamp(0, 1, 1 - Math.max(0, at - 0.6) / 1.4);
    },
  );

  if (reduced) {
    // No pin, no cross-fade: the topics are simply stacked and read in order.
    return (
      <div ref={wrapperRef} className="relative">
        {panels.map((panel, i) => (
          <div key={i} className="w-full">
            <StageProgressProvider value={{ atRef, index: i, reduced: true }}>
              {panel}
            </StageProgressProvider>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className="relative" style={{ height: `${heightVh}vh` }}>
      <div ref={pinRef} className="relative h-screen w-full overflow-hidden">
        {/* The one animation the whole stage shares. */}
        <IntegrationPortal stateRef={portalState} />

        {/*
         * The copy's own ground. The gate keeps to the right, but its outer
         * shells are wide enough to reach across at some sizes, and a hairline
         * crossing a heading is exactly the kind of thing that makes type hard
         * to read. This damps whatever is behind the left column without
         * touching the half the animation lives in.
         */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(4,6,11,0.97) 0%, rgba(4,6,11,0.95) 40%, rgba(4,6,11,0.8) 56%, rgba(4,6,11,0.4) 70%, rgba(4,6,11,0.08) 84%, rgba(4,6,11,0) 92%)",
          }}
        />

        {panels.map((panel, i) => (
          <div
            key={i}
            ref={(el) => {
              panelRefs.current[i] = el;
            }}
            className={cn(
              "absolute inset-0 flex items-center justify-center",
              // A shadow on every panel, so any hairline that does reach
              // across still passes behind the type rather than through it.
              "[text-shadow:0_1px_12px_rgba(4,6,11,0.95)]",
              // Only the first is visible before the first frame runs.
              i === 0 ? "opacity-100" : "opacity-0",
            )}
            style={{
              willChange: "transform, opacity",
              /*
               * Every panel sits at the same document position, so a jump to
               * #industries would otherwise land on the first one. Pulling
               * each panel's scroll margin back by its own index turns the
               * fragment into the scroll needed to reach that topic.
               */
              ["--stage-scroll-offset" as string]: `-${i * 100}vh`,
            }}
          >
            <div className="max-h-full w-full overflow-y-auto">
              <StageProgressProvider value={{ atRef, index: i, reduced: false }}>
                {panel}
              </StageProgressProvider>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
