"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import {
  localProgress,
  useStageProgress,
} from "@/components/animation/StageProgress";

/**
 * The integrations topic, wired.
 *
 * The section says the software you already run does not have to be replaced;
 * this draws what that actually means. A bus is laid under the list of
 * systems, each system drops a tap onto it in turn, and once a tap lands that
 * system lights and starts putting packets on the bus — which runs off to the
 * right and terminates on a node, at the edge of the gateway the stage is
 * already turning behind the copy. Existing stack on the left, AI layer on
 * the right, one line between them.
 *
 * Nothing here is laid out by hand. The chips are measured where the browser
 * actually put them, so the wiring survives wrapping, resizing and every
 * breakpoint without a magic number per breakpoint.
 *
 * Scroll drives it, but not through a ScrollTrigger: this topic lives on a
 * pinned stage, so its own element never moves and a trigger on it would
 * never fire. It reads the stage's position instead, and eases toward it a
 * few hundredths a frame — a hard flick of the wheel still arrives as a slow
 * build rather than a jump.
 */

/** How fast the drawn state chases the scroll. Low on purpose. */
const EASE_RATE = 0.055;

interface Anchor {
  x: number;
  y: number;
}

interface Geometry {
  width: number;
  height: number;
  /** The bus, and where it sits under the chips. */
  busY: number;
  busFrom: number;
  busTo: number;
  anchors: Anchor[];
}

interface IntegrationWiringProps {
  /** The topic's own box. Chips are measured relative to it. */
  containerRef: RefObject<HTMLDivElement | null>;
}

