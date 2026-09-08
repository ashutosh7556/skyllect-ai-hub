"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { BULB_SRC, BULB_HEIGHT, BULB_Y_OFFSET, BULB_IDLE_OPACITY } from "@/lib/bulb";

const { clamp, mapRange, interpolate } = gsap.utils;
const easeJourney = gsap.parseEase("power2.inOut");

/**
 * The bulb mark lifts out of the header logo as the hero scrolls away, grows
 * into place, and then stays as a faint backdrop behind every section below —
 * fading out again once the footer comes up.
 *
 * Page-level and `fixed` rather than owned by a section, so it persists across
 * the whole scroll instead of appearing and vanishing per section.
 */
export function BulbBackdrop() {
  const layerRef = useRef<HTMLDivElement>(null);
  const bulbRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      const bulb = bulbRef.current;
      const agents = document.querySelector("#ai-agents");
      if (!bulb || !agents) return;

      let from = { x: 0, y: 0, scale: 0.1 };

      const measure = () => {
        const mark = document.querySelector<HTMLElement>("[data-logo-icon]");
        if (!mark) return;
        const rect = mark.getBoundingClientRect();
        // Offsets are relative to the flex-centred resting spot of the image.
        from = {
          x: rect.left + rect.width / 2 - window.innerWidth / 2,
          y: rect.top + rect.height / 2 - window.innerHeight / 2,
          scale: rect.height / BULB_HEIGHT,
        };
      };

      const renderJourney = (raw: number) => {
        const p = easeJourney(raw);
        // While it is travelling it rides *over* the hero, so you watch it lift
        // out of the logo and cross the banner. Only once it has landed does it
        // drop behind the content to act as a backdrop.
        gsap.set(layerRef.current, { zIndex: raw < 0.98 ? 45 : 0 });
        gsap.set(bulb, {
          x: interpolate(from.x, 0, p),
          y: interpolate(from.y, BULB_Y_OFFSET, p),
          scale: interpolate(from.scale, 1, p),
          // Hidden while it overlaps the real logo so the two never double up,
          // then eased to its faint resting level as it arrives.
          autoAlpha:
            clamp(0, 1, mapRange(0.04, 0.16, 0, 1, raw)) *
            interpolate(1, BULB_IDLE_OPACITY, clamp(0, 1, mapRange(0.7, 1, 0, 1, raw))),
        });
      };

      const journey = ScrollTrigger.create({
        trigger: "#home",
        start: "top top",
        endTrigger: agents,
        end: "top top",
        scrub: 1,
        invalidateOnRefresh: true,
        onRefresh: (self) => {
          measure();
          renderJourney(self.progress);
        },
        onUpdate: (self) => renderJourney(self.progress),
      });

      // Once the footer arrives the backdrop has done its job.
      ScrollTrigger.create({
        trigger: "#contact",
        start: "top bottom",
        end: "top center",
        scrub: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          gsap.set(bulb, { autoAlpha: BULB_IDLE_OPACITY * (1 - self.progress) });
        },
      });

      measure();
      renderJourney(journey.progress);
    },
    { dependencies: [reduced] },
  );

  return (
    <div
      ref={layerRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center"
    >
      {/* Glow and bulb travel together as one group. Under reduced motion it
          simply sits at its resting spot — the backdrop is a still image, so
          there is no reason to drop it just because motion is off. */}
      <div
        ref={bulbRef}
        className="relative flex items-center justify-center"
        style={
          reduced
            ? { opacity: BULB_IDLE_OPACITY, transform: `translateY(${BULB_Y_OFFSET}px)` }
            : { opacity: 0 }
        }
      >
        {/*
         * Soft light cast by the bulb. It lives on this backdrop layer, below
         * every section, so it can warm the panels behind the copy without
         * ever washing out or blurring the text on top of them.
         */}
        <div
          className="pointer-events-none absolute rounded-full"
          style={{
            width: BULB_HEIGHT * 3.4,
            height: BULB_HEIGHT * 3.4,
            background:
              "radial-gradient(circle, rgba(255,201,92,0.30) 0%, rgba(251,158,54,0.17) 17%, rgba(214,120,80,0.10) 34%, rgba(99,102,241,0.08) 52%, rgba(99,102,241,0) 72%)",
          }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={BULB_SRC}
          alt=""
          className="relative"
          style={{ height: BULB_HEIGHT, width: "auto" }}
        />
      </div>
    </div>
  );
}
