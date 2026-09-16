"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import {
  localProgress,
  useStageProgress,
} from "@/components/animation/StageProgress";
import { integrationPortal } from "@/lib/integrationPortal";
import { INTEGRATIONS } from "@/data/integrations";
import { cn } from "@/lib/utils";

/**
 * The integrations topic: the gate handing over its contents, one at a time.
 *
 * Every integration is a plate on the gate's ring before it is anything on
 * the page. As the topic is read the gate releases them in turn — a plate
 * leaves its berth, arcs round the ring it was sitting on, crosses to the
 * copy and grows into the card that carries its name. The next scroll takes
 * the next one and the last is put back.
 *
 * The flight is computed in screen space against the gate's real projected
 * module positions, which IntegrationPortal publishes each frame (see
 * `lib/integrationPortal`). Nothing about the ring's radius, speed or tilt is
 * restated here, so a card cannot drift out of step with the thing it came
 * out of — and the gate is told which module is out so it can dim that plate
 * rather than show the same integration twice.
 *
 * The heading, its description and both buttons never move. Only the card
 * between them changes, so the section's message and its call to action are
 * on screen for the whole run.
 */

/** Fraction of an integration's slot spent flying; the rest it is read. */
const FLIGHT = 0.46;
/**
 * The deck behind the live card: how many finished integrations stay stacked
 * behind it, and how far each one is set back.
 */
const DECK_DEPTH = 3;
const DECK_RISE = 26;
const DECK_SHIFT = 14;
/** Size a card is held at on the ring, before it is released. */
const BIRTH_SCALE = 0.17;
/** Ceiling on the attitude a card flies at, in degrees. */
const FLIGHT_YAW = 52;
const FLIGHT_PITCH = 16;
/**
 * Extra arc a card is carried round the ring before it breaks away.
 *
 * This does the real work of the flight, not the angle between the two ends.
 * The card slot sits out to the left of the gate, so for any module already
 * berthed on that side the angle between where it starts and where it lands is
 * almost nothing — interpolating between them walked those cards straight out
 * along a radius, which is exactly the straight line this is supposed not to
 * be. A large arc that is zero at both ends bends every path around the ring
 * regardless of how far apart its endpoints happen to be, and still lands on
 * the slot exactly.
 */
const CARRY_ARC = 1.25;
/** How fast the drawn state chases the scroll. Low on purpose. */
const EASE_RATE = 0.075;

