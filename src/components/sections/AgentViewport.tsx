"use client";

import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { HudVariant } from "@/data/agents";

/**
 * The machine viewport an agent's clip is shown through.
 *
 * The clip is the subject: everything drawn over it is a hairline, a spark or
 * a one-pixel sweep, and the heaviest thing on top of the footage is a corner
 * tint. What the HUD is doing is describing the clip — brackets framing it, a
 * scan passing over it, a light running the frame, and one figure per agent
 * that says what that agent actually works on.
 *
 * Cost control:
 *  - every loop lives on one paused timeline per card, resumed only while the
 *    card is on screen, and the clip plays on the same condition;
 *  - hover does not start anything new, it just raises `timeScale`;
 *  - under prefers-reduced-motion nothing is built at all and the viewport is
 *    a still, lit frame.
 */

/** Idle pace, and the pace once the module is being looked at. */
const IDLE_RATE = 1;
const ACTIVE_RATE = 1.9;

interface AgentViewportProps {
  src: string;
  variant: HudVariant;
  /** True while the pointer is over the module this viewport belongs to. */
  active: boolean;
  /**
   * Position in the grid. Published on the element as `data-agent-stage` so
   * AgentScenes can find this viewport and draw that agent's 3D rig into it.
   */
  index: number;
}

/* ------------------------------------------------------------------ layers */

/**
 * The per-agent figure. Kept to a handful of absolutely positioned hairlines
 * and dots — no SVG scaling, no filters — so each one is a few transforms a
 * frame no matter how wide the card is.
 */
