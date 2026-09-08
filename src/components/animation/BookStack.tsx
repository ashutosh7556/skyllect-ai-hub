"use client";

import { Children, useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

/**
 * Turns a run of sections into a stack of full-screen pages.
 *
 * Every page is `sticky top-0`, so they pile up at the top of the viewport and
 * each new one slides up over the last. On top of that natural cover motion,
 * each page tips back in 3D and dims as it is buried, while the arriving page
 * settles forward into place — so it reads as turning pages rather than
 * scrolling past blocks.
 *
 * Under prefers-reduced-motion the whole thing degrades to ordinary stacked
 * sections in normal flow.
 */
export function BookStack({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<Array<HTMLElement | null>>([]);
  const innerRefs = useRef<Array<HTMLDivElement | null>>([]);
  const reduced = useReducedMotion();
  const pages = Children.toArray(children);

  useGSAP(
    () => {
      if (reduced) return;

      pageRefs.current.forEach((page, i) => {
        const inner = innerRefs.current[i];
        const next = pageRefs.current[i + 1];
        if (!page || !inner) return;

        // Arriving: the page rises slightly tilted and straightens as it lands.
        if (i > 0) {
          gsap.fromTo(
            inner,
            { rotateX: 8, scale: 0.94, y: 70 },
            {
              rotateX: 0,
              scale: 1,
              y: 0,
              ease: "none",
              scrollTrigger: {
                trigger: page,
                start: "top bottom",
                end: "top top",
                scrub: 0.6,
                invalidateOnRefresh: true,
              },
            },
          );
        }

        // Departing: tips away and dims as the following page covers it.
        if (next) {
          gsap.to(inner, {
            rotateX: -9,
            scale: 0.9,
            y: -80,
            opacity: 0.2,
            filter: "blur(6px)",
            ease: "none",
            scrollTrigger: {
              trigger: next,
              start: "top bottom",
              end: "top top",
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          });
        }
      });
    },
    { scope: rootRef, dependencies: [reduced, pages.length] },
  );

  return (
    <div
      ref={rootRef}
      className="relative"
      style={reduced ? undefined : { perspective: 1600 }}
    >
      {pages.map((page, i) => (
        <section
          key={i}
          ref={(el) => {
            pageRefs.current[i] = el;
          }}
          className={cn(!reduced && "sticky top-0 h-screen overflow-hidden")}
        >
          <div
            ref={(el) => {
              innerRefs.current[i] = el;
            }}
            className={cn(
              !reduced && "flex h-full w-full items-center justify-center",
            )}
            style={reduced ? undefined : { willChange: "transform, opacity, filter" }}
          >
            {page}
          </div>
        </section>
      ))}
    </div>
  );
}
