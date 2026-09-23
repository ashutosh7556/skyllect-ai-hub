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
        "flex h-14 w-14 items-center justify-center rounded-full",
        disabled
          ? "cursor-default bg-line text-muted"
          : "bg-brand-orange text-white shadow-[0_10px_24px_-10px_rgba(249,122,31,0.7)] hover:bg-brand-blue",
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
 * scrolling with snap points, so touch swipe works too. Jumps are instant —
 * no easing.
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
    track.scrollBy({ left: direction * (card.offsetWidth + GAP_PX), behavior: "instant" });
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

      {/* Out beside the track only where the page margin has room for it;
          centred beneath the track everywhere else. */}
      <ArrowButton
        direction="prev"
        disabled={atStart}
        onClick={() => step(-1)}
        className="absolute top-1/2 -left-20 hidden -translate-y-1/2 min-[1400px]:flex"
      />
      <ArrowButton
        direction="next"
        disabled={atEnd}
        onClick={() => step(1)}
        className="absolute top-1/2 -right-20 hidden -translate-y-1/2 min-[1400px]:flex"
      />
      <div className="mt-8 flex justify-center gap-4 min-[1400px]:hidden">
        <ArrowButton direction="prev" disabled={atStart} onClick={() => step(-1)} />
        <ArrowButton direction="next" disabled={atEnd} onClick={() => step(1)} />
      </div>
    </div>
  );
}
