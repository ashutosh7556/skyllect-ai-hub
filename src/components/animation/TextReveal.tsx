"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface TextRevealProps {
  words: string;
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
}

/** Splits text into words and reveals them with a staggered rise-and-fade as it scrolls into view. */
export function TextReveal({ words, as = "p", className }: TextRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const Tag = as;

  useGSAP(
    () => {
      if (reduced || !containerRef.current) return;
      const wordEls = containerRef.current.querySelectorAll("[data-word]");

      gsap.set(wordEls, { yPercent: 110, opacity: 0 });
      gsap.to(wordEls, {
        yPercent: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.04,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
        },
      });
    },
    { scope: containerRef, dependencies: [reduced] },
  );

  return (
    <div ref={containerRef} className={className}>
      <Tag className="sr-only">{words}</Tag>
      <div aria-hidden="true">
        {words.split(" ").map((word, index) => (
          <span key={`${word}-${index}`} className="inline-block overflow-hidden pb-1">
            <span data-word className="inline-block will-change-transform">
              {word}
              {index < words.split(" ").length - 1 ? " " : ""}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
