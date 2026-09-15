"use client";

import { useEffect, useRef, type RefObject } from "react";
import * as THREE from "three";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { MACHINE } from "@/lib/theme";
import {
  WORKFLOW_SOURCE,
  WORKFLOW_SYSTEMS,
  type WorkflowSystem,
} from "@/data/workflow";

/**
 * One request, running through the machine.
 *
 * The AI core sits at the centre inside a scanner that never stops turning.
 * Email hangs off it to the left — where the request comes from — and the
 * business systems it writes to are ranged around the right. Connections are
 * drawn rather than revealed: each one grows out of the core along its own
 * curve when its turn comes, and only then does it start carrying packets.
 *
 * Labels are DOM, not geometry. Text rendered into a WebGL canvas at this
 * size is mush; instead each node's world position is projected to screen
 * every frame and the label is moved to meet it, which keeps the type as
 * sharp as the rest of the page and lets it inherit the same styles.
 *
 * Scroll owns the whole thing. The section hands this component a progress
 * value and every phase below is a window on it, so scrubbing backwards
 * unwinds the pipeline exactly the way it was built.
 */

/** Phase windows, as fractions of the section's scroll. */
const REQUEST_END = 0.2;
const UNDERSTAND_END = 0.38;
const SYSTEMS_END = 0.82;

interface WorkflowPipelineProps {
  /** Scroll progress of the pinned section, 0..1. Read every frame. */
  progressRef: RefObject<{ value: number }>;
}

type NodeStatus = "IDLE" | "SYNCING" | "CONNECTED" | "COMPLETED";

interface PipelineNode {
  spec: WorkflowSystem;
  group: THREE.Group;
  plate: THREE.LineBasicMaterial;
  curve: THREE.QuadraticBezierCurve3;
  linkPositions: THREE.BufferAttribute;
  linkMaterial: THREE.LineBasicMaterial;
  label: HTMLElement;
  status: HTMLElement;
  /** Eased 0..1 wiring progress. */
  lit: number;
  lastStatus: NodeStatus | null;
}

/** Points of a rounded plate outline, in the XY plane. */
function plateOutline(width: number, height: number, radius: number): number[] {
  const points: number[] = [];
  const w = width / 2 - radius;
  const h = height / 2 - radius;
  const corners: Array<[number, number, number]> = [
    [w, h, 0],
    [-w, h, Math.PI / 2],
    [-w, -h, Math.PI],
    [w, -h, -Math.PI / 2],
  ];
  for (const [cx, cy, start] of corners) {
    for (let i = 0; i <= 5; i++) {
      const angle = start + (i / 5) * (Math.PI / 2);
      points.push(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius, 0);
    }
  }
  points.push(points[0], points[1], points[2]);
  return points;
}

