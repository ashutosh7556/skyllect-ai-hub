"use client";

import { useEffect, useRef, type RefObject } from "react";
import * as THREE from "three";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { MACHINE } from "@/lib/theme";
import { INTEGRATIONS } from "@/data/integrations";
import { integrationPortal } from "@/lib/integrationPortal";

/**
 * The gateway the integrations section opens onto.
 *
 * A hexagonal aperture sits in the open half of the page with five software
 * modules on a wide orbit around it. Scroll brings them in one at a time:
 * each leaves the orbit, slides to its berth on the inner ring, locks on with
 * a cable and starts passing packets through the gate. The aperture itself
 * opens as they arrive, so the section reads as a port coming up rather than
 * as a diagram being revealed.
 *
 * Module labels are DOM projected onto their 3D positions each frame, not
 * geometry — text rendered into the canvas at this size is mush, and this way
 * it inherits the page's own type.
 *
 * The gate is the whole stage's backdrop, not one topic's, so it has to keep
 * going long after the modules are home. Every topic past them adds another
 * shell to the structure and pulls the camera a little further back, so the
 * descent through the stage reads as one continuous build rather than an
 * animation that finishes in the first third and then idles.
 */

/**
 * Where docking begins, and how much of the run each module takes to arrive.
 * Spread wide on purpose: the modules have the opening topics to come in
 * over, not a single screen, so nothing about the approach looks hurried.
 *
 * The step is derived rather than fixed. With five modules a hand-picked
 * 0.16 fitted; with ten it would have put the last four past the end of the
 * dock phase, so they would have orbited forever and never berthed. Dividing
 * what is left after the first one starts and the last one finishes keeps the
 * whole set home by the end however many there are.
 */
const DOCK_START = 0.12;
const DOCK_SPAN = 0.2;

/**
 * Orbit radius before docking, and the berths after.
 *
 * Two berth rings, taken in turn, rather than the single one that held five
 * modules. Ten plates on one ring sit about 1.5 units apart while a plate is
 * nearly three wide, so they would overlap badly — and widening them enough
 * to carry a name like "Custom internal applications" on two lines makes that
 * far worse. Alternating the radius doubles the arc between any two plates on
 * the same ring and separates the ones in between radially instead.
 */
const ORBIT_RADIUS = 6.9;
const BERTH_RADIUS = 3.05;
const BERTH_RADIUS_OUTER = 4.95;
/** How far round the gate the berths are spread. */
const BERTH_ARC = Math.PI * 1.7;
const berthRadiusFor = (index: number) =>
  index % 2 === 0 ? BERTH_RADIUS : BERTH_RADIUS_OUTER;

/** Camera distance. Fixed — see the note in the frame loop. */
const REST_DISTANCE = 13;
/** How far the outermost shell reaches. Everything is sized against this. */
const OUTER_REACH = 9.6;

const CABLE_SEGMENTS = 22;
const PACKETS_PER_MODULE = 2;

/**
 * Shells added as the stage is read — roughly one per topic, so there is
 * always something arriving no matter how far down the reader is.
 */
const SHELL_COUNT = 13;

/**
 * One module per integration, so every plate on the ring is a card the topic
 * will eventually release. Nothing appears on the page that was not visibly
 * taken off the gate first.
 */
const MODULES = INTEGRATIONS.map((integration) => integration.name);

const DOCK_STEP =
  MODULES.length > 1 ? (1 - DOCK_START - DOCK_SPAN) / (MODULES.length - 1) : 0;

interface Module {
  label: HTMLElement;
  group: THREE.Group;
  plate: THREE.LineBasicMaterial;
  cable: THREE.Line;
  cableMaterial: THREE.LineBasicMaterial;
  cablePositions: THREE.BufferAttribute;
  curve: THREE.QuadraticBezierCurve3;
  /** Resting angle on the ring, in radians. */
  berth: number;
  /** Eased 0..1 docking progress. */
  docked: number;
  /**
   * Eased 1..0 as the topic takes this module off the ring. 1 while the gate
   * still holds it, 0 once its card is out on the page.
   */
  held: number;
}

