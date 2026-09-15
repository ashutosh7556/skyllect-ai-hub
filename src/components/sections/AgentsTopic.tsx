"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { AgentScenes } from "@/components/animation/AgentScenes";
import { AgentViewport } from "@/components/sections/AgentViewport";
import { AGENTS } from "@/data/agents";

/**
 * The agents, read as modules of the machine.
 *
 * Not a carousel and not a pinned scene: the modules sit in a fixed grid and
 * stay there. What moves is their depth. Each one docks into the page as the
 * section arrives, and the one under the pointer comes forward off the board
 * while its neighbours give way — the same relationship the cables drawn by
 * MachineCore describe in 3D, expressed in the layout.
 *
 * Three transform channels on three nested elements, so nothing ever fights
 * over the same property: the outer wrapper carries the scroll-driven
 * docking, the one inside it the endless idle drift, and the panel itself
 * hover depth and pointer tilt.
 *
 * The system runs itself: with no pointer on the grid it promotes each
 * module in turn, so there is always one card docked forward, lit and
 * reporting ACTIVE. The pointer overrides that while it is on a card, and
 * the cycle picks up from whatever was last looked at.
 */

/** How far the live module comes forward, and its neighbours give way, in px. */
const FORWARD = 46;
const BACK = -16;
/** Tilt ceiling for the pointer parallax, in degrees. */
const MAX_TILT = 5;
/** Seconds a module holds the foreground before handing on. */
const DWELL = 3.2;

