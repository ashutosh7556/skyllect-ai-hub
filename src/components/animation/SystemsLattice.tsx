"use client";

import { useEffect, useRef, type RefObject } from "react";
import * as THREE from "three";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { MACHINE } from "@/lib/theme";

/**
 * The systems an agent actually plugs into, drawn behind the Beyond Chat card.
 *
 * Eight nodes — databases, CRM records, workflows, API endpoints — wired to
 * one another and lit left to right as the section is read. Every glyph is
 * line work: no fills, no sprites, nothing that could compete with the copy
 * sitting on the card in front of it.
 *
 * Two things are scroll-driven and deliberately separate. The lattice fades
 * up once as the section arrives, and the connections energise across the
 * pin — so the wiring is already there before it starts carrying anything,
 * which is what makes it read as a system coming online rather than as a
 * drawing appearing.
 */

interface SystemsLatticeProps {
  /** The section that drives activation. Its pin range is the scroll span. */
  triggerRef: RefObject<HTMLElement | null>;
  /** Scroll length of the pin, in px. Must match the section's own timeline. */
  pinLength: number;
}

type NodeKind = "database" | "crm" | "workflow" | "api";

interface NodeSpec {
  x: number;
  y: number;
  kind: NodeKind;
}

/** Laid out left to right, so activation has a direction to travel in. */
const NODE_SPECS: NodeSpec[] = [
  { x: -7.4, y: 1.5, kind: "api" },
  { x: -5.5, y: -2.1, kind: "database" },
  { x: -3.1, y: 2.5, kind: "crm" },
  { x: -1.9, y: -2.8, kind: "workflow" },
  { x: 2.1, y: 1.5, kind: "database" },
  { x: 3.7, y: -1.6, kind: "api" },
  { x: 5.6, y: 2.3, kind: "crm" },
  { x: 7.5, y: -0.7, kind: "workflow" },
];

/** The spine, plus a few cross-links so it reads as a mesh, not a chain. */
const LINK_SPECS: Array<[number, number]> = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 5],
  [5, 6],
  [6, 7],
  [0, 2],
  [1, 3],
  [3, 5],
  [4, 6],
];

/** Two packets in flight per link at most. */
const PULSES_PER_LINK = 2;

/** Closed outline as a line loop, in the XY plane. */
function ellipse(rx: number, ry: number, segments = 28): number[] {
  const points: number[] = [];
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    points.push(Math.cos(angle) * rx, Math.sin(angle) * ry, 0);
  }
  return points;
}

function polygon(radius: number, sides: number, rotation = 0): number[] {
  const points: number[] = [];
  for (let i = 0; i <= sides; i++) {
    const angle = rotation + (i / sides) * Math.PI * 2;
    points.push(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);
  }
  return points;
}

function rectangle(width: number, height: number): number[] {
  const w = width / 2;
  const h = height / 2;
  return [-w, -h, 0, w, -h, 0, w, h, 0, -w, h, 0, -w, -h, 0];
}

/** Moves a flat point list. Positions come in x, y, z triples. */
function shift(points: number[], dx: number, dy: number): number[] {
  return points.map((value, i) => (i % 3 === 0 ? value + dx : i % 3 === 1 ? value + dy : value));
}

