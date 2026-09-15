"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { AgentScenes } from "@/components/animation/AgentScenes";
import { AgentViewport } from "@/components/sections/AgentViewport";
import { AGENTS } from "@/data/agents";
import { machineRings } from "@/lib/machineRings";

/**
 * The agents, read as modules of the machine — and built by it.
 *
 * The modules are not placed on the page. Each one is held on one of the
 * machine's gear rings, turning with it, and released as the section is read:
 * it sweeps round the arc it was born on, spirals outward as it goes, opens
 * toward the camera and settles into its slot in the grid. Seven of them, one
 * after another, so the section reads as the machine producing its own
 * contents rather than as a grid fading in.
 *
 * The flight is computed in screen space against the rings' real projected
 * positions — MachineCore parents an empty to each gear and publishes where
 * it lands each frame (see `lib/machineRings`). The cards are therefore
 * synced to the rings by construction: no ring speed, radius or tilt is
 * restated here, and none of it can drift out of step.
 *
 * Four transform channels on four nested elements, so nothing ever fights
 * over the same property: the grid cell carries the flight out of the
 * machine, the wrapper inside it the long scroll parallax, the next one the
 * endless idle drift, and the panel itself hover depth and pointer tilt.
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

/* ------------------------------------------------------------- the release */

/**
 * The release is strictly one at a time.
 *
 * Each module owns an equal slot of the run — `1 / count` — and flies for
 * this fraction of it. The remainder of the slot is dead scroll: the module
 * that just arrived is left alone and nothing else has started yet. Slots
 * never overlap, so there is never a second card in the air, and the pause
 * between releases is real scroll rather than a gap in an eased stagger.
 */
const FLIGHT_DUTY = 0.62;

/** Size a module is held at inside the machine, before it is let go. */
const BIRTH_SCALE = 0.16;
/** How far behind the page it starts, in px against the grid's perspective. */
const BIRTH_DEPTH = 620;
/** Ceiling on the attitude a module flies at, in degrees. */
const FLIGHT_YAW = 46;
const FLIGHT_PITCH = 18;
const FLIGHT_ROLL = 9;
/**
 * Extra arc the module is carried round before it breaks away, in radians.
 * Shaped by a sine over the flight, so it is zero at both ends: the module
 * still lands exactly on its slot, it simply takes the long way there.
 */