export function AgentsTopic() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  // Which module the pointer is over, and which one the system has promoted
  // on its own. Held here rather than per card so the panel, its viewport
  // read-out and the machine's cables all agree on who is live.
  const [hovered, setHovered] = useState<number | null>(null);
  const [auto, setAuto] = useState(0);
  const reduced = useReducedMotion();

  // The pointer wins while it is on a card; otherwise the cycle does.
  const active = hovered ?? auto;

  // Mirrors `hovered` for the cycle to read, so the timer does not have to be
  // torn down and rebuilt every time the pointer moves. Written only from the
  // pointer handlers below — never during render.
  const hoveredRef = useRef<number | null>(null);

  const enterModule = (index: number) => {
    hoveredRef.current = index;
    setHovered(index);
  };

  const leaveModule = () => {
    // The cycle carries on from the card just left rather than snapping back
    // to wherever it had got to on its own.
    if (hoveredRef.current !== null) setAuto(hoveredRef.current);
    hoveredRef.current = null;
    setHovered(null);
  };

  /*
   * The hand-off. A GSAP delayed call rather than setInterval, so it runs on
   * the same clock as everything else here and stops dead in a background
   * tab instead of queueing up a burst of promotions to catch up on.
   */
  useEffect(() => {
    if (reduced) return;
    const section = sectionRef.current;
    if (!section) return;

    let call: gsap.core.Tween | null = null;

    const advance = () => {
      // Leave it alone while someone is actually looking at a card.
      if (hoveredRef.current === null) {
        setAuto((previous) => (previous + 1) % AGENTS.length);
      }
      call = gsap.delayedCall(DWELL, advance);
    };
    call = gsap.delayedCall(DWELL, advance);

    // No point cycling a section nobody can see.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) call?.play();
        else call?.pause();
      },
      { rootMargin: "0px" },
    );
    observer.observe(section);

    return () => {
      call?.kill();
      observer.disconnect();
    };
  }, [reduced]);

  useGSAP(
    () => {
      if (reduced) return;

      gsap.from("[data-module]", {
        autoAlpha: 0,
        y: 26,
        duration: 0.7,
        ease: "power2.out",
        stagger: 0.06,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 72%",
          once: true,
        },
      });

      gsap.from("[data-rail]", {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 1.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 78%",
          once: true,
        },
      });

      /*
       * Idle drift. Each module breathes in depth on its own clock, so the
       * grid is never still and never in step — a board of parts under load
       * rather than a static layout.
       *
       * This is a third transform channel, on its own element. The wrapper
       * above it owns the scroll docking and the panel below it owns hover
       * and tilt; three separate elements is what keeps them from writing
       * over each other's transforms.
       */
      gsap.utils.toArray<HTMLElement>("[data-float]").forEach((panel, i) => {
        gsap.to(panel, {
          z: gsap.utils.random(9, 19),
          rotateY: gsap.utils.random(-1.8, 1.8),
          rotateX: gsap.utils.random(-1.5, 1.5),
          duration: gsap.utils.random(3.8, 5.6),
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          delay: i * 0.28,
        });
      });

      // Docking. The modules arrive out of the board and seat themselves as
      // the section comes up, staggered so they land one after another rather
      // than as a single slab.
      gsap.fromTo(
        "[data-dock]",
        { z: -170, rotateX: 7 },
        {
          z: 0,
          rotateX: 0,
          ease: "power2.out",
          stagger: 0.05,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 88%",
            end: "top 30%",
            scrub: 1,
            invalidateOnRefresh: true,
          },
        },
      );
    },
    { scope: sectionRef, dependencies: [reduced] },
  );

  /*
   * Hover depth and pointer tilt.
   *
   * Plain effects rather than useGSAP: a context would revert these when the
   * hovered index changed, snapping a panel back instead of letting it ease.
   * quickTo keeps one tween per property per panel alive for the life of the
   * section, so sweeping the grid re-targets rather than re-allocates.
   */
  const setters = useRef<
    Array<{
      z: gsap.QuickToFunc;
      rotateX: gsap.QuickToFunc;
      rotateY: gsap.QuickToFunc;
    }>
  >([]);

  useEffect(() => {
    if (reduced) return;
    const grid = gridRef.current;
    if (!grid) return;

    const panels = Array.from(grid.querySelectorAll<HTMLElement>("[data-module]"));
    setters.current = panels.map((panel) => ({
      z: gsap.quickTo(panel, "z", { duration: 0.55, ease: "power3.out" }),
      rotateX: gsap.quickTo(panel, "rotateX", { duration: 0.6, ease: "power3.out" }),
      rotateY: gsap.quickTo(panel, "rotateY", { duration: 0.6, ease: "power3.out" }),
    }));

    function handleMove(event: PointerEvent) {
      if (event.pointerType !== "mouse") return;
      panels.forEach((panel, i) => {
        const setter = setters.current[i];
        if (!setter) return;
        const rect = panel.getBoundingClientRect();
        // A margin either side of the panel, so the tilt is already easing
        // out by the time the pointer actually leaves it.
        const withinReach =
          event.clientX > rect.left - 40 &&
          event.clientX < rect.right + 40 &&
          event.clientY > rect.top - 40 &&
          event.clientY < rect.bottom + 40;
        if (!withinReach) {
          setter.rotateX(0);
          setter.rotateY(0);
          return;
        }
        const px = (event.clientX - rect.left) / rect.width - 0.5;
        const py = (event.clientY - rect.top) / rect.height - 0.5;
        setter.rotateY(px * MAX_TILT * 2);
        setter.rotateX(-py * MAX_TILT * 2);
      });
    }

    window.addEventListener("pointermove", handleMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", handleMove);
      setters.current = [];
    };
  }, [reduced]);

  useEffect(() => {
    if (reduced) return;
    setters.current.forEach((setter, i) => {
      setter.z(active === i ? FORWARD : BACK);
    });
  }, [active, reduced]);

  return (
    <div id="ai-agents" ref={sectionRef} className="relative px-5 py-24 sm:px-8 sm:py-32">
      {/* One WebGL canvas, scissor-drawn into each module's viewport: every
          card runs its own small machine over its clip. The cables feeding
          them are drawn by MachineCore, which owns the central machinery. */}
      <AgentScenes containerRef={sectionRef} focus={active} />

      <div className="mx-auto max-w-[1200px]">
        <div className="max-w-2xl">
          <p className="font-mono text-[11px] tracking-[0.4em] text-muted uppercase">01 / Modules</p>
          <h2 className="font-display mt-3 text-[clamp(1.9rem,4.5vw,3.25rem)] leading-[1.1] font-normal tracking-tight text-foreground">
            AI Agents
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-hero-sub sm:text-base">
            Each agent is a working part of the same system — assembled around
            your actual business processes, not a chat window bolted onto them.
          </p>
        </div>

        {/* The bus every module hangs off. */}
        <div
          data-rail
          aria-hidden="true"
          className="mt-12 h-px w-full bg-gradient-to-r from-accent/40 via-edge to-transparent"
        />

        <div
          ref={gridRef}
          className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          // Shared perspective, so the modules read as seated at different
          // depths on one board rather than each having its own vanishing
          // point.
          style={reduced ? undefined : { perspective: 1400 }}
        >
          {AGENTS.map((agent, i) => (
            <div
              key={agent.name}
              data-dock
              style={reduced ? undefined : { transformStyle: "preserve-3d" }}
            >
              <div
                data-float
                className="h-full"
                style={reduced ? undefined : { transformStyle: "preserve-3d" }}
              >
                <article
                  data-module
                  onPointerEnter={(event) => {
                    if (event.pointerType === "mouse") enterModule(i);
                  }}
                  onPointerLeave={(event) => {
                    if (event.pointerType === "mouse") leaveModule();
                  }}
                  className="liquid-glass machine-module flex h-full flex-col rounded-2xl p-5 sm:p-6"
                  style={reduced ? undefined : { transformStyle: "preserve-3d" }}
                >
                  <AgentViewport
                    src={agent.video}
                    variant={agent.hud}
                    active={active === i}
                    index={i}
                  />

                  <div className="flex items-center justify-between gap-3">
                    <p className="font-mono text-[10px] tracking-[0.28em] text-muted uppercase">
                      Agent {String(i + 1).padStart(2, "0")}
                    </p>
                    <span
                      aria-hidden="true"
                      className="h-1 w-1 rounded-full bg-accent shadow-[0_0_8px_1px_rgba(92,200,232,0.5)]"
                    />
                  </div>

                  <h3 className="font-display mt-2.5 text-lg leading-tight font-normal tracking-tight text-foreground">
                    {agent.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{agent.description}</p>
                </article>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
