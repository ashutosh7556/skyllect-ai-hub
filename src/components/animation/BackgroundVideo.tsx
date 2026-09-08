"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const FADE_MS = 500;
const RESTART_DELAY_MS = 100;

interface BackgroundVideoProps {
  src: string;
  className?: string;
}

/**
 * Loops a background video with a manual crossfade: fades in over the first
 * 500ms, fades out over the last 500ms, then pauses briefly before replaying
 * from the start. Avoids the hard cut of a native `loop` attribute.
 */
export function BackgroundVideo({ src, className }: BackgroundVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const video = videoRef.current;
    if (!video || reduced) return;

    let frameId: number;
    video.style.opacity = "0";

    const tick = () => {
      const duration = video.duration || 0;
      if (duration > 0) {
        const elapsed = video.currentTime;
        const remaining = duration - elapsed;
        const fadeSeconds = FADE_MS / 1000;

        let opacity = 1;
        if (elapsed < fadeSeconds) opacity = elapsed / fadeSeconds;
        else if (remaining < fadeSeconds) opacity = Math.max(remaining / fadeSeconds, 0);

        video.style.opacity = String(opacity);
      }
      frameId = requestAnimationFrame(tick);
    };

    const handleEnded = () => {
      video.style.opacity = "0";
      setTimeout(() => {
        video.currentTime = 0;
        video.play().catch(() => {});
      }, RESTART_DELAY_MS);
    };

    video.addEventListener("ended", handleEnded);
    video.play().catch(() => {});
    frameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frameId);
      video.removeEventListener("ended", handleEnded);
    };
  }, [reduced]);

  if (reduced) return null;

  return (
    <video
      ref={videoRef}
      className={className}
      src={src}
      muted
      playsInline
      preload="auto"
      aria-hidden="true"
    />
  );
}
