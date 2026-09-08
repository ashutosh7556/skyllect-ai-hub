"use client";

import { useLenis } from "@/hooks/useLenis";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/** Enables Lenis smooth scrolling, unless the user prefers reduced motion. */
export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();
  useLenis(!reduced);

  return <>{children}</>;
}