export function Integrations() {
  const slotRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<Array<HTMLElement | null>>([]);
  const stage = useStageProgress();
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const slot = slotRef.current;
    if (!slot || !stage) return;

    const cards = cardsRef.current;
    /** Whether each card is parked at rest, so a settled one is left alone. */
    const landed = cards.map(() => false);
    let eased = 0;
    let primed = false;
    let seenGate = false;

    const park = (card: HTMLElement, i: number) => {
      if (landed[i]) return;
      landed[i] = true;
      gsap.set(card, {
        x: 0,
        y: 0,
        scale: 1,
        rotateX: 0,
        rotateY: 0,
        rotateZ: 0,
        autoAlpha: 1,
      });
    };

    const hide = (card: HTMLElement, i: number) => {
      landed[i] = false;
      gsap.set(card, { autoAlpha: 0 });
    };

    function run() {
      const target = localProgress(stage!);
      if (!primed) {
        /*
         * Start where the reader already is, rather than easing up to it.
         *
         * Landing part-way into the section — a refresh, a fragment link,
         * a restored scroll position — otherwise began at zero and raced
         * through every earlier card's flight to catch up, which read as the
         * cards flashing past before settling.
         */
        primed = true;
        eased = target;
      } else {
        // Eased toward rather than assigned: a hard flick of the wheel still
        // arrives as a slow arc rather than a jump across the page.
        eased += (target - eased) * EASE_RATE;
      }

      // Whether the gate has ever drawn. Until it has there are no module
      // positions to fly from, and after it has, a frame without them means
      // it is off screen rather than absent.
      if (integrationPortal.live) seenGate = true;

      const count = INTEGRATIONS.length;
      const at = eased * count;
      const current = Math.min(count - 1, Math.floor(at));

      // The gate dims whichever plate is currently out on the page.
      integrationPortal.released = eased > 0.001 ? current : -1;

      const slotBox = slot!.getBoundingClientRect();
      const homeX = slotBox.left + slotBox.width / 2;
      const homeY = slotBox.top + slotBox.height / 2;

      cards.forEach((card, i) => {
        if (!card) return;

        // Position within this integration's own slot of the run.
        const e = at - i;

        // Not its turn yet: still a plate on the ring, nothing on the page.
        if (e <= 0) {
          hide(card, i);
          return;
        }

        if (e >= 1) {
          /*
           * Done, but not gone. A card that has had its turn slides back and
           * up behind the one that replaced it, so the integrations already
           * read stay visible as a deck rather than vanishing — the reader
           * can see how far through the set they are, and where the new card
           * came to rest.
           *
           * Only the nearest few are worth drawing; past that they are behind
           * each other and cost compositing for nothing.
           */
          const back = e - 1;
          if (back >= DECK_DEPTH) {
            hide(card, i);
            return;
          }
          landed[i] = false;
          const step = Math.min(back, DECK_DEPTH);
          gsap.set(card, {
            x: DECK_SHIFT * step,
            y: -DECK_RISE * step,
            scale: 1 - step * 0.045,
            rotateX: 0,
            rotateY: 0,
            rotateZ: 0,
            // Fades across the depth of the deck rather than at its edge, so
            // the furthest one is already almost nothing when it is dropped.
            autoAlpha: Math.max(0, 1 - step / DECK_DEPTH) * 0.55,
          });
          return;
        }

        const flight = Math.min(1, e / FLIGHT);
        if (flight >= 1) {
          park(card, i);
          return;
        }
        landed[i] = false;

        // Named `plate`, not `module`: that identifier is reserved in this
        // build and assigning it breaks the bundle.
        const plate = integrationPortal.modules[i];

        /*
         * Has this plate actually been projected yet?
         *
         * A published slot starts at (0, 0) and stays there until the gate's
         * first frame runs, and the gate reports itself dead until it has a
         * size. Both were being treated as "no gate at all", which parked the
         * card at its final position — so the very first card, the only one
         * whose flight begins before the gate has drawn, appeared finished at
         * the slot, then jumped to the top-left corner once a zeroed position
         * was read, then jumped again to its real plate. Three positions, no
         * path between them.
         *
         * Now an unready gate means wait, not arrive. The card stays off the
         * page until there is a real position to leave from, and the fallback
         * for a gate that never draws at all — no WebGL — is kept by asking
         * whether one has ever been seen.
         */
        const ready =
          integrationPortal.live && !!plate && (plate.x !== 0 || plate.y !== 0);
        if (!ready) {
          if (seenGate) hide(card, i);
          else park(card, i);
          return;
        }

        /*
         * The flight, in polar coordinates around the gate's centre.
         *
         * The angle runs ahead while the radius holds back, so the card is
         * carried a long way round the ring it was berthed on before it
         * starts crossing to the copy. Interpolating the two endpoints
         * directly would draw a straight line from the gate to the card slot,
         * which is exactly what this is not.
         */
        const { cx, cy } = integrationPortal;
        const bornRadius = Math.hypot(plate.x - cx, plate.y - cy);
        const bornAngle = Math.atan2(plate.y - cy, plate.x - cx);
        const restRadius = Math.hypot(homeX - cx, homeY - cy);
        const restAngle = Math.atan2(homeY - cy, homeX - cx);

        // The short way round, so a card never takes three quarters of a turn
        // to reach a slot beside it.
        let delta = restAngle - bornAngle;
        if (delta > Math.PI) delta -= Math.PI * 2;
        if (delta < -Math.PI) delta += Math.PI * 2;

        const sweep = 1 - Math.pow(1 - flight, 2.4);
        /*
         * The radius holds back hard. Below about a quarter of the flight the
         * card has barely left the ring at all: it is still travelling round
         * it, which is what the arc is for. Everything radial happens late.
         */
        const reach = Math.pow(flight, 2.6);
        const grow = flight * flight * (3 - 2 * flight);
        /*
         * The arc, always over the top of the gate.
         *
         * Taking its direction from `delta` meant a module whose berth already
         * pointed at the card slot got an arc of nearly nothing — those were
         * the cards that looked like they moved in a straight line. A fixed
         * sign sends every card round the same side of the ring, which also
         * stops consecutive cards taking visibly different routes.
         *
         * Positive, which arcs over the top: the other way dipped the card to
         * within sixty pixels of the bottom of the window on its way across.
         *
         * Zero at both ends, so it bends the path without moving either end —
         * the card still lands exactly on its slot.
         */
        const carry = Math.sin(Math.PI * flight) * CARRY_ARC;

        const angle = bornAngle + delta * sweep + carry;
        const radius = bornRadius + (restRadius - bornRadius) * reach;
        const settle = 1 - grow;

        gsap.set(card, {
          x: cx + Math.cos(angle) * radius - homeX,
          y: cy + Math.sin(angle) * radius - homeY,
          scale: BIRTH_SCALE + (1 - BIRTH_SCALE) * grow,
          // Turned toward the gate it is leaving, opening to face the reader
          // as it arrives.
          rotateY: FLIGHT_YAW * settle,
          rotateX: -FLIGHT_PITCH * settle,
          // Rolled with the arc, so the card banks into the turn it is making
          // rather than against it.
          rotateZ: 7 * Math.sin(Math.PI * flight),
          autoAlpha: gsap.utils.clamp(0, 1, flight * 3.2),
        });
      });
    }

    // Held off the page until the run begins, rather than sitting in the slot
    // waiting: the first ticker frame is a frame late, and a flash of ten
    // stacked cards is what it would otherwise show.
    gsap.set(cards.filter(Boolean), { autoAlpha: 0 });

    gsap.ticker.add(run);
    return () => {
      gsap.ticker.remove(run);
      integrationPortal.released = -1;
    };
  }, [reduced, stage]);

  return (
    <section id="integrations" className="w-full px-5 py-8 sm:px-8 sm:py-10">
      {/* Held to the left half so the gate behind has the other. */}
      <div className="relative mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="AI integrations"
          title={
            <>
              Already using software that works well?
              <br />
              <span className="text-muted">You don&apos;t need to replace it.</span>
            </>
          }
          description="We integrate AI into your existing technology stack. AI becomes an intelligent layer across your existing systems."
          className="relative max-w-2xl"
        />

        {/*
         * The berth on the page. It reserves the card's room in the layout so
         * nothing below it moves as cards come and go, and every card is
         * absolutely placed inside it — they all share one position and only
         * one is ever on screen.
         */}
        <div
          ref={slotRef}
          className="relative mt-6 h-[188px] w-full max-w-md sm:mt-9 sm:h-[196px]"
          style={reduced ? undefined : { perspective: 1200 }}
        >
          {INTEGRATIONS.map((integration, i) => (
            <article
              key={integration.name}
              ref={(el) => {
                cardsRef.current[i] = el;
              }}
              className={cn(
                "liquid-glass machine-module flex flex-col justify-center rounded-2xl p-5 sm:p-6",
                // Stacked at one position under motion; in flow, and simply
                // listed, when there is none.
                reduced ? "mb-3" : "absolute inset-0",
              )}
              style={
                reduced
                  ? undefined
                  : { transformStyle: "preserve-3d", willChange: "transform, opacity" }
              }
            >
              <p className="font-mono text-[10px] tracking-[0.3em] text-accent/65 uppercase">
                Integration {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="font-display mt-3 text-xl leading-tight font-medium tracking-tight text-foreground sm:text-2xl">
                {integration.name}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-muted">
                {integration.description}
              </p>
            </article>
          ))}
        </div>

        <div className="relative mt-6 flex flex-wrap gap-3 sm:mt-9">
          <Button href="#contact">Discuss an Integration</Button>
          <Button href="" variant="secondary">
            View More
          </Button>
        </div>
      </div>
    </section>
  );
}