export function WorkflowPipeline({ progressRef }: WorkflowPipelineProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const host = hostRef.current;
    const layer = layerRef.current;
    if (!host || !layer) return;

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
    host.insertBefore(renderer.domElement, host.firstChild);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1.6, 0.1, 60);
    camera.position.set(0, 0, 13);

    const board = new THREE.Group();
    scene.add(board);

    const geometries: THREE.BufferGeometry[] = [];
    const materials: THREE.Material[] = [];
    const geo = <T extends THREE.BufferGeometry>(value: T) => (geometries.push(value), value);
    const mat = <T extends THREE.Material>(value: T) => (materials.push(value), value);

    const lineOf = (points: number[], material: THREE.LineBasicMaterial) => {
      const geometry = geo(new THREE.BufferGeometry());
      geometry.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
      return new THREE.Line(geometry, material);
    };

    /* ----------------------------------------------------------- the AI core */

    const coreGroup = new THREE.Group();
    board.add(coreGroup);

    const coreLine = mat(
      new THREE.LineBasicMaterial({
        color: MACHINE.accent,
        transparent: true,
        opacity: 0.75,
        depthWrite: false,
      }),
    );
    const scannerLine = mat(
      new THREE.LineBasicMaterial({
        color: MACHINE.accent,
        transparent: true,
        opacity: 0.4,
        depthWrite: false,
      }),
    );

    const ringPoints = (radius: number, segments: number, arc = Math.PI * 2) => {
      const points: number[] = [];
      for (let i = 0; i <= segments; i++) {
        const angle = (i / segments) * arc;
        points.push(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);
      }
      return points;
    };

    coreGroup.add(lineOf(plateOutline(2.1, 1.5, 0.3), coreLine));
    coreGroup.add(lineOf(ringPoints(0.62, 6), coreLine));

    // The scanner: two arcs turning against each other, plus a sweep arm. It
    // never stops, so the core reads as live even where the scroll is still.
    const scannerOuter = lineOf(ringPoints(1.62, 72, Math.PI * 1.35), scannerLine);
    const scannerInner = lineOf(ringPoints(1.28, 60, Math.PI * 0.9), scannerLine);
    const sweepArm = lineOf([0.7, 0, 0, 1.55, 0, 0], coreLine);
    coreGroup.add(scannerOuter, scannerInner, sweepArm);

    const coreGlowMaterial = mat(
      new THREE.MeshBasicMaterial({
        color: 0xdff6ff,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    const coreGlow = new THREE.Mesh(geo(new THREE.CircleGeometry(0.22, 18)), coreGlowMaterial);
    coreGroup.add(coreGlow);

    /* -------------------------------------------------------------- the nodes */

    const plateGeometryPoints = plateOutline(1.7, 1.05, 0.22);
    const specs: WorkflowSystem[] = [WORKFLOW_SOURCE, ...WORKFLOW_SYSTEMS];
    const labels = Array.from(layer.querySelectorAll<HTMLElement>("[data-node]"));

    const nodes: PipelineNode[] = specs.map((spec, i) => {
      const group = new THREE.Group();
      group.position.set(spec.x, spec.y, 0);

      const plate = mat(
        new THREE.LineBasicMaterial({
          color: MACHINE.accent,
          transparent: true,
          opacity: 0.16,
          depthWrite: false,
        }),
      );
      group.add(lineOf(plateGeometryPoints, plate));

      board.add(group);

      // The connection. Bowed rather than straight so six of them leaving one
      // point read as separate runs instead of a star.
      const from = new THREE.Vector3(0, 0, 0);
      const to = new THREE.Vector3(spec.x, spec.y, 0);
      const control = from
        .clone()
        .lerp(to, 0.5)
        .add(new THREE.Vector3(-to.y, to.x, 0).normalize().multiplyScalar(spec.bow));

      const linkMaterial = mat(
        new THREE.LineBasicMaterial({
          color: MACHINE.accent,
          transparent: true,
          opacity: 0.1,
          depthWrite: false,
        }),
      );
      const linkGeometry = geo(new THREE.BufferGeometry());
      const segments = 34;
      const linkPositions = new THREE.BufferAttribute(new Float32Array((segments + 1) * 3), 3);
      linkPositions.setUsage(THREE.DynamicDrawUsage);
      linkGeometry.setAttribute("position", linkPositions);
      const link = new THREE.Line(linkGeometry, linkMaterial);
      link.frustumCulled = false;
      board.add(link);

      const wrapper = labels[i];

      return {
        spec,
        group,
        plate,
        curve: new THREE.QuadraticBezierCurve3(from, control, to),
        linkPositions,
        linkMaterial,
        label: wrapper,
        status: wrapper.querySelector<HTMLElement>("[data-status]")!,
        lit: 0,
        lastStatus: null,
      };
    });

    const LINK_SEGMENTS = 34;

    /* ------------------------------------------------------------ the packets */

    const PACKETS_PER_LINK = 2;
    const packets = new THREE.InstancedMesh(
      geo(new THREE.SphereGeometry(0.075, 8, 6)),
      mat(
        new THREE.MeshBasicMaterial({
          color: 0xdff6ff,
          transparent: true,
          opacity: 0.9,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        }),
      ),
      nodes.length * PACKETS_PER_LINK,
    );
    packets.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    packets.frustumCulled = false;
    board.add(packets);

    /* ------------------------------------------------------------------- dust */

    const dust = (() => {
      const count = window.innerWidth < 768 ? 60 : 130;
      const positions = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        positions[i * 3] = THREE.MathUtils.randFloatSpread(22);
        positions[i * 3 + 1] = THREE.MathUtils.randFloatSpread(13);
        positions[i * 3 + 2] = THREE.MathUtils.randFloatSpread(6) - 3;
      }
      const geometry = geo(new THREE.BufferGeometry());
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const points = new THREE.Points(
        geometry,
        mat(
          new THREE.PointsMaterial({
            size: 0.045,
            color: 0x9fd0e8,
            transparent: true,
            opacity: 0.35,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
          }),
        ),
      );
      board.add(points);
      return points;
    })();

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

      /*
       * Fit the diagram to both axes, not just the width.
       *
       * The pipeline is roughly 15.6 units wide and 9.8 tall. Sizing it on
       * width alone looks right on a square window and runs off the top and
       * bottom of a wide, short one — which is most desktop windows. Height
       * is usually the binding constraint, so both are measured and the
       * tighter one wins.
       *
       * The usable fractions leave the bands this section needs clear: the
       * heading across the top, the stage flow along the bottom.
       */
      const halfHeight =
        Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
      const halfWidth = halfHeight * camera.aspect;
      const fit = Math.min((halfWidth * 0.86) / 7.8, (halfHeight * 0.62) / 4.9);
      board.scale.setScalar(THREE.MathUtils.clamp(fit, 0.3, 1));
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    resize();

    /* ------------------------------------------------------------------- loop */

    const point = new THREE.Vector3();
    const projected = new THREE.Vector3();
    const matrix = new THREE.Matrix4();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3();

    let running = true;
    let onScreen = true;

    /** Where each node sits in the run, as a window on scroll progress. */
    function wiringFor(index: number, p: number) {
      if (index === 0) {
        // Email is the request: it is already arriving as the section opens.
        return THREE.MathUtils.clamp(p / REQUEST_END, 0, 1);
      }
      const slot = (index - 1) / WORKFLOW_SYSTEMS.length;
      const span = (SYSTEMS_END - UNDERSTAND_END) / WORKFLOW_SYSTEMS.length;
      const start = UNDERSTAND_END + slot * (SYSTEMS_END - UNDERSTAND_END);
      return THREE.MathUtils.clamp((p - start) / span, 0, 1);
    }

    function statusFor(lit: number, finished: boolean): NodeStatus {
      if (finished && lit > 0.9) return "COMPLETED";
      if (lit > 0.92) return "CONNECTED";
      if (lit > 0.04) return "SYNCING";
      return "IDLE";
    }

    function frame(time: number) {
      if (!running || !onScreen || width === 0) return;

      const p = progressRef.current?.value ?? 0;
      const understanding = THREE.MathUtils.clamp(
        (p - REQUEST_END) / (UNDERSTAND_END - REQUEST_END),
        0,
        1,
      );
      const finished = p > SYSTEMS_END;

      // The scanner. It idles, spins up while the core is reading the
      // request, and stays quick once it is driving the systems.
      const spin = 0.25 + understanding * 1.5 + (finished ? 0.4 : 0);
      scannerOuter.rotation.z = time * spin;
      scannerInner.rotation.z = -time * spin * 0.7;
      sweepArm.rotation.z = time * spin * 2.2;
      coreGlow.scale.setScalar(1 + Math.sin(time * 2.2) * 0.12 + understanding * 0.5);
      coreGlowMaterial.opacity = 0.45 + understanding * 0.35;
      coreLine.opacity = 0.55 + understanding * 0.35;

      let packetIndex = 0;

      nodes.forEach((node, i) => {
        const target = wiringFor(i, p);
        // Eased rather than assigned, so scrubbing never makes a link blink.
        node.lit += (target - node.lit) * 0.14;

        // The link is drawn by sampling more of its own curve, so it grows
        // along the bow instead of fading in whole.
        const drawn = Math.max(node.lit, 0.001);
        for (let s = 0; s <= LINK_SEGMENTS; s++) {
          node.curve.getPoint((s / LINK_SEGMENTS) * drawn, point);
          node.linkPositions.setXYZ(s, point.x, point.y, 0);
        }
        node.linkPositions.needsUpdate = true;
        node.linkMaterial.opacity = 0.08 + node.lit * 0.42;

        node.plate.opacity = 0.16 + node.lit * 0.64;
        node.group.rotation.z = Math.sin(time * 0.4 + i) * 0.015;

        // Packets only run once a link has finished drawing itself. Email
        // sends toward the core; everything else receives from it.
        const carrying = THREE.MathUtils.clamp((node.lit - 0.8) / 0.2, 0, 1);
        for (let k = 0; k < PACKETS_PER_LINK; k++) {
          /*
           * Run the packet between the two plates rather than along the whole
           * curve: at either end it would sit inside a box, on top of that
           * box's label. Email runs the other way — it is sending to the core,
           * not receiving from it — and the reversal is written against the
           * same window, since `getPoint` happily extrapolates past 1 and
           * would fling the packet out the back of the plate.
           */
          const phase = (time * 0.3 + i * 0.19 + k * 0.5) % 1;
          const t = i === 0 ? 0.88 - phase * 0.8 : 0.08 + phase * 0.8;
          node.curve.getPoint(t, point);
          scale.setScalar(carrying);
          matrix.compose(point, quaternion, scale);
          packets.setMatrixAt(packetIndex++, matrix);
        }

        // Labels ride their node: projected from world space every frame, so
        // they stay put through the resize and the board's own drift.
        projected.copy(node.group.position).applyMatrix4(board.matrixWorld).project(camera);
        const x = (projected.x * 0.5 + 0.5) * width;
        const y = (-projected.y * 0.5 + 0.5) * height;
        node.label.style.transform = `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0) translate(-50%, -50%)`;
        node.label.style.opacity = String(0.25 + node.lit * 0.75);

        const status = statusFor(node.lit, finished);
        if (status !== node.lastStatus) {
          node.lastStatus = status;
          node.status.textContent = status === "IDLE" ? "STANDBY" : status;
          node.status.dataset.state = status.toLowerCase();
        }
      });
      packets.instanceMatrix.needsUpdate = true;

      dust.rotation.z = time * 0.01;
      board.rotation.y = Math.sin(time * 0.12) * 0.04;
      board.rotation.x = Math.cos(time * 0.09) * 0.02;
      board.updateMatrixWorld();

      renderer.render(scene, camera);
    }

    if (reduced) {
      // Everything wired, everything reporting, nothing moving.
      nodes.forEach((node) => (node.lit = 1));
      board.updateMatrixWorld();
      frame(0);
    } else {
      gsap.ticker.add(frame);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
      },
      { rootMargin: "120px" },
    );
    observer.observe(host);

    function handleVisibilityChange() {
      running = !document.hidden;
    }
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      running = false;
      gsap.ticker.remove(frame);
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
  }, [progressRef, reduced]);

  return (
    <div ref={hostRef} className="absolute inset-0">
      {/*
       * The label layer. Each entry is parked at the origin and moved to its
       * node by the frame loop, so nothing here needs to know the scene's
       * layout — and the type stays real text.
       */}
      <div ref={layerRef} aria-hidden="true" className="pointer-events-none absolute inset-0">
        {[WORKFLOW_SOURCE, ...WORKFLOW_SYSTEMS].map((system) => (
          <div
            key={system.label}
            data-node
            className="absolute top-0 left-0 flex flex-col items-center gap-1 opacity-0 will-change-transform"
          >
            <span className="text-sm font-medium tracking-tight text-foreground sm:text-[15px]">
              {system.label}
            </span>
            <span
              data-status
              data-state="idle"
              className="font-mono text-[10px] tracking-[0.18em] text-muted/70 uppercase transition-colors duration-300 data-[state=completed]:text-accent-soft data-[state=connected]:text-accent data-[state=syncing]:text-accent/70"
            >
              STANDBY
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
