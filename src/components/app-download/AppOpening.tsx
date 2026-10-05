"use client";

import Image from "next/image";
import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { siAppstore, siGoogleplay } from "simple-icons";
import type { MobilePlatform } from "@/lib/app-platform";

const COPY: Record<MobilePlatform, { store: string; short: string; device: string; icon: { path: string } }> = {
  android: { store: "Google Play Store", short: "Play Store", device: "Android phone", icon: siGoogleplay },
  ios: { store: "App Store", short: "App Store", device: "iPhone", icon: siAppstore },
};

/** Small dots that twinkle around the logo: left %, top %, size px, delay s. */
const SPARKLES: [number, number, number, number][] = [
  [30, 18, 4, 0],
  [70, 14, 3, 0.5],
  [76, 40, 5, 1],
  [24, 44, 3, 1.4],
  [62, 30, 3, 0.8],
  [38, 32, 4, 0.3],
];

function LineIcon({ children }: { children: ReactNode }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}

/**
 * Full-screen "Opening TKPS App" moment, shown on the desktop once a phone
 * has scanned its code. The progress bar fills and the four steps tick off in
 * turn (all timed in CSS), mirroring what is happening on the phone.
 */
export function AppOpening({
  platform,
  appIcon,
  onClose,
}: {
  platform: MobilePlatform;
  appIcon: string;
  onClose: () => void;
}) {
  const copy = COPY[platform];
  const closeRef = useRef<HTMLButtonElement>(null);

  // Esc closes; the page underneath stops scrolling while this is open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [onClose]);

  const steps: { label: string; icon: ReactNode }[] = [
    {
      label: "QR Scanned",
      icon: (
        <LineIcon>
          <path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3" />
          <rect x="9" y="9" width="6" height="6" rx="1" />
        </LineIcon>
      ),
    },
    {
      label: "Connecting",
      icon: <Image src={appIcon} alt="" width={256} height={256} className="h-full w-full rounded-full object-cover" />,
    },
    {
      label: `Opening ${copy.short}`,
      icon:
        platform === "android" ? (
          // Google Play's four-colour mark, as in the store badge.
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-7 w-7">
            <path d="M3.6 2.2 13.3 12l-9.7 9.8c-.4-.2-.6-.7-.6-1.2V3.4c0-.5.2-1 .6-1.2Z" fill="#00d7fe" />
            <path d="m16.6 8.7-3.3 3.3-9.7-9.8c.4-.3 1-.3 1.5 0l11.5 6.5Z" fill="#00f076" />
            <path d="M16.6 15.3 5.1 21.8c-.5.3-1.1.3-1.5 0l9.7-9.8 3.3 3.3Z" fill="#ff3a44" />
            <path d="m20.4 13.4-3.8 1.9-3.3-3.3 3.3-3.3 3.8 2.1c1 .6 1 2 0 2.6Z" fill="#ffd500" />
          </svg>
        ) : (
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor">
            <path d={copy.icon.path} />
          </svg>
        ),
    },
    {
      label: "Almost there...",
      icon: (
        <LineIcon>
          <rect x="7" y="3" width="10" height="18" rx="2" />
          <path d="M11 18h2" />
        </LineIcon>
      ),
    },
  ];

  return createPortal(
    <div role="dialog" aria-modal="true" aria-labelledby="app-opening-title" className="app-opening">
      <div aria-hidden="true" className="app-opening-bg" />

      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="Close and show the QR code again"
        className="absolute top-5 right-5 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white/80 transition-colors hover:bg-white/15 hover:text-white"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
          <path d="M6 6l12 12M18 6 6 18" />
        </svg>
      </button>

      <div className="relative flex w-full max-w-3xl flex-col items-center px-5 text-center">
        {/* Logo over its glowing platform, circled by gold orbits. */}
        <div aria-hidden="true" className="app-opening-stage">
          <span className="app-opening-platform">
            <span className="app-opening-platform-ring" />
            <span className="app-opening-platform-ring [animation-delay:0.4s]" />
            <span className="app-opening-platform-core" />
          </span>
          <span className="app-opening-beam" />
          <span className="app-opening-orbit app-opening-orbit--back" />
          <span className="app-opening-logo">
            <Image src={appIcon} alt="" width={256} height={256} priority className="h-full w-full rounded-[22%]" />
          </span>
          <span className="app-opening-orbit app-opening-orbit--front" />
          <span className="app-opening-orbit app-opening-orbit--wide" />
          {SPARKLES.map(([left, top, size, delay]) => (
            <span
              key={`${left}-${top}`}
              className="scan-sparkle"
              style={{ left: `${left}%`, top: `${top}%`, width: size, height: size, animationDelay: `${delay}s` }}
            />
          ))}
        </div>

        <h2 id="app-opening-title" className="app-opening-rise font-display text-[clamp(2rem,1.4rem+2.4vw,3.25rem)] leading-tight font-bold text-white">
          Opening <span className="bg-gradient-to-r from-[#ffe2b0] to-[#f7b267] bg-clip-text text-transparent">TKPS App</span>
        </h2>
        <p className="app-opening-rise mt-2 text-base text-white/80 [animation-delay:0.1s] sm:text-lg">
          Redirecting you to {copy.store}
          <span aria-hidden="true" className="scan-dots" />
        </p>

        <div
          role="progressbar"
          aria-label={`Opening ${copy.store}`}
          className="app-opening-rise mt-6 h-3.5 w-full max-w-md overflow-hidden rounded-full border border-white/25 bg-black/25 p-[2px] [animation-delay:0.2s]"
        >
          <span className="app-opening-progress block h-full rounded-full" />
        </div>

        <ol className="mt-9 grid w-full grid-cols-4 gap-2 sm:gap-4">
          {steps.map((step, i) => (
            <li
              key={step.label}
              className="app-opening-step relative flex flex-col items-center"
              style={{ ["--step-delay" as string]: `${0.3 + i * 0.9}s` }}
            >
              {i < steps.length - 1 && <span aria-hidden="true" className="app-opening-link" />}
              <span className="app-opening-step-icon relative flex h-14 w-14 items-center justify-center rounded-full sm:h-16 sm:w-16">
                <span className="flex h-full w-full items-center justify-center overflow-hidden rounded-full p-0.5">{step.icon}</span>
                <span aria-hidden="true" className="app-opening-check">
                  <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
                    <path d="m3.5 8.5 3 3 6-6" />
                  </svg>
                </span>
              </span>
              <span className="mt-2.5 text-xs leading-snug text-white/85 sm:text-sm">{step.label}</span>
            </li>
          ))}
        </ol>

        <p className="app-opening-rise mt-8 inline-flex items-center gap-3 rounded-full border border-white/20 bg-black/20 px-5 py-2.5 text-sm text-white/90 [animation-delay:0.5s]">
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
            <rect x="7" y="3" width="10" height="18" rx="2" />
            <path d="M11 18h2" />
          </svg>
          {copy.store} is opening on your {copy.device}.
        </p>
      </div>
    </div>,
    document.body,
  );
}
