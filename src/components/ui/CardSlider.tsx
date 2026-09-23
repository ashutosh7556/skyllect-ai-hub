"use client";

import { Children, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

// Matches the track's gap-6.
const GAP_PX = 24;

function ArrowButton({
  direction,
  disabled,
  onClick,
  className,
}: {
  direction: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "prev" ? "Previous" : "Next"}
      className={cn(
        "flex items-center justify-center rounded-full transition duration-300 ease-out motion-reduce:transition-none",
        disabled
          ? "cursor-default bg-line text-muted"
          : "bg-brand-orange text-white hover:scale-105 hover:bg-brand-blue",
        className,
      )}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 16 16"
        className={cn("h-5 w-5", direction === "prev" && "rotate-180")}
        fill="none"
        stroke="currentColor"
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 3l5 5-5 5" />
      </svg>
    </button>
  );
}

/**
 * A row of cards that pages sideways with previous/next buttons: one card per
 * view on phones, two from md, three from lg. Built on native horizontal
 * scrolling with snap points, so touch swipe works too. Paging glides
 * smoothly, or jumps straight there for anyone who prefers reduced motion.
 */
export function CardSlider({ children }: { children: ReactNode }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateEdges = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    setAtStart(track.scrollLeft <= 1);
    setAtEnd(track.scrollLeft + track.clientWidth >= track.scrollWidth - 1);
  }, []);

  useEffect(() => {
    updateEdges();
    window.addEventListener("resize", updateEdges);
    return () => window.removeEventListener("resize", updateEdges);
  }, [updateEdges]);

  const step = (direction: 1 | -1) => {
    const track = trackRef.current;
    const card = track?.firstElementChild as HTMLElement | null;
    if (!track || !card) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollBy({
      left: direction * (card.offsetWidth + GAP_PX),
      behavior: reduced ? "instant" : "smooth",
    });
  };

  return (
    <div className="relative">
      <div
        ref={trackRef}
        onScroll={updateEdges}
        // Padding keeps the card shadows from being clipped by the scroller.
        className="no-scrollbar -mx-2 -my-4 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-px-2 px-2 py-4"
      >
        {Children.map(children, (child) => (
          <div className="flex w-full shrink-0 snap-start md:w-[calc(50%-12px)] lg:w-[calc((100%-48px)/3)]">
            {child}
          </div>
        ))}
      </div>

      {/* Beside the cards from lg up — on their edges on laptops, out in the
          margin on wide screens — set a little above centre so they line up
          with the cards rather than the section below. Beneath the track on
          smaller screens. */}
      <ArrowButton
        direction="prev"
        disabled={atStart}
        onClick={() => step(-1)}
        className="absolute top-[46%] -left-6 z-20 hidden h-11 w-11 -translate-y-1/2 lg:flex wide:-left-20 wide:h-14 wide:w-14"
      />
      <ArrowButton
        direction="next"
        disabled={atEnd}
        onClick={() => step(1)}
        className="absolute top-[46%] -right-6 z-20 hidden h-11 w-11 -translate-y-1/2 lg:flex wide:-right-20 wide:h-14 wide:w-14"
      />
      <div className="mt-8 flex justify-center gap-4 lg:hidden">
        <ArrowButton direction="prev" disabled={atStart} onClick={() => step(-1)} className="h-14 w-14" />
        <ArrowButton direction="next" disabled={atEnd} onClick={() => step(1)} className="h-14 w-14" />
      </div>
    </div>
  );
}
