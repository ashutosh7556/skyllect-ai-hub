"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { AgentScenes } from "@/components/animation/AgentScenes";
import { AgentViewport } from "@/components/sections/AgentViewport";
import { AGENTS } from "@/data/agents";
import { machineRings } from "@/lib/machineRings";
import { cn } from "@/lib/utils";

/**
 * The agents, read as modules of the machine — and built by it.
 *
 * The modules are not placed on the page. Each one is held on one of the
 * machine's gear rings, turning with it, and released as the section is read:
 * it sweeps round the arc it was born on, spirals outward as it goes, opens
 * toward the camera and settles into its slot. Seven of them, one after
 * another, so the section reads as the machine producing its own contents
 * rather than as a grid fading in.
 *
 * What they settle into is a ring of its own, seated on a twelve-column grid
 * with its centre left empty — see RING_SLOTS. A module that spirals out of a
 * circle and lands in a rectangle spends the last of its flight arguing with
 * where it came from.
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
 *
 * Raised alongside the slot length so the flight itself is slower rather than
 * merely further apart: together they take a module's travel from about 80px
 * of wheel to about 125, while leaving the pause between releases where it
 * was.
 */
const FLIGHT_DUTY = 0.68;


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

/**
 * Scroll one module's slot is worth while the board is held, in px.
 *
 * The run is this times the number of modules, so the pacing is the same
 * however tall the grid or the window happens to be.
 */
const SCROLL_PER_CARD = 290;

/** Room the floating header needs at the top of the window, in px. */
const HEADER_CLEARANCE = 68;

/**
 * How tall a module's clip may be, in px.
 *
 * Sized to the window rather than fixed: three rows of cards plus a heading is
 * within a few dozen pixels of a laptop screen either way, so a height that
 * looks generous on one is a cropped last row on another. The board measures
 * what is spare and gives it to the clips, which is the one part of a card
 * that gains from being larger.
 */
const MEDIA_MIN = 84;
const MEDIA_MAX = 156;
/**
 * Bottom overflow the board will accept in exchange for larger clips.
 *
 * None. Spending it bought about a dozen pixels of clip per row and cost the
 * last row the bottom of its description — trading copy the reader is meant
 * to read for image they are not.
 */
const MEDIA_BLEED = 0;

/* -------------------------------------------------------- the composition */

/**
 * Where each module comes to rest, once the machine has let it go.
 *
 * A twelve-column grid rather than three, used to seat the modules as a ring
 * around an open centre: three across the top, two on the flanks with the gap
 * between them left empty, two closed up underneath. The empty middle is the
 * point — it is the only part of the section where the machine the modules
 * came out of is still visible through them, and it is what stops a circular
 * scene being covered by a rectangle.
 *
 * It also disposes of the orphan. Seven modules in a three-column grid leaves
 * the last one alone on a row of its own, which is the one thing about the
 * old arrangement that read as a mistake rather than a decision.
 *
 * The top row is bowed: the outer two are dropped, so the three of them sit
 * on a curve with the highest point at the centre — the top of a circle, not
 * the top of a box. The bottom pair straddle the centre line and are
 * therefore level with each other, which is what the same circle does there.
 *
 * Placement only. No module is rotated: everything else on this page is
 * machined and square to its neighbours — hairlines, corner brackets,
 * monospace labels — and panels tipped a couple of degrees off true would
 * read as scattered rather than assembled, on top of costing the body copy
 * its horizontal. The curve is in where the cards sit, not in how they lean.
 *
 * Every span is four columns wide, which is exactly the width three columns
 * gave: the card design is untouched at every breakpoint. Below `lg` this is
 * inert and the modules stack one or two up as before.
 */
const RING_SLOTS = [
  "sm:col-span-2 lg:col-start-1 lg:row-start-1 lg:col-span-4",
  "sm:col-span-2 lg:col-start-5 lg:row-start-1 lg:col-span-4",
  "sm:col-span-2 lg:col-start-9 lg:row-start-1 lg:col-span-4",
  "sm:col-span-2 lg:col-start-1 lg:row-start-2 lg:col-span-4",
  "sm:col-span-2 lg:col-start-9 lg:row-start-2 lg:col-span-4",
  "sm:col-span-2 lg:col-start-3 lg:row-start-3 lg:col-span-4",
  // Odd one out at the middle breakpoint, where the ring has collapsed to two
  // up: centred on its own row rather than left hanging off the left edge.
  "sm:col-start-2 sm:col-span-2 lg:col-start-7 lg:row-start-3 lg:col-span-4",
];

/**
 * An eighth module would have nowhere on the ring to go, so it falls back to
 * flowing after the others at the same width rather than collapsing to a
 * single column of the twelve.
 */
const ringSlot = (index: number) =>
  RING_SLOTS[index] ?? "sm:col-span-2 lg:col-span-4";

