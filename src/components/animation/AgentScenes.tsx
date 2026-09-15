"use client";

import { useEffect, useRef, type RefObject } from "react";
import * as THREE from "three";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { MACHINE } from "@/lib/theme";
import { AGENTS, type HudVariant } from "@/data/agents";

/**
 * A different machine running inside each agent card.
 *
 * Seven WebGL contexts would be seven GPU processes and would crowd the
 * browser's context limit on their own. Instead this is *one* canvas and one
 * scene: every card's rig is built into that scene, parked far enough apart
 * that only one is ever in frame, and each frame the renderer walks the
 * cards and draws each rig into that card's own rectangle with the scissor
 * test on. One context, one draw call per visible card, nothing to tear down
 * when a card scrolls away.
 *
 * The canvas is fixed and transparent, and nothing is ever painted outside a
 * scissor rectangle — so it can sit over the cards without covering them,
 * and each clip stays fully visible under its rig.
 *
 * The rigs are wireframe and additive by design. They read as a schematic
 * running on top of the footage rather than as an object hiding it.
 */

/** Spacing between rigs in world units. Wider than any rig is deep. */
const BAY_PITCH = 100;

interface Rig {
  update: (time: number, lit: number) => void;
}

interface AgentScenesProps {
  /** Element whose `[data-agent-stage]` descendants are the card viewports. */
  containerRef: RefObject<HTMLElement | null>;
  /** Index of the hovered card, or null when the pointer is elsewhere. */
  focus: number | null;
}

