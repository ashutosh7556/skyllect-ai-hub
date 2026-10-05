"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { AppOpening } from "@/components/app-download/AppOpening";
import type { MobilePlatform } from "@/lib/app-platform";

const POLL_MS = 2000;
/** Matches the server's session lifetime; after this the code can no longer be tracked. */
const STOP_AFTER_MS = 15 * 60 * 1000;

const PLATFORM_COPY: Record<MobilePlatform, { device: string; store: string }> = {
  ios: { device: "iPhone", store: "the App Store" },
  android: { device: "Android phone", store: "Google Play" },
};

/** Twinkling dots around the icon: left %, top %, size px, delay s. */
const SPARKLES: [number, number, number, number][] = [
  [14, 22, 4, 0],
  [82, 16, 3, 0.4],
  [88, 52, 5, 0.9],
  [10, 60, 3, 1.3],
  [26, 8, 3, 0.7],
  [70, 70, 4, 0.2],
  [52, 6, 3, 1.1],
  [20, 78, 4, 0.5],
];

type Status = { state: "waiting" } | { state: "scanned"; platform: MobilePlatform; at: number };

/**
 * The QR code and the line under it. Polls the server until a phone scans
 * this view's code, then plays the full-screen opening animation over the
 * page and swaps the code for the glowing icon scene. Nothing moves
 * or changes before a scan: if the server cannot find the session, the card
 * simply stays a plain QR code.
 */
export function ScanStatus({
  sessionId,
  qrSvg,
  qrUrl,
  icon,
}: {
  sessionId: string;
  qrSvg: string;
  qrUrl: string;
  icon: string;
}) {
  const [status, setStatus] = useState<Status>({ state: "waiting" });
  // Time of the scan last shown, so "Show the code again" only reacts to a new one.
  const [seenAt, setSeenAt] = useState(0);

  useEffect(() => {
    if (status.state !== "waiting") return;
    let stopped = false;
    const startedAt = Date.now();

    async function check() {
      // Skip while the tab is in the background; the next visible tick catches up.
      if (document.hidden) return;
      if (Date.now() - startedAt > STOP_AFTER_MS) {
        clearInterval(timer);
        return;
      }
      try {
        const res = await fetch(`/app/tkps/status?s=${sessionId}`, { cache: "no-store" });
        const data: { status: string; scan: { platform: MobilePlatform; at: number } | null } = await res.json();
        if (stopped) return;
        if (data.scan && data.scan.at > seenAt) setStatus({ state: "scanned", ...data.scan });
      } catch {
        // Network blip: try again on the next tick.
      }
    }

    const timer = setInterval(check, POLL_MS);
    return () => {
      stopped = true;
      clearInterval(timer);
    };
  }, [sessionId, status.state, seenAt]);

  const scanned = status.state === "scanned" ? PLATFORM_COPY[status.platform] : null;

  // Back to the code; remember this scan so only a newer one reopens the screen.
  const dismiss = useCallback(() => {
    setStatus((current) => {
      if (current.state === "scanned") setSeenAt(current.at);
      return { state: "waiting" };
    });
  }, []);

  return (
    <>
      {status.state === "scanned" && <AppOpening platform={status.platform} appIcon={icon} onClose={dismiss} />}

      <div className="relative mx-auto mt-5 aspect-square w-full max-w-[260px] overflow-hidden rounded-2xl bg-white p-4">
        <div
          className={`relative h-full w-full transition-[opacity,filter,transform] duration-500 motion-reduce:transition-none ${
            scanned ? "scale-95 opacity-15 blur-[2px]" : ""
          }`}
        >
          <div aria-hidden="true" className="h-full w-full [&>svg]:h-full [&>svg]:w-full" dangerouslySetInnerHTML={{ __html: qrSvg }} />
          <Image
            src={icon}
            alt=""
            width={256}
            height={256}
            className="absolute top-1/2 left-1/2 h-[22%] w-[22%] -translate-x-1/2 -translate-y-1/2 rounded-lg border-[3px] border-white"
          />
        </div>

        {scanned && (
          // The app icon rising from a glowing platform, circled by orbits.
          <div aria-hidden="true" className="scan-scene">
            <span className="scan-beam" />
            <span className="scan-platform">
              <span className="scan-platform-ring scan-platform-ring--outer" />
              <span className="scan-platform-ring scan-platform-ring--mid" />
              <span className="scan-platform-ring scan-platform-ring--inner" />
            </span>
            <span className="scan-orbit scan-orbit--back" />
            <span className="scan-icon">
              <Image src={icon} alt="" width={256} height={256} className="h-full w-full rounded-[22%]" />
            </span>
            <span className="scan-orbit scan-orbit--front" />
            <span className="scan-orbit scan-orbit--blue" />
            {SPARKLES.map(([left, top, size, delay]) => (
              <span
                key={`${left}-${top}`}
                className="scan-sparkle"
                style={{ left: `${left}%`, top: `${top}%`, width: size, height: size, animationDelay: `${delay}s` }}
              />
            ))}
          </div>
        )}

        <span className="sr-only">QR code linking to {qrUrl}</span>
      </div>

      {/* Announced to screen readers when it changes. */}
      <div aria-live="polite">
        {scanned ? (
          <div key="scanned" className="scan-fade-in">
            <p className="mt-6 font-display text-lg font-medium text-[#4ade80]">Scanned!</p>
            <p className="mt-1.5 text-sm leading-relaxed text-white/55">
              Opening {scanned.store} on your {scanned.device}
              <span aria-hidden="true" className="scan-dots" />
            </p>
            <button
              type="button"
              onClick={dismiss}
              className="mt-3 text-sm font-medium text-indigo-300 hover:underline"
            >
              Show the code again
            </button>
          </div>
        ) : (
          <>
            <p className="mt-6 font-display text-lg font-medium text-white">Point your phone camera here</p>
            <p className="mt-1.5 text-sm leading-relaxed text-white/55">
              Works on iPhone and Android. Your phone opens the right store automatically.
            </p>
          </>
        )}
      </div>
    </>
  );
}
