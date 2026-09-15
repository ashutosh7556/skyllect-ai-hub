"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { SystemsLattice } from "@/components/animation/SystemsLattice";
import { TiltCard } from "@/components/animation/TiltCard";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

const CONNECTED_SYSTEMS = [
  "CRM",
  "ERP",
  "Email",
  "WhatsApp",
  "Inventory",
  "Accounting software",
  "Internal databases",
  "Customer portals",
  "Third-party APIs",
];

/**
 * Scroll length of the pin. The stage timeline and the lattice behind it both
 * run on this, so the wiring energises in step with the copy rather than on
 * its own schedule.
 */
const PIN_LENGTH = 3200;

const CAPABILITIES = [
  "Read incoming emails and enquiries",
  "Understand PDFs, invoices, purchase orders, and documents",
  "Check inventory and order status",
  "Generate quotations",
  "Update CRM and ERP systems",
  "Follow up with customers",
  "Track shipments",
  "Detect operational issues",
  "Prepare reports",
  "Recommend actions",
  "Escalate important decisions to your team",
];

export function SystemsIntegration() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const stage0Ref = useRef<HTMLDivElement>(null);
  const stage1Ref = useRef<HTMLDivElement>(null);
  const stage2Ref = useRef<HTMLDivElement>(null);
  const stage3Ref = useRef<HTMLDivElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);
  const dockRef = useRef<HTMLDivElement>(null);
  const sweepRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) {
        // Nothing is moving under reduced motion, so the panel is simply
        // already lit rather than easing up.
        gsap.set(lightRef.current, { opacity: 1 });
        return;
      }

      // The panel comes up out of the machine's light as it slides into
      // place — fully lit exactly when the pin takes hold. Scrubbed rather
      // than triggered so it tracks the scroll like a dimmer being turned,
      // not a switch being flipped.
      gsap.fromTo(
        lightRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          ease: "power1.inOut",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "top top",
            scrub: 1.2,
            invalidateOnRefresh: true,
          },
        },
      );

      /*
       * The card comes forward as the section arrives and settles. Its own
       * wrapper, not the TiltCard, which is already driving rotateX/rotateY
       * and z from the pointer — two writers on one transform is how you get
       * a card that jumps.
       */
      gsap.fromTo(
        dockRef.current,
        { z: -90 },
        {
          z: 0,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "top 30%",
            scrub: 1,
            invalidateOnRefresh: true,
          },
        },
      );

      // Power-on: one sweep of cool light across the panel as the section
      // takes hold, then a slow repeat so the surface never reads as dead.
      gsap.fromTo(
        sweepRef.current,
        { xPercent: -140, opacity: 0 },
        {
          xPercent: 140,
          opacity: 1,
          duration: 2.6,
          ease: "power1.inOut",
          repeat: -1,
          repeatDelay: 5.5,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            once: true,
          },
        },
      );

      const stages = [
        stage0Ref.current,
        stage1Ref.current,
        stage2Ref.current,
        stage3Ref.current,
      ];
      if (stages.some((stage) => !stage)) return;

      gsap.set([stage1Ref.current, stage2Ref.current, stage3Ref.current], {
        autoAlpha: 0,
        y: 24,
      });
      gsap.set(stage0Ref.current, { autoAlpha: 1, y: 0 });
      gsap.set(stage1Ref.current!.querySelectorAll("[data-chip]"), {
        autoAlpha: 0,
        y: 12,
      });
      gsap.set(stage2Ref.current!.querySelectorAll("[data-item]"), {
        autoAlpha: 0,
        y: 12,
      });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: `+=${PIN_LENGTH}`,
          scrub: 1,
          pin: pinRef.current,
        },
      });

      timeline
        .to(stage0Ref.current, { autoAlpha: 0, y: -24, duration: 0.6 }, 0.6)
        .to(stage1Ref.current, { autoAlpha: 1, y: 0, duration: 0.4 }, 0.7)
        .to(
          stage1Ref.current!.querySelectorAll("[data-chip]"),
          { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.04 },
          0.8,
        )
        .to(stage1Ref.current, { autoAlpha: 0, y: -24, duration: 0.4 }, 2.1)
        .to(stage2Ref.current, { autoAlpha: 1, y: 0, duration: 0.4 }, 2.2)
        .to(
          stage2Ref.current!.querySelectorAll("[data-item]"),
          { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.05 },
          2.3,
        )
        .to(stage2Ref.current, { autoAlpha: 0, y: -24, duration: 0.4 }, 3.8)
        .to(stage3Ref.current, { autoAlpha: 1, y: 0, duration: 0.5 }, 3.9);
    },
    { scope: sectionRef, dependencies: [reduced] },
  );

  const stagePanelClass = (staticFallback: boolean) =>
    cn(
      "flex h-full w-full flex-col justify-center p-6 sm:p-12",
      !staticFallback && "absolute inset-0",
    );

  return (
    <div ref={sectionRef} className={cn("relative", !reduced && "h-[420vh]")}>
      <div
        ref={pinRef}
        className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-20 sm:px-6 sm:py-24"
      >
        {/*
         * The systems the card is talking about, wired up behind it. Inside
         * the pinned container rather than the section: the section is 420vh
         * tall, so a lattice parented to it would sit centred a couple of
         * screens down and scroll away from the card it belongs to.
         */}
        <SystemsLattice triggerRef={sectionRef} pinLength={PIN_LENGTH} />

        <p className="mb-5 text-xs font-medium uppercase tracking-[0.3em] text-foreground/50 sm:mb-8 sm:text-sm">
          Beyond chat
        </p>

        {/* Depth wrapper. The perspective lives here so the dock below it has
            something to travel in; TiltCard keeps its own for the tilt. */}
        <div
          className="w-full max-w-3xl"
          style={reduced ? undefined : { perspective: 1500 }}
        >
          <div
            ref={dockRef}
            style={reduced ? undefined : { transformStyle: "preserve-3d" }}
          >
            <TiltCard
              className={cn("w-full", reduced ? "" : "h-[min(560px,68dvh)]")}
            >
              <div
                className={cn(
                  "relative h-full w-full",
                  reduced && "flex flex-col gap-8 p-6 sm:gap-10 sm:p-12",
                )}
              >
                {/*
                 * The light the machine casts up into this panel. First child, so
                 * every stage panel below paints over it and the copy stays fully
                 * opaque and sharp — this only ever lights what is behind the
                 * text. `screen` keeps it additive against the near-black plate,
                 * so it reads as light arriving rather than a tint laid on top.
                 */}
                <div
                  ref={lightRef}
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0"
                  style={{
                    opacity: 0,
                    mixBlendMode: "screen",
                    background: [
                      // The source: anchored just below the card on the centre
                      // line, and wide enough that its falloff clears the top
                      // edge instead of dying partway up and leaving the heading
                      // in the dark.
                      "radial-gradient(150% 125% at 50% 96%, rgba(92,200,232,0.26) 0%, rgba(72,170,205,0.16) 24%, rgba(60,120,175,0.10) 46%, rgba(106,92,224,0.07) 70%, rgba(106,92,224,0.035) 100%)",
                      // Ambient bounce. A radial alone always leaves the far
                      // corners black, so this lifts the whole surface a little.
                      "linear-gradient(to top, rgba(120,190,225,0.08) 0%, rgba(110,130,200,0.05) 55%, rgba(120,140,215,0.035) 100%)",
                    ].join(", "),
                  }}
                />

                <div ref={stage0Ref} className={stagePanelClass(reduced)}>
                  <h2 className="font-display text-2xl leading-tight tracking-tight text-foreground sm:text-3xl md:text-5xl">
                    AI That Works With Your Real Business Systems
                  </h2>
                  <p className="mt-4 max-w-xl text-sm leading-relaxed text-hero-sub opacity-80 sm:mt-6 sm:text-lg">
                    Most AI tools stop at answering questions.{" "}
                    <span className="text-foreground">We go further.</span>{" "}
                    Skyllect connects AI with the systems your business already
                    uses.
                  </p>
                </div>

                <div ref={stage1Ref} className={stagePanelClass(reduced)}>
                  <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.2em] text-foreground/40 sm:mb-6 sm:text-xs">
                    Connected systems
                  </p>
                  <ul className="flex flex-wrap gap-2 sm:gap-3">
                    {CONNECTED_SYSTEMS.map((system) => (
                      <li
                        key={system}
                        data-chip
                        className="rounded-full border border-edge px-3 py-1.5 text-xs text-foreground/80 sm:px-4 sm:py-2 sm:text-sm"
                      >
                        {system}
                      </li>
                    ))}
                  </ul>
                </div>

                <div ref={stage2Ref} className={stagePanelClass(reduced)}>
                  <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.2em] text-foreground/40 sm:mb-6 sm:text-xs">
                    Your AI can
                  </p>
                  <ul className="grid grid-cols-1 gap-x-6 gap-y-1.5 sm:grid-cols-2 sm:gap-y-2">
                    {CAPABILITIES.map((capability) => (
                      <li
                        key={capability}
                        data-item
                        className="text-xs leading-relaxed text-foreground/70 sm:text-sm"
                      >
                        {capability}
                      </li>
                    ))}
                  </ul>
                </div>

                <div ref={stage3Ref} className={stagePanelClass(reduced)}>
                  <p className="max-w-lg text-xl leading-snug tracking-tight text-foreground sm:text-2xl md:text-3xl">
                    Your employees remain in control while AI handles repetitive
                    operational work.
                  </p>
                </div>

                {/*
                 * The power-on sweep. Last child so it passes over the panel
                 * rather than under the copy — `screen` at this strength lifts
                 * the surface it crosses without touching the legibility of
                 * the text, which stays fully opaque beneath it.
                 */}
                {!reduced && (
                  <div
                    ref={sweepRef}
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 opacity-0"
                    style={{
                      mixBlendMode: "screen",
                      background:
                        "linear-gradient(105deg, rgba(92,200,232,0) 0%, rgba(92,200,232,0.13) 45%, rgba(190,235,255,0.2) 55%, rgba(92,200,232,0) 100%)",
                    }}
                  />
                )}
              </div>
            </TiltCard>
          </div>
        </div>
      </div>
    </div>
  );
}