function VariantLayer({ variant }: { variant: HudVariant }) {
  switch (variant) {
    // Sales: signal flowing along the pipeline, left to right.
    case "flow":
      return (
        <>
          {[30, 50, 70].map((top) => (
            <span
              key={top}
              aria-hidden="true"
              className="absolute left-0 h-px w-full bg-accent/12"
              style={{ top: `${top}%` }}
            />
          ))}
          {[30, 50, 70].map((top) => (
            <span
              key={`d-${top}`}
              data-flow
              aria-hidden="true"
              className="absolute left-0 h-px w-8 bg-gradient-to-r from-transparent via-accent to-transparent"
              style={{ top: `${top}%` }}
            />
          ))}
        </>
      );

    // Support: turns of a conversation, arriving one after another.
    case "chat":
      return (
        <>
          {[
            { left: 12, width: 22 },
            { left: 40, width: 14 },
            { left: 20, width: 30 },
            { left: 56, width: 18 },
          ].map((bubble, i) => (
            <span
              key={i}
              data-chat
              aria-hidden="true"
              className="absolute bottom-3 h-1.5 rounded-full border border-accent/40 bg-accent/10"
              style={{ left: `${bubble.left}%`, width: `${bubble.width}%` }}
            />
          ))}
        </>
      );

    // Logistics: a leg of a route, with something moving along it.
    case "route":
      return (
        <>
          <span
            aria-hidden="true"
            className="absolute top-[62%] left-[10%] h-px w-[34%] bg-accent/25"
          />
          <span
            aria-hidden="true"
            className="absolute top-[38%] left-[42%] h-px w-[26%] origin-left rotate-[-16deg] bg-accent/25"
          />
          <span
            aria-hidden="true"
            className="absolute top-[30%] left-[66%] h-px w-[24%] bg-accent/25"
          />
          {[10, 44, 68, 90].map((left, i) => (
            <span
              key={left}
              aria-hidden="true"
              className="absolute h-1 w-1 -translate-x-1/2 -translate-y-1/2 rotate-45 border border-accent/55"
              style={{ left: `${left}%`, top: `${[62, 38, 30, 30][i]}%` }}
            />
          ))}
          <span
            data-route-dot
            aria-hidden="true"
            className="absolute top-[62%] left-[10%] h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-soft shadow-[0_0_8px_2px_rgba(92,200,232,0.55)]"
          />
        </>
      );

    // Procurement: quotes weighed against one another.
    case "nodes":
      return (
        <>
          <span
            aria-hidden="true"
            className="absolute top-[46%] left-[22%] h-px w-[26%] origin-left rotate-[18deg] bg-accent/22"
          />
          <span
            aria-hidden="true"
            className="absolute top-[46%] left-[22%] h-px w-[26%] origin-left rotate-[-20deg] bg-accent/22"
          />
          <span
            aria-hidden="true"
            className="absolute top-[64%] left-[48%] h-px w-[22%] origin-left rotate-[-26deg] bg-accent/22"
          />
          {[
            { left: 22, top: 46 },
            { left: 48, top: 64 },
            { left: 48, top: 28 },
            { left: 70, top: 38 },
          ].map((node, i) => (
            <span
              key={i}
              data-node
              aria-hidden="true"
              className="absolute h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/60 bg-accent/20"
              style={{ left: `${node.left}%`, top: `${node.top}%` }}
            />
          ))}
        </>
      );

    // Operations: every system reporting in, in step.
    case "sync":
      return (
        <div
          aria-hidden="true"
          className="absolute right-3 bottom-3 left-3 flex h-6 items-end gap-1.5"
        >
          {Array.from({ length: 7 }).map((_, i) => (
            <span
              key={i}
              data-bar
              className="h-full flex-1 origin-bottom rounded-[1px] bg-gradient-to-t from-accent/50 to-accent/5"
              style={{ transform: "scaleY(0.25)" }}
            />
          ))}
        </div>
      );

    // Documents: fields being found and lifted off the page.
    case "scan":
      return (
        <>
          {[
            { top: 26, left: 14, width: 34 },
            { top: 46, left: 14, width: 22 },
            { top: 66, left: 14, width: 40 },
          ].map((field, i) => (
            <span
              key={i}
              data-field
              aria-hidden="true"
              className="absolute h-1.5 border border-accent/45 bg-accent/10"
              style={{ top: `${field.top}%`, left: `${field.left}%`, width: `${field.width}%` }}
            />
          ))}
          <span
            data-column
            aria-hidden="true"
            className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-accent/70 to-transparent"
          />
        </>
      );

    // Knowledge: a question propagating out through what the company knows.
    case "neural":
      return (
        <>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              data-ring
              aria-hidden="true"
              className="absolute top-1/2 left-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/45"
            />
          ))}
          <span
            aria-hidden="true"
            className="absolute top-1/2 left-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-soft shadow-[0_0_8px_2px_rgba(92,200,232,0.5)]"
          />
          {[
            { left: 26, top: 30 },
            { left: 74, top: 34 },
            { left: 32, top: 72 },
            { left: 70, top: 70 },
          ].map((node, i) => (
            <span
              key={i}
              data-satellite
              aria-hidden="true"
              className="absolute h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/70"
              style={{ left: `${node.left}%`, top: `${node.top}%` }}
            />
          ))}
        </>
      );
  }
}

/* ------------------------------------------------------------- the viewport */

