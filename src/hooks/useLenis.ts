"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * The live instance, kept at module scope so callers outside the React tree
 * can drive the scroll. Lenis holds its own animated scroll position, so a
 * native `window.scrollTo` or a hash jump gets fought back by the next rAF —
 * anything that wants to move the page has to go through Lenis itself.
 */
let instance: Lenis | null = null;

/**
 * Returns to the top of the page. Falls back to the native smooth scroll when
 * Lenis is disabled under prefers-reduced-motion.
 */
export function scrollToTop() {
  if (instance) {
    instance.scrollTo(0);
    return;
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/** Drives smooth scrolling via GSAP's ticker and keeps ScrollTrigger in sync with Lenis. */
export function useLenis(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
    });
    instance = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const update = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
      lenis.destroy();
      if (instance === lenis) instance = null;
    };
  }, [enabled]);
}
