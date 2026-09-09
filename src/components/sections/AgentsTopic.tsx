"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { usePinnedTimeline } from "@/hooks/usePinnedTimeline";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { NodeNetwork } from "@/components/animation/NodeNetwork";
import { AGENTS } from "@/data/agents";
import { cn } from "@/lib/utils";
// The vortex spawns its cards from wherever the page-level bulb sits.
import { BULB_Y_OFFSET } from "@/lib/bulb";

const TOTAL_UNITS = AGENTS.length;

// Cards enter, travel the corridor, then the whole composition leaves — as
// fractions of the pinned scroll.
const FORM_END = 0.08;
const TRAVEL_END = 0.84;
const EXIT_START = 0.86;

// The vortex. Each card is born at the bulb and spirals up and outward from
// it, so the bulb reads as the source of the flow rather than something the
// cards merely pass. A card's "age" is how far it has travelled up the helix.
//
//   age 0        -> at the bulb, small
//   age PRIME    -> swung toward the camera, largest and readable
//   age MAX_AGE  -> high above and behind, faded out
const PRIME_AGE = 0.5;
const MAX_AGE = 4;
// Radians of spin per unit of age.
const TURN = 1.15;
// Cards emerge around the bulb's rim rather than dead centre, so the bulb
// stays visible as the source instead of being covered by the nearest card.
const BASE_RADIUS = 255;
// The width the lateral constants below were tuned against, and the card width
// they were tuned around. Narrower viewports have proportionally less room to
// spend on sideways spread once the card itself is subtracted, so the helix
// tightens toward a vertical column rather than flinging cards off-screen.
const DESIGN_WIDTH = 1440;
const DESIGN_CARD_WIDTH = 470;
// Lateral radius growth per unit of age — this is what makes it flare outward
// as it climbs rather than staying a straight column.
const EXPAND = 200;
// Near/far swing of the helix, plus a steady drift away as a card rises.
const Z_AMP = 300;
const Z_RECEDE = 90;
// Upward travel per unit of age.
const RISE = 165;
// Phase, depth and lift used to vary per card, which split the stream into a
// near layer and a shy far layer: the far cards sat deep enough that depthFade
// and the depth blur left them dim and soft, their high lift carried them out
// of the top of the frame before they were readable, and the mixed-sign phase
// offset parked them up to ~90px further right at their prime. Every card now
// rides one identical curve, so each arrives at the same spot, depth and size
// as the one before it.
const PHASE = -0.1;
const DEPTH_BIAS = 1.25;
const LIFT_BIAS = 0.85;


const { clamp, mapRange } = gsap.utils;

