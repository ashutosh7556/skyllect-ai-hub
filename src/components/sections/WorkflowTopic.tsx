"use client";

import { useRef, useState } from "react";
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
  const [stage, setStage] = useState(0);

  const { wrapperRef, pinRef, reduced, heightVh } = usePinnedTimeline(
    TOTAL_UNITS,
    null,
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
            <WorkflowPipeline progressRef={progressRef} />

            {/*
             * The run along the bottom. A caption for the scene above it, and
             * the only place the four beats are named — the nodes report
             * their own state, this reports the process.
             */}
            <div className="absolute inset-x-0 bottom-12 z-20 flex justify-center px-6 sm:bottom-16">
              <ol className="flex w-full max-w-3xl items-center justify-between gap-1 sm:gap-3">
                {WORKFLOW_STAGES.map((label, i) => {
                  const done = i < stage;
                  const current = i === stage;
                  return (
                    <li key={label} className="flex flex-1 items-center gap-1 sm:gap-3">
                      <div className="flex min-w-0 flex-col items-center gap-2">
                        <span
                          aria-hidden="true"
                          className={cn(
                            "h-1.5 w-1.5 shrink-0 rounded-full transition-all duration-500",
                            current
                              ? "scale-150 bg-accent shadow-[0_0_10px_2px_rgba(92,200,232,0.6)]"
                              : done
                                ? "bg-accent/60"
                                : "bg-edge-strong",
                          )}
                        />
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