const CARRY_ARC = 0.62;

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

      // The heading comes up first, line by line, well ahead of the board.
      gsap.from("[data-agents-head] > *", {
        autoAlpha: 0,
        y: 22,
        duration: 1.2,
        ease: "power3.out",
        stagger: 0.14,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
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
       * Charge running the bus. The rail clips it, so the pulse enters and
       * leaves rather than appearing and vanishing — one slow pass, a breath,
       * then another. This is the section's tie to the machinery behind it:
       * the same current the cables carry, on the page's own furniture.
       */
      const rail = sectionRef.current?.querySelector<HTMLElement>("[data-rail]");
      if (rail) {
        gsap.fromTo(
          "[data-rail-pulse]",
          { x: -160 },
          {
            x: () => rail.offsetWidth + 160,
            duration: 9,
            ease: "none",
            repeat: -1,
            repeatDelay: 1.6,
            invalidateOnRefresh: true,
          },
        );
      }

      // The drops off the bus into each module. Drawn downward from the rail
      // as the board arrives, so the modules read as fed rather than placed.
      gsap.from("[data-feed]", {
        scaleY: 0,
        autoAlpha: 0,
        transformOrigin: "top center",
        duration: 0.9,
        ease: "power2.out",
        stagger: 0.07,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 74%",
          once: true,
        },
      });

      /*
       * Idle drift. Each module breathes in depth on its own clock, so the
       * grid is never still and never in step — a board of parts under load
       * rather than a static layout.
       *
       * This is the third transform channel, on its own element. The wrappers
       * above it own the flight and the parallax, the panel below it owns
       * hover and tilt; four separate elements is what keeps them from
       * writing over each other's transforms.
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

      /*
       * The long drift. The flight is over well before the last cards are
       * finished being read, and the section is tall — without this the
       * board would be motionless for most of the time it is on screen.
       * Columns travel at slightly different rates across the whole passage,
       * which keeps depth in the layout until the last card has gone by.
       *
       * Small on purpose: a couple of dozen pixels over several viewports of
       * scroll is parallax, not movement. Nothing is displaced enough to
       * change where the copy sits.
       */
      gsap.to("[data-dock]", {
        y: (i: number) => [-22, -9, -16][i % 3],
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.6,
          invalidateOnRefresh: true,
        },
      });
    },
    { scope: sectionRef, dependencies: [reduced] },
  );

  /* ------------------------------------------------------------ the flight */

  /**
   * Where each module belongs once it has landed, in document coordinates.
   *
   * Measured from `offsetLeft`/`offsetTop` against the section rather than
   * from `getBoundingClientRect`, because the cell is carrying a transform
   * for most of the time this needs to be known and a rect would report where
   * the card currently *is* rather than where it is going. Offsets are layout
   * values: no transform on the cell, or on anything inside it, can touch
   * them.
   */
  const homesRef = useRef<Array<{ x: number; y: number }>>([]);
  const flightRef = useRef({ value: 0 });

  useEffect(() => {
    if (reduced) return;
    const section = sectionRef.current;
    const grid = gridRef.current;
    if (!section || !grid) return;

    const cells = Array.from(grid.querySelectorAll<HTMLElement>("[data-emerge]"));
    if (cells.length === 0) return;

    // Whether each cell is currently parked at rest, so a landed module is
    // written once and then left alone rather than re-set sixty times a
    // second for the whole time the reader spends with the section.
    const landed = cells.map(() => false);

    function measure() {
      const base = section!.getBoundingClientRect();
      const baseX = base.left + window.scrollX;
      const baseY = base.top + window.scrollY;
      homesRef.current = cells.map((cell) => ({
        x: baseX + cell.offsetLeft + cell.offsetWidth / 2,
        y: baseY + cell.offsetTop + cell.offsetHeight / 2,
      }));
    }
    measure();

    const park = (cell: HTMLElement, i: number) => {
      if (landed[i]) return;
      landed[i] = true;
      gsap.set(cell, {
        x: 0,
        y: 0,
        z: 0,
        scale: 1,
        rotateX: 0,
        rotateY: 0,
        rotateZ: 0,
        autoAlpha: 1,
        pointerEvents: "auto",
      });
    };

    const slot = 1 / cells.length;
    const span = slot * FLIGHT_DUTY;

    function fly() {
      const master = flightRef.current.value;
      const homes = homesRef.current;

      // No machine projecting its rings — no WebGL, or it has dimmed out
      // below the page. There is nothing to fly out of, so everything simply
      // sits where the layout put it.
      if (!machineRings.live) {
        cells.forEach(park);
        return;
      }

      const scrollX = window.scrollX;
      const scrollY = window.scrollY;
      const { cx, cy } = machineRings;

      cells.forEach((cell, i) => {
        const home = homes[i];
        const berth = machineRings.berths[i];
        if (!home || !berth) return;

        const e = gsap.utils.clamp(0, 1, (master - i * slot) / span);
        if (e >= 1) {
          park(cell, i);
          return;
        }
        landed[i] = false;

        /*
         * The flight, in polar coordinates around the core.
         *
         * Two eases pulling against each other is the whole trick. The angle
         * runs ahead — most of the sweep is done early — while the radius
         * holds back, so the module is carried a long way round the ring it
         * was born on before it starts to leave. Interpolating the two
         * cartesian endpoints instead would draw a straight line from the
         * machine to the slot, which is precisely what this is not.
         */
        const homeX = home.x - scrollX;
        const homeY = home.y - scrollY;

        const bornRadius = Math.hypot(berth.x - cx, berth.y - cy);
        const bornAngle = Math.atan2(berth.y - cy, berth.x - cx);
        const restRadius = Math.hypot(homeX - cx, homeY - cy);
        const restAngle = Math.atan2(homeY - cy, homeX - cx);

        // The short way round, so a module never takes the scenic route
        // through three quarters of a turn to reach a slot beside it.
        let delta = restAngle - bornAngle;
        if (delta > Math.PI) delta -= Math.PI * 2;
        if (delta < -Math.PI) delta += Math.PI * 2;

        const sweep = 1 - Math.pow(1 - e, 2.4);
        const reach = Math.pow(e, 2);
        const grow = e * e * (3 - 2 * e);
        // Zero at both ends: the extra arc only exists mid-flight, so the
        // landing is still exactly the slot the layout computed.
        const carry = Math.sin(Math.PI * e) * CARRY_ARC * (delta < 0 ? -1 : 1);

        const angle = bornAngle + delta * sweep + carry;
        const radius = bornRadius + (restRadius - bornRadius) * reach;

        /*
         * `depth` is how near the camera the berth is relative to the core.
         * A module held on the near side of a tilted ring is that much closer
         * to the lens and starts correspondingly bigger, the same as anything
         * else in the scene would. Banded, so a ring swinging through its
         * turn cannot push a module to a size the flight has to undo.
         */
        const settle = 1 - grow;
        const born = BIRTH_SCALE * gsap.utils.clamp(0.72, 1.38, berth.depth);

        gsap.set(cell, {
          x: cx + Math.cos(angle) * radius - homeX,
          y: cy + Math.sin(angle) * radius - homeY,
          z: -BIRTH_DEPTH * settle,
          scale: born + (1 - born) * grow,
          // Turned toward the machine it is leaving, opening to face the
          // reader as it arrives. Which way it turns follows which side of
          // the core it is flying out to.
          rotateY: FLIGHT_YAW * settle * (homeX < cx ? 1 : -1),
          rotateX: -FLIGHT_PITCH * settle,
          rotateZ: FLIGHT_ROLL * Math.sin(Math.PI * e) * (delta < 0 ? -1 : 1),
          autoAlpha: gsap.utils.clamp(0, 1, e * 2.6),
          // A module still in the air is not something the pointer can pick
          // up — it would take the hover promotion with it mid-flight.
          pointerEvents: "none",
        });
      });
    }

    // Held at the berth before the run begins, rather than sitting in the
    // grid waiting to be animated: the first frame of the ticker is a frame
    // late, and a flash of seven finished cards is exactly what it would show.
    gsap.set(cells, { autoAlpha: 0 });

    const master = gsap.to(flightRef.current, {
      value: 1,
      ease: "none",
      scrollTrigger: {
        trigger: grid,
        /*
         * As much scroll as the section can honestly give the run.
         *
         * The window is bounded at both ends by what is on screen: a module
         * cannot be released before its slot has come up from below, and the
         * last one cannot land after its row has gone off the top. Between
         * "the grid is arriving" and "the grid is nearly away" is every pixel
         * there is, and the releases are spread across all of it.
         */
        start: "top 95%",
        end: "bottom 30%",
        // Heavy on purpose. The scrub is what turns a flick of the wheel into
        // a long glide, so the module keeps travelling after the scroll has
        // stopped rather than arriving with it.
        scrub: 2.2,
        invalidateOnRefresh: true,
      },
    });

    gsap.ticker.add(fly);
    // The homes move whenever the grid reflows — a resize, a font landing, or
    // ScrollTrigger recomputing the page around it.
    const observer = new ResizeObserver(measure);
    observer.observe(grid);
    ScrollTrigger.addEventListener("refresh", measure);

    return () => {
      gsap.ticker.remove(fly);
      observer.disconnect();
      ScrollTrigger.removeEventListener("refresh", measure);
      master.scrollTrigger?.kill();
      master.kill();
      gsap.set(cells, { clearProps: "transform,opacity,visibility,pointerEvents" });
    };
  }, [reduced]);

  /*
   * Activation. Whichever module is live takes one slow pass of light across
   * its face — the charge arriving from the machine, rather than a hover
   * highlight. Its own element and its own property, so it cannot collide
   * with the depth channels above it or with the viewport's HUD below.
   */
  useEffect(() => {
    if (reduced) return;
    const grid = gridRef.current;
    if (!grid) return;

    const card = grid.querySelectorAll<HTMLElement>("[data-module]")[active];
    const sweep = card?.querySelector<HTMLElement>("[data-card-sweep]");
    if (!sweep) return;

    const tween = gsap.fromTo(
      sweep,
      { xPercent: -40, opacity: 0 },
      {
        xPercent: 400,
        opacity: 1,
        duration: 1.9,
        ease: "power1.inOut",
        onComplete: () => gsap.set(sweep, { opacity: 0 }),
      },
    );

    return () => {
      tween.kill();
      gsap.set(sweep, { opacity: 0 });
    };
  }, [active, reduced]);

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
        <div data-agents-head className="max-w-2xl">
          <p className="font-mono text-[11px] tracking-[0.4em] text-muted uppercase">01 / Modules</p>
          <h2 className="font-display mt-3 text-[clamp(1.9rem,4.5vw,3.25rem)] leading-[1.1] font-normal tracking-tight text-foreground">
            AI Agents
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-hero-sub sm:text-base">
            Each agent is a working part of the same system — assembled around
            your actual business processes, not a chat window bolted onto them.
          </p>
        </div>

        {/* The bus every module hangs off, and the charge running it. The
            rail keeps its own height — the pulse is absolutely placed inside
            it, so nothing about the spacing changes. */}
        <div
          data-rail
          aria-hidden="true"
          className="relative mt-12 h-px w-full overflow-hidden bg-gradient-to-r from-accent/40 via-edge to-transparent"
        >
          {!reduced && (
            <span
              data-rail-pulse
              className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-transparent via-accent-soft to-transparent"
            />
          )}
        </div>

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
              /*
               * The grid cell, and the only thing the flight writes to. It is
               * the outermost element in the cell on purpose: its own
               * `offsetLeft`/`offsetTop` are what the flight measures against,
               * and an element with a transformed ancestor inside the grid
               * would report a moving target.
               */
              data-emerge
              className="relative"
              style={
                reduced
                  ? undefined
                  : { transformStyle: "preserve-3d", willChange: "transform, opacity" }
              }
            >
              {/* The drop off the bus. Short enough to sit inside the gap
                  above the card at every breakpoint, so it never crosses the
                  module above it. */}
              {!reduced && (
                <span
                  data-feed
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-3 left-7 h-3 w-px bg-gradient-to-b from-accent/0 via-accent/35 to-accent/60"
                />
              )}

              <div
                data-dock
                className="h-full"
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
                    {/* The pass of light when this module goes live. The panel
                        already clips its own overflow, so the sweep enters and
                        leaves at the card's edges. */}
                    {!reduced && (
                      <span
                        data-card-sweep
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-y-0 -left-1/4 w-1/4 opacity-0"
                        style={{
                          mixBlendMode: "screen",
                          background:
                            "linear-gradient(100deg, rgba(92,200,232,0) 0%, rgba(92,200,232,0.12) 45%, rgba(190,235,255,0.18) 55%, rgba(92,200,232,0) 100%)",
                        }}
                      />
                    )}

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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