export function AgentsTopic() {
  const headingRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);
  const reduced = useReducedMotion();

  const { wrapperRef, pinRef, heightVh } = usePinnedTimeline(
    TOTAL_UNITS,
    null,
    [],
    (progress) => {
      const stage = stageRef.current;
      const heading = headingRef.current;
      const cards = cardRefs.current;
      if (!stage || !heading || cards.some((card) => !card)) return;

      const formIn = clamp(0, 1, mapRange(0, FORM_END, 0, 1, progress));
      const exit = clamp(0, 1, mapRange(EXIT_START, 1, 0, 1, progress));

      gsap.set(heading, { autoAlpha: formIn * (1 - exit), y: (1 - formIn) * -12 });
      // The tail of the scroll carries the whole stream out, so the section
      // hands off in motion instead of freezing then cutting.
      gsap.set(stage, {
        autoAlpha: formIn * (1 - exit),
        y: exit * window.innerHeight * 0.55,
      });


      const focus = clamp(
        0,
        AGENTS.length - 1,
        mapRange(FORM_END, TRAVEL_END, 0, AGENTS.length - 1, progress),
      );

      // Room left for sideways travel once the card itself is accounted for,
      // as a fraction of the room the desktop layout had. Reaches 1 at
      // DESIGN_WIDTH, so the desktop composition is unchanged.
      const cardWidth = Math.min(DESIGN_CARD_WIDTH, window.innerWidth * 0.8);
      const spread = clamp(
        0,
        1,
        (window.innerWidth - cardWidth) / (DESIGN_WIDTH - DESIGN_CARD_WIDTH),
      );
      // Depth keeps a floor so narrow screens still read as layered rather
      // than perfectly flat.
      const depthScale = 0.4 + 0.6 * spread;

      cards.forEach((card, i) => {
        // How far this card has climbed the vortex. Offsetting by PRIME_AGE
        // means a card hits its readable moment exactly as focus reaches it.
        const age = focus - i + PRIME_AGE;

        const video = videoRefs.current[i];

        if (age < 0 || age > MAX_AGE) {
          gsap.set(card, { opacity: 0 });
          if (video && !video.paused) video.pause();
          return;
        }

        // Only the cards actually near the camera bother fetching and playing.
        // With preload="none" the file isn't requested until this fires.
        const shouldPlay = age < 1.6;
        if (video) {
          if (shouldPlay && video.paused) video.play().catch(() => {});
          else if (!shouldPlay && !video.paused) video.pause();
        }

        const theta = age * TURN + PHASE;
        const radius = (BASE_RADIUS + EXPAND * age) * spread;
        const depth =
          (Math.cos(theta) * Z_AMP - age * Z_RECEDE) * DEPTH_BIAS * depthScale;

        // Emerges out of the bulb, then fades once it is high above it.
        // Reaches full size quickly so there is always a dominant card, rather
        // than a gap while one recedes and the next is still emerging.
        const birth = clamp(0, 1, age / 0.3);
        const fadeOut = clamp(0, 1, (MAX_AGE - age) / 0.9);
        // Further away reads dimmer and softer.
        const depthFade = clamp(0.25, 1, (depth + 900) / 1100);

        gsap.set(card, {
          xPercent: -50,
          yPercent: -50,
          x: Math.sin(theta) * radius,
          // Climbs away from the bulb, which anchors the base of the vortex.
          y: BULB_Y_OFFSET - RISE * age * LIFT_BIAS,
          z: depth,
          rotateY: (theta * 180) / Math.PI / 3,
          rotateX: -age * 5,
          scale: 0.35 + birth * 0.65,
          opacity: birth * fadeOut * depthFade * formIn,
          filter: `blur(${clamp(0, 6, (200 - depth) / 120)}px)`,
          // Always above the bulb, which is a backdrop for the whole section.
          zIndex: clamp(1, 90, Math.round(40 + depth / 12)),
          // Receded cards are faint and overlapping, so only the near one is
          // allowed to take the hover.
          pointerEvents: age < 1.1 ? "auto" : "none",
        });
      });
    },
  );


  return (
    <div
      id="ai-agents"
      ref={wrapperRef}
      className="relative"
      style={reduced ? undefined : { height: `${heightVh}vh` }}
    >
      <div className="absolute inset-0 -z-10">
        <NodeNetwork
          className="h-full w-full"
          density={1 / 32000}
          lineColor="150, 180, 255"
          dotColor="200, 215, 255"
        />
      </div>


      <div
        ref={pinRef}
        className={cn(
          "relative z-10 flex flex-col items-center px-6",
          reduced ? "gap-12 py-24" : "h-screen justify-center overflow-hidden",
        )}
      >
        <div
          ref={headingRef}
          className={cn(
            "text-center",
            reduced ? "relative" : "absolute top-20 left-1/2 z-[60] w-full max-w-md -translate-x-1/2 px-6 sm:top-24",
          )}
        >
          <p className="text-[11px] font-medium uppercase tracking-[0.4em] text-foreground/40">01</p>
          <h2 className="font-display mt-2 text-2xl font-normal tracking-tight text-foreground sm:mt-3 sm:text-4xl">
            AI Agents
          </h2>
          <p className="mx-auto mt-2 max-w-md text-xs text-hero-sub opacity-70 sm:text-sm">
            AI assistants designed around your actual business processes.
          </p>
        </div>

        <div
          ref={stageRef}
          className={cn(reduced ? "flex w-full max-w-xl flex-col gap-6" : "absolute inset-0")}
        >
          <div
            className={cn(!reduced && "absolute inset-0")}
            style={reduced ? undefined : { perspective: 1000 }}
          >
            {AGENTS.map((agent, i) => (
              <div
                key={agent.name}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                className={cn(
                  "liquid-glass agent-card overflow-hidden rounded-3xl border",
                  !reduced &&
                    "absolute top-1/2 left-1/2 h-[min(280px,48vw)] w-[min(470px,80vw)] bg-[#0c0718]/70",
                  reduced ? "border-white/10 p-6 sm:p-8" : "p-5 sm:p-8",
                )}
                style={
                  reduced
                    ? undefined
                    : {
                        willChange: "transform, filter, opacity",
                        // Each agent carries its own accent while the body stays
                        // dark, so the stream reads as one system. Read by the
                        // .agent-card border and hover rules.
                        ["--agent-accent" as string]: agent.accent,
                      }
                }
              >
                {!reduced && (
                  <>
                    {/* Sits faintly behind the copy. Muted and metadata-only
                        until the card is close enough to be worth playing. */}
                    <video
                      ref={(el) => {
                        videoRefs.current[i] = el;
                      }}
                      src={agent.video}
                      muted
                      loop
                      playsInline
                      preload="none"
                      aria-hidden="true"
                      className="agent-card__video pointer-events-none absolute inset-0 h-full w-full object-cover opacity-60"
                    />
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0"
                      style={{
                        // Enough scrim to keep the copy legible, but light
                        // enough that the clip still reads through it.
                        background: `linear-gradient(135deg, ${agent.accent}33, rgba(12,7,24,0.55) 58%)`,
                      }}
                    />
                  </>
                )}
                <div className="relative">
                  <p
                    className="text-[11px] font-medium uppercase tracking-[0.25em] sm:tracking-[0.3em]"
                    style={reduced ? undefined : { color: agent.accent }}
                  >
                    Agent {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="font-display mt-2 text-lg font-normal leading-tight tracking-tight text-foreground sm:mt-3 sm:text-2xl">
                    {agent.name}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-white/70 sm:mt-3 sm:text-sm">
                    {agent.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
