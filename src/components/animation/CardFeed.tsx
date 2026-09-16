"use client";

import { useEffect, useRef, type RefObject } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { systemsLattice } from "@/lib/systemsLattice";

/**
 * What the lattice is actually sending the card.
 *
 * The systems behind the Beyond Chat card were already wired to each other;
 * nothing was wired to the card itself, so the panel sat in front of the
 * diagram rather than being part of it. This runs a line from each node into
 * the nearest point on the card's own edge, lands it on a port, and puts
 * traffic on it — so the copy on the panel is visibly the output of the
 * machinery drawn around it.
 *
 * Every line is driven by its own node's `lit`, which the lattice publishes
 * and which is the same left-to-right charge wave the glyphs light on. A feed
 * therefore cannot arrive before the system feeding it has come up: the card
 * fills from the left as the section is read, with no second timeline to fall
 * out of step with the first. It draws itself by moving its far end, the same
 * way the lattice draws its own links.
 *
 * Everything is outside the panel. The lines stop at the edge, the ports sit
 * on it, and nothing is ever painted over the copy — the layer is behind the
 * card in the stack, so even the ports are occluded by it rather than drawn
 * on top.
 */

/** Feeds only run from nodes with room to run. See `portFor`. */
const CLEARANCE = 26;
/** Packets in flight per feed. Two, slow, and well apart. */
const PACKETS = 2;
/** How long a packet takes to travel one feed, in seconds. */
const TRANSIT = 4.6;

interface CardFeedProps {
  /** The lattice host's box is the coordinate space; this is measured in it. */
  hostRef: RefObject<HTMLElement | null>;
  /** The panel being fed. Its border box is where the ports sit. */
  cardRef: RefObject<HTMLElement | null>;
}

interface Feed {
  group: SVGGElement;
  path: SVGPathElement;
  port: SVGGElement;
  packets: SVGCircleElement[];
}

