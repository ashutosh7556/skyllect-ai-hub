"use client";

import { Children, useMemo, useRef, type ReactNode } from "react";
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
 * How much scroll a hand-over takes, in viewports.
 *
 * Each topic owns a window, and the fade is centred on the boundary between
 * two windows: half of it belongs to the topic leaving and half to the one
 * arriving. That is what keeps the two sides summing to one all the way
 * across — neither a blank frame in the middle nor a long stretch with two
 * headings on screen at once.
 *
 * Centring it on the boundary is also what makes windows of different widths
 * work. The old version measured a fixed hold outward from each panel's
 * centre, which silently assumed every panel was the same width; a topic
 * asking for ten viewports would have faded out after the first.
 */
const FADE = 0.34;
/** How far a panel travels as it hands over, in px. */
const TRAVEL = 110;
/**
 * Viewports of scroll a topic gets unless it asks for more.
 *
 * Slowing the animation by stretching the scroll is the wrong lever for a
 * topic that is just copy: past a viewport it stops reading as a calm
 * animation and starts reading as a page that will not move. One screen of
 * wheel, one topic.
 *
 * A topic that runs a sequence rather than a reveal is the exception, and
 * says so through `dwell`.
 */
const VIEWPORTS_PER_TOPIC = 1;

interface TopicStageProps {
  children: ReactNode;
  /**
   * Viewports for particular panels, by index. Anything not named here gets
   * one. Used by the integrations topic, which releases ten cards one at a
   * time and needs a screen of scroll for each rather than a screen in total.
   */
  dwell?: Record<number, number>;
}

export function TopicStage({ children, dwell }: TopicStageProps) {
  const panels = Children.toArray(children);
  const panelRefs = useRef<Array<HTMLDivElement | null>>([]);
  // What the gateway behind the panels is doing. A ref rather than state: the
  // scene reads it every frame and React has no business re-rendering for it.
  const portalState = useRef({ progress: 0, dock: 0, focus: 0 });
  // The same position, handed to the topics. A topic sitting on a pinned
  // stage cannot build a ScrollTrigger of its own — its element never moves —
  // so anything it wants to drive from scroll reads this instead.
  const atRef = useRef({ value: 0 });

  /*
   * Each topic's window, in viewports: where it starts and how wide it is.
   * Widths are one apiece unless the topic asked for more, and the run is as
   * long as they add up to.
   */
  const windows = useMemo(() => {
    const result: Array<{ start: number; span: number }> = [];
    for (let i = 0; i < panels.length; i++) {
      const span = Math.max(dwell?.[i] ?? VIEWPORTS_PER_TOPIC, 0.25);
      const previous = result[i - 1];
      result.push({ start: previous ? previous.start + previous.span : 0, span });
    }
    return result;
    // Panels are re-derived from children on every render, so their identity
    // is not a useful dependency; their count and the dwell map are.
  }, [panels.length, dwell]);

  const total = windows.reduce((sum, w) => sum + w.span, 0);

  const { wrapperRef, pinRef, reduced, heightVh } = usePinnedTimeline(
    Math.round(total),
    null,
    [total],
    (progress) => {
      // Position along the run, in viewports.
      const at = progress * total;
      atRef.current.value = at;

      panelRefs.current.forEach((panel, i) => {
        if (!panel) return;
        const window = windows[i];
        if (!window) return;

        const centre = window.start + window.span / 2;
        /*
         * Distance from this topic's centre — except at the two ends of the
         * whole run, where there is nothing to hand over to. The first topic
         * is already on screen before any scrolling has happened and the last
         * is still there after it stops, so neither should be fading against
         * a neighbour that does not exist. Without this the stage opened
         * half-transparent and only reached full once the reader had scrolled
         * into the middle of the first topic.
         */
        const isFirst = i === 0;
        const isLast = i === panelRefs.current.length - 1;
        const raw = at - centre;
        const distance =
          (isFirst && raw < 0) || (isLast && raw > 0) ? 0 : raw;
        /*
         * Distance past the point where this topic starts giving way, as a
         * fraction of the hand-over. Measured from its own window's edge, so
         * a wide topic holds the screen for as long as it asked for and the
         * fade is the same length either way.
         */
        const away = (Math.abs(distance) - (window.span / 2 - FADE / 2)) / FADE;

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
      /*
       * The modules berth across the first viewport, and the gate stays at
       * full strength for as long as the integrations topic holds the screen
       * — it is releasing a card per screen for all of it, so it cannot fade
       * back after the first one the way it did when the topic was a single
       * panel. It lets go once that window is behind the reader.
       */
      const gateWindow = windows[0] ?? { start: 0, span: 1 };
      state.dock = gsap.utils.clamp(0, 1, at);
      state.focus = gsap.utils.clamp(
        0,
        1,
        1 - Math.max(0, at - (gateWindow.start + gateWindow.span)) / 1.4,
      );
    },
  );

  if (reduced) {
    // No pin, no cross-fade: the topics are simply stacked and read in order.
    return (
      <div ref={wrapperRef} className="relative">
        {panels.map((panel, i) => (
          <div key={i} className="w-full">
            <StageProgressProvider
              value={{
                atRef,
                index: i,
                start: windows[i]?.start ?? 0,
                span: windows[i]?.span ?? 1,
                reduced: true,
              }}
            >
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
              ["--stage-scroll-offset" as string]: `-${(windows[i]?.start ?? i) * 100}vh`,
            }}
          >
            {/*
             * Clipped, not scrollable.
             *
             * This was `overflow-y-auto`, which makes the element a scroll
             * container — and because `overflow-x` was left visible, the
             * cascade computes it to `auto` as well, so it scrolled in both
             * directions. A transformed element contributes its *transformed*
             * box to an ancestor's scrollable area, so the integrations cards
             * flying out to the gate pushed this box's scroll area hundreds of
             * pixels wide and tall: a scrollbar appeared over the page and the
             * whole topic could be dragged sideways.
             *
             * The panel is already exactly the pinned viewport, and the pin
             * itself clips, so clipping here as well costs nothing visible —
             * a card can still travel the full width of the screen — and it
             * leaves no scroll area for anything to escape into.
             */}
            <div className="max-h-full w-full overflow-hidden">
              <StageProgressProvider
                value={{
                  atRef,
                  index: i,
                  start: windows[i]?.start ?? 0,
                  span: windows[i]?.span ?? 1,
                  reduced: false,
                }}
              >
                {panel}
              </StageProgressProvider>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
