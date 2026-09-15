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
  /** Position along the run, in panels. Panel `index` is centred at `index`. */
  atRef: RefObject<{ value: number }>;
  /** Which panel is reading this. */
  index: number;
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
 * The stage position mapped to a topic's own 0..1.
 *
 * Panel 0 opens the stage already centred, so it has no approach to animate
 * over and its window has to start where the stage does. Every other panel
 * arrives from below and gets a little of that approach to play in.
 */
export function localProgress(at: number, index: number) {
  const distance = at - index;
  const from = index === 0 ? 0 : -0.35;
  const span = index === 0 ? 0.5 : 0.7;
  return Math.min(1, Math.max(0, (distance - from) / span));
}
