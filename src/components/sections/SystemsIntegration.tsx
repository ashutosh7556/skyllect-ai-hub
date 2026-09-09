"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { NodeNetwork } from "@/components/animation/NodeNetwork";
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
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      const stages = [stage0Ref.current, stage1Ref.current, stage2Ref.current, stage3Ref.current];
      if (stages.some((stage) => !stage)) return;

      gsap.set([stage1Ref.current, stage2Ref.current, stage3Ref.current], { autoAlpha: 0, y: 24 });
      gsap.set(stage0Ref.current, { autoAlpha: 1, y: 0 });
      gsap.set(stage1Ref.current!.querySelectorAll("[data-chip]"), { autoAlpha: 0, y: 12 });
      gsap.set(stage2Ref.current!.querySelectorAll("[data-item]"), { autoAlpha: 0, y: 12 });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=3200",
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
      <div className="absolute inset-0 -z-10">
        <NodeNetwork
          className="h-full w-full"
          density={1 / 26000}
          lineColor="165, 148, 249"
          dotColor="200, 190, 255"
        />
      </div>

      <div
        ref={pinRef}
        className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-20 sm:px-6 sm:py-24"
      >
        <p className="mb-5 text-xs font-medium uppercase tracking-[0.3em] text-foreground/50 sm:mb-8 sm:text-sm">
          Beyond chat
        </p>

        <TiltCard
          className={cn("w-full max-w-3xl", reduced ? "" : "h-[min(560px,68dvh)]")}
        >
          <div
            className={cn(
              "relative h-full w-full",
              reduced && "flex flex-col gap-8 p-6 sm:gap-10 sm:p-12",
            )}
          >
            <div ref={stage0Ref} className={stagePanelClass(reduced)}>
              <h2 className="font-display text-2xl leading-tight tracking-tight text-foreground sm:text-3xl md:text-5xl">
                AI That Works With Your Real Business Systems
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-hero-sub opacity-80 sm:mt-6 sm:text-lg">
                Most AI tools stop at answering questions.{" "}
                <span className="text-foreground">We go further.</span> Skyllect
                connects AI with the systems your business already uses.
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
                    className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-foreground/80 sm:px-4 sm:py-2 sm:text-sm"
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
          </div>
        </TiltCard>
      </div>
    </div>
  );
}