export function AgentsTopic() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const holdRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);
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

      // No machine projecting its rings — no WebGL, or it has dimmed out
      // below the page. There is nothing to fly out of, so everything simply
      // sits where the layout put it.
      if (!machineRings.live) {
        cells.forEach(park);
        return;
      }

      /*
       * Where the grid is right now, in viewport pixels.
       *
       * A cell's own rect is useless here — it is carrying the flight — so a
       * home is the grid's live position plus the cell's layout offset inside
       * it. The grid is `relative`, which makes it every cell's `offsetParent`
       * and those offsets grid-relative by construction.
       *
       * Read every frame rather than measured once into document coordinates,
       * because the grid is pinned for the length of the run: while it is
       * pinned its document position is meaningless and only its viewport
       * position is true.
       */
      const gridBox = grid!.getBoundingClientRect();
      const { cx, cy } = machineRings;

      cells.forEach((cell, i) => {
        const berth = machineRings.berths[i];
        if (!berth) return;

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
        const homeX = gridBox.left + cell.offsetLeft + cell.offsetWidth / 2;
        const homeY = gridBox.top + cell.offsetTop + cell.offsetHeight / 2;

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

    /*
     * Hold the board on screen for the length of the run.
     *
     * The wrapper is given the run's worth of height below the board, and the
     * board is made sticky inside it: the reader keeps scrolling, that height
     * passes underneath, and the board stays where it is until the last module
     * has arrived. Then it releases and the page carries on.
     *
     * Only when the board fits the window. Held in place while taller than the
     * screen, its bottom row could never be seen — so on a short window none
     * of this is applied and the run is bounded by what is on screen instead,
     * the way it was before.
     */
    const hold = holdRef.current;
    const sticky = stickyRef.current;
    const spacer = spacerRef.current;
    /*
     * Three rows of these cards come to about 870px, which is taller than a
     * good many laptop windows — so demanding that the whole board fit meant
     * the hold switched itself off on exactly the screens that need it most,
     * and the board went back to scrolling away with its top row cut off while
     * modules were still arriving.
     *
     * A little overflow is tolerated instead. Held, a board slightly taller
     * than the window loses a few dozen pixels off its last row; not held, it
     * loses the whole top row *and* the section leaves early. The first is the
     * better trade — so when there is no room to centre the board it is put
     * against the top of the window rather than not held at all.
     */
    /*
     * Measured on the sticky block, not the grid: the board's label rides
     * inside it, so the grid alone understates what has to be held.
     *
     * The label's description line is the one thing here that can be given up.
     * Three rows of cards already come to about 870px, which fills a laptop
     * window on its own, so on a short screen the choice is between showing
     * the description and showing the bottom of the last row — and the cards
     * are what the section is. Taller windows get both.
     */
    /*
     * Give the clips whatever height the window has spare.
     *
     * Measured at the smallest size first, because the block's height depends
     * on the very thing being chosen — so the spare room is found with the
     * clips at their minimum and then handed out three ways, one per row.
     */
    grid.style.setProperty("--agent-media", `${MEDIA_MIN}px`);
    const blockAt = () => (sticky ? sticky.offsetHeight : grid.offsetHeight);
    const budget = window.innerHeight - HEADER_CLEARANCE + MEDIA_BLEED;
    const media = gsap.utils.clamp(
      MEDIA_MIN,
      MEDIA_MAX,
      MEDIA_MIN + Math.floor((budget - blockAt()) / 3),
    );
    grid.style.setProperty("--agent-media", `${media}px`);

    /*
     * Measured on the whole held block, not the grid alone. The heading is
     * inside the sticky element now, so sizing against the grid understated it
     * by its full height and pushed the title off the top of the window.
     */
    const room = window.innerHeight - blockAt();
    const fits = !!hold && !!sticky && !!spacer && room >= -(80 + MEDIA_BLEED);
    const runPx = cells.length * SCROLL_PER_CARD;
    /*
     * Never under the header.
     *
     * Centring the block in the window put its top at whatever half the spare
     * room happened to be — which on a lot of windows is less than the height
     * of the floating header, so the section title was held behind it. The
     * header's clearance is the floor; the block is centred only in whatever
     * is left below it.
     */
    const stickyTop = fits ? Math.max(HEADER_CLEARANCE, Math.round(room / 2)) : 0;

    if (fits) {
      sticky!.style.position = "sticky";
      sticky!.style.top = `${stickyTop}px`;
      /*
       * The run's height goes on a real sibling, not on the wrapper's padding.
       *
       * Padding looked equivalent and is not: with `padding-bottom` on the
       * wrapper the sticky element never detached at all — measured inert,
       * tracking its parent pixel for pixel — and with the identical height as
       * a sibling box below it, it sticks. The element needs flow content to
       * travel past, not just a taller box to sit in.
       */
      spacer!.style.height = `${runPx}px`;
    }

    const master = gsap.to(flightRef.current, {
      value: 1,
      ease: "none",
      scrollTrigger: fits
        ? {
            // The wrapper, not the board: while the board is stuck its own
            // rect does not move, so a trigger measured against it would sit
            // at one progress for the whole run. The wrapper keeps scrolling.
            trigger: hold,
            start: () => `top ${stickyTop}px`,
            end: () => `+=${runPx}`,
            // Heavier than the fallback below: the board is held, so a longer
            // catch-up costs nothing but glide — there is no risk of the
            // module still travelling after its slot has scrolled away.
            scrub: 2.1,
            invalidateOnRefresh: true,
          }
        : {
            trigger: grid,
            start: "top 90%",
            end: "bottom 70%",
            /*
             * Enough to turn a flick of the wheel into a glide, and no more.
             * At 2.2 the module was still catching up well after the scroll
             * stopped, which ate into the time it was sitting still and
             * readable.
             */
            scrub: 1.6,
            invalidateOnRefresh: true,
          },
    });

    gsap.ticker.add(fly);

    return () => {
      gsap.ticker.remove(fly);
      master.scrollTrigger?.kill();
      master.kill();
      // The hold is written straight onto the elements, so it has to be taken
      // off again — a remount would otherwise stack another run's worth of
      // padding onto the last one's.
      if (sticky) {
        sticky.style.position = "";
        sticky.style.top = "";
      }
      if (spacer) spacer.style.height = "";
      grid.style.removeProperty("--agent-media");
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
        {/*
         * The hold.
         *
         * `holdRef` is given extra height below the board and `stickyRef` is
         * made sticky inside it, so the board stays put on screen while that
         * extra height scrolls past underneath it — which is the whole run,
         * one module at a time, with the wheel still working the entire time.
         *
         * Sticky rather than a ScrollTrigger pin on purpose. A pin takes the
         * board out of flow and holds it fixed, and the section below simply
         * scrolled up underneath it — the two ended up drawn on top of each
         * other. A sticky element stays in flow: its parent still reserves its
         * height, so the next section physically cannot reach it.
         *
         * Both properties are set from the effect, because whether there is
         * room to do this at all depends on the window.
         */}
        <div ref={holdRef} className="relative">
          <div ref={stickyRef}>
            {/*
             * The heading is part of the board, not something above it.
             *
             * Held together, the title, the line under it and the ring of
             * modules read as one composition on one screen — which is the
             * whole point of holding the board at all. Left outside, it simply
             * scrolled away and left the cards unattributed for the length of
             * the run.
             */}
            {/* Wide enough that the line under the title stays on one line at
                desktop widths — two lines here is two lines fewer for the
                cards below. */}
            <div data-agents-head className="mx-auto max-w-5xl text-center">
              <p className="font-mono text-[11px] tracking-[0.4em] text-muted uppercase">
                01 / Modules
              </p>
              <h2 className="font-display mt-1.5 text-[clamp(1.6rem,2.9vw,2.15rem)] leading-[1.1] font-normal tracking-tight text-foreground">
                AI Agents
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-hero-sub">
                Each agent is a working part of the same system — assembled
                around your actual business processes, not a chat window bolted
                onto them.
              </p>
            </div>

        <div
          ref={gridRef}
          /*
           * Twelve columns at `lg` so the ring has somewhere to be seated,
           * four at `sm` so the module left over can sit in the middle of its
           * row instead of against one edge — see RING_SLOTS. Both are the
           * same card width they were at three columns and two; the extra
           * columns only buy places to put things, not a different size.
           *
           * `relative` so the grid is every cell's `offsetParent`, which is
           * what makes their offsets grid-relative and keeps the flight's
           * home positions correct while the board is held.
           */
          className="relative mt-4 grid gap-3 sm:grid-cols-4 lg:grid-cols-12"
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
              className={cn("relative", ringSlot(i))}
              style={
                reduced
                  ? undefined
                  : { transformStyle: "preserve-3d", willChange: "transform, opacity" }
              }
            >
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
                    // Tighter than it was: the heading now shares the screen
                    // with the whole ring, so every row has to give some back.
                    className="liquid-glass machine-module flex h-full flex-col rounded-2xl p-4 sm:p-[1.15rem]"
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

                    <h3 className="font-display mt-2 text-base leading-tight font-normal tracking-tight text-foreground">
                      {agent.name}
                    </h3>
                    <p className="mt-1.5 text-[0.8rem] leading-snug text-muted">
                      {agent.description}
                    </p>
                  </article>
                </div>
              </div>
            </div>
          ))}
        </div>
          </div>

          {/* The run's worth of scroll, as flow content for the board above to
              stay put against. Height is set from the effect. */}
          <div ref={spacerRef} aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