interface Box {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

/**
 * Where a feed lands on the panel, and which way the port faces.
 *
 * For a node outside the card this is its own position clamped to the border
 * box, with the port turned to meet the cable. For a node the card happens to
 * be sitting on top of — the lattice is wider than the panel at some
 * viewports and the middle of it is behind the panel at most — it is the
 * nearest edge instead, facing out of that edge. Those ones get a port and no
 * visible cable, which is the truth of it: the cable is behind the card.
 *
 * `facing` always points *into* the panel, so the bracket opens inward and
 * its lamp sits on the outside, whichever edge it ends up on.
 */
function portFor(nx: number, ny: number, box: Box) {
  const inside = nx > box.left && nx < box.right && ny > box.top && ny < box.bottom;

  if (inside) {
    const gaps = [nx - box.left, box.right - nx, ny - box.top, box.bottom - ny];
    const nearest = gaps.indexOf(Math.min(...gaps));
    const edges = [
      { x: box.left, y: ny, ox: -1, oy: 0 },
      { x: box.right, y: ny, ox: 1, oy: 0 },
      { x: nx, y: box.top, ox: 0, oy: -1 },
      { x: nx, y: box.bottom, ox: 0, oy: 1 },
    ];
    const edge = edges[nearest];
    return { x: edge.x, y: edge.y, facing: edge, cabled: false };
  }

  const x = gsap.utils.clamp(box.left, box.right, nx);
  const y = gsap.utils.clamp(box.top, box.bottom, ny);
  const dx = nx - x;
  const dy = ny - y;
  const length = Math.hypot(dx, dy) || 1;
  return {
    x,
    y,
    facing: { ox: dx / length, oy: dy / length },
    // Too close to the edge to be worth a cable: it would be a stub under the
    // panel's own shadow rather than a run between two things.
    cabled: length > CLEARANCE,
  };
}

export function CardFeed({ hostRef, cardRef }: CardFeedProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const groups = Array.from(svg.querySelectorAll<SVGGElement>("[data-card-feed]"));
    const feeds: Feed[] = groups.map((group) => ({
      group,
      path: group.querySelector<SVGPathElement>("[data-line]")!,
      port: group.querySelector<SVGGElement>("[data-port]")!,
      packets: Array.from(group.querySelectorAll<SVGCircleElement>("[data-packet]")),
    }));

    /*
     * Everything below writes presentation *attributes*, never inline style.
     * Mixing the two on one property is a trap: a style set once outranks
     * every attribute written afterwards, so a single frame taken before the
     * lattice was live would have left the whole layer invisible for good.
     */
    const hide = (feed: Feed) => feed.group.setAttribute("opacity", "0");

    function draw(time: number) {
      const host = hostRef.current;
      const card = cardRef.current;
      if (!host || !card || !systemsLattice.live) {
        // Nothing to connect to. Better an empty layer than cables left
        // pointing at where the card used to be.
        feeds.forEach(hide);
        return;
      }

      const hostBox = host.getBoundingClientRect();
      const cardBox = card.getBoundingClientRect();
      const box: Box = {
        left: cardBox.left - hostBox.left,
        top: cardBox.top - hostBox.top,
        right: cardBox.right - hostBox.left,
        bottom: cardBox.bottom - hostBox.top,
      };

      feeds.forEach((feed, i) => {
        const node = systemsLattice.nodes[i];
        if (!node || node.lit <= 0.01) {
          if (feed.group.getAttribute("opacity") !== "0") hide(feed);
          return;
        }

        const lit = node.lit;
        const port = portFor(node.x, node.y, box);
        feed.group.setAttribute("opacity", Math.min(1, lit * 1.3).toFixed(3));

        /*
         * The cable is drawn by moving its far end rather than by fading in,
         * so it reaches for the panel instead of appearing between the two —
         * the same way the lattice behind it draws its own links. Its control
         * point is offset perpendicular to the run, alternating side by side,
         * which is what keeps several cables converging on one rectangle
         * reading as separate runs rather than as a star.
         */
        const dx = port.x - node.x;
        const dy = port.y - node.y;
        const length = Math.hypot(dx, dy) || 1;
        const bow = Math.min(length * 0.16, 54) * (i % 2 === 0 ? 1 : -1);
        const cxp = (node.x + port.x) / 2 - (dy / length) * bow;
        const cyp = (node.y + port.y) / 2 + (dx / length) * bow;

        if (port.cabled) {
          const endX = node.x + dx * lit;
          const endY = node.y + dy * lit;
          feed.path.setAttribute(
            "d",
            `M ${node.x.toFixed(1)} ${node.y.toFixed(1)} Q ${cxp.toFixed(1)} ${cyp.toFixed(1)} ${endX.toFixed(1)} ${endY.toFixed(1)}`,
          );
          feed.path.setAttribute("opacity", "1");
        } else {
          // Behind the panel: the port is the whole of what there is to see.
          feed.path.setAttribute("opacity", "0");
        }

        // The port only exists once its cable has arrived, and it faces into
        // the panel whichever edge it landed on.
        const docked = gsap.utils.clamp(0, 1, (lit - 0.72) / 0.28);
        const facing = (Math.atan2(-port.facing.oy, -port.facing.ox) * 180) / Math.PI;
        feed.port.setAttribute(
          "transform",
          `translate(${port.x.toFixed(1)} ${port.y.toFixed(1)}) rotate(${facing.toFixed(1)}) scale(${(0.5 + docked * 0.5).toFixed(3)})`,
        );
        feed.port.setAttribute("opacity", docked.toFixed(3));

        feed.packets.forEach((packet, p) => {
          if (!port.cabled || docked < 0.99) {
            packet.setAttribute("opacity", "0");
            return;
          }
          /*
           * Position along the cable, as a point on the *curve* rather than a
           * fraction of the straight run — a packet interpolated between the
           * two ends would visibly leave the line it is meant to be
           * travelling down.
           */
          const t = (time / TRANSIT + (i * 0.37 + p / PACKETS)) % 1;
          const inv = 1 - t;
          const qx = inv * inv * node.x + 2 * inv * t * cxp + t * t * port.x;
          const qy = inv * inv * node.y + 2 * inv * t * cyp + t * t * port.y;
          packet.setAttribute("cx", qx.toFixed(1));
          packet.setAttribute("cy", qy.toFixed(1));
          // Fades as it arrives, so it reads as entering the panel rather
          // than stopping dead against its edge.
          packet.setAttribute("opacity", (Math.min(1, t * 6) * (1 - t * t)).toFixed(3));
        });
      });
    }

    if (reduced) {
      // One pass: everything connected, everything still.
      draw(0);
      return;
    }

    gsap.ticker.add(draw);
    return () => {
      gsap.ticker.remove(draw);
    };
  }, [hostRef, cardRef, reduced]);

  return (
    <svg
      ref={svgRef}
      aria-hidden="true"
      /*
       * Between the lattice and the card. The nodes are behind this, the panel
       * in front of it — so a feed passes under the card's edge and the copy
       * never has a hairline across it.
       */
      className="pointer-events-none absolute inset-0 z-[-5] h-full w-full"
    >
      {Array.from({ length: 8 }).map((_, i) => (
        <g key={i} data-card-feed opacity={0}>
          <path
            data-line
            fill="none"
            stroke="rgba(92,200,232,0.38)"
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
          />

          {/* The port the cable lands on: a bracket against the panel's edge
              with a lamp inside it, in the same line language as the HUD on
              the agent modules. */}
          <g data-port opacity={0}>
            <path
              d="M -5 -5 L -5 5 M -5 0 L 5 0"
              fill="none"
              stroke="rgba(143,220,242,0.85)"
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
            />
            <circle cx={-5} cy={0} r={2} fill="#dff6ff" />
          </g>

          {Array.from({ length: PACKETS }).map((__, p) => (
            <circle key={p} data-packet r={1.8} fill="#dff6ff" opacity={0} />
          ))}
        </g>
      ))}
    </svg>
  );
}
