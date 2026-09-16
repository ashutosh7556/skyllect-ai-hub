"use client";

import { createContext, useContext, type RefObject } from "react";

/**
 * Where the reader is inside TopicStage, published to the topics themselves.
 *
 * The stage already computes one authoritative position per frame and writes
 * it straight to the DOM — nothing about it goes through React, and nothing
 * here changes that. This only hands the same ref down, so a topic that wants
 * its own scroll-driven animation can read the stage's position instead of
 * building a ScrollTrigger against an element that is pinned and therefore
 * never moves.
 */
export interface StageProgress {
  /**
   * Position along the run, in viewports.
   *
   * Panels are no longer all one viewport wide — a topic can ask for a longer
   * dwell — so this is a position in that weighted space rather than a panel
   * index. A panel's own window is `start`..`start + span`.
   */
  atRef: RefObject<{ value: number }>;
  /** Which panel is reading this. */
  index: number;
  /** Where this panel's window begins, and how wide it is, in viewports. */
  start: number;
  span: number;
  /** True when the stage is stacked rather than pinned. */
  reduced: boolean;
}

const StageProgressContext = createContext<StageProgress | null>(null);

export const StageProgressProvider = StageProgressContext.Provider;

/** Null outside a TopicStage — callers fall back to a static, finished state. */
export function useStageProgress() {
  return useContext(StageProgressContext);
}

/**
 * The stage position mapped to a topic's own 0..1, across its whole window.
 *
 * A one-viewport topic gets the same shape it always had; a topic that asked
 * for ten gets all ten, which is what lets it run a sequence of its own
 * rather than a single reveal.
 */
export function localProgress(stage: StageProgress) {
  const at = stage.atRef.current?.value ?? 0;
  return Math.min(1, Math.max(0, (at - stage.start) / stage.span));
}
