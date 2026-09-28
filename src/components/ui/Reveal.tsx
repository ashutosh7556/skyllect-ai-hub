"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

// A section counts as "in view" while any of it sits inside the middle 70% of
// the screen, so the fade-out plays visibly as it passes the top or bottom
// edge rather than once it has already scrolled away.
const ROOT_MARGIN = "-15% 0px -15% 0px";

/**
 * Fades its section in as it enters the viewport and back out as
 * it leaves, in either scroll direction. Built on CSS transitions rather than
 * keyframe animations: a transition always starts from the current state, so
 * reversing mid-way is smooth instead of snapping to invisible and replaying.
 * Until the observer reports, nothing is applied, so content is never hidden
 * if JavaScript fails.
 */
export function Reveal({
  children,
  className,
  delay,
}: {
  children: ReactNode;
  /** Classes for the wrapper itself, e.g. sizing when it sits in a grid or flex row. */
  className?: string;
  /** Staggers the entrance, e.g. "0.16s", for items revealed side by side. */
  delay?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState<boolean | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: ROOT_MARGIN, threshold: 0 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      // The stagger only applies on the way in; leaving is immediate.
      style={delay && inView ? { transitionDelay: delay } : undefined}
      className={cn(className, inView !== null && "reveal", inView === true && "reveal--in")}
    >
      {children}
    </div>
  );
}
