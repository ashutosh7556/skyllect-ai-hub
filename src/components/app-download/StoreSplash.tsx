"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { MobilePlatform } from "@/lib/app-platform";

/** How long the animation plays before it moves on. */
const SHOW_MS = 2600;
/** Length of the fade-out on desktop, matching .tkps-splash--out in globals.css. */
const FADE_MS = 500;
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

/** Where to go once the animation finishes. */
type Then =
  /** Phones: open their app store. */
  | { store: MobilePlatform; url: string }
  /** Desktops: fade away and show the /app/tkps page underneath. */
  | { page: true; subtitle: string };

/**
 * Full-screen TKPS opening animation for /app/tkps. On phones it plays and
 * then opens the app store; on desktops it plays over the page and fades
 * out to reveal it, leaving the page (QR scanner included) untouched.
 */
export function StoreSplash({ then, icon }: { then: Then; icon: string }) {
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState<"playing" | "leaving" | "done">("playing");
  const [showFallback, setShowFallback] = useState(false);
  const storeUrl = "url" in then ? then.url : null;

  useEffect(() => {
    // Sent with the page so it shows on the first paint, then moved to <body>
    // so no layout layer (site header, loading screen) can sit above it.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (storeUrl) {
      const go = setTimeout(() => window.location.replace(storeUrl), SHOW_MS);
      const fallback = setTimeout(() => setShowFallback(true), FALLBACK_MS);
      return () => {
        clearTimeout(go);
        clearTimeout(fallback);
      };
    }
    // Desktop: keep the page still underneath, then fade out and get out of the way.
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const leave = setTimeout(() => setPhase("leaving"), SHOW_MS);
    const done = setTimeout(() => {
      document.body.style.overflow = overflow;
      setPhase("done");
    }, SHOW_MS + FADE_MS);
    return () => {
      clearTimeout(leave);
      clearTimeout(done);
      document.body.style.overflow = overflow;
    };
  }, [storeUrl]);

  if (phase === "done") return null;

  const store = "store" in then ? STORE_NAME[then.store] : null;

  const splash = (
    <div
      role="status"
      aria-live="polite"
      className={`tkps-splash ${phase === "leaving" ? "tkps-splash--out" : ""}`}
    >
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

        <p className="tkps-splash-rise font-display text-[clamp(1.5rem,0.9rem+3.6vw,2.75rem)] leading-tight font-bold whitespace-nowrap text-white">
          Opening <span className="bg-gradient-to-r from-[#ffe7b8] to-[#f6b35f] bg-clip-text text-transparent">TKPS App</span>
          <span aria-hidden="true" className="tkps-splash-dots" />
        </p>
        <p className="tkps-splash-rise mt-2 text-[15px] text-white/80 [animation-delay:0.1s] sm:text-base">
          {store ? `Redirecting you to ${store}...` : "subtitle" in then ? then.subtitle : null}
        </p>

        <div aria-hidden="true" className="tkps-splash-rise mt-6 h-3 w-full max-w-xs overflow-hidden rounded-full border border-white/25 bg-black/30 p-[2px] [animation-delay:0.2s]">
          <span className="tkps-splash-progress block h-full rounded-full" />
        </div>

        {/* Phones only: in case the browser blocks the automatic redirect. */}
        {storeUrl && store && (
          <a
            href={storeUrl}
            className={`mt-6 text-sm font-semibold text-[#ffd9a0] underline-offset-4 transition-opacity duration-500 hover:underline ${
              showFallback ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
            tabIndex={showFallback ? 0 : -1}
          >
            Not opening? Tap to open {store}
          </a>
        )}
      </div>

      {/* Skyllect branding along the bottom. */}
      <div className="tkps-splash-brand">
        <span className="text-[11px] font-medium tracking-[0.2em] text-white/60 uppercase">Powered by</span>
        <Image src="/images/skyllect-logo.png" alt="Skyllect" width={1224} height={283} className="h-7 w-auto" />
      </div>
    </div>
  );

  return mounted ? createPortal(splash, document.body) : splash;
}
