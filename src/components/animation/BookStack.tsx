"use client";

import { Children, useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { BULB_SRC } from "@/lib/bulb";
import { cn } from "@/lib/utils";

/**
 * How far the lifted flap is tilted out of the page plane. It starts well
 * short of flat, so early in the peel you are looking at the underside of a
 * raised edge, and only settles down as the fold reaches the binding.
 */
const FLAP_START_DEG = -166;
const FLAP_END_DEG = -179;
/** Corner radius carried through the clip so a leaf keeps its rounded edges. */
const LEAF_RADIUS = 22;

/**
 * The face of a leaf. Layered back to front: the paper, a warm bounce from the
 * bulb sitting below the stack, a highlight along the outer edge, and the
 * shadow the binding casts down the spine.
 */
const SHEET_SURFACE = [
  "linear-gradient(to right, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.20) 3.5%, rgba(0,0,0,0) 10%)",
  "linear-gradient(to left, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 1.4%)",
  "radial-gradient(125% 78% at 50% 112%, rgba(255,190,110,0.10) 0%, rgba(255,190,110,0) 68%)",
  "linear-gradient(118deg, #0c0919 0%, #100c20 46%, #0a0714 100%)",
].join(", ");

/**
 * The reverse of the paper, seen once the edge lifts. `to left` because the
 * fold mirrors the flap: its local right edge is the crease, so that is where
 * the light has to break. The opaque base matters — without it the page's own
 * copy, and the page below, read straight through the flap.
 */
const FLAP_SURFACE = [
  "linear-gradient(to left, rgba(255,255,255,0.17) 0%, rgba(188,178,220,0.10) 4%, rgba(30,24,50,0.93) 26%, rgba(13,9,25,0.98) 68%, rgba(9,6,18,1) 100%)",
  "linear-gradient(#0b0817, #0b0817)",
].join(", ");

/**
 * The shadow the raised flap throws back across the page still lying flat.
 * Full width with the gradient packed against its right edge, so translating
 * it by -100% of its own width walks that edge from the outer edge of the leaf
 * to the binding — exactly tracking the fold.
 */
const CREASE_SHADOW =
  "linear-gradient(to left, rgba(0,0,0,0.66) 0%, rgba(0,0,0,0.34) 5%, rgba(0,0,0,0.12) 12%, rgba(0,0,0,0) 20%)";

/**
 * The light the bulb throws across a leaf. Same amber-to-indigo ramp the page
 * backdrop uses, at a fraction of the strength — enough to warm the paper
 * without lifting it toward the copy sitting on top.
 */
const BULB_GLOW =
  "radial-gradient(circle, rgba(255,201,92,0.17) 0%, rgba(251,158,54,0.105) 18%, rgba(214,120,80,0.06) 36%, rgba(99,102,241,0.04) 55%, rgba(99,102,241,0) 74%)";

/**
 * Turns a run of sections into the leaves of a book.
 *
 * The whole book is one pinned screen with every leaf stacked absolutely
 * inside it, front to back. Nothing in the stack ever moves in layout: the
 * leaves are already sitting behind one another before you reach them, and the
 * only thing scroll drives is the peel. That is deliberate — an earlier version
 * gave each leaf its own sticky slot and cancelled the slot's motion with a
 * scrubbed transform, but a smoothed transform cannot cancel an instantaneous
 * layout shift, so pages drifted, snapped into place, and read as sliding up
 * from below instead of being uncovered.
 *
 * The turn itself is a peel rather than a hinge: the leaf never rotates. A fold
 * line sweeps in from the outer edge toward the binding, the face is clipped
 * away behind it, and the portion past the fold flips over as a flap showing
 * the back of the paper — so the edge curls over while the rest of the page
 * stays put and the next leaf is revealed underneath.
 *
 * Under prefers-reduced-motion this degrades to ordinary stacked sections in
 * normal flow, still styled as sheets but never turning.
 */
export function BookStack({ children }: { children: ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const faceRefs = useRef<Array<HTMLDivElement | null>>([]);
  const flapRefs = useRef<Array<HTMLDivElement | null>>([]);
  const creaseRefs = useRef<Array<HTMLDivElement | null>>([]);
  const reduced = useReducedMotion();
  const pages = Children.toArray(children);
  // The last leaf is never turned — there is nothing behind it.
  const turns = Math.max(pages.length - 1, 1);

  useGSAP(
    () => {
      if (reduced) return;

      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top top",
          // One viewport of scroll per turn, so timeline unit i lands exactly
          // i viewports past the pin. The leaf scroll-margins below rely on
          // that being an exact 1:1 mapping.
          end: () => `+=${turns * window.innerHeight}`,
          scrub: 1,
          pin: pinRef.current,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Anchors the timeline's total duration to the unit scale, so unit i
      // always sits at progress i / turns however many tweens are added.
      timeline.to({}, { duration: turns });

      faceRefs.current.forEach((face, i) => {
        const flap = flapRefs.current[i];
        const crease = creaseRefs.current[i];
        if (!face || !flap || i >= turns) return;

        // Everything below is a percentage of the leaf's own width, so none of
        // it needs measuring and all of it survives a resize.

        // Face: clipped back to the part still lying flat.
        timeline.fromTo(
          face,
          { clipPath: `inset(0% 0% 0% 0% round ${LEAF_RADIUS}px)` },
          { clipPath: `inset(0% 100% 0% 0% round ${LEAF_RADIUS}px)`, duration: 1 },
          i,
        );

        // Flap: hinged on the fold line, which it rides via xPercent. Mirrored
        // by the rotation, so clipping its own left portion yields exactly the
        // strip of page that has been turned over.
        timeline.fromTo(
          flap,
          { xPercent: 100, rotateY: FLAP_START_DEG },
          { xPercent: 0, rotateY: FLAP_END_DEG, duration: 1 },
          i,
        );

        // The turned-over strip is as wide as the part already folded, but it
        // lands to the *left* of the fold — so past halfway it would hang over
        // the binding and sprawl across the screen. Clipping it to the leaf
        // means it grows until the fold reaches the middle, then disappears
        // into the spine, which is what a page does when you turn it.
        timeline
          .fromTo(
            flap,
            { clipPath: `inset(0% 100% 0% 0% round ${LEAF_RADIUS}px)` },
            { clipPath: `inset(0% 50% 0% 0% round ${LEAF_RADIUS}px)`, duration: 0.5 },
            i,
          )
          .to(
            flap,
            { clipPath: `inset(0% 100% 0% 0% round ${LEAF_RADIUS}px)`, duration: 0.5 },
            i + 0.5,
          );

        // Crease shadow: its right edge is the fold, so walking it a full width
        // to the left drags the shadow along with the crease.
        if (crease) {
          timeline.fromTo(crease, { xPercent: 0 }, { xPercent: -100, duration: 1 }, i);
        }
      });
    },
    { scope: wrapperRef, dependencies: [reduced, pages.length] },
  );

  return (
    <div ref={wrapperRef} className="relative">
      <div
        ref={pinRef}
        className={cn(!reduced && "relative h-screen w-full overflow-hidden")}
        style={reduced ? undefined : { perspective: 1800 }}
      >
        {pages.map((page, i) => (
          <div
            key={i}
            className={cn(
              reduced
                ? "relative w-full"
                : // A leaf, not the whole screen. inset-0 + m-auto centres it
                  // with no transform of its own.
                  "absolute inset-0 m-auto h-[74vh] w-[min(1040px,86vw)]",
            )}
            style={reduced ? undefined : { zIndex: pages.length - i, transformStyle: "preserve-3d" }}
          >
            {/* The face of the leaf: the page as the reader sees it. */}
            <div
              ref={(el) => {
                faceRefs.current[i] = el;
              }}
              className={cn(
                "flex items-center justify-center overflow-hidden",
                reduced ? "relative min-h-screen w-full" : "absolute inset-0 rounded-[22px]",
              )}
              style={{
                background: SHEET_SURFACE,
                ...(reduced
                  ? {}
                  : {
                      boxShadow: "0 40px 90px -30px rgba(0,0,0,0.95)",
                      willChange: "clip-path",
                      // Every leaf sits at the same document position now that
                      // the book is a single pinned screen, so #anchors would
                      // all resolve to the first page. Pulling each leaf's
                      // scroll margin back by its own index lands a fragment
                      // jump exactly on that leaf's turn.
                      ["--leaf-scroll-offset" as string]: `-${i * 100}vh`,
                    }),
              }}
            >
              {/*
               * The bulb, printed into the leaf itself. It has to live here
               * rather than show through from the page backdrop, because the
               * leaves are opaque — anything behind them is invisible. Being
               * the first child it sits under the copy, so the page stays
               * fully legible, and it is clipped by the peel along with the
               * rest of the face.
               */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 overflow-hidden"
              >
                <div
                  className="absolute bottom-0 left-1/2 h-[130%] w-[130%] -translate-x-1/2 translate-y-[22%] rounded-full"
                  style={{ background: BULB_GLOW }}
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={BULB_SRC}
                  alt=""
                  className="absolute bottom-[-7%] left-1/2 h-[66%] w-auto -translate-x-1/2 opacity-[0.17]"
                />
              </div>

              {page}

              {!reduced && (
                <div
                  ref={(el) => {
                    creaseRefs.current[i] = el;
                  }}
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 left-0 w-full"
                  style={{ background: CREASE_SHADOW, willChange: "transform" }}
                />
              )}
            </div>

            {/* The lifted flap: the back of the paper, folded over the face. */}
            {!reduced && (
              <div
                ref={(el) => {
                  flapRefs.current[i] = el;
                }}
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-[22px]"
                style={{
                  background: FLAP_SURFACE,
                  transformOrigin: "left center",
                  transformStyle: "preserve-3d",
                  clipPath: `inset(0% 100% 0% 0% round ${LEAF_RADIUS}px)`,
                  boxShadow: "22px 0 54px -16px rgba(0,0,0,0.85)",
                  willChange: "transform, clip-path",
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
