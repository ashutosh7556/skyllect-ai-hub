"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { MobilePlatform } from "@/lib/app-platform";

const POLL_MS = 2000;
/** Matches the server's session lifetime; after this the code can no longer be tracked. */
const STOP_AFTER_MS = 15 * 60 * 1000;

const PLATFORM_COPY: Record<MobilePlatform, { device: string; store: string }> = {
  ios: { device: "iPhone", store: "the App Store" },
  android: { device: "Android phone", store: "Google Play" },
};

type Status = { state: "waiting" } | { state: "scanned"; platform: MobilePlatform; at: number };

/**
 * The QR code and the line under it. Polls the server until a phone scans
 * this view's code, then swaps the code for an animated tick. Nothing moves
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

  return (
    <>
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
          <div className="absolute inset-0 flex items-center justify-center">
            <span aria-hidden="true" className="scan-ring" />
            <span aria-hidden="true" className="scan-ring [animation-delay:0.35s]" />
            <svg aria-hidden="true" viewBox="0 0 52 52" className="scan-tick relative h-24 w-24">
              <circle cx="26" cy="26" r="25" fill="#16a34a" />
              <path d="M15 27l7 7 15-16" fill="none" stroke="#fff" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
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
              onClick={() => {
                if (status.state === "scanned") setSeenAt(status.at);
                setStatus({ state: "waiting" });
              }}
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
