Drop the licensed hero background video here as `hero-bg.mp4`.

Referenced by [BackgroundVideo.tsx](../../src/components/animation/BackgroundVideo.tsx) via `src/components/sections/Hero.tsx`. Until a real file exists, the `<video>` element simply fails to load and the hero falls back to the dark background — no crash, no console-blocking error.

Recommended: H.264 mp4, under ~8MB, 1920x1080 or smaller, no audio track needed (muted).
