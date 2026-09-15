"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * The instrument rail down the hero's left gutter.
 *
 * The heading sits in the page container, which leaves a column of empty
 * page to the left of it — wide enough to look unfinished, too narrow for
 * anything with content in it. This fills it the way the rest of the page
 * would: a calibrated edge, a charge running down it, and the mark set on
 * its side.
 *
 * Deliberately DOM and GSAP rather than a third WebGL context. It is a line,
 * eight ticks and a dot; handing that to a renderer would cost a canvas and
 * a frame loop to draw what CSS already draws for nothing.
 */

/** Ticks down the rail. Every fourth is a long one, as on any real scale. */
const TICKS = 17;

export function HeroRail() {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;

      // The charge, running the length of the rail and back. Slow enough to
      // be something you notice rather than something that catches the eye.
      gsap.fromTo(
        "[data-charge]",
        { top: "6%", opacity: 0 },
        {
          top: "94%",
          opacity: 1,
          duration: 7,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        },
      );

      // The ticks breathe in a slow wave down the column, so the scale reads
      // as live without anything actually moving.
      gsap.to("[data-tick]", {
        opacity: 0.85,
        scaleX: 1.6,
        transformOrigin: "left center",
        duration: 1.8,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: { each: 0.12, from: "start" },
      });

      gsap.to("[data-node]", {
        rotate: 360,
        duration: 44,
        ease: "none",
        repeat: -1,
      });
    },
    { scope: rootRef, dependencies: [reduced] },
  );

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      // Hidden until there is a gutter worth filling: below `lg` the copy
      // runs to the page edge and this would be sitting on top of it.
      className="pointer-events-none absolute inset-y-0 left-5 z-10 hidden w-20 sm:left-8 lg:block"
    >
      <div className="relative h-full py-28">
        {/* The rail itself, fading out at both ends rather than stopping. */}
        <div className="absolute inset-y-24 left-6 w-px bg-gradient-to-b from-transparent via-edge-strong to-transparent" />

        {/* The scale. */}
        <div className="absolute inset-y-24 left-6 flex flex-col justify-between">
          {Array.from({ length: TICKS }).map((_, i) => (
            <span
              key={i}
              data-tick
              className={`block h-px origin-left bg-accent/45 ${i % 4 === 0 ? "w-2.5" : "w-1.5"}`}
              style={{ opacity: 0.3 }}
            />
          ))}
        </div>

        {/* The charge riding it. */}
        <span
          data-charge
          className="absolute left-6 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-soft shadow-[0_0_10px_2px_rgba(92,200,232,0.55)]"
        />

        {/* A turning mark at the head of the rail. */}
        <span
          data-node
          className="absolute top-14 left-6 block h-3 w-3 -translate-x-1/2 border border-accent/50"
          style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }}
        />

        {/* Set on its side, the way a plate is stamped. */}
        <span className="absolute bottom-24 left-3 font-mono text-[10px] tracking-[0.36em] text-muted/60 uppercase [writing-mode:vertical-rl]">
          Skyllect — Applied AI
        </span>
      </div>
    </div>
  );
}