/** Rounded plate outline, in the XY plane. */
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

export interface PortalState {
  /** Progress across the whole stage, 0..1. */
  progress: number;
  /** How far the modules have come home, 0..1. */
  dock: number;
  /** How present the integrations topic is, 0..1. */
  focus: number;
}

interface IntegrationPortalProps {
  /** Written by the stage every frame; never read through React. */
  stateRef: RefObject<PortalState>;
}

export function IntegrationPortal({ stateRef }: IntegrationPortalProps) {
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
    camera.position.set(0, 0, REST_DISTANCE);

    const gate = new THREE.Group();
    scene.add(gate);

    const geometries: THREE.BufferGeometry[] = [];
    const materials: THREE.Material[] = [];
    const geo = <T extends THREE.BufferGeometry>(value: T) => (geometries.push(value), value);
    const mat = <T extends THREE.Material>(value: T) => (materials.push(value), value);

    const lineOf = (points: number[], material: THREE.LineBasicMaterial) => {
      const geometry = geo(new THREE.BufferGeometry());
      geometry.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
      return new THREE.Line(geometry, material);
    };

    const ring = (radius: number, segments: number, arc = Math.PI * 2, offset = 0) => {
      const points: number[] = [];
      for (let i = 0; i <= segments; i++) {
        const angle = offset + (i / segments) * arc;
        points.push(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);
      }
      return points;
    };

    /* --------------------------------------------------------- the aperture */

    const gateLine = mat(
      new THREE.LineBasicMaterial({
        color: MACHINE.accent,
        transparent: true,
        opacity: 0.55,
        depthWrite: false,
      }),
    );
    const gateFaint = mat(
      new THREE.LineBasicMaterial({
        color: MACHINE.accent,
        transparent: true,
        opacity: 0.2,
        depthWrite: false,
      }),
    );

    // The iris: six blades on a hexagon that widen as the modules connect.
    const irisGroup = new THREE.Group();
    const blades: THREE.Line[] = [];
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const blade = lineOf([0, 0.42, 0, 0.62, 1.05, 0, -0.62, 1.05, 0, 0, 0.42, 0], gateLine);
      blade.rotation.z = angle;
      irisGroup.add(blade);
      blades.push(blade);
    }
    gate.add(irisGroup);

    const innerRing = lineOf(ring(1.55, 6), gateLine);
    const midRing = lineOf(ring(2.25, 72, Math.PI * 1.55), gateFaint);
    // One ring per set of berths, so a plate always sits on a track rather
    // than floating at an arbitrary distance from the gate.
    const berthRing = lineOf(ring(BERTH_RADIUS, 84), gateFaint);
    const berthRingOuter = lineOf(ring(BERTH_RADIUS_OUTER, 96), gateFaint);
    const outerScan = lineOf(ring(6.1, 90, Math.PI * 1.2), gateFaint);
    gate.add(innerRing, midRing, berthRing, berthRingOuter, outerScan);

    /*
     * The structure that keeps growing. Each shell is an arc at its own
     * radius, tilt and speed; they arrive one per topic, so the gate is still
     * being built when the reader reaches the last of them.
     */
    const shells = Array.from({ length: SHELL_COUNT }, (_, i) => {
      const t = i / (SHELL_COUNT - 1);
      const material = mat(
        new THREE.LineBasicMaterial({
          color: MACHINE.accent,
          transparent: true,
          opacity: 0,
          depthWrite: false,
        }),
      );
      const radius = 3.9 + t * 5.4;
      const arc = Math.PI * (0.45 + ((i * 7) % 5) * 0.22);
      const line = lineOf(ring(radius, 80, arc, (i * 2.4) % (Math.PI * 2)), material);
      // Alternating tilt, so the shells read as a nest of orbits rather than
      // as rings printed on one plane.
      line.rotation.x = (i % 3) * 0.22 * (i % 2 ? 1 : -1);
      line.rotation.y = (i % 4) * 0.18 * (i % 2 ? -1 : 1);
      gate.add(line);
      return {
        line,
        material,
        radius,
        /** Where in the run this shell joins. */
        at: 0.16 + t * 0.78,
        speed: 0.009 + ((i % 5) * 0.006),
        direction: i % 2 ? 1 : -1,
        lit: 0,
      };
    });

    const coreMaterial = mat(
      new THREE.MeshBasicMaterial({
        color: 0xdff6ff,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    const core = new THREE.Mesh(geo(new THREE.CircleGeometry(0.42, 24)), coreMaterial);
    gate.add(core);

    /* ----------------------------------------------------------- the modules */

    /*
     * The plate a module's name has to fit inside, in world units.
     *
     * Wide enough that the longest name breaks to two lines rather than three,
     * and tall enough that two lines clear the border. Both are what the berth
     * rings above were re-spread to make room for.
     */
    const PLATE_WIDTH = 3.6;
    const plateGeometry = plateOutline(PLATE_WIDTH, 1.28, 0.22);
    const labels = Array.from(layer.querySelectorAll<HTMLElement>("[data-module]"));

    const modules: Module[] = MODULES.map((_, i) => {
      const group = new THREE.Group();
      const plate = mat(
        new THREE.LineBasicMaterial({
          color: MACHINE.accent,
          transparent: true,
          opacity: 0.18,
          depthWrite: false,
        }),
      );
      group.add(lineOf(plateGeometry, plate));
      gate.add(group);

      const cableMaterial = mat(
        new THREE.LineBasicMaterial({
          color: MACHINE.accent,
          transparent: true,
          opacity: 0,
          depthWrite: false,
        }),
      );
      const cableGeometry = geo(new THREE.BufferGeometry());
      const cablePositions = new THREE.BufferAttribute(
        new Float32Array((CABLE_SEGMENTS + 1) * 3),
        3,
      );
      cablePositions.setUsage(THREE.DynamicDrawUsage);
      cableGeometry.setAttribute("position", cablePositions);
      const cable = new THREE.Line(cableGeometry, cableMaterial);
      cable.frustumCulled = false;
      gate.add(cable);

      // Berths are spread over the upper and right of the ring, keeping the
      // lower left — where the copy sits — clear.
      const berth = -0.95 + (i / (MODULES.length - 1)) * BERTH_ARC;

      return {
        label: labels[i],
        group,
        plate,
        cable,
        cableMaterial,
        cablePositions,
        curve: new THREE.QuadraticBezierCurve3(
          new THREE.Vector3(),
          new THREE.Vector3(),
          new THREE.Vector3(),
        ),
        berth,
        docked: 0,
        held: 1,
      };
    });

    // One published slot per module, rebuilt rather than appended to: the
    // stage remounts on a client-side navigation back to the home page.
    integrationPortal.modules = modules.map(() => ({ x: 0, y: 0 }));
    integrationPortal.released = -1;

    /*
     * Three more things that keep arriving, so the rig is still gaining
     * detail at the bottom of the stage rather than only at the top:
     *
     *   satellites — one rides each shell in, and keeps orbiting it
     *   gauge      — a ring of ticks that fills across the whole run
     *   dust       — a field that thickens as the structure grows
     */
    const satellites = new THREE.InstancedMesh(
      geo(new THREE.SphereGeometry(0.055, 8, 6)),
      mat(
        new THREE.MeshBasicMaterial({
          color: 0xbfeeff,
          transparent: true,
          opacity: 0.8,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        }),
      ),
      SHELL_COUNT,
    );
    satellites.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    satellites.frustumCulled = false;
    gate.add(satellites);

    const GAUGE_TICKS = 72;
    const gaugeMaterial = mat(
      new THREE.LineBasicMaterial({
        color: MACHINE.accent,
        transparent: true,
        opacity: 0,
        depthWrite: false,
      }),
    );
    const gauge = (() => {
      const points: number[] = [];
      for (let i = 0; i < GAUGE_TICKS; i++) {
        const angle = (i / GAUGE_TICKS) * Math.PI * 2;
        // Every sixth tick is a long one, the way a dial is marked.
        const inner = 3.42;
        const outer = inner + (i % 6 === 0 ? 0.3 : 0.15);
        points.push(
          Math.cos(angle) * inner,
          Math.sin(angle) * inner,
          0,
          Math.cos(angle) * outer,
          Math.sin(angle) * outer,
          0,
        );
      }
      const geometry = geo(new THREE.BufferGeometry());
      geometry.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
      const line = new THREE.LineSegments(geometry, gaugeMaterial);
      line.frustumCulled = false;
      gate.add(line);
      return line;
    })();

    const dust = (() => {
      const count = window.innerWidth < 768 ? 90 : 220;
      const positions = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        // Spread across the rig's own reach, so the field grows with it
        // rather than sitting in a box of its own.
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.sqrt(Math.random()) * OUTER_REACH;
        positions[i * 3] = Math.cos(angle) * radius;
        positions[i * 3 + 1] = Math.sin(angle) * radius;
        positions[i * 3 + 2] = THREE.MathUtils.randFloatSpread(2.5);
      }
      const geometry = geo(new THREE.BufferGeometry());
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const points = new THREE.Points(
        geometry,
        mat(
          new THREE.PointsMaterial({
            size: 0.055,
            color: 0x9fd0e8,
            transparent: true,
            opacity: 0,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
          }),
        ),
      );
      gate.add(points);
      return points;
    })();
    const dustMaterial = dust.material as THREE.PointsMaterial;

    const OUTPOSTS = 14;
    const outposts = new THREE.InstancedMesh(
      geo(new THREE.OctahedronGeometry(0.11, 0)),
      mat(
        new THREE.MeshBasicMaterial({
          color: MACHINE.accent,
          transparent: true,
          opacity: 0.55,
          wireframe: true,
          depthWrite: false,
        }),
      ),
      OUTPOSTS,
    );
    outposts.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    outposts.frustumCulled = false;
    gate.add(outposts);

    /** Where each outpost sits, and when in the run it shows up. */
    const outpostSeeds = Array.from({ length: OUTPOSTS }, (_, i) => ({
      angle: (i / OUTPOSTS) * Math.PI * 2 + (i % 3) * 0.4,
      radius: 5.2 + ((i * 5) % 7) * 0.62,
      at: 0.52 + (i / OUTPOSTS) * 0.46,
      drift: 0.004 + ((i % 4) * 0.003),
      lit: 0,
    }));

    const packets = new THREE.InstancedMesh(
      geo(new THREE.SphereGeometry(0.06, 8, 6)),
      mat(
        new THREE.MeshBasicMaterial({
          color: 0xdff6ff,
          transparent: true,
          opacity: 0.85,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        }),
      ),
      modules.length * PACKETS_PER_MODULE,
    );
    packets.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    packets.frustumCulled = false;
    gate.add(packets);

    /* ---------------------------------------------------------------- sizing */

    let width = 0;
    let height = 0;
    /** How strongly the rig paints, given how much room the window leaves. */
    let presence = 1;

    function resize() {
      const rect = host!.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      width = rect.width;
      height = rect.height;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      const halfHeight =
        Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * REST_DISTANCE;
      const halfWidth = halfHeight * camera.aspect;

      /*
       * Size the rig to the slice of screen it is allowed to occupy, not to
       * the screen. The outermost shell reaches OUTER_REACH units and the
       * structure keeps growing as the reader descends — sizing on anything
       * less than that final reach means it is fine at the top of the stage
       * and sprawling across the copy by the bottom of it.
       *
       * It stays on the right at every size. An earlier version centred it on
       * anything narrower than 1.15:1, which on a nearly-square window — a
       * perfectly ordinary browser shape — parked the whole rig directly
       * behind the heading. There is no window shape where that is better
       * than a smaller rig held to one side.
       */
      const room = Math.min(halfWidth * 0.44, halfHeight * 0.9);
      gate.scale.setScalar(THREE.MathUtils.clamp(room / OUTER_REACH, 0.12, 0.72));
      gate.position.set(halfWidth * 0.55, 0, 0);

      // The squarer the window, the less room there is beside the copy, so
      // the rig also steps back out of the way rather than just shrinking.
      presence = THREE.MathUtils.clamp(
        THREE.MathUtils.mapLinear(camera.aspect, 1, 1.6, 0.45, 1),
        0.45,
        1,
      );
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    resize();

    /* ------------------------------------------------------------------ loop */

    const point = new THREE.Vector3();
    const projected = new THREE.Vector3();
    const satellitePoint = new THREE.Vector3();
    const satelliteScale = new THREE.Vector3();
    const satelliteQuaternion = new THREE.Quaternion();
    const satelliteMatrix = new THREE.Matrix4();
    const matrix = new THREE.Matrix4();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3();
    const origin = new THREE.Vector3();

    let running = true;
    let onScreen = true;

    function frame(time: number) {
      if (!running || !onScreen || width === 0) {
        // Nothing is projecting the gate, so nothing should be flying out of
        // it — the topic falls back to showing its card at rest.
        integrationPortal.live = false;
        return;
      }

      const state = stateRef.current;
      const p = state?.dock ?? 0;
      // Presence of the topic these modules belong to. The gateway itself
      // stays — it is the stage's backdrop, not this topic's decoration —
      // but the modules and their labels go with the topic.
      const focus = state?.focus ?? 1;
      // How far the aperture has opened: driven by how many modules are home.
      const opened = THREE.MathUtils.clamp(
        (p - DOCK_START) / (DOCK_STEP * (MODULES.length - 1) + DOCK_SPAN),
        0,
        1,
      );

      blades.forEach((blade, i) => {
        blade.rotation.z = (i / 6) * Math.PI * 2 + time * 0.013;
        // Blades retract outward as the gate opens.
        blade.position.set(
          Math.cos((i / 6) * Math.PI * 2 + Math.PI / 2) * opened * 0.55,
          Math.sin((i / 6) * Math.PI * 2 + Math.PI / 2) * opened * 0.55,
          0,
        );
      });
      innerRing.rotation.z = time * 0.022;
      midRing.rotation.z = -time * 0.04;
      outerScan.rotation.z = time * 0.018;
      berthRing.rotation.z = -time * 0.007;
      berthRingOuter.rotation.z = time * 0.005;

      // Everything past the modules is driven by the run as a whole.
      const journey = state?.progress ?? 0;

      shells.forEach((shell, i) => {
        const target = THREE.MathUtils.clamp((journey - shell.at) / 0.07, 0, 1);
        // Eased, so scrubbing back retires a shell as smoothly as it arrived.
        shell.lit += (target - shell.lit) * 0.018;
        shell.material.opacity = shell.lit * 0.22 * presence;
        shell.line.rotation.z = time * shell.speed * shell.direction;
        shell.line.scale.setScalar(0.94 + shell.lit * 0.06);

        // Its satellite, riding the same radius at the same pace.
        const angle = time * shell.speed * shell.direction * 4 + i * 1.7;
        satellitePoint.set(
          Math.cos(angle) * shell.radius,
          Math.sin(angle) * shell.radius,
          0,
        );
        satelliteScale.setScalar(shell.lit * presence);
        satelliteMatrix.compose(satellitePoint, satelliteQuaternion, satelliteScale);
        satellites.setMatrixAt(i, satelliteMatrix);
      });
      satellites.instanceMatrix.needsUpdate = true;

      // The dial fills across the whole run: two vertices per tick, so the
      // draw range is what decides how much of it has been marked off.
      gauge.geometry.setDrawRange(0, Math.round(GAUGE_TICKS * journey) * 2);
      gauge.rotation.z = -time * 0.01;
      gaugeMaterial.opacity = 0.3 * presence;

      dustMaterial.opacity = (0.06 + journey * 0.16) * presence;
      dust.rotation.z = time * 0.006;

      outpostSeeds.forEach((seed, i) => {
        const target = THREE.MathUtils.clamp((journey - seed.at) / 0.06, 0, 1);
        seed.lit += (target - seed.lit) * 0.02;
        const angle = seed.angle + time * seed.drift;
        satellitePoint.set(
          Math.cos(angle) * seed.radius,
          Math.sin(angle) * seed.radius,
          0,
        );
        satelliteScale.setScalar(seed.lit * presence);
        satelliteMatrix.compose(satellitePoint, satelliteQuaternion, satelliteScale);
        outposts.setMatrixAt(i, satelliteMatrix);
      });
      outposts.instanceMatrix.needsUpdate = true;

      /*
       * The camera does not move. An earlier version drew it back as the
       * structure grew, which made the rig huge at the top of the stage and
       * only settled it by the bottom — the run is sized for its final reach
       * up front instead, so the copy is never encroached on at any point in
       * the scroll.
       */
      gate.rotation.x = journey * 0.2;
      gate.rotation.y = Math.sin(time * 0.02) * 0.05 - journey * 0.12;

      core.scale.setScalar(0.5 + opened * 0.32 + Math.sin(time * 0.7) * 0.04);
      coreMaterial.opacity =
        (0.45 + journey * 0.25 + opened * 0.2 * focus + Math.sin(time * 0.7) * 0.05) * presence;
      gateLine.opacity = (0.2 + (0.15 + opened * 0.35) * focus) * presence;

      let packetIndex = 0;

      /*
       * How many screen pixels a world unit is worth right now, measured
       * rather than assumed: the gate is scaled to fit the viewport and turns
       * slightly as it breathes, so this is the only honest way to size a DOM
       * label against geometry drawn in WebGL.
       */
      projected.set(0, 0, 0).applyMatrix4(gate.matrixWorld).project(camera);
      const gateScreenX = (projected.x * 0.5 + 0.5) * width;
      const gateScreenY = (-projected.y * 0.5 + 0.5) * height;
      projected.set(1, 0, 0).applyMatrix4(gate.matrixWorld).project(camera);
      const pixelsPerUnit = Math.abs((projected.x * 0.5 + 0.5) * width - gateScreenX);
      // A little inside the plate, so the text never touches its own border.
      const labelWidth = Math.max(56, PLATE_WIDTH * pixelsPerUnit * 0.86);

      modules.forEach((module, i) => {
        const start = DOCK_START + i * DOCK_STEP;
        const target = THREE.MathUtils.clamp((p - start) / DOCK_SPAN, 0, 1);
        // Eased rather than assigned, so scrubbing back never snaps a module
        // from one radius to the other.
        module.docked += (target - module.docked) * 0.022;

        // Before docking it drifts on the outer orbit; after, it holds its
        // berth. The angle is interpolated too, so it slides round as it
        // comes in rather than cutting across the gate.
        const drift = time * 0.012 + (i / MODULES.length) * Math.PI * 2;
        const angle = THREE.MathUtils.lerp(drift, module.berth, module.docked);
        const radius = THREE.MathUtils.lerp(
          ORBIT_RADIUS,
          berthRadiusFor(i),
          module.docked,
        );
        module.group.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);
        module.group.rotation.z = Math.sin(time * 0.4 + i) * 0.02;

        /*
         * A module that has been taken off the ring hands its plate over to
         * the card it became. Eased rather than switched, so releasing one
         * reads as it leaving rather than as it being deleted — and so
         * scrubbing back brings it home again instead of popping it in.
         */
        // Everything up to and including the one that is out, not just the
        // one that is out. A module that has already been taken off the ring
        // has become a card on the page and does not come back — so by the
        // last integration the gate is empty, which is what it should be.
        const wanted = integrationPortal.released >= i ? 0 : 1;
        module.held += (wanted - module.held) * 0.06;

        module.plate.opacity =
          (0.14 + module.docked * 0.6) * focus * presence * module.held;

        // The cable only exists once the module is close enough to reach.
        const reach = THREE.MathUtils.clamp((module.docked - 0.45) / 0.55, 0, 1);
        module.curve.v0.copy(module.group.position);
        module.curve.v2.copy(origin);
        module.curve.v1
          .copy(module.curve.v0)
          .lerp(origin, 0.5)
          .add(new THREE.Vector3(-Math.sin(angle), Math.cos(angle), 0).multiplyScalar(0.5));

        for (let s = 0; s <= CABLE_SEGMENTS; s++) {
          module.curve.getPoint((s / CABLE_SEGMENTS) * Math.max(reach, 0.001), point);
          module.cablePositions.setXYZ(s, point.x, point.y, point.z);
        }
        module.cablePositions.needsUpdate = true;
        module.cableMaterial.opacity = reach * 0.5 * focus * presence * module.held;

        for (let k = 0; k < PACKETS_PER_MODULE; k++) {
          const phase = (time * 0.075 + i * 0.2 + k * 0.5) % 1;
          module.curve.getPoint(0.12 + phase * 0.76, point);
          scale.setScalar(reach * focus);
          matrix.compose(point, quaternion, scale);
          packets.setMatrixAt(packetIndex++, matrix);
        }

        // Labels ride their module.
        projected.copy(module.group.position).applyMatrix4(gate.matrixWorld).project(camera);
        const x = (projected.x * 0.5 + 0.5) * width;
        const y = (-projected.y * 0.5 + 0.5) * height;
        module.label.style.transform = `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0) translate(-50%, -50%)`;
        module.label.style.width = `${Math.round(labelWidth)}px`;
        module.label.style.opacity = String(
          (0.3 + module.docked * 0.7) * focus * presence * module.held,
        );

        /*
         * Hand this module's position to the page.
         *
         * The same projection the label just used, so a card leaving the gate
         * starts from exactly where its plate is drawn — not from an
         * approximation of the ring, and not from a position a frame old.
         */
        const published = integrationPortal.modules[i];
        if (published) {
          published.x = x;
          published.y = y;
        }
      });
      packets.instanceMatrix.needsUpdate = true;

      // The gate's own centre, which is the pivot a released card arcs
      // around on its way across the page. Already measured above.
      integrationPortal.cx = gateScreenX;
      integrationPortal.cy = gateScreenY;
      integrationPortal.live = true;

      gate.updateMatrixWorld();
      renderer.render(scene, camera);
    }

    if (reduced) {
      // Everything home, everything connected, nothing turning.
      modules.forEach((module) => (module.docked = 1));
      gate.updateMatrixWorld();
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
      integrationPortal.live = false;
      gsap.ticker.remove(frame);
      observer.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);

      packets.dispose();
      satellites.dispose();
      outposts.dispose();
      geometries.forEach((value) => value.dispose());
      materials.forEach((value) => value.dispose());
      scene.clear();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    };
  }, [stateRef, reduced]);

  return (
    <div ref={hostRef} className="pointer-events-none absolute inset-0">
      <div ref={layerRef} aria-hidden="true" className="absolute inset-0">
        {MODULES.map((label) => (
          <div
            key={label}
            data-module
            /*
             * Centred and free to wrap. The plate behind this is a fixed
             * 2.7 world units wide, and a name like "Custom internal
             * applications" is far wider than that as one line — it ran
             * straight out of both sides of its own box. The width is set
             * from the plate's real projected size every frame, so the text
             * breaks to a second line exactly when it no longer fits,
             * whatever the viewport is doing to the gate's scale.
             */
            className="absolute top-0 left-0 text-center text-[10px] leading-tight font-medium tracking-[0.01em] text-foreground opacity-0 will-change-transform [text-shadow:0_1px_6px_rgba(4,6,11,0.95)] sm:text-[11px]"
          >
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
