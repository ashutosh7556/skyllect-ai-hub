"use client";

import { Fragment, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { SystemsLattice } from "@/components/animation/SystemsLattice";
import { CardFeed } from "@/components/animation/CardFeed";
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

/**
 * Where the read-out clears the screen, as an offset from the end of the pin.
 *
 * Negative: it happens *inside* the pin's last stretch, not after it. Fading
 * it afterwards meant the section had to be a whole viewport longer than its
 * pin so the next one stayed away — and that extra length was a screen of
 * nothing between the two. Done before the pin lets go, the section can end
 * exactly where the pin does and the hand-over has no empty scroll in it.
 */
const EXIT_START = -300;
const EXIT_END = -40;

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

/**
 * A headline split into its own words, each one a piece the hand-over moves
 * separately.
 *
 * Only the large type gets this. A capability list broken into forty
 * independently flying words is noise, not an effect — the lists stay
 * line-level and it is the headlines that assemble word by word, which is
 * where the extra detail actually reads.
 *
 * The space between words is a real text node outside the animated span, so
 * the line still wraps and justifies exactly as ordinary text would.
 */
function Words({ text }: { text: string }) {
  return (
    <>
      {text.split(" ").map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          <span data-line className="inline-block">
            {word}
          </span>{" "}
        </Fragment>
      ))}
    </>
  );
}