export function AgentScenes({ containerRef, focus }: AgentScenesProps) {
  const reduced = useReducedMotion();
  /**
   * Per-card excitement, 0 at rest and 1 while hovered. A ref, not state:
   * the render loop reads it every frame and GSAP writes to it, so pushing
   * it through React would be a re-render per frame for nothing.
   */
  const chargeRef = useRef<number[]>(AGENTS.map(() => 0));

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: window.innerWidth >= 1024,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      return;
    }

    const canvas = renderer.domElement;
    canvas.setAttribute("aria-hidden", "true");
    canvas.style.position = "fixed";
    canvas.style.inset = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.pointerEvents = "none";
    // Over the card panels — it only ever paints inside a card's viewport —
    // but under the header, which owns z-50.
    canvas.style.zIndex = "30";
    document.body.appendChild(canvas);

    renderer.setClearAlpha(0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setScissorTest(true);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 2.6, 0.1, 40);

    const geometries: THREE.BufferGeometry[] = [];
    const materials: THREE.Material[] = [];
    const geo = <T extends THREE.BufferGeometry>(value: T) => (geometries.push(value), value);
    const mat = <T extends THREE.Material>(value: T) => (materials.push(value), value);

    /* ------------------------------------------------------------ materials */

    /*
     * The line work blends normally, not additively. Additive light is
     * invisible against the bright frames some of these clips have — it adds
     * to white and stays white — so the rigs vanished on exactly the cards
     * where they most needed to read. A flat cyan holds on both a dark frame
     * and a blown-out one. Only the sparks stay additive, because a point of
     * light is meant to look like one.
     */
    const wire = mat(
      new THREE.LineBasicMaterial({
        color: MACHINE.accent,
        transparent: true,
        opacity: 0.9,
        depthWrite: false,
      }),
    );

    const wireDim = mat(
      new THREE.LineBasicMaterial({
        color: 0x9fc4e8,
        transparent: true,
        opacity: 0.5,
        depthWrite: false,
      }),
    );

    const spark = mat(
      new THREE.MeshBasicMaterial({
        color: 0xcaf2ff,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );

    const plate = mat(
      new THREE.MeshStandardMaterial({
        color: MACHINE.metalDark,
        metalness: 0.6,
        roughness: 0.42,
        transparent: true,
        opacity: 0.22,
        side: THREE.DoubleSide,
      }),
    );

    /** A wireframe outline of any geometry, as a single line object. */
    const edgesOf = (source: THREE.BufferGeometry, material: THREE.LineBasicMaterial) =>
      new THREE.LineSegments(geo(new THREE.EdgesGeometry(geo(source))), material);

    /** A flat ring outline — RingGeometry with both radii equal draws nothing. */
    const ringOf = (radius: number, segments: number, material: THREE.LineBasicMaterial) => {
      const points: number[] = [];
      for (let i = 0; i <= segments; i++) {
        const angle = (i / segments) * Math.PI * 2;
        points.push(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);
      }
      const geometry = geo(new THREE.BufferGeometry());
      geometry.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
      return new THREE.Line(geometry, material);
    };

    const sparkGeometry = geo(new THREE.SphereGeometry(0.055, 8, 6));

    /* ---------------------------------------------------------- rig builders */

    /** Sales: the funnel, with leads falling through it and narrowing. */
    function buildFunnel(bay: THREE.Group): Rig {
      const rings: THREE.Line[] = [];
      for (let i = 0; i < 4; i++) {
        const ring = ringOf(1.15 - i * 0.25, 40, i === 3 ? wire : wireDim);
        ring.rotation.x = Math.PI / 2;
        ring.position.y = 0.78 - i * 0.5;
        bay.add(ring);
        rings.push(ring);
      }

      const drops = Array.from({ length: 6 }, () => {
        const drop = new THREE.Mesh(sparkGeometry, spark);
        bay.add(drop);
        return drop;
      });

      return {
        update(time, lit) {
          rings.forEach((ring, i) => {
            ring.rotation.z = time * (0.2 + i * 0.09) * (i % 2 ? -1 : 1);
          });
          drops.forEach((drop, i) => {
            const t = (time * (0.26 + lit * 0.45) + i / drops.length) % 1;
            const radius = 1.15 - t * 0.95;
            const angle = t * Math.PI * 3 + i;
            drop.position.set(Math.cos(angle) * radius, 0.9 - t * 1.85, Math.sin(angle) * radius);
            drop.scale.setScalar(0.8 + lit * 0.9);
          });
        },
      };
    }

    /** Support: the conversation orbiting a live core. */
    function buildOrbit(bay: THREE.Group): Rig {
      const core = edgesOf(new THREE.IcosahedronGeometry(0.42, 0), wire);
      bay.add(core);

      const arms = Array.from({ length: 3 }, (_, i) => {
        const pivot = new THREE.Group();
        pivot.rotation.set(0.45 * i, i * 1.3, 0.3 * i);
        const shard = edgesOf(new THREE.BoxGeometry(0.36, 0.22, 0.02), wireDim);
        shard.position.x = 1.05;
        const dot = new THREE.Mesh(sparkGeometry, spark);
        dot.position.x = 1.05;
        pivot.add(shard, dot);
        bay.add(pivot);
        return pivot;
      });

      return {
        update(time, lit) {
          core.rotation.y = time * 0.35;
          core.rotation.x = time * 0.2;
          core.scale.setScalar(1 + lit * 0.18 + Math.sin(time * 1.6) * 0.02);
          arms.forEach((pivot, i) => {
            pivot.rotation.y = time * (0.5 + i * 0.22 + lit * 0.8) * (i % 2 ? -1 : 1);
          });
        },
      };
    }

    /** Logistics: a run round the network, with the shipment on it. */
    function buildRoute(bay: THREE.Group): Rig {
      const track = ringOf(1.15, 64, wire);
      track.rotation.x = 1.15;
      bay.add(track);

      const inner = ringOf(0.62, 48, wireDim);
      inner.rotation.x = 1.15;
      bay.add(inner);

      const stops = Array.from({ length: 4 }, (_, i) => {
        const angle = (i / 4) * Math.PI * 2;
        const stop = edgesOf(new THREE.BoxGeometry(0.15, 0.15, 0.15), wire);
        stop.position.set(Math.cos(angle) * 1.15, Math.sin(angle) * 1.15, 0);
        track.add(stop);
        return stop;
      });

      const pod = new THREE.Mesh(sparkGeometry, spark);
      pod.scale.setScalar(1.5);
      track.add(pod);

      return {
        update(time, lit) {
          track.rotation.z = time * 0.12;
          inner.rotation.z = -time * 0.3;
          const angle = time * (0.55 + lit * 1.2);
          pod.position.set(Math.cos(angle) * 1.15, Math.sin(angle) * 1.15, 0);
          stops.forEach((stop, i) => {
            stop.rotation.z = time * 0.6 + i;
          });
        },
      };
    }

    /** Procurement: two quotes on a beam, weighed against each other. */
    function buildBalance(bay: THREE.Group): Rig {
      const beam = new THREE.Group();
      beam.position.y = 0.25;
      bay.add(beam);
      beam.add(edgesOf(new THREE.BoxGeometry(2.1, 0.06, 0.06), wire));

      const pans = [-1, 1].map((side) => {
        const pan = edgesOf(new THREE.BoxGeometry(0.44, 0.44, 0.44), side < 0 ? wire : wireDim);
        pan.position.set(side * 1.02, -0.46, 0);
        beam.add(pan);
        return pan;
      });

      const column = edgesOf(new THREE.CylinderGeometry(0.06, 0.2, 1.15, 8), wireDim);
      column.position.y = -0.4;
      bay.add(column);

      // The recommendation: rides the pan that is winning.
      const verdict = new THREE.Mesh(sparkGeometry, spark);
      beam.add(verdict);

      return {
        update(time, lit) {
          const tilt = Math.sin(time * 0.5) * (0.17 + lit * 0.1);
          beam.rotation.z = tilt;
          pans.forEach((pan, i) => {
            pan.rotation.y = time * (0.3 + i * 0.18);
          });
          const winning = tilt < 0 ? 1 : -1;
          verdict.position.set(winning * 1.02, -0.46, 0.3);
          verdict.scale.setScalar(1 + lit + Math.sin(time * 3) * 0.1);
        },
      };
    }

    /** Operations: every system's panel, turning in step. */
    function buildStack(bay: THREE.Group): Rig {
      const plates = Array.from({ length: 4 }, (_, i) => {
        const group = new THREE.Group();
        group.position.y = 0.7 - i * 0.46;
        const width = 1.55 - i * 0.16;
        const depth = 0.95 - i * 0.1;
        const face = new THREE.Mesh(geo(new THREE.PlaneGeometry(width, depth)), plate);
        face.rotation.x = -Math.PI / 2.5;
        const outline = edgesOf(new THREE.PlaneGeometry(width, depth), i === 0 ? wire : wireDim);
        outline.rotation.x = -Math.PI / 2.5;
        group.add(face, outline);
        bay.add(group);
        return group;
      });

      const readouts = Array.from({ length: 4 }, (_, i) => {
        const dot = new THREE.Mesh(sparkGeometry, spark);
        dot.position.set(-0.62 + i * 0.41, 0.82, 0.24);
        bay.add(dot);
        return dot;
      });

      return {
        update(time, lit) {
          plates.forEach((group, i) => {
            group.rotation.y = Math.sin(time * (0.32 + i * 0.08) + i) * (0.5 + lit * 0.4);
          });
          readouts.forEach((dot, i) => {
            const pulse = (Math.sin(time * 2 + i * 0.8) + 1) / 2;
            dot.scale.setScalar(0.6 + pulse * (0.8 + lit * 1));
          });
        },
      };
    }

    /** Documents: pages passing the scanner, fields lifting off them. */
    function buildSheets(bay: THREE.Group): Rig {
      const sheets = Array.from({ length: 3 }, (_, i) => {
        const group = new THREE.Group();
        group.position.set(-0.1 + i * 0.1, 0.3 - i * 0.3, -i * 0.14);
        group.rotation.x = -0.85;
        group.add(
          new THREE.Mesh(geo(new THREE.PlaneGeometry(1.1, 1.4)), plate),
          edgesOf(new THREE.PlaneGeometry(1.1, 1.4), i === 0 ? wire : wireDim),
        );
        bay.add(group);
        return group;
      });

      const barGeometry = geo(new THREE.PlaneGeometry(1.3, 0.035));
      const bar = new THREE.Mesh(barGeometry, spark);
      bar.rotation.x = -0.85;
      bay.add(bar);

      // What the scan lifts off the page.
      const fields = Array.from({ length: 3 }, (_, i) => {
        const field = new THREE.Mesh(sparkGeometry, spark);
        field.scale.set(3, 0.45, 0.45);
        field.position.x = -0.25 + i * 0.25;
        bay.add(field);
        return field;
      });

      return {
        update(time, lit) {
          sheets.forEach((sheet, i) => {
            sheet.rotation.z = Math.sin(time * 0.3 + i) * 0.05;
          });
          const pass = (time * (0.28 + lit * 0.4)) % 1;
          bar.position.set(0, 0.7 - pass * 1.4, 0.32);
          fields.forEach((field, i) => {
            const t = (pass + i * 0.22) % 1;
            field.position.y = 0.55 - t * 1.15;
            field.position.z = 0.34 + t * 0.4;
            field.scale.x = 2.2 + Math.sin(t * Math.PI) * (1.5 + lit * 1.4);
            field.visible = t < 0.86;
          });
        },
      };
    }

    /** Knowledge: a question propagating through what the company knows. */
    function buildNeural(bay: THREE.Group): Rig {
      const count = 9;
      const positions: THREE.Vector3[] = [];
      const nodes = Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * Math.PI * 2;
        const radius = i % 3 === 0 ? 0.52 : 1.1;
        const position = new THREE.Vector3(
          Math.cos(angle) * radius,
          Math.sin(angle * 1.6) * 0.58,
          Math.sin(angle) * radius * 0.6,
        );
        positions.push(position);
        const node = new THREE.Mesh(sparkGeometry, spark);
        node.position.copy(position);
        bay.add(node);
        return node;
      });

      const links: number[] = [];
      for (let i = 0; i < count; i++) {
        const a = positions[i];
        const b = positions[(i + 3) % count];
        links.push(a.x, a.y, a.z, b.x, b.y, b.z);
      }
      const linkGeometry = geo(new THREE.BufferGeometry());
      linkGeometry.setAttribute("position", new THREE.Float32BufferAttribute(links, 3));
      bay.add(new THREE.LineSegments(linkGeometry, wireDim));

      const query = new THREE.Mesh(sparkGeometry, spark);
      query.scale.setScalar(1.8);
      bay.add(query);

      return {
        update(time, lit) {
          bay.rotation.y = time * 0.18;
          nodes.forEach((node, i) => {
            const pulse = (Math.sin(time * 1.6 - i * 0.7) + 1) / 2;
            node.scale.setScalar(0.6 + pulse * (0.8 + lit * 1.1));
          });
          // The question hops node to node, faster while the card is read.
          const walk = time * (0.8 + lit * 1.5);
          const step = Math.floor(walk) % count;
          query.position.lerpVectors(positions[step], positions[(step + 1) % count], walk % 1);
        },
      };
    }

    const BUILDERS: Record<HudVariant, (bay: THREE.Group) => Rig> = {
      flow: buildFunnel,
      chat: buildOrbit,
      route: buildRoute,
      nodes: buildBalance,
      sync: buildStack,
      scan: buildSheets,
      neural: buildNeural,
    };

    /* -------------------------------------------------------------- the bays */

    const bays: THREE.Group[] = [];
    const rigs: Rig[] = AGENTS.map((agent, i) => {
      const bay = new THREE.Group();
      // Parked far apart, so a card's camera can only ever see its own rig.
      bay.position.x = i * BAY_PITCH;
      bay.scale.setScalar(0.96);
      scene.add(bay);
      bays.push(bay);
      return BUILDERS[agent.hud](bay);
    });

    // Only the plates are lit — everything else is additive line work, which
    // ignores lighting entirely. A directional light reaches every bay at the
    // same angle, so one rig is lit exactly like the next.
    scene.add(new THREE.AmbientLight(0x3d5a78, 1.1));

    const key = new THREE.DirectionalLight(MACHINE.key, 1.4);
    key.position.set(2, 4, 6);
    scene.add(key);

    /* -------------------------------------------------------------- the loop */

    let running = true;
    let onScreen = true;

    function frame(time: number) {
      if (!running || !onScreen) return;

      const stages = container!.querySelectorAll<HTMLElement>("[data-agent-stage]");
      if (stages.length === 0) return;

      const charge = chargeRef.current;
      const viewWidth = window.innerWidth;
      const viewHeight = window.innerHeight;

      /*
       * Wipe the whole canvas before drawing any card.
       *
       * With the scissor test on, a render only clears its own rectangle — so
       * a card that scrolls out of view is never drawn again and never
       * cleared either, and its last frame stays burnt into the canvas as a
       * ghost panel floating over the page. Clearing up front, with the
       * scissor off, is what makes the canvas only ever show cards that are
       * actually on screen right now.
       */
      renderer.setScissorTest(false);
      renderer.clear();
      renderer.setScissorTest(true);

      stages.forEach((stage) => {
        const index = Number(stage.dataset.agentStage);
        const rig = rigs[index];
        if (!rig) return;

        const rect = stage.getBoundingClientRect();
        // Off the viewport entirely: no rectangle to draw into, and no reason
        // to advance the rig either.
        if (rect.bottom <= 0 || rect.top >= viewHeight) return;
        if (rect.right <= 0 || rect.left >= viewWidth) return;

        rig.update(time, charge[index] ?? 0);

        const bottom = viewHeight - rect.bottom;
        renderer.setViewport(rect.left, bottom, rect.width, rect.height);
        renderer.setScissor(rect.left, bottom, rect.width, rect.height);

        camera.aspect = rect.width / rect.height;
        // A card viewport is wide and short, so the lens widens with it —
        // otherwise the rig runs out of the top and bottom of the frame.
        camera.fov = THREE.MathUtils.clamp(46 - camera.aspect * 2.4, 24, 44);
        camera.position.set(bays[index].position.x, 0.1, 6.1);
        camera.lookAt(bays[index].position.x, 0, 0);
        camera.updateProjectionMatrix();

        renderer.render(scene, camera);
      });
    }

    function resize() {
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(window.innerWidth, window.innerHeight, false);
    }
    resize();
    window.addEventListener("resize", resize);

    const observer = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        if (!onScreen) {
          // Scissor is on, so a plain clear would only wipe the last card's
          // rectangle and leave the rest of the canvas painted.
          renderer.setScissorTest(false);
          renderer.clear();
          renderer.setScissorTest(true);
        }
      },
      { rootMargin: "150px" },
    );
    observer.observe(container);

    function handleVisibilityChange() {
      running = !document.hidden;
    }
    document.addEventListener("visibilitychange", handleVisibilityChange);

    if (reduced) {
      // One composed frame, then nothing further.
      frame(0);
    } else {
      gsap.ticker.add(frame);
    }

    return () => {
      running = false;
      gsap.ticker.remove(frame);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      observer.disconnect();

      geometries.forEach((value) => value.dispose());
      materials.forEach((value) => value.dispose());
      scene.clear();
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
    };
  }, [containerRef, reduced]);

  /*
   * Hover, eased per card rather than switched: a rig winds up and back down,
   * so sweeping across the grid leaves a wake instead of a flicker.
   */
  useEffect(() => {
    const charge = chargeRef.current;
    const tweens = charge.map((_, i) =>
      gsap.to(charge, {
        [i]: focus === i ? 1 : 0,
        duration: focus === i ? 0.45 : 0.8,
        ease: "power2.out",
        overwrite: true,
      }),
    );
    return () => tweens.forEach((tween) => tween.kill());
  }, [focus]);

  return null;
}
