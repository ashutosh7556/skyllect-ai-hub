"use client";

import { useRef, type RefObject } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface PinnedTimelineResult {
  wrapperRef: RefObject<HTMLDivElement | null>;
  pinRef: RefObject<HTMLDivElement | null>;
  reduced: boolean;
  heightVh: number;
}

/**
 * Shared scaffolding for a scroll-scrubbed cinematic topic: pins `pinRef`
 * for `totalUnits` viewports of scroll on `wrapperRef`, drives a single
 * GSAP timeline whose 0..totalUnits duration maps 1:1 to scroll progress,
 * and skips all of it under prefers-reduced-motion.
 *
 * `build` receives the timeline so the caller can add its own tweens at
 * whatever position values (in the same unit scale) make sense for its scene.
 */
export function usePinnedTimeline(
  totalUnits: number,
  build?: ((timeline: gsap.core.Timeline) => void) | null,
  deps: unknown[] = [],
  onProgress?: (progress: number) => void,
): PinnedTimelineResult {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;

      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          pin: pinRef.current,
          onUpdate: (self) => onProgress?.(self.progress),
          // Also fire on refresh so the scene paints its correct state on load
          // and after resize, not only once the user starts scrolling.
          onRefresh: (self) => onProgress?.(self.progress),
        },
      });

      // Anchors total scroll-mapped duration so unit N always lands at
      // scroll progress N / totalUnits, regardless of how many tweens follow.
      timeline.to({}, { duration: totalUnits });
      build?.(timeline);
    },
    { scope: wrapperRef, dependencies: [reduced, ...deps] },
  );

  return { wrapperRef, pinRef, reduced, heightVh: totalUnits * 100 };
}
