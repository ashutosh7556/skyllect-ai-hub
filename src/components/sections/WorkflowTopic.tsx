"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { usePinnedTimeline } from "@/hooks/usePinnedTimeline";
import { WorkflowPipeline } from "@/components/animation/WorkflowPipeline";
import { WORKFLOW_STAGES, WORKFLOW_STEPS } from "@/data/workflow";
import { cn } from "@/lib/utils";

const TOTAL_UNITS = 6;

/**
 * One request running end to end through the machine.
 *
 * The section is a pinned screen: the pipeline holds still while the scroll
 * drives it, so the whole run reads as a single continuous process rather
 * than as a series of things passing the window.
 *
 * Progress is handed to the 3D scene through a ref rather than through state.
 * The scene reads it every frame, and pushing sixty values a second into
 * React would re-render the section for no visible gain; the only thing that
 * does go through state is which of the four stages is current, which changes
 * a handful of times across the entire section.
 */
export function WorkflowTopic() {
  const progressRef = useRef({ value: 0 });
  const frameRef = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState(0);

  const { wrapperRef, pinRef, reduced, heightVh } = usePinnedTimeline(
    TOTAL_UNITS,
    (timeline) => {
      const frame = frameRef.current;
      if (!frame) return;

      /*
       * The camera move over the run.
       *
       * The pipeline holds the screen for six viewports of scroll, and the
       * scene's own motion is all local — links drawing, packets running. On
       * its own that leaves the diagram itself pinned to one spot for a very
       * long passage. This rides it slowly down the frame across the whole
       * section, so there is always something carrying the eye between one
       * stage lighting up and the next.
       *
       * Translation only, deliberately. The scene sizes its renderer and
       * projects its labels from this element's measured box, and a scale on
       * an ancestor would feed a transformed rectangle back into both — the
       * labels would drift off their nodes on the next resize. A translate
       * moves the box without changing its dimensions, so the scene is never
       * any the wiser.
       */
      timeline.fromTo(
        frame,
        { y: 34 },
        { y: -34, duration: TOTAL_UNITS, ease: "none" },
        0,
      );
    },
    [],
    (progress) => {
      progressRef.current.value = progress;
      // Four equal beats. Kept off the render path unless it actually moves.
      const next = Math.min(
        WORKFLOW_STAGES.length - 1,
        Math.floor(progress * WORKFLOW_STAGES.length),
      );
      setStage((current) => (current === next ? current : next));
    },
  );

  useGSAP(
    () => {
      if (reduced) return;

      gsap.from("[data-wf-head] > *", {
        autoAlpha: 0,
        y: 18,
        duration: 1.3,
        ease: "power3.out",
        stagger: 0.16,
        scrollTrigger: { trigger: wrapperRef.current, start: "top 65%", once: true },
      });

      gsap.from("[data-wf-run]", {
        autoAlpha: 0,
        y: 16,
        duration: 1.3,
        ease: "power3.out",
        scrollTrigger: { trigger: wrapperRef.current, start: "top 45%", once: true },
      });

      /*
       * Data on the run between beats.
       *
       * The connectors already fill as each beat is passed; this is what
       * moves along them afterwards. Each dot is its own slow timeline with
       * its own offset, so the four runs are never in step — a pipeline
       * carrying traffic rather than a progress bar with decoration.
       *
       * Whether a run is carrying at all is left to the class on its wrapper,
       * which React updates with the stage. Keeping that out of GSAP's hands
       * means these timelines are built once and never torn down and rebuilt
       * as the reader scrolls.
       */
      gsap.utils.toArray<HTMLElement>("[data-run-dot]").forEach((dot, i) => {
        gsap
          .timeline({ repeat: -1, repeatDelay: 1.3, delay: i * 0.7 })
          .set(dot, { left: "0%", opacity: 0 })
          .to(dot, { left: "100%", duration: 2.8, ease: "none" }, 0)
          .to(dot, { opacity: 1, duration: 0.45 }, 0)
          .to(dot, { opacity: 0, duration: 0.5 }, 2.3);
      });
    },
    { scope: wrapperRef, dependencies: [reduced] },
  );

  /*
   * Each beat announcing itself. One ring off the marker as the run reaches
   * it — the arrival, which the held state of the marker cannot show.
   */
  useEffect(() => {
    if (reduced) return;
    const ping = pinRef.current?.querySelectorAll<HTMLElement>("[data-ping]")[stage];
    if (!ping) return;

    const tween = gsap.fromTo(
      ping,
      { scale: 0.5, opacity: 0.7 },
      { scale: 3.4, opacity: 0, duration: 1.6, ease: "power2.out" },
    );
    return () => {
      tween.kill();
    };
  }, [stage, reduced, pinRef]);

  return (
    <div
      id="automation"
      ref={wrapperRef}
      className="relative"
      style={reduced ? undefined : { height: `${heightVh}vh` }}
    >
      <div
        ref={pinRef}
        className={cn(
          "relative z-10 flex flex-col items-center justify-center px-6",
          reduced ? "gap-10 py-24" : "h-screen overflow-hidden",
        )}
      >
        <div
          data-wf-head
          className={cn(
            reduced
              ? "relative max-w-xl text-center"
              : "absolute top-20 left-1/2 z-20 w-full max-w-xl -translate-x-1/2 px-6 text-center",
          )}
        >
          <p className="text-[11px] font-medium tracking-[0.4em] text-foreground/40 uppercase">02</p>
          <h2 className="font-display mt-2 text-xl font-medium tracking-tight text-foreground sm:text-3xl">
            AI Workflow Automation
          </h2>
          <p className="mt-2 text-xs text-hero-sub opacity-70 sm:text-sm">
            Replace repetitive manual processes with intelligent workflows.
          </p>
        </div>

        {reduced ? (
          <ol className="flex w-full max-w-xl flex-col gap-2">
            {WORKFLOW_STEPS.map((step, i) => (
              <li key={step} className="text-sm text-muted">
                {i + 1}. {step}
              </li>
            ))}
          </ol>
        ) : (
          <>
            {/* The frame the camera move rides. Same box as the scene it
                holds, so nothing about the scene's own sizing changes. */}
            <div ref={frameRef} className="absolute inset-0">
              <WorkflowPipeline progressRef={progressRef} />
            </div>

            {/*
             * The run along the bottom. A caption for the scene above it, and
             * the only place the four beats are named — the nodes report
             * their own state, this reports the process.
             */}
            <div
              data-wf-run
              className="absolute inset-x-0 bottom-12 z-20 flex justify-center px-6 sm:bottom-16"
            >
              <ol className="flex w-full max-w-3xl items-center justify-between gap-1 sm:gap-3">
                {WORKFLOW_STAGES.map((label, i) => {
                  const done = i < stage;
                  const current = i === stage;
                  return (
                    <li key={label} className="flex flex-1 items-center gap-1 sm:gap-3">
                      <div className="flex min-w-0 flex-col items-center gap-2">
                        {/* The marker, and the ring it throws when the run
                            reaches it. The wrapper is the marker's own size,
                            so the row's spacing is untouched. */}
                        <span
                          aria-hidden="true"
                          className="relative flex h-1.5 w-1.5 shrink-0 items-center justify-center"
                        >
                          <span
                            className={cn(
                              "h-1.5 w-1.5 rounded-full transition-all duration-500",
                              current
                                ? "scale-150 bg-accent shadow-[0_0_10px_2px_rgba(92,200,232,0.6)]"
                                : done
                                  ? "bg-accent/60"
                                  : "bg-edge-strong",
                            )}
                          />
                          {!reduced && (
                            <span
                              data-ping
                              className="pointer-events-none absolute inset-0 rounded-full border border-accent/70 opacity-0"
                            />
                          )}
                        </span>
                        <span
                          className={cn(
                            "text-center font-mono text-[10px] tracking-[0.14em] whitespace-nowrap uppercase transition-colors duration-500 sm:text-xs sm:tracking-[0.18em]",
                            current
                              ? "text-foreground"
                              : done
                                ? "text-accent/70"
                                : "text-muted/50",
                          )}
                        >
                          {label}
                        </span>
                      </div>

                      {/* The run between beats, filling as each is passed. */}
                      {i < WORKFLOW_STAGES.length - 1 && (
                        <span
                          aria-hidden="true"
                          className="relative mb-5 h-px flex-1 bg-edge"
                        >
                          <span
                            className={cn(
                              "absolute inset-y-0 left-0 bg-accent/70 transition-[width] duration-700 ease-out",
                              done ? "w-full" : "w-0",
                            )}
                          />
                          {/* Traffic on the run, once the beat has been
                              passed. The wrapper carries whether it is
                              carrying; GSAP only moves the dot. */}
                          {!reduced && (
                            <span
                              className={cn(
                                "absolute inset-0 transition-opacity duration-700",
                                done ? "opacity-100" : "opacity-0",
                              )}
                            >
                              <span
                                data-run-dot
                                className="absolute top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-soft opacity-0 shadow-[0_0_8px_2px_rgba(92,200,232,0.5)]"
                              />
                            </span>
                          )}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ol>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
