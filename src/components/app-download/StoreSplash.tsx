"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { MobilePlatform } from "@/lib/app-platform";

/** How long the animation plays before the phone is sent to its store. */
const REDIRECT_MS = 2600;
/** If the store has not opened by now, offer a link to tap instead. */
const FALLBACK_MS = 4500;

const STORE_NAME: Record<MobilePlatform, string> = {
  android: "Google Play Store",
  ios: "App Store",
};

/** Twinkling dots around the logo: left %, top %, size px, delay s. */
const SPARKLES: [number, number, number, number][] = [
  [18, 22, 4, 0],
  [80, 16, 3, 0.5],
  [86, 46, 4, 1],
  [12, 52, 3, 1.3],
  [70, 8, 3, 0.8],
  [30, 6, 3, 0.3],
];

/**
 * Full-screen TKPS opening animation for phones that open /app/tkps, shown
 * for a moment before they are sent to their app store.
 */
export function StoreSplash({ platform, storeUrl, icon }: { platform: MobilePlatform; storeUrl: string; icon: string }) {
  const [showFallback, setShowFallback] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Sent with the page so it shows on the first paint, then moved to <body>
    // so no layout layer (site header, loading screen) can sit above it.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    const go = setTimeout(() => window.location.replace(storeUrl), REDIRECT_MS);
    const fallback = setTimeout(() => setShowFallback(true), FALLBACK_MS);
    return () => {
      clearTimeout(go);
      clearTimeout(fallback);
    };
  }, [storeUrl]);

  const store = STORE_NAME[platform];

  const splash = (
    <div role="status" aria-live="polite" className="tkps-splash">
      <div aria-hidden="true" className="tkps-splash-bg" />

      <div className="relative flex w-full max-w-md flex-col items-center px-6 text-center">
        <div aria-hidden="true" className="tkps-splash-stage">
          <span className="tkps-splash-platform">
            <span className="tkps-splash-ring" />
            <span className="tkps-splash-ring tkps-splash-ring--inner" />
            <span className="tkps-splash-core" />
          </span>
          <span className="tkps-splash-beam" />
          <span className="tkps-splash-orbit tkps-splash-orbit--back" />
          <span className="tkps-splash-logo">
            <Image src={icon} alt="" width={256} height={256} priority className="h-full w-full rounded-[22%]" />
          </span>
          <span className="tkps-splash-orbit tkps-splash-orbit--front" />
          <span className="tkps-splash-orbit tkps-splash-orbit--wide" />
          {SPARKLES.map(([left, top, size, delay]) => (
            <span
              key={`${left}-${top}`}
              className="tkps-splash-sparkle"
              style={{ left: `${left}%`, top: `${top}%`, width: size, height: size, animationDelay: `${delay}s` }}
            />
          ))}
        </div>

        <h1 className="tkps-splash-rise font-display text-[clamp(1.9rem,1.2rem+3vw,2.75rem)] leading-tight font-bold text-white">
          Opening <span className="bg-gradient-to-r from-[#ffe7b8] to-[#f6b35f] bg-clip-text text-transparent">TKPS App</span>
          <span aria-hidden="true" className="tkps-splash-dots" />
        </h1>
        <p className="tkps-splash-rise mt-2 text-[15px] text-white/80 [animation-delay:0.1s] sm:text-base">
          Redirecting you to {store}...
        </p>

        <div aria-hidden="true" className="tkps-splash-rise mt-6 h-3 w-full max-w-xs overflow-hidden rounded-full border border-white/25 bg-black/30 p-[2px] [animation-delay:0.2s]">
          <span className="tkps-splash-progress block h-full rounded-full" />
        </div>

        {/* In case the browser blocks the automatic redirect. */}
        <a
          href={storeUrl}
          className={`mt-6 text-sm font-semibold text-[#ffd9a0] underline-offset-4 transition-opacity duration-500 hover:underline ${
            showFallback ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
          tabIndex={showFallback ? 0 : -1}
        >
          Not opening? Tap to open {store}
        </a>
      </div>
    </div>
  );

  return mounted ? createPortal(splash, document.body) : splash;
}
