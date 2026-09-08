"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const MAX_TILT_DEG = 8;

interface TiltCardProps {
  children: ReactNode;
  className?: string;
}

/** A glass panel that tilts in 3D toward the cursor, GSAP-eased back to rest on leave. */
export function TiltCard({ children, className }: TiltCardProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const wrapper = wrapperRef.current;
      const card = cardRef.current;
      if (!wrapper || !card || reduced) return;

      const rotateX = gsap.quickTo(card, "rotateX", { duration: 0.6, ease: "power3.out" });
      const rotateY = gsap.quickTo(card, "rotateY", { duration: 0.6, ease: "power3.out" });
      const translateZ = gsap.quickTo(card, "z", { duration: 0.6, ease: "power3.out" });

      function handleMove(event: PointerEvent) {
        const rect = wrapper!.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width - 0.5;
        const py = (event.clientY - rect.top) / rect.height - 0.5;
        rotateY(px * MAX_TILT_DEG * 2);
        rotateX(-py * MAX_TILT_DEG * 2);
        translateZ(20);
      }

      function handleLeave() {
        rotateX(0);
        rotateY(0);
        translateZ(0);
      }

      wrapper.addEventListener("pointermove", handleMove);
      wrapper.addEventListener("pointerleave", handleLeave);

      return () => {
        wrapper.removeEventListener("pointermove", handleMove);
        wrapper.removeEventListener("pointerleave", handleLeave);
      };
    },
    { scope: wrapperRef, dependencies: [reduced] },
  );

  return (
    <div ref={wrapperRef} className={className} style={{ perspective: 1200 }}>
      <div
        ref={cardRef}
        className="liquid-glass h-full w-full rounded-[28px] border border-white/10"
        style={{ transformStyle: "preserve-3d" }}
      >
        {children}
      </div>
    </div>
  );
}
