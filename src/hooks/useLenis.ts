"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * The running instance, if there is one.
 *
 * Lenis takes the scroll away from the browser: it holds its own position and
 * writes it to the window every frame. Anything that wants to move the page
 * has to go through it, or the two fight — a native jump lands, Lenis writes
 * its own position back on the next frame, and the page slides away from
 * wherever it was sent.
 */
let active: Lenis | null = null;

/** Drives smooth scrolling via GSAP's ticker and keeps ScrollTrigger in sync with Lenis. */
export function useLenis(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
    });
    active = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const update = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
      lenis.destroy();
      if (active === lenis) active = null;
    };
  }, [enabled]);
}

/**
 * Takes the page back to the top, through Lenis where it is running so the
 * pinned sections unwind on the way rather than being skipped over.
 *
 * `immediate` when the user prefers reduced motion — there is no Lenis to go
 * through in that case, and a long animated scroll is the thing they asked
 * not to have.
 */
export function scrollToTop() {
  if (active) {
    active.scrollTo(0, { duration: 1.4 });
    return;
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}