export function IntegrationWiring({ containerRef }: IntegrationWiringProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [geometry, setGeometry] = useState<Geometry | null>(null);
  const stage = useStageProgress();
  const reduced = useReducedMotion();

  /*
   * Measure. The chips are real laid-out elements, so their positions are
   * read rather than assumed — and re-read whenever the topic changes size,
   * which is the only thing that can move them.
   */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    function measure() {
      const host = containerRef.current;
      if (!host) return;
      const box = host.getBoundingClientRect();
      if (box.width === 0) return;

      const chips = Array.from(
        host.querySelectorAll<HTMLElement>("[data-system-chip]"),
      );
      if (chips.length === 0) return;

      const anchors: Anchor[] = chips.map((chip) => {
        const rect = chip.getBoundingClientRect();
        return {
          x: rect.left - box.left + rect.width / 2,
          y: rect.bottom - box.top,
        };
      });

      // The bus clears the deepest chip row by a hair, which lands it in the
      // gap the layout already leaves above the buttons. Nothing is displaced.
      const busY = Math.max(...anchors.map((a) => a.y)) + 15;

      setGeometry({
        width: box.width,
        height: box.height,
        busY,
        busFrom: Math.min(...anchors.map((a) => a.x)) - 18,
        /*
         * The run stops just past the copy column. Carried any further right
         * it crosses the ground the gateway's own modules berth in, and a
         * terminus sitting on top of a module label is not a terminus you can
         * read. Here it clears the chips, points at the gate, and stays in
         * open space at every width.
         */
        busTo: box.width * 0.62,
        anchors,
      });
    }

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    return () => observer.disconnect();
  }, [containerRef]);

  useGSAP(
    () => {
      const svg = svgRef.current;
      const container = containerRef.current;
      if (!svg || !container || !geometry) return;

      const chips = Array.from(
        container.querySelectorAll<HTMLElement>("[data-system-chip]"),
      );
      const taps = Array.from(svg.querySelectorAll<SVGPathElement>("[data-tap]"));
      const lamps = Array.from(svg.querySelectorAll<SVGElement>("[data-lamp]"));
      const bus = svg.querySelector<SVGPathElement>("[data-bus]");
      const hub = svg.querySelector<SVGGElement>("[data-hub]");
      const packets = Array.from(svg.querySelectorAll<SVGElement>("[data-packet]"));
      if (!bus || !hub) return;

      /*
       * Every drawn line is its own length of dash, so `strokeDashoffset`
       * going to zero draws it end to end. Measured rather than estimated —
       * the bus and the taps are different lengths at every breakpoint.
       */
      const arm = (path: SVGPathElement) => {
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
        return length;
      };
      arm(bus);
      taps.forEach(arm);

      gsap.set(lamps, { opacity: 0, scale: 0.4, transformOrigin: "center" });
      gsap.set(hub, { opacity: 0, scale: 0.5, transformOrigin: "center" });
      gsap.set(packets, { opacity: 0 });

      if (reduced) {
        // Everything connected, nothing moving.
        gsap.set([bus, ...taps], { strokeDashoffset: 0 });
        gsap.set(lamps, { opacity: 1, scale: 1 });
        gsap.set(hub, { opacity: 1, scale: 1 });
        return;
      }

      // The build, as one paused timeline exactly one unit long — so its
      // progress is the topic's progress, with no conversion in between.
      const timeline = gsap.timeline({ paused: true, defaults: { ease: "none" } });
      timeline.to({}, { duration: 1 }, 0);

      timeline.to(bus, { strokeDashoffset: 0, duration: 0.46, ease: "power1.inOut" }, 0.04);

      const spread = 0.52;
      taps.forEach((tap, i) => {
        const at = 0.16 + (i / Math.max(taps.length, 1)) * spread;
        timeline
          .to(tap, { strokeDashoffset: 0, duration: 0.16, ease: "power2.out" }, at)
          .to(lamps[i], { opacity: 1, scale: 1, duration: 0.14, ease: "power2.out" }, at + 0.1)
          // The system itself acknowledging the tap. Brightened only — the
          // chip's own type never drops below where it started.
          .to(
            chips[i],
            {
              borderColor: "rgba(92,200,232,0.5)",
              color: "rgba(226,242,251,0.95)",
              boxShadow: "0 0 24px -10px rgba(92,200,232,0.75)",
              duration: 0.16,
              ease: "power2.out",
            },
            at + 0.08,
          );
      });

      timeline.to(
        hub,
        { opacity: 1, scale: 1, duration: 0.2, ease: "power2.out" },
        0.72,
      );
      timeline.to(packets, { opacity: 1, duration: 0.18 }, 0.76);

      /*
       * Traffic. Deliberately not on the scrubbed timeline: once a system is
       * on the bus it keeps sending whether or not the reader is still
       * scrolling, which is what stops the topic going dead the moment it
       * settles. Slow, and spaced, so it reads as telemetry rather than rain.
       */
      const traffic = packets.map((packet, i) =>
        gsap.fromTo(
          packet,
          { attr: { cx: geometry.busFrom } },
          {
            attr: { cx: geometry.busTo },
            duration: 5.2,
            ease: "none",
            repeat: -1,
            delay: i * 1.75,
          },
        ),
      );

      /* -------------------------------------------------------- the driver */

      let drawn = 0;
      const step = () => {
        const at = stage?.atRef.current?.value ?? 0;
        const target = stage ? localProgress(at, stage.index) : 1;
        drawn += (target - drawn) * EASE_RATE;
        timeline.progress(gsap.utils.clamp(0, 1, drawn));
      };

      if (stage) {
        gsap.ticker.add(step);
      } else {
        // Not on the stage — show the finished wiring rather than nothing.
        timeline.progress(1);
      }

      return () => {
        gsap.ticker.remove(step);
        traffic.forEach((tween) => tween.kill());
        timeline.kill();
      };
    },
    { dependencies: [geometry, reduced, stage?.index] },
  );

  // First paint has nothing to measure against yet. The overlay is purely
  // decorative and absolutely positioned, so there is nothing to reserve.
  if (!geometry) return null;

  const { width, busY, busFrom, busTo, anchors } = geometry;

  return (
    <svg
      ref={svgRef}
      aria-hidden="true"
      viewBox={`0 0 ${width} ${geometry.height}`}
      width={width}
      height={geometry.height}
      /*
       * Behind the copy, never over it: the chips, heading and buttons all
       * paint on top of this, so no hairline can cross a glyph.
       */
      className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-visible"
    >
      {/* The bus. One run from the first system to the AI layer. */}
      <path
        data-bus
        d={`M ${busFrom} ${busY} L ${busTo} ${busY}`}
        fill="none"
        stroke="rgba(92,200,232,0.34)"
        strokeWidth={1}
        vectorEffect="non-scaling-stroke"
      />

      {/* Each system's tap onto it, with the lamp that confirms the link. */}
      {anchors.map((anchor, i) => (
        <g key={i}>
          <path
            data-tap
            d={`M ${anchor.x} ${anchor.y + 2} L ${anchor.x} ${busY}`}
            fill="none"
            stroke="rgba(92,200,232,0.4)"
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
          />
          <circle data-lamp cx={anchor.x} cy={busY} r={2.2} fill="#8fdcf2" />
        </g>
      ))}

      {/* Packets on the run, heading for the layer. */}
      {[0, 1, 2].map((i) => (
        <circle
          key={i}
          data-packet
          cx={busFrom}
          cy={busY}
          r={2}
          fill="#dff6ff"
          opacity={0}
        />
      ))}

      {/*
       * The AI layer the bus terminates on — a hex node, the same figure the
       * gateway behind the stage is built from, so the line reads as arriving
       * somewhere rather than running off the page.
       */}
      <g data-hub transform={`translate(${busTo} ${busY})`}>
        <path
          d="M 0 -7 L 6 -3.5 L 6 3.5 L 0 7 L -6 3.5 L -6 -3.5 Z"
          fill="rgba(92,200,232,0.08)"
          stroke="rgba(143,220,242,0.75)"
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
        />
        <circle cx={0} cy={0} r={1.6} fill="#dff6ff" />
      </g>
    </svg>
  );
}