export function SystemsLattice({ triggerRef, pinLength }: SystemsLatticeProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const host = hostRef.current;
    const trigger = triggerRef.current;
    if (!host || !trigger) return;

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

    renderer.setClearAlpha(0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1.6, 0.1, 60);
    camera.position.set(0, 0, 14);

    const board = new THREE.Group();
    scene.add(board);

    const geometries: THREE.BufferGeometry[] = [];
    const materials: THREE.Material[] = [];
    const geo = <T extends THREE.BufferGeometry>(value: T) => (geometries.push(value), value);
    const mat = <T extends THREE.Material>(value: T) => (materials.push(value), value);

    const line = (points: number[], material: THREE.LineBasicMaterial) => {
      const geometry = geo(new THREE.BufferGeometry());
      geometry.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
      return new THREE.Line(geometry, material);
    };

    /* ------------------------------------------------------------- the nodes */

    interface Node {
      group: THREE.Group;
      glyph: THREE.LineBasicMaterial;
      halo: THREE.Mesh;
      haloMaterial: THREE.MeshBasicMaterial;
      /** Position along the run, 0 at the left-most node and 1 at the right. */
      reach: number;
      position: THREE.Vector3;
      lit: number;
    }

    const minX = Math.min(...NODE_SPECS.map((spec) => spec.x));
    const maxX = Math.max(...NODE_SPECS.map((spec) => spec.x));

    // Deliberately small: this is the lamp inside the glyph, not a glow around
    // it. At any real size it simply covers the line work it sits on.
    const haloGeometry = geo(new THREE.CircleGeometry(0.055, 14));

    const nodes: Node[] = NODE_SPECS.map((spec) => {
      const group = new THREE.Group();
      group.position.set(spec.x, spec.y, 0);

      // One material per node so each can be lit on its own schedule.
      const glyph = mat(
        new THREE.LineBasicMaterial({
          color: MACHINE.accent,
          transparent: true,
          opacity: 0.1,
          depthWrite: false,
        }),
      );

      switch (spec.kind) {
        case "database": {
          // Three platters stacked, the way a database is always drawn.
          for (let i = 0; i < 3; i++) {
            const platter = line(ellipse(0.62, 0.2), glyph);
            platter.position.y = 0.26 - i * 0.26;
            group.add(platter);
          }
          group.add(line([-0.62, 0.26, 0, -0.62, -0.26, 0], glyph));
          group.add(line([0.62, 0.26, 0, 0.62, -0.26, 0], glyph));
          break;
        }
        case "crm": {
          // A record: a card with a header rule and two fields.
          group.add(line(rectangle(1.4, 0.92), glyph));
          group.add(line([-0.7, 0.22, 0, 0.7, 0.22, 0], glyph));
          group.add(line([-0.5, -0.06, 0, 0.16, -0.06, 0], glyph));
          group.add(line([-0.5, -0.3, 0, 0.36, -0.3, 0], glyph));
          break;
        }
        case "workflow": {
          // A decision and its two branches.
          group.add(line(polygon(0.42, 4), glyph));
          group.add(line([0.42, 0, 0, 0.92, 0, 0, 0.92, 0.42, 0], glyph));
          group.add(line([0.42, 0, 0, 0.92, 0, 0, 0.92, -0.42, 0], glyph));
          group.add(line(shift(rectangle(0.36, 0.26), 1.1, 0.42), glyph));
          group.add(line(shift(rectangle(0.36, 0.26), 1.1, -0.42), glyph));
          break;
        }
        case "api": {
          // An endpoint: a hexagon with its socket.
          group.add(line(polygon(0.6, 6, Math.PI / 6), glyph));
          group.add(line(polygon(0.26, 6, Math.PI / 6), glyph));
          break;
        }
      }

      const haloMaterial = mat(
        new THREE.MeshBasicMaterial({
          color: 0xcaf2ff,
          transparent: true,
          opacity: 0,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        }),
      );
      const halo = new THREE.Mesh(haloGeometry, haloMaterial);
      group.add(halo);

      board.add(group);

      return {
        group,
        glyph,
        halo,
        haloMaterial,
        reach: (spec.x - minX) / (maxX - minX),
        position: new THREE.Vector3(spec.x, spec.y, 0),
        lit: 0,
      };
    });

    /* ------------------------------------------------------------- the links */

    interface Link {
      material: THREE.LineBasicMaterial;
      positions: THREE.BufferAttribute;
      from: THREE.Vector3;
      to: THREE.Vector3;
      reach: number;
      lit: number;
    }

    const links: Link[] = LINK_SPECS.map(([a, b]) => {
      const from = nodes[a].position;
      const to = nodes[b].position;

      const material = mat(
        new THREE.LineBasicMaterial({
          color: MACHINE.accent,
          transparent: true,
          opacity: 0.1,
          depthWrite: false,
        }),
      );

      const geometry = geo(new THREE.BufferGeometry());
      const positions = new THREE.BufferAttribute(new Float32Array(6), 3);
      positions.setUsage(THREE.DynamicDrawUsage);
      positions.setXYZ(0, from.x, from.y, 0);
      positions.setXYZ(1, from.x, from.y, 0);
      geometry.setAttribute("position", positions);
      const mesh = new THREE.Line(geometry, material);
      mesh.frustumCulled = false;
      board.add(mesh);

      return {
        material,
        positions,
        from,
        to,
        // A link energises once its own midpoint has been reached.
        reach: ((from.x + to.x) / 2 - minX) / (maxX - minX),
        lit: 0,
      };
    });

    /* ------------------------------------------------------------ the packets */

    const packets = new THREE.InstancedMesh(
      geo(new THREE.SphereGeometry(0.06, 8, 6)),
      mat(
        new THREE.MeshBasicMaterial({
          color: 0xdff6ff,
          transparent: true,
          opacity: 0.8,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        }),
      ),
      links.length * PULSES_PER_LINK,
    );
    packets.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    packets.frustumCulled = false;
    board.add(packets);

    /* ---------------------------------------------------------------- sizing */

    let width = 0;
    let height = 0;

    function resize() {
      const rect = host!.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      width = rect.width;
      height = rect.height;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      // The run is about 15 units wide. Scale it to whatever the viewport can
      // actually show, so the outer nodes stay on screen on a phone instead
      // of being cropped away.
      const halfWidth =
        Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z * camera.aspect;
      board.scale.setScalar(THREE.MathUtils.clamp(halfWidth / 9.2, 0.42, 1.15));
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    resize();

    /* ------------------------------------------------------------------ loop */

    const state = { enter: 0, charge: 0 };
    const matrix = new THREE.Matrix4();
    const point = new THREE.Vector3();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3();

    let running = true;
    let onScreen = true;

    function frame(time: number) {
      if (!running || !onScreen || width === 0) return;

      // The wave front, run slightly past the end so the last node has time
      // to come fully up before the section is done.
      const front = state.charge * 1.22;
      const ease = state.enter;

      nodes.forEach((node) => {
        const target = THREE.MathUtils.clamp((front - node.reach) / 0.22, 0, 1);
        // Eased toward rather than assigned, so scrubbing back and forth
        // never makes a node blink.
        node.lit += (target - node.lit) * 0.12;
        node.glyph.opacity = (0.08 + node.lit * 0.62) * ease;
        node.haloMaterial.opacity = node.lit * 0.75 * ease;
        node.halo.scale.setScalar(0.8 + node.lit * (0.9 + Math.sin(time * 1.6 + node.reach * 6) * 0.15));
        node.group.rotation.z = Math.sin(time * 0.25 + node.reach * 4) * 0.03;
      });

      let packetIndex = 0;
      links.forEach((link, i) => {
        const target = THREE.MathUtils.clamp((front - link.reach) / 0.2, 0, 1);
        link.lit += (target - link.lit) * 0.1;

        // The line is drawn by moving its end point, so the trace grows along
        // its own length instead of fading in as a whole.
        point.copy(link.from).lerp(link.to, Math.max(link.lit, 0.001));
        link.positions.setXYZ(1, point.x, point.y, 0);
        link.positions.needsUpdate = true;
        link.material.opacity = (0.07 + link.lit * 0.38) * ease;

        for (let p = 0; p < PULSES_PER_LINK; p++) {
          // Packets only run on a link that has finished drawing itself.
          const carrying = THREE.MathUtils.clamp((link.lit - 0.75) / 0.25, 0, 1);
          const t = (time * 0.26 + i * 0.23 + p * 0.5) % 1;
          point.copy(link.from).lerp(link.to, t);
          scale.setScalar(carrying * ease);
          matrix.compose(point, quaternion, scale);
          packets.setMatrixAt(packetIndex++, matrix);
        }
      });
      packets.instanceMatrix.needsUpdate = true;

      // A breath of parallax, so the board is never perfectly flat.
      board.rotation.y = Math.sin(time * 0.1) * 0.05;
      board.rotation.x = Math.cos(time * 0.08) * 0.03;

      renderer.render(scene, camera);
    }

    const tweens: gsap.core.Tween[] = [];

    if (reduced) {
      // Fully wired, fully lit, perfectly still.
      state.enter = 1;
      state.charge = 1;
      nodes.forEach((node) => (node.lit = 1));
      links.forEach((link) => (link.lit = 1));
      frame(0);
    } else {
      // The wiring arrives with the section…
      tweens.push(
        gsap.to(state, {
          enter: 1,
          ease: "none",
          scrollTrigger: {
            trigger,
            start: "top 85%",
            end: "top 35%",
            scrub: 1,
            invalidateOnRefresh: true,
          },
        }),
      );

      // …and energises left to right across the pin, matching the stage
      // timeline the card itself runs on.
      tweens.push(
        gsap.to(state, {
          charge: 1,
          ease: "none",
          scrollTrigger: {
            trigger,
            start: "top top",
            end: `+=${pinLength}`,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        }),
      );

      gsap.ticker.add(frame);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
      },
      { rootMargin: "150px" },
    );
    observer.observe(host);

    function handleVisibilityChange() {
      running = !document.hidden;
    }
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      running = false;
      gsap.ticker.remove(frame);
      tweens.forEach((tween) => {
        tween.scrollTrigger?.kill();
        tween.kill();
      });
      observer.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);

      packets.dispose();
      geometries.forEach((value) => value.dispose());
      materials.forEach((value) => value.dispose());
      scene.clear();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    };
  }, [triggerRef, pinLength, reduced]);

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10"
      style={{ contain: "strict" }}
    />
  );
}
