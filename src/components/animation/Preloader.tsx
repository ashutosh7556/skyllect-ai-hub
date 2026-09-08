"use client";

import { useEffect, useState } from "react";
import { gsap } from "@/lib/gsap";

/**
 * Blocks the animated experience until critical assets (fonts, hero media)
 * have loaded, then reveals the page with a short exit animation.
 */
export function Preloader({ onDone }: { onDone?: () => void }) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function waitForCriticalAssets() {
      const fonts = document.fonts ? document.fonts.ready : Promise.resolve();
      const minimumDisplay = new Promise((resolve) => setTimeout(resolve, 600));

      const tick = gsap.to(
        { value: 0 },
        {
          value: 90,
          duration: 1.2,
          ease: "power1.out",
          onUpdate: function () {
            if (!cancelled) setProgress(Math.round(this.targets()[0].value));
          },
        },
      );

      await Promise.all([fonts, minimumDisplay]);
      tick.kill();
      if (cancelled) return;

      gsap.to(
        { value: progress },
        {
          value: 100,
          duration: 0.4,
          ease: "power2.out",
          onUpdate: function () {
            if (!cancelled) setProgress(Math.round(this.targets()[0].value));
          },
          onComplete: () => {
            if (cancelled) return;
            setDone(true);
            onDone?.();
          },
        },
      );
    }

    waitForCriticalAssets();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={
        "fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black transition-opacity duration-700 " +
        (done ? "pointer-events-none opacity-0" : "opacity-100")
      }
      aria-hidden={done}
    >
      <span className="mb-6 text-sm font-medium uppercase tracking-[0.3em] text-white/60">
        Skyllect
      </span>
      <div className="h-px w-48 overflow-hidden bg-white/10">
        <div
          className="h-full bg-white transition-[width] duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="mt-4 font-mono text-xs text-white/40">{progress}%</span>
    </div>
  );
}