export function SystemsIntegration() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const stage0Ref = useRef<HTMLDivElement>(null);
  const stage1Ref = useRef<HTMLDivElement>(null);
  const stage2Ref = useRef<HTMLDivElement>(null);
  const stage3Ref = useRef<HTMLDivElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);
  const dockRef = useRef<HTMLDivElement>(null);
  const readoutRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
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

      /*
       * The panel never quite still.
       *
       * Two long sine loops, deliberately at different periods so they never
       * come back into phase and the drift has no visible cycle. On the dock
       * wrapper, and on rotation only: the dock's own scroll tween writes `z`
       * to this element and the TiltCard writes rotation to the one inside
       * it, so this is a channel of its own either way and nothing here can
       * be overwritten by a pointer moving or a reader scrolling.
       *
       * Small enough — two degrees at the ends — that it reads as the panel
       * hanging in the machine's light rather than as anything moving.
       */
      gsap.to(dockRef.current, {
        rotateY: 2,
        duration: 13,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        startAt: { rotateY: -2 },
      });
      gsap.to(dockRef.current, {
        rotateX: 1.4,
        duration: 17,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        startAt: { rotateX: -1.4 },
      });

      /*
       * The read-out leaves before the next section arrives.
       *
       * The pin releases a few hundred pixels before this section ends, and
       * the copy was still fully lit as it scrolled away — so the closing line
       * was still on screen when the workflow heading came up underneath it
       * and the two ran into each other. This takes the whole read-out, frame
       * and all, down across the gap between the pin ending and the section
       * ending, which is scroll nobody is reading anyway.
       *
       * A tween of its own rather than another beat on the stage timeline:
       * that timeline is normalised onto the pin, so it has no way to express
       * anything that should happen *after* the pin lets go.
       */
      gsap.to(readoutRef.current, {
        autoAlpha: 0,
        ease: "power1.in",
        scrollTrigger: {
          trigger: sectionRef.current,
          // Measured from the pin's end, not the section's bottom: this has to
          // be finished before the next section's heading crosses into view,
          // and that distance is fixed against the pin.
          start: () => `top+=${PIN_LENGTH + EXIT_START} top`,
          end: () => `top+=${PIN_LENGTH + EXIT_END} top`,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

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

      /*
       * The machinery, expressed on the panel itself.
       *
       * Three things, all of them behind the copy and none of them fast:
       * light running the two edges in opposite directions, the corner
       * brackets locking on as the section takes hold, and the plate
       * breathing. Every one is a hairline or a low-alpha wash on `screen`,
       * so the type over them never loses contrast — the panel reads as a
       * working surface rather than a slide.
       */
      gsap.utils.toArray<HTMLElement>("[data-edge-rail]").forEach((railElement) => {
        const light = railElement.querySelector<HTMLElement>("[data-edge-light]");
        if (!light) return;
        const reverse = railElement.dataset.edgeRail === "bottom";
        gsap.fromTo(
          light,
          { x: () => (reverse ? railElement.offsetWidth + 140 : -140) },
          {
            x: () => (reverse ? -140 : railElement.offsetWidth + 140),
            duration: 11,
            ease: "none",
            repeat: -1,
            repeatDelay: 2.4,
            invalidateOnRefresh: true,
          },
        );
      });

      // The brackets ease out to the corners as the panel arrives. Scrubbed,
      // so it reads as the frame settling onto the plate.
      gsap.fromTo(
        "[data-corner]",
        { autoAlpha: 0, scale: 0.55 },
        {
          autoAlpha: 1,
          scale: 1,
          ease: "power2.out",
          stagger: 0.09,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 88%",
            end: "top 32%",
            scrub: 1.4,
            invalidateOnRefresh: true,
          },
        },
      );

      // Load on the plate. Slow enough that it is never something the eye
      // follows — it only stops the surface going flat while a stage is held.
      gsap.fromTo(
        "[data-breath]",
        { opacity: 0.14 },
        {
          // Kept low deliberately. The panel already takes a power-on sweep
          // across it, and the two stacking is how copy on a dark plate stops
          // being crisp — this only has to keep the surface from going flat.
          opacity: 0.34,
          duration: 8.5,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        },
      );

      const stages = [
        stage0Ref.current,
        stage1Ref.current,
        stage2Ref.current,
        stage3Ref.current,
      ];
      if (stages.some((stage) => !stage)) return;

      /*
       * Every line of every topic, animated on its own.
       *
       * There is no panel any more, so there is nothing to slide a block of
       * copy in and out of. What hands over instead is the type itself: a
       * topic breaks apart, each line drifting out into the machinery it was
       * printed over, and the next one assembles inward from the same place.
       * The lattice is visible straight through the whole exchange, which is
       * the point of dropping the card.
       */
      const linesOf = (stage: HTMLDivElement | null) =>
        gsap.utils.toArray<HTMLElement>("[data-line]", stage);

      /**
       * Which way a line leaves, and where it comes back from.
       *
       * Straight out from the middle of the read-out, so a line always
       * travels toward the part of the lattice nearest to it rather than
       * every line sliding the same way. Measured rather than authored: the
       * copy reflows at every breakpoint and a hand-written vector per line
       * would be wrong at all but one width.
       *
       * Read at tween time through a function value, so a resize that moves
       * the copy moves where it flies to as well.
       */
      const driftOf = (element: HTMLElement, axis: "x" | "y") => {
        const stage = element.offsetParent as HTMLElement | null;
        if (!stage) return 0;
        const dx = element.offsetLeft + element.offsetWidth / 2 - stage.clientWidth / 2;
        const dy = element.offsetTop + element.offsetHeight / 2 - stage.clientHeight / 2;
        const length = Math.hypot(dx, dy) || 1;
        // Far enough to clear the read-out's own frame, so a line is gone
        // into the machinery rather than fading out on top of it.
        const reach = 190;
        return ((axis === "x" ? dx : dy) / length) * reach;
      };

      /*
       * Out of the machine's plane, not just out of the way.
       *
       * `transformPerspective` rather than a CSS `perspective` on a parent:
       * perspective only applies to an element's direct children, and half of
       * these lines are list items two levels down inside a `ul`. Carrying it
       * in each line's own transform is what lets every piece tip in depth
       * regardless of how deeply the markup nests it.
       */
      const scatter = {
        autoAlpha: 0,
        scale: 0.8,
        rotateX: -46,
        z: -180,
        transformPerspective: 900,
        transformOrigin: "50% 50% -60px",
        x: (_: number, element: HTMLElement) => driftOf(element, "x"),
        y: (_: number, element: HTMLElement) => driftOf(element, "y"),
        textShadow: "0 0 26px rgba(143,220,242,0.9)",
      };
      const assembled = {
        autoAlpha: 1,
        scale: 1,
        rotateX: 0,
        z: 0,
        x: 0,
        y: 0,
        transformPerspective: 900,
        // Settles to no glow at all, so a line that has arrived is ordinary
        // crisp type and nothing is left haloing behind the copy.
        textShadow: "0 0 0px rgba(143,220,242,0)",
      };

      const allStages = [stage0Ref, stage1Ref, stage2Ref, stage3Ref];
      allStages.forEach((stage, i) => {
        gsap.set(linesOf(stage.current), i === 0 ? assembled : scatter);
      });

      /**
       * The box a topic's copy actually occupies, in read-out coordinates.
       *
       * Measured from the lines' own offsets rather than from their rendered
       * rectangles, because for most of the time this needs to be known the
       * lines are scattered out into the machinery and a rect would report
       * where they have flown to. Offsets are layout values, so no transform
       * on a line — or on anything around it — can move them.
       *
       * `visibility: hidden` keeps an element in the layout, which is the
       * reason the scatter uses `autoAlpha` and not `display`.
       */
      const FRAME_PAD = 34;
      const contentBox = (stage: HTMLDivElement | null) => {
        const lines = linesOf(stage);
        if (lines.length === 0) return null;
        let top = Infinity;
        let left = Infinity;
        let right = -Infinity;
        let bottom = -Infinity;
        for (const line of lines) {
          top = Math.min(top, line.offsetTop);
          left = Math.min(left, line.offsetLeft);
          right = Math.max(right, line.offsetLeft + line.offsetWidth);
          bottom = Math.max(bottom, line.offsetTop + line.offsetHeight);
        }
        return {
          top: top - FRAME_PAD,
          left: left - FRAME_PAD,
          width: right - left + FRAME_PAD * 2,
          height: bottom - top + FRAME_PAD * 2,
        };
      };

      // Opens on the first topic before anything has scrolled.
      const first = contentBox(stage0Ref.current);
      if (first) gsap.set(frameRef.current, first);

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: `+=${PIN_LENGTH}`,
          scrub: 1,
          pin: pinRef.current,
          invalidateOnRefresh: true,
        },
      });

      /*
       * Apart at random, back together in reading order. A topic that
       * disintegrates line by line from the top would read as a list being
       * deleted; scattered, it reads as the text being taken back into the
       * machine. Coming the other way, order matters again — the eye wants to
       * start at the first line.
       */
      const breakApart = (stage: HTMLDivElement | null, at: string) =>
        timeline.to(
          linesOf(stage),
          {
            ...scatter,
            duration: 0.55,
            ease: "power2.in",
            stagger: { each: 0.03, from: "random" },
          },
          at,
        );

      const assemble = (stage: HTMLDivElement | null, at: string) =>
        timeline.to(
          linesOf(stage),
          {
            ...assembled,
            duration: 0.85,
            ease: "power3.out",
            stagger: { each: 0.05, from: "start" },
          },
          at,
        );

      /** Scroll where a topic simply sits there and is read. */
      const hold = (units: number) => timeline.to({}, { duration: units });

      /*
       * The frame closing onto the incoming topic, alongside it arriving.
       *
       * Function values rather than numbers, so a resize — or anything else
       * that reflows the copy — is picked up on the next ScrollTrigger
       * refresh instead of leaving the brackets around the shape the text
       * used to be.
       */
      const frameTo = (stage: HTMLDivElement | null, at: string) =>
        timeline.to(
          frameRef.current,
          {
            top: () => contentBox(stage)?.top ?? 0,
            left: () => contentBox(stage)?.left ?? 0,
            width: () => contentBox(stage)?.width ?? 0,
            height: () => contentBox(stage)?.height ?? 0,
            duration: 0.9,
            ease: "power3.inOut",
          },
          at,
        );

      /*
       * Sequenced end-to-end rather than pinned to fixed times.
       *
       * Every phase here is as long as its own stagger makes it, and those
       * lengths are not knowable in advance: a headline split into twelve
       * words takes far longer to assemble than a two-line topic does. Beats
       * at hand-written positions were fine while whole panels cross-faded,
       * and stopped being fine the moment the stagger got long — the outgoing
       * topic was still coming apart underneath the incoming one, which put
       * two sets of copy on screen at once.
       *
       * `">"` is the end of whatever came last, whatever that turned out to
       * be, so a topic is always fully gone before the next starts arriving,
       * and the scroll is divided by however much time the phases actually
       * need. The whole timeline is normalised onto the pin regardless of how
       * long it adds up to.
       */
      hold(1.1);
      breakApart(stage0Ref.current, ">");
      timeline.addLabel("topic1");
      assemble(stage1Ref.current, "topic1+=0.1");
      frameTo(stage1Ref.current, "topic1");
      hold(1.3);

      breakApart(stage1Ref.current, ">");
      timeline.addLabel("topic2");
      assemble(stage2Ref.current, "topic2+=0.1");
      frameTo(stage2Ref.current, "topic2");
      hold(1.3);

      breakApart(stage2Ref.current, ">");
      timeline.addLabel("topic3");
      assemble(stage3Ref.current, "topic3+=0.1");
      frameTo(stage3Ref.current, "topic3");
      // Longer than the other holds: the exit fade eats into the tail of this
      // one, so the closing line needs the extra to be read before it starts
      // going.
      hold(2.2);
    },
    { scope: sectionRef, dependencies: [reduced] },
  );

  /*
   * Topics start at the top of the read-out, not centred in it.
   *
   * Centred, every topic sat a different distance below the "Beyond chat"
   * label — the shorter the topic, the further down it began — and with a
   * 560px box the longest of those gaps was over two hundred pixels of
   * nothing. Top-aligned, the first line of every topic lands in exactly the
   * same place, so the space under the label is one fixed measure instead of
   * four different ones.
   */
  const stagePanelClass = (staticFallback: boolean) =>
    cn(
      "flex h-full w-full flex-col justify-start p-6 sm:p-12",
      !staticFallback && "absolute inset-0",
    );

  return (
    <div
      ref={sectionRef}
      className="relative"
      /*
       * Tall enough to hold the pin *and* see it out.
       *
       * At a flat 420vh the section was shorter than its own pin needs, so the
       * next section's heading crossed into view while this one was still
       * pinned and being read, and the two ran into each other.
       *
       * The pin plus one viewport is exactly the room the pin needs and not a
       * pixel more — the read-out has already gone by the time the pin lets
       * go, so nothing has to be held apart afterwards. Written from
       * PIN_LENGTH rather than as a round number of viewports so the
       * relationship cannot drift if the pin is ever retimed.
       */
      style={reduced ? undefined : { height: `calc(${PIN_LENGTH}px + 100vh)` }}
    >
      <div
        ref={pinRef}
        /*
         * Unequal padding, not symmetric.
         *
         * Centred in the viewport the copy read as sitting low: the label
         * above it is small and the space beneath it is empty machinery, so
         * the optical centre of the block is below its geometric one. The
         * extra bottom padding lifts the whole group — label and read-out
         * together — onto the middle of the frame as the eye judges it.
         *
         * Less of a lift than it needed when the read-out was 560px tall and
         * the copy floated in the middle of it; now that the copy starts at
         * the top of a shorter box, the group is already higher on its own.
         */
        className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 pt-16 pb-28 sm:px-6 sm:pt-20 sm:pb-32"
      >
        {/*
         * The systems the card is talking about, wired up behind it. Inside
         * the pinned container rather than the section: the section is 420vh
         * tall, so a lattice parented to it would sit centred a couple of
         * screens down and scroll away from the card it belongs to.
         */}
        <SystemsLattice triggerRef={sectionRef} pinLength={PIN_LENGTH} />

        {/*
         * What those systems are sending the copy. Sits between the lattice
         * and the read-out in the stack, so every cable passes under the
         * read-out's edge rather than across its text. Measured against this
         * same pinned box, which is the box the lattice publishes its nodes
         * in.
         */}
        {/* Landed on the frame, not on the whole read-out: the frame is what
            the reader can actually see the edge of, so that is where a cable
            has to stop. It follows the frame as it closes onto each topic. */}
        {!reduced && <CardFeed hostRef={pinRef} cardRef={frameRef} />}

        {/* The section's own label, in the machine's typeface — the same
            mono, the same wide tracking and the same accent as every other
            read-out on the page, rather than the plain sans it was. */}
        <p className="mb-6 font-mono text-[11px] tracking-[0.42em] text-accent/65 uppercase sm:mb-9 sm:text-xs sm:tracking-[0.5em]">
          Beyond chat
        </p>

        {/* Depth wrapper. The perspective lives here so the read-out below it
            has something to travel in. */}
        <div
          // Above the feed layer behind it, so the cables land under the
          // read-out's own edge instead of being drawn over its copy.
          className="relative z-0 w-full max-w-3xl"
          style={reduced ? undefined : { perspective: 1500 }}
        >
          <div
            ref={dockRef}
            style={reduced ? undefined : { transformStyle: "preserve-3d" }}
          >
            {/*
             * The read-out.
             *
             * No panel: there is no surface here, no border and no fill. What
             * marks the copy's territory is a frame of corner brackets and two
             * hairline rails, and what makes it legible is a soft wash of the
             * machine's own light behind it. Everything the lattice draws is
             * visible straight through, which is what the card used to cover.
             */}
            <div
              ref={readoutRef}
              // No padding here under reduced motion: each topic already
              // carries its own, and stacking the two indents the copy twice.
              /*
               * Sized to the tallest topic plus its padding, rather than to a
               * comfortable-looking round number. The box is invisible — the
               * frame hugs the copy — so every pixel it has beyond what the
               * copy needs is just distance between the label and the text.
               */
              className={cn("relative w-full", !reduced && "h-[min(360px,48dvh)]")}
            >
              <div
                className={cn(
                  "relative h-full w-full",
                  reduced && "flex flex-col gap-8 sm:gap-10",
                )}
              >
                {/*
                 * The frame, as one element that is sized to whatever topic
                 * is currently in it.
                 *
                 * The brackets used to be pinned to the read-out's own box,
                 * which is a fixed 560px tall whatever it happens to be
                 * holding. A row of chips left most of that frame empty and
                 * the copy looked lost inside it rather than contained by it.
                 * This measures the topic's actual text and closes the frame
                 * onto it, so the brackets always sit just outside the copy —
                 * and the frame re-sizes as part of each hand-over, which is
                 * a piece of machinery adjusting to its contents rather than
                 * a border that happens to be there.
                 */}
                {!reduced && (
                  <div
                    ref={frameRef}
                    aria-hidden="true"
                    /*
                     * `overflow-hidden` is the whole point of this element
                     * now: every coloured layer in the section lives inside
                     * it, so the sign is the boundary of the colour. Outside
                     * the brackets the lattice is plain line work on black,
                     * which is what stops the wash reading as a panel bleeding
                     * across the page. It does not create a stacking context,
                     * so the `screen` blends below still composite against the
                     * page rather than against an isolated layer.
                     */
                    className="pointer-events-none absolute top-0 left-0 h-full w-full overflow-hidden"
                  >
                    {/*
                     * The ground the type sits on, and the only dark layer.
                     * Inside the frame, so the copy has something to hold
                     * against without anything being darkened beyond the sign.
                     */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "radial-gradient(50% 50% at 50% 50%, rgba(4,6,11,0.92) 0%, rgba(4,6,11,0.8) 44%, rgba(4,6,11,0.44) 70%, rgba(4,6,11,0) 100%)",
                      }}
                    />

                    {/*
                     * The light the machine casts up into the read-out.
                     * `screen` keeps it additive against the near-black page,
                     * so it reads as light arriving rather than a tint laid on
                     * top, and the 50% radii bring it to zero by the frame's
                     * own edge — clipped or not, there is no hard rectangle.
                     */}
                    <div
                      ref={lightRef}
                      className="absolute inset-0"
                      style={{
                        opacity: 0,
                        mixBlendMode: "screen",
                        /*
                         * Anchor and radius have to add up to 100%, or the
                         * ellipse runs past an edge and the frame's clip cuts
                         * it while it is still lit — which draws exactly the
                         * hard rectangle this layer is inside the frame to
                         * avoid. Biased low at 58% with a 42% radius: it
                         * still reads as light arriving from beneath, and it
                         * reaches zero precisely at the bottom edge.
                         */
                        background:
                          "radial-gradient(50% 42% at 50% 58%, rgba(92,200,232,0.3) 0%, rgba(72,170,205,0.18) 22%, rgba(60,120,175,0.11) 44%, rgba(106,92,224,0.05) 72%, rgba(106,92,224,0) 100%)",
                      }}
                    />

                    {/* The plate under load — a slow breath, so the inside of
                        the sign is never completely static. */}
                    <div
                      data-breath
                      className="absolute inset-0 opacity-[0.14]"
                      style={{
                        mixBlendMode: "screen",
                        // Anchor plus radius lands on 100%, same as the light
                        // above it, for the same clipping reason.
                        background:
                          "radial-gradient(50% 38% at 50% 62%, rgba(92,200,232,0.18) 0%, rgba(106,92,224,0.08) 55%, rgba(106,92,224,0) 100%)",
                      }}
                    />

                    {/* Light running the frame, out along the top and back
                        along the bottom. Each rail clips its own light, so the
                        pass enters and leaves at the frame's edges. */}
                    {(["top", "bottom"] as const).map((edge) => (
                      <span
                        key={edge}
                        data-edge-rail={edge}
                        className={cn(
                          "pointer-events-none absolute inset-x-0 h-px overflow-hidden",
                          edge === "top" ? "top-0" : "bottom-0",
                        )}
                      >
                        <span
                          data-edge-light
                          className="absolute inset-y-0 left-0 w-36 bg-gradient-to-r from-transparent via-accent-soft/80 to-transparent"
                        />
                      </span>
                    ))}

                    {/* Corner brackets, on the frame's own corners. */}
                    {(
                      [
                        ["border-t border-l", "top-0 left-0"],
                        ["border-t border-r", "top-0 right-0"],
                        ["border-b border-l", "bottom-0 left-0"],
                        ["border-b border-r", "bottom-0 right-0"],
                      ] as const
                    ).map(([edges, placement]) => (
                      <span
                        key={placement}
                        data-corner
                        className={cn(
                          "pointer-events-none absolute h-5 w-5 border-accent/45",
                          edges,
                          placement,
                        )}
                      />
                    ))}

                    {/*
                     * The power-on sweep. Inside the frame and therefore
                     * clipped by it, which is what lets it run right across
                     * without any light escaping past the brackets.
                     */}
                    <div
                      ref={sweepRef}
                      className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 opacity-0"
                      style={{
                        mixBlendMode: "screen",
                        background:
                          "radial-gradient(50% 50% at 50% 50%, rgba(190,235,255,0.22) 0%, rgba(92,200,232,0.12) 42%, rgba(92,200,232,0) 100%)",
                      }}
                    />
                  </div>
                )}

                {/*
                 * Every `data-line` is a piece the hand-over moves on its own.
                 * A heading, a paragraph, a chip, a capability — each one
                 * leaves for the machinery and comes back from it separately,
                 * which is what makes a topic change read as the text being
                 * taken apart rather than a slide being swapped.
                 */}
                <div ref={stage0Ref} className={stagePanelClass(reduced)}>
                  <h2 className="font-display text-[1.75rem] leading-[1.08] font-medium tracking-[-0.025em] text-foreground sm:text-4xl md:text-[3.4rem]">
                    <Words text="AI That Works With Your Real Business Systems" />
                  </h2>
                  <p
                    data-line
                    className="mt-5 max-w-xl text-sm leading-relaxed text-hero-sub opacity-80 sm:mt-7 sm:text-lg"
                  >
                    Most AI tools stop at answering questions.{" "}
                    <span className="text-foreground">We go further.</span>{" "}
                    Skyllect connects AI with the systems your business already
                    uses.
                  </p>
                </div>

                <div ref={stage1Ref} className={stagePanelClass(reduced)}>
                  <p
                    data-line
                    className="mb-5 font-mono text-[10px] tracking-[0.34em] text-accent/60 uppercase sm:mb-7 sm:text-[11px]"
                  >
                    Connected systems
                  </p>
                  <ul className="flex flex-wrap gap-2.5 sm:gap-3">
                    {CONNECTED_SYSTEMS.map((system) => (
                      <li
                        key={system}
                        data-line
                        className="font-display rounded-full border border-edge/80 px-3.5 py-1.5 text-xs font-medium tracking-tight text-foreground/85 sm:px-4.5 sm:py-2 sm:text-[0.95rem]"
                      >
                        {system}
                      </li>
                    ))}
                  </ul>
                </div>

                <div ref={stage2Ref} className={stagePanelClass(reduced)}>
                  <p
                    data-line
                    className="mb-5 font-mono text-[10px] tracking-[0.34em] text-accent/60 uppercase sm:mb-7 sm:text-[11px]"
                  >
                    Your AI can
                  </p>
                  <ul className="grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2 sm:gap-y-2.5">
                    {CAPABILITIES.map((capability) => (
                      <li
                        key={capability}
                        data-line
                        className="font-display flex items-baseline gap-2.5 text-[0.9rem] leading-snug font-normal tracking-tight text-foreground/85 sm:text-base"
                      >
                        {/* A lit tick per line, so the list reads as a
                            machine's output rather than as body copy. */}
                        <span
                          aria-hidden="true"
                          className="mt-0.5 h-px w-2.5 shrink-0 bg-accent/55"
                        />
                        {capability}
                      </li>
                    ))}
                  </ul>
                </div>

                <div ref={stage3Ref} className={stagePanelClass(reduced)}>
                  <p className="font-display max-w-xl text-xl leading-[1.2] font-medium tracking-[-0.02em] text-foreground sm:text-3xl md:text-[2.6rem]">
                    <Words text="Your employees remain in control while AI handles repetitive operational work." />
                  </p>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