export function AgentViewport({ src, variant, active, index }: AgentViewportProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const statusRef = useRef<gsap.core.Timeline | null>(null);
  const onScreenRef = useRef(false);
  const reduced = useReducedMotion();

  // The read-out timeline outlives any single hover, so it is killed on the
  // way out rather than by the hover effect's own cleanup.
  useEffect(
    () => () => {
      statusRef.current?.kill();
    },
    [],
  );

  /* The ambient loops. Built once, then parked until the card is visible. */
  useGSAP(
    () => {
      if (reduced) return;

      const timeline = gsap.timeline({ paused: true, defaults: { ease: "none" } });
      timelineRef.current = timeline;

      // The sweep passing over the footage. One pixel tall, gone for most of
      // the cycle — a pass of light, not a shutter.
      timeline.fromTo(
        "[data-sweep]",
        { yPercent: -260, opacity: 0 },
        {
          yPercent: 2600,
          opacity: 1,
          duration: 3.6,
          repeat: -1,
          repeatDelay: 1.4,
          ease: "power1.inOut",
        },
        0,
      );

      // The wider band the hard line rides in.
      timeline.fromTo(
        "[data-scan]",
        { yPercent: -120, opacity: 0 },
        {
          yPercent: 460,
          opacity: 1,
          duration: 3.6,
          repeat: -1,
          repeatDelay: 1.4,
          ease: "power1.inOut",
        },
        0,
      );

      // Charge arriving from the machine, in at both ports.
      timeline.fromTo(
        '[data-charge="left"]',
        { x: 0, opacity: 0 },
        { x: 22, opacity: 1, duration: 1.1, repeat: -1, repeatDelay: 0.9, ease: "power2.out" },
        0,
      );
      timeline.fromTo(
        '[data-charge="right"]',
        { x: 0, opacity: 0 },
        { x: -22, opacity: 1, duration: 1.1, repeat: -1, repeatDelay: 0.9, ease: "power2.out" },
        0.55,
      );

      // The light running the frame. `pathLength` normalises the perimeter to
      // 1, so the dash fractions hold at any card width.
      timeline.to(
        "[data-perimeter]",
        { strokeDashoffset: -1, duration: 7, repeat: -1 },
        0,
      );

      // Brackets breathing against the corners.
      timeline.to(
        "[data-bracket]",
        {
          opacity: 0.95,
          duration: 1.9,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          stagger: { each: 0.22, from: "random" },
        },
        0,
      );

      // Loose data points drifting in the frame.
      timeline.to(
        "[data-mote]",
        {
          y: -14,
          opacity: 0.85,
          duration: 3.2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          stagger: { each: 0.5, from: "random" },
        },
        0,
      );

      switch (variant) {
        case "flow":
          timeline.fromTo(
            "[data-flow]",
            { xPercent: -60, opacity: 0 },
            {
              xPercent: 460,
              opacity: 1,
              duration: 2.6,
              repeat: -1,
              stagger: 0.55,
              ease: "power1.inOut",
            },
            0,
          );
          break;

        case "chat":
          timeline.fromTo(
            "[data-chat]",
            { opacity: 0, y: 8, scaleX: 0.6 },
            {
              opacity: 1,
              y: 0,
              scaleX: 1,
              duration: 0.5,
              repeat: -1,
              repeatDelay: 2.6,
              stagger: 0.45,
              ease: "power2.out",
            },
            0,
          );
          break;

        case "route": {
          // Three legs of the run, one after another, then back to the depot.
          // Nested rather than added to the master directly: the master holds
          // other infinitely repeating tweens, so its own duration is endless
          // and a `repeat` on it would never come round.
          const run = gsap.timeline({ repeat: -1, defaults: { ease: "none" } });
          run
            .to("[data-route-dot]", { left: "44%", top: "62%", duration: 1.1 })
            .to("[data-route-dot]", { left: "68%", top: "30%", duration: 1.1 })
            .to("[data-route-dot]", { left: "90%", top: "30%", duration: 0.9 })
            .to("[data-route-dot]", { opacity: 0, duration: 0.3 })
            .set("[data-route-dot]", { left: "10%", top: "62%" })
            .to("[data-route-dot]", { opacity: 1, duration: 0.3 });
          timeline.add(run, 0);
          break;
        }

        case "nodes":
          timeline.to(
            "[data-node]",
            {
              scale: 1.7,
              opacity: 1,
              duration: 0.6,
              repeat: -1,
              yoyo: true,
              repeatDelay: 1.1,
              stagger: 0.3,
              ease: "power2.inOut",
            },
            0,
          );
          break;

        case "sync":
          timeline.to(
            "[data-bar]",
            {
              scaleY: 1,
              duration: 0.9,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
              stagger: 0.12,
            },
            0,
          );
          break;

        case "scan":
          timeline
            .fromTo(
              "[data-column]",
              { xPercent: 0 },
              { xPercent: 100, duration: 3.2, repeat: -1, ease: "power1.inOut" },
              0,
            )
            .to(
              "[data-field]",
              {
                opacity: 1,
                borderColor: "rgba(143,220,242,0.85)",
                duration: 0.35,
                repeat: -1,
                yoyo: true,
                repeatDelay: 2.4,
                stagger: 0.8,
              },
              0.4,
            );
          break;

        case "neural":
          timeline
            .fromTo(
              "[data-ring]",
              { scale: 0.3, opacity: 0.7 },
              {
                scale: 2.6,
                opacity: 0,
                duration: 2.8,
                repeat: -1,
                stagger: 0.9,
                ease: "power1.out",
              },
              0,
            )
            .to(
              "[data-satellite]",
              {
                scale: 1.9,
                opacity: 1,
                duration: 0.8,
                repeat: -1,
                yoyo: true,
                stagger: 0.35,
                ease: "sine.inOut",
              },
              0,
            );
          break;
      }

      timeline.timeScale(IDLE_RATE);

      return () => {
        timeline.kill();
        timelineRef.current = null;
      };
    },
    { scope: rootRef, dependencies: [reduced, variant] },
  );

  /*
   * Off-screen cards cost nothing: no decoding, no tweening. The clip plays
   * whenever the module is in view — it is the subject of the card, so it
   * should be running, not waiting for a hover.
   */
  useEffect(() => {
    const root = rootRef.current;
    const video = videoRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        onScreenRef.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          timelineRef.current?.play();
          if (!reduced) video?.play().catch(() => {});
        } else {
          timelineRef.current?.pause();
          video?.pause();
        }
      },
      { rootMargin: "120px" },
    );
    observer.observe(root);

    const handleVisibility = () => {
      if (document.hidden) {
        timelineRef.current?.pause();
        video?.pause();
      } else if (onScreenRef.current) {
        timelineRef.current?.play();
        if (!reduced) video?.play().catch(() => {});
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [reduced]);

  /*
   * Hover. The clip lifts and brightens, the HUD speeds up, and the read-out
   * walks idle → scanning → processing → active. Nothing restarts: the same
   * loops simply run faster, which is why moving the pointer across the grid
   * never produces a stutter.
   *
   * Deliberately a plain effect rather than useGSAP: a useGSAP context
   * reverts everything it created when its dependencies change, which would
   * snap the clip back to its resting scale the instant the pointer moved
   * instead of letting the leave tween ease it there.
   */
  useEffect(() => {
    const root = rootRef.current;
    const video = videoRef.current;
    const label = labelRef.current;
    const percent = percentRef.current;
    if (!root || !video || !label || !percent) return;

    if (reduced) {
      label.textContent = "ONLINE";
      percent.textContent = "100%";
      return;
    }

    const brackets = root.querySelectorAll("[data-bracket]");
    const perimeter = root.querySelector("[data-perimeter]");
    const statusDot = root.querySelector("[data-status-dot]");

    // Filter has to be written as a whole string, so it is driven from a
    // proxy rather than tweened directly.
    const grade = { brightness: active ? 1 : 1.22, saturation: active ? 0.85 : 1.05 };
    const applyGrade = () => {
      video.style.filter = `brightness(${grade.brightness}) saturate(${grade.saturation})`;
    };

    const timeline = timelineRef.current;
    const tweens: gsap.core.Tween[] = [];

    if (active) {
      tweens.push(
        gsap.to(timeline, { timeScale: ACTIVE_RATE, duration: 0.6, ease: "power2.out" }),
        gsap.to(video, { scale: 1.03, duration: 0.7, ease: "power3.out" }),
        gsap.to(grade, {
          brightness: 1.22,
          saturation: 1.05,
          duration: 0.7,
          ease: "power3.out",
          onUpdate: applyGrade,
        }),
        gsap.to(brackets, {
          "--bracket-offset": "-3px",
          borderColor: "rgba(143,220,242,0.9)",
          duration: 0.5,
          ease: "power3.out",
        }),
        gsap.to(perimeter, { strokeOpacity: 0.95, duration: 0.5 }),
        gsap.to(statusDot, { scale: 1.4, duration: 0.4, ease: "power2.out" }),
        // The frame lighting up as the charge arrives. A one-shot flash that
        // settles to a held glow, rather than a state the border sits in.
        gsap.fromTo(
          root,
          { boxShadow: "0 0 0 0 rgba(92,200,232,0)" },
          {
            boxShadow: "0 0 30px -6px rgba(92,200,232,0.6)",
            duration: 0.55,
            ease: "power2.out",
          },
        ),
      );

      // The read-out walks its states for as long as the pointer stays.
      const readout = { value: 0 };
      statusRef.current?.kill();
      statusRef.current = gsap
        .timeline()
        .call(() => {
          label.textContent = "SCANNING";
        })
        .to(readout, {
          value: 98,
          duration: 1.2,
          delay: 0.45,
          ease: "power1.inOut",
          onStart: () => {
            label.textContent = "PROCESSING";
          },
          onUpdate: () => {
            percent.textContent = `${Math.round(readout.value)}%`;
          },
        })
        .call(() => {
          label.textContent = "ACTIVE";
          percent.textContent = "100%";
        });
    } else {
      statusRef.current?.kill();
      statusRef.current = null;
      label.textContent = "ONLINE";
      percent.textContent = "100%";

      tweens.push(
        gsap.to(timeline, { timeScale: IDLE_RATE, duration: 0.8, ease: "power2.out" }),
        gsap.to(video, { scale: 1, duration: 0.8, ease: "power3.out" }),
        gsap.to(grade, {
          brightness: 1,
          saturation: 0.85,
          duration: 0.8,
          ease: "power3.out",
          onUpdate: applyGrade,
        }),
        gsap.to(brackets, {
          "--bracket-offset": "0px",
          borderColor: "rgba(92,200,232,0.5)",
          duration: 0.6,
          ease: "power3.out",
        }),
        gsap.to(perimeter, { strokeOpacity: 0.55, duration: 0.6 }),
        gsap.to(statusDot, { scale: 1, duration: 0.5, ease: "power2.out" }),
        gsap.to(root, {
          boxShadow: "0 0 0 0 rgba(92,200,232,0)",
          duration: 0.7,
          ease: "power2.out",
        }),
      );
    }

    // Only the in-flight tweens are cancelled on the next hover change —
    // whatever they had reached stays put, and the new tweens pick up from
    // there.
    return () => tweens.forEach((tween) => tween.kill());
  }, [active, reduced]);

  return (
    <div
      ref={rootRef}
      data-agent-stage={index}
      /*
       * Read by MachineCore: this element is both the rectangle its cable
       * docks onto and the flag that tells it which module is live. An empty
       * string rather than "true" so `dataset.active === ""` is the test.
       */
      data-active={active ? "" : undefined}
      /*
       * Height comes from the board, not from here. AgentsTopic measures what
       * the window can actually give three rows of cards and sets
       * `--agent-media` to suit, so the clip is as large as it can be without
       * pushing the last row off the screen. The fallback is the old fixed
       * size, for anything that renders this outside that board.
       */
      className="relative mb-3 h-[var(--agent-media,5.25rem)] w-full overflow-hidden rounded-lg border border-edge bg-surface"
    >
      <video
        ref={videoRef}
        src={src}
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ filter: "brightness(1) saturate(0.85)", willChange: "transform" }}
      />

      {/* The only heavy thing over the clip: a corner tint that keeps the
          HUD legible against bright frames. Deliberately weak in the middle,
          where the footage is. */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(155deg, rgba(92,200,232,0.10) 0%, rgba(4,6,11,0.12) 42%, rgba(4,6,11,0.62) 100%)",
        }}
      />

      {/* Frame light. preserveAspectRatio="none" plus a non-scaling stroke
          keeps the line one pixel wide whatever shape the card is. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 h-full w-full"
      >
        <rect
          data-perimeter
          x="0.5"
          y="0.5"
          width="99"
          height="99"
          rx="2"
          fill="none"
          stroke="#8fdcf2"
          strokeOpacity={0.55}
          strokeWidth={1.2}
          pathLength={1}
          strokeDasharray="0.12 0.88"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* Corner brackets. The inset is a custom property, so hover pushes all
          four outward without anything having to know where they sit. */}
      {(
        [
          ["border-t border-l", { top: 0, left: 0 }],
          ["border-t border-r", { top: 0, right: 0 }],
          ["border-b border-l", { bottom: 0, left: 0 }],
          ["border-b border-r", { bottom: 0, right: 0 }],
        ] as const
      ).map(([edges, corner]) => {
        const inset = "calc(6px + var(--bracket-offset, 0px))";
        const placement = Object.fromEntries(
          Object.keys(corner).map((side) => [side, inset]),
        );
        return (
          <span
            key={edges}
            data-bracket
            aria-hidden="true"
            className={`absolute h-3 w-3 opacity-60 ${edges}`}
            style={{ borderColor: "rgba(92,200,232,0.5)", ...placement }}
          />
        );
      })}

      {/* Technical ticks along the top edge. */}
      <div aria-hidden="true" className="absolute top-0 right-9 flex gap-1">
        {[3, 5, 3, 7].map((height, i) => (
          <span key={i} className="w-px bg-accent/35" style={{ height }} />
        ))}
      </div>

      {/* The pass of light: a soft band with a hard line at its head, so the
          scan reads as a beam crossing the frame rather than as a hairline. */}
      <span
        data-scan
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-7 bg-gradient-to-b from-transparent via-accent/12 to-transparent"
      />
      <span
        data-sweep
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-soft/80 to-transparent"
      />

      {/*
       * Dock ports. This is where MachineCore lands its cable — it picks
       * whichever side faces the machine, so both are here and both are live.
       * The charge arriving is a dot running a short way in from the port,
       * which is what ties the panel to the cable feeding it.
       */}
      <span
        aria-hidden="true"
        className="absolute top-1/2 left-0 h-5 w-[3px] -translate-y-1/2 rounded-r-sm bg-accent/55 shadow-[0_0_8px_1px_rgba(92,200,232,0.4)]"
      />
      <span
        aria-hidden="true"
        className="absolute top-1/2 right-0 h-5 w-[3px] -translate-y-1/2 rounded-l-sm bg-accent/55 shadow-[0_0_8px_1px_rgba(92,200,232,0.4)]"
      />
      <span
        data-charge="left"
        aria-hidden="true"
        className="absolute top-1/2 left-1 h-1 w-1 -translate-y-1/2 rounded-full bg-accent-soft shadow-[0_0_6px_1px_rgba(92,200,232,0.6)]"
      />
      <span
        data-charge="right"
        aria-hidden="true"
        className="absolute top-1/2 right-1 h-1 w-1 -translate-y-1/2 rounded-full bg-accent-soft shadow-[0_0_6px_1px_rgba(92,200,232,0.6)]"
      />

      {/* Loose data points. */}
      {[
        { left: 18, top: 22 },
        { left: 62, top: 18 },
        { left: 84, top: 52 },
        { left: 38, top: 78 },
        { left: 8, top: 62 },
      ].map((mote, i) => (
        <span
          key={i}
          data-mote
          aria-hidden="true"
          className="absolute h-px w-px rounded-full bg-accent-soft opacity-40 shadow-[0_0_5px_1px_rgba(92,200,232,0.5)]"
          style={{ left: `${mote.left}%`, top: `${mote.top}%` }}
        />
      ))}

      <VariantLayer variant={variant} />

      {/* Read-out. Sits inside the viewport so the card's own layout is
          untouched. */}
      <div
        aria-hidden="true"
        className="absolute bottom-1.5 left-2 flex items-center gap-1.5 font-mono text-[8px] tracking-[0.18em] text-accent/85 uppercase"
      >
        <span
          data-status-dot
          className="h-1 w-1 rounded-full bg-accent shadow-[0_0_6px_1px_rgba(92,200,232,0.7)]"
        />
        <span ref={labelRef}>ONLINE</span>
        <span ref={percentRef} className="text-muted/70">
          100%
        </span>
      </div>
    </div>
  );
}
