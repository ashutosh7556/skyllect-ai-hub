"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { MACHINE } from "@/lib/theme";
import { cn } from "@/lib/utils";

/**
 * The mechanical AI core the home page is built around.
 *
 * Everything here is procedural — no models, no textures beyond two tiny
 * generated gradients — so the whole scene is a few hundred KB of geometry
 * rather than a download. It is composed as three depth layers:
 *
 *   far   — circuit traces and their nodes, sitting behind the core
 *   mid   — the core itself: interlocking gear rings, shells, the heart
 *   near  — articulated arms reaching in toward the core, plus dust
 *
 * Scroll dollies the camera *into* the machine while the three layers
 * separate at different rates, so the hero reads as the outside of the
 * machine and the sections below read as its interior.
 *
 * The canvas is fixed and full-viewport. It fades out as the first content
 * section arrives and stops rendering entirely once it is invisible.
 */

/** Camera distance at rest, before the scroll dolly moves it in. */
const REST_DISTANCE = 16.5;

/** How far the machine dims once the modules below take the foreground. */
const DOCKED_DIM = 0.45;

/** Cables the dock can draw at once — one per agent module, plus headroom. */
const DOCK_MAX = 8;
/** Points sampled along a cable. Enough that the curve reads as a curve. */
const CABLE_SEGMENTS = 26;
/** World depth the card anchors are unprojected onto, in front of the core. */
const ANCHOR_Z = 3;

interface Quality {
  maxDpr: number;
  antialias: boolean;
  teeth: number;
  dust: number;
  traces: number;
  arms: number;
}

function qualityFor(width: number): Quality {
  if (width < 640) {
    return { maxDpr: 1.5, antialias: false, teeth: 16, dust: 220, traces: 12, arms: 2 };
  }
  if (width < 1024) {
    return { maxDpr: 1.75, antialias: false, teeth: 22, dust: 380, traces: 18, arms: 3 };
  }
  return { maxDpr: 2, antialias: true, teeth: 30, dust: 620, traces: 26, arms: 4 };
}

/**
 * A soft radial falloff, as a texture. Used for the atmospheric glow behind
 * the core and for the dust sprites — both of which would read as hard discs
 * without it. 128px is plenty for something this blurred.
 */
function radialTexture(inner: string, outer: string): THREE.Texture {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, inner);
  gradient.addColorStop(0.45, outer);
  gradient.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * A vertical gradient used as the scene's environment map. Without one, metal
 * has nothing to reflect and renders black; with it, every edge picks up a
 * cool sky above and a dark floor below, which is most of what makes the
 * parts read as machined rather than plastic.
 */
function environmentTexture(): THREE.Texture {
  const canvas = document.createElement("canvas");
  canvas.width = 16;
  canvas.height = 64;
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createLinearGradient(0, 0, 0, 64);
  gradient.addColorStop(0, "#2a4058");
  gradient.addColorStop(0.42, "#101c2a");
  gradient.addColorStop(0.52, "#080f19");
  gradient.addColorStop(1, "#010306");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 16, 64);
  const texture = new THREE.CanvasTexture(canvas);
  texture.mapping = THREE.EquirectangularReflectionMapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function MachineCore() {
  const hostRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    // A stale `lost context` or a browser without WebGL should degrade to the
    // plain dark hero rather than throwing during render.
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: qualityFor(window.innerWidth).antialias,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      return;
    }

    const quality = qualityFor(window.innerWidth);

    /* ---------------------------------------------------------------- setup */

    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.4;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, quality.maxDpr));
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    // Dense enough that the far layer dissolves rather than ending, which is
    // what sells the depth. Matched to the page colour so there is no seam.
    scene.fog = new THREE.FogExp2(MACHINE.background, 0.042);

    const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 120);
    camera.position.set(0, 0.4, REST_DISTANCE);

    /*
     * Everything created below is registered for disposal. Three does not
     * track its own resources, so anything not in one of these lists leaks
     * when the hero unmounts on a client-side navigation.
     */
    const geometries: THREE.BufferGeometry[] = [];
    const materials: THREE.Material[] = [];
    const textures: THREE.Texture[] = [];
    const geo = <T extends THREE.BufferGeometry>(value: T) => (geometries.push(value), value);
    const mat = <T extends THREE.Material>(value: T) => (materials.push(value), value);
    const tex = <T extends THREE.Texture>(value: T) => (textures.push(value), value);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const envSource = tex(environmentTexture());
    const environment = pmrem.fromEquirectangular(envSource).texture;
    scene.environment = environment;
    pmrem.dispose();

    /* ------------------------------------------------------------ materials */

    const metal = mat(
      new THREE.MeshStandardMaterial({
        color: MACHINE.metal,
        metalness: 0.78,
        roughness: 0.28,
        envMapIntensity: 2.2,
      }),
    );

    const metalDark = mat(
      new THREE.MeshStandardMaterial({
        color: MACHINE.metalDark,
        metalness: 0.68,
        roughness: 0.45,
        envMapIntensity: 1.6,
      }),
    );

    // Lit parts of the machine. Emissive rather than a light source, so there
    // is no per-light cost for the dozens of small glowing details.
    const lit = mat(
      new THREE.MeshStandardMaterial({
        color: 0x0a1620,
        emissive: MACHINE.accent,
        emissiveIntensity: 1.5,
        metalness: 0.3,
        roughness: 0.4,
      }),
    );

    const traceMaterial = mat(
      new THREE.LineBasicMaterial({
        color: MACHINE.accent,
        transparent: true,
        opacity: 0.22,
        depthWrite: false,
      }),
    );

    /* ----------------------------------------------------------- the layers */

    const root = new THREE.Group();
    scene.add(root);

    const far = new THREE.Group();
    const mid = new THREE.Group();
    const near = new THREE.Group();
    root.add(far, mid, near);

    /* far — circuit board traces and their solder nodes ------------------- */

    far.position.z = -7;

    {
      const points: number[] = [];
      const nodes: THREE.Vector3[] = [];
      // Each trace is a short right-angle walk, the way a board is actually
      // routed — never a diagonal, never a curve.
      for (let i = 0; i < quality.traces; i++) {
        let x = THREE.MathUtils.randFloatSpread(26);
        let y = THREE.MathUtils.randFloatSpread(16);
        nodes.push(new THREE.Vector3(x, y, 0));
        const steps = 2 + Math.floor(Math.random() * 3);
        let horizontal = Math.random() > 0.5;
        for (let s = 0; s < steps; s++) {
          const length = THREE.MathUtils.randFloat(1.4, 4.2) * (Math.random() > 0.5 ? 1 : -1);
          const nx = horizontal ? x + length : x;
          const ny = horizontal ? y : y + length;
          points.push(x, y, 0, nx, ny, 0);
          x = nx;
          y = ny;
          horizontal = !horizontal;
        }
        nodes.push(new THREE.Vector3(x, y, 0));
      }

      const traceGeometry = geo(new THREE.BufferGeometry());
      traceGeometry.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
      far.add(new THREE.LineSegments(traceGeometry, traceMaterial));

      const nodeGeometry = geo(new THREE.OctahedronGeometry(0.09, 0));
      const nodeMesh = new THREE.InstancedMesh(nodeGeometry, lit, nodes.length);
      const matrix = new THREE.Matrix4();
      nodes.forEach((position, i) => {
        matrix.makeTranslation(position.x, position.y, position.z);
        nodeMesh.setMatrixAt(i, matrix);
      });
      nodeMesh.instanceMatrix.needsUpdate = true;
      far.add(nodeMesh);
    }

    /* mid — the core ------------------------------------------------------ */

    const core = new THREE.Group();
    mid.add(core);

    /**
     * One gear: a hub ring, a rim of teeth, and spokes. Built from three
     * instanced/shared geometries rather than a lathe, so a gear costs three
     * draw calls no matter how many teeth it has.
     */
    function buildGear(
      radius: number,
      tube: number,
      teethCount: number,
      material: THREE.Material,
    ): THREE.Group {
      const gear = new THREE.Group();

      const rim = geo(new THREE.TorusGeometry(radius, tube, 10, 72));
      gear.add(new THREE.Mesh(rim, material));

      const toothGeometry = geo(new THREE.BoxGeometry(tube * 2.6, tube * 3.4, tube * 2.2));
      const teeth = new THREE.InstancedMesh(toothGeometry, material, teethCount);
      const matrix = new THREE.Matrix4();
      const quaternion = new THREE.Quaternion();
      const position = new THREE.Vector3();
      const scale = new THREE.Vector3(1, 1, 1);
      const euler = new THREE.Euler();
      for (let i = 0; i < teethCount; i++) {
        const angle = (i / teethCount) * Math.PI * 2;
        position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);
        euler.set(0, 0, angle);
        quaternion.setFromEuler(euler);
        matrix.compose(position, quaternion, scale);
        teeth.setMatrixAt(i, matrix);
      }
      teeth.instanceMatrix.needsUpdate = true;
      gear.add(teeth);

      const spokeCount = 6;
      const spokeGeometry = geo(new THREE.BoxGeometry(radius * 0.92, tube * 1.1, tube * 1.1));
      const spokes = new THREE.InstancedMesh(spokeGeometry, metalDark, spokeCount);
      for (let i = 0; i < spokeCount; i++) {
        const angle = (i / spokeCount) * Math.PI;
        position.set(0, 0, 0);
        euler.set(0, 0, angle);
        quaternion.setFromEuler(euler);
        matrix.compose(position, quaternion, scale);
        spokes.setMatrixAt(i, matrix);
      }
      spokes.instanceMatrix.needsUpdate = true;
      gear.add(spokes);

      return gear;
    }

    // Three interlocking rings, each on its own axis and speed. The plate is
    // the machined backing they all sit against.
    const gearOuter = buildGear(4.5, 0.1, quality.teeth, metal);
    const gearMid = buildGear(3.1, 0.085, Math.round(quality.teeth * 0.7), metal);
    const gearInner = buildGear(1.9, 0.07, Math.round(quality.teeth * 0.5), metalDark);
    gearMid.rotation.x = 0.42;
    gearInner.rotation.y = 0.5;
    core.add(gearOuter, gearMid, gearInner);

    // Open shells: partial tori that read as a housing cracked open around
    // the core rather than a closed sphere.
    const shellA = new THREE.Mesh(
      geo(new THREE.TorusGeometry(5.5, 0.16, 8, 90, Math.PI * 1.15)),
      metalDark,
    );
    shellA.rotation.set(Math.PI / 2, 0, 0.4);
    const shellB = new THREE.Mesh(
      geo(new THREE.TorusGeometry(6.2, 0.1, 8, 90, Math.PI * 0.8)),
      metalDark,
    );
    shellB.rotation.set(Math.PI / 2.4, 0.6, -0.9);
    core.add(shellA, shellB);

    // The heart. Faceted so the key light breaks across it as it turns.
    const heart = new THREE.Mesh(geo(new THREE.IcosahedronGeometry(0.62, 0)), lit);
    core.add(heart);

    // Cage around the heart — six struts, so it reads as held rather than
    // floating.
    {
      const strutGeometry = geo(new THREE.BoxGeometry(0.055, 1.7, 0.055));
      const struts = new THREE.InstancedMesh(strutGeometry, metal, 6);
      const matrix = new THREE.Matrix4();
      const quaternion = new THREE.Quaternion();
      const position = new THREE.Vector3();
      const scale = new THREE.Vector3(1, 1, 1);
      const euler = new THREE.Euler();
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        position.set(Math.cos(angle) * 0.95, 0, Math.sin(angle) * 0.95);
        euler.set(0, -angle, 0);
        quaternion.setFromEuler(euler);
        matrix.compose(position, quaternion, scale);
        struts.setMatrixAt(i, matrix);
      }
      struts.instanceMatrix.needsUpdate = true;
      core.add(struts);
    }

    // Atmospheric glow behind the machine. A single additive sprite plane —
    // cheaper and softer than any amount of bloom post-processing.
    const glowTexture = tex(
      radialTexture("rgba(92,200,232,0.42)", "rgba(106,92,224,0.14)"),
    );
    const glow = new THREE.Mesh(
      geo(new THREE.PlaneGeometry(26, 26)),
      mat(
        new THREE.MeshBasicMaterial({
          map: glowTexture,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          opacity: 0.95,
          fog: false,
        }),
      ),
    );
    glow.position.z = -4;
    mid.add(glow);

    /* near — articulated arms and dust ------------------------------------ */

    near.position.z = 2.4;

    interface Arm {
      shoulder: THREE.Group;
      elbow: THREE.Group;
      phase: number;
    }
    const arms: Arm[] = [];

    {
      const upperGeometry = geo(new THREE.BoxGeometry(0.2, 0.2, 3.1));
      const foreGeometry = geo(new THREE.BoxGeometry(0.15, 0.15, 2.2));
      const jointGeometry = geo(new THREE.SphereGeometry(0.19, 12, 10));
      const clampGeometry = geo(new THREE.CylinderGeometry(0.1, 0.16, 0.34, 10));

      for (let i = 0; i < quality.arms; i++) {
        const angle = (i / quality.arms) * Math.PI * 2 + 0.7;
        const radius = 8.2;

        const shoulder = new THREE.Group();
        shoulder.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius * 0.62, -1.2);
        // Each arm points back in at the core it is working on.
        shoulder.lookAt(0, 0, 0);
        shoulder.add(new THREE.Mesh(jointGeometry, metalDark));

        const upper = new THREE.Mesh(upperGeometry, metal);
        upper.position.z = 1.55;
        shoulder.add(upper);

        const elbow = new THREE.Group();
        elbow.position.z = 3.1;
        elbow.add(new THREE.Mesh(jointGeometry, metalDark));
        const fore = new THREE.Mesh(foreGeometry, metal);
        fore.position.z = 1.1;
        elbow.add(fore);
        const clamp = new THREE.Mesh(clampGeometry, metalDark);
        clamp.rotation.x = Math.PI / 2;
        clamp.position.z = 2.3;
        elbow.add(clamp);
        const tip = new THREE.Mesh(geo(new THREE.OctahedronGeometry(0.07, 0)), lit);
        tip.position.z = 2.5;
        elbow.add(tip);

        shoulder.add(elbow);
        near.add(shoulder);
        arms.push({ shoulder, elbow, phase: i * 1.7 });
      }
    }

    // Technical dust. Positions are fixed; the whole field is rotated and
    // bobbed as one, so there is no per-particle work on the CPU.
    const dust = (() => {
      const positions = new Float32Array(quality.dust * 3);
      for (let i = 0; i < quality.dust; i++) {
        positions[i * 3] = THREE.MathUtils.randFloatSpread(34);
        positions[i * 3 + 1] = THREE.MathUtils.randFloatSpread(20);
        positions[i * 3 + 2] = THREE.MathUtils.randFloatSpread(22) - 4;
      }
      const dustGeometry = geo(new THREE.BufferGeometry());
      dustGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const dustTexture = tex(radialTexture("rgba(200,232,245,0.9)", "rgba(120,190,220,0.25)"));
      const points = new THREE.Points(
        dustGeometry,
        mat(
          new THREE.PointsMaterial({
            size: 0.075,
            map: dustTexture,
            color: 0xbfe2f2,
            transparent: true,
            opacity: 0.5,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true,
          }),
        ),
      );
      root.add(points);
      return points;
    })();

    /* dock — the cables that power the modules on the page ---------------- */

    /*
     * The machine does not stop at the hero: as the agent modules scroll up,
     * it stays behind them and runs a cable out to each one. The cards are
     * DOM, so their anchors are found by measuring each module and
     * unprojecting that screen point onto a plane in front of the core —
     * which is what keeps a cable landing on its card at any viewport size,
     * through any scroll position, without the two layouts knowing about
     * each other.
     */
    interface Cable {
      line: THREE.Line;
      material: THREE.LineBasicMaterial;
      node: THREE.Mesh;
      curve: THREE.CubicBezierCurve3;
      positions: THREE.BufferAttribute;
      /** Eased 0..1 as its card becomes the active one. */
      glow: number;
    }

    const dock = new THREE.Group();
    dock.visible = false;
    scene.add(dock);

    const cableMaterials: THREE.LineBasicMaterial[] = [];
    const nodeGeometry = geo(new THREE.TorusGeometry(0.17, 0.028, 6, 20));
    const cables: Cable[] = [];

    for (let i = 0; i < DOCK_MAX; i++) {
      const material = mat(
        new THREE.LineBasicMaterial({
          color: MACHINE.accent,
          transparent: true,
          opacity: 0.45,
          depthWrite: false,
          // The cables are a diagram, not part of the scene's atmosphere;
          // letting the fog take them left almost nothing on screen once the
          // machine had dimmed to backdrop level.
          fog: false,
        }),
      );
      cableMaterials.push(material);

      const geometry = geo(new THREE.BufferGeometry());
      const positions = new THREE.BufferAttribute(
        new Float32Array((CABLE_SEGMENTS + 1) * 3),
        3,
      );
      positions.setUsage(THREE.DynamicDrawUsage);
      geometry.setAttribute("position", positions);

      const line = new THREE.Line(geometry, material);
      // Rebuilt every frame from screen positions, so a bounding sphere
      // computed once would cull it the moment a card moved.
      line.frustumCulled = false;

      const node = new THREE.Mesh(nodeGeometry, lit);
      node.frustumCulled = false;

      dock.add(line, node);
      cables.push({
        line,
        material,
        node,
        positions,
        curve: new THREE.CubicBezierCurve3(
          new THREE.Vector3(),
          new THREE.Vector3(),
          new THREE.Vector3(),
          new THREE.Vector3(),
        ),
        glow: 0,
      });
    }

    // The charge running down the cables. Two packets per cable, one
    // instanced mesh for the lot.
    const packets = new THREE.InstancedMesh(
      geo(new THREE.SphereGeometry(0.1, 8, 6)),
      mat(
        new THREE.MeshBasicMaterial({
          color: 0xcaf2ff,
          transparent: true,
          opacity: 0.9,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          fog: false,
        }),
      ),
      DOCK_MAX * 2,
    );
    packets.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    packets.frustumCulled = false;
    dock.add(packets);

    /* ---------------------------------------------------------------- light */

    scene.add(new THREE.AmbientLight(0x33465e, 1.8));

    const key = new THREE.DirectionalLight(MACHINE.key, 2.2);
    key.position.set(5, 7, 8);
    scene.add(key);

    const rim = new THREE.DirectionalLight(MACHINE.accent, 1.5);
    rim.position.set(-7, -3, -5);
    scene.add(rim);

    // Fill from behind the lens. Without it the faces pointing at the camera
    // — which is most of what you see — have nothing lighting them and the
    // whole assembly reads as a silhouette.
    const fill = new THREE.DirectionalLight(0x9fc4e8, 1.15);
    fill.position.set(-2, 1.5, 12);
    scene.add(fill);

    // The two lights that travel through the machinery. Orbiting inside the
    // gear rings is what makes light appear to pass between the parts.
    const travellerA = new THREE.PointLight(MACHINE.accent, 44, 18, 2);
    const travellerB = new THREE.PointLight(MACHINE.violet, 32, 20, 2);
    scene.add(travellerA, travellerB);

    /* ------------------------------------------------------------- sizing */

    let width = 0;
    let height = 0;

    function resize() {
      const rect = host!.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      width = rect.width;
      height = rect.height;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, quality.maxDpr));
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      // Portrait viewports need a wider lens or the core fills the frame and
      // crowds the copy sitting on top of it.
      camera.fov = camera.aspect < 0.85 ? 68 : camera.aspect < 1.3 ? 58 : 48;
      camera.updateProjectionMatrix();

      /*
       * Fit the machine to the viewport rather than to a fixed world size.
       *
       * The assembly is about 6.2 units in radius. Rather than a fixed world
       * scale — which reads as a close-up on a short window and as a speck on
       * a tall one — it is sized to a fraction of the visible half-height, so
       * the outer shell lands at the same proportion of the frame whatever
       * shape the window is.
       */
      const halfHeight = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * REST_DISTANCE;
      root.scale.setScalar(THREE.MathUtils.clamp((halfHeight * 0.88) / 6.2, 0.4, 1.5));
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    resize();

    /* ---------------------------------------------------------- interaction */

    /*
     * The three acts of the scroll, each smoothed by ScrollTrigger's own
     * scrub rather than by anything of ours — that is what keeps the motion
     * free of steps and catch-up lag.
     *
     *   enter — the camera pushes into the machine across the hero
     *   dock  — it settles back as the modules arrive and the cables run out
     *   exit  — it dims away once the modules are done with it
     */
    const state = { enter: 0, dock: 0, exit: 0 };
    // Mouse parallax target, eased toward in the frame loop.
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };

    let hostVisible = true;
    let running = true;

    /* -------------------------------------------------------- dock plumbing */

    const ray = new THREE.Vector3();
    const coreCentre = new THREE.Vector3();
    const anchor = new THREE.Vector3();
    const start = new THREE.Vector3();
    const control1 = new THREE.Vector3();
    const control2 = new THREE.Vector3();
    const sample = new THREE.Vector3();
    const packetMatrix = new THREE.Matrix4();
    const packetQuaternion = new THREE.Quaternion();
    const packetScale = new THREE.Vector3();

    /**
     * Screen point to a world point on the `z` plane. The camera matrix has
     * to be current — call this only after the camera has been placed for
     * this frame.
     */
    function screenToWorld(x: number, y: number, z: number, target: THREE.Vector3) {
      ray.set((x / window.innerWidth) * 2 - 1, -(y / window.innerHeight) * 2 + 1, 0.5);
      ray.unproject(camera);
      ray.sub(camera.position).normalize();
      return target.copy(camera.position).addScaledVector(ray, (z - camera.position.z) / ray.z);
    }

    function updateDock(time: number, level: number) {
      dock.visible = level > 0.02;
      if (!dock.visible) return;

      const stages = document.querySelectorAll<HTMLElement>("[data-agent-stage]");
      mid.getWorldPosition(coreCentre);
      /*
       * Where a cable leaves the machine. Deliberately well inside the outer
       * ring: measured from the rim, the launch point was around 4.8 world
       * units out and the cards sit only about 7 away, so every cable was a
       * stub hidden behind its own card. Launching from near the hub gives
       * each one a run long enough to read as a cable.
       */
      const coreRadius = 1.6 * root.scale.x;

      // Which side of the core each card sits on, in screen terms.
      const coreScreen = coreCentre.clone().project(camera);
      const coreScreenX = ((coreScreen.x + 1) / 2) * window.innerWidth;

      let packetIndex = 0;

      cables.forEach((cable, i) => {
        const stage = stages[i];
        const rect = stage?.getBoundingClientRect();
        const onScreen =
          !!rect &&
          rect.bottom > -80 &&
          rect.top < window.innerHeight + 80 &&
          rect.width > 0;

        if (!onScreen) {
          cable.line.visible = false;
          cable.node.visible = false;
          // Park this cable's packets inside the core, scaled to nothing.
          for (let p = 0; p < 2; p++) {
            packetScale.setScalar(0);
            packetMatrix.compose(coreCentre, packetQuaternion, packetScale);
            packets.setMatrixAt(packetIndex++, packetMatrix);
          }
          return;
        }

        cable.line.visible = true;
        cable.node.visible = true;

        /*
         * The cable docks on the *outer* edge of the card — the one facing
         * away from the machine. Running to the near edge is the obvious
         * choice and the wrong one: that edge points into the middle of the
         * grid, so the cable spends its whole length hidden behind the cards
         * in between. Going the long way round puts it in the margins, where
         * there is actually something to see.
         */
        const cardCentreX = rect.left + rect.width / 2;
        const edgeX = cardCentreX < coreScreenX ? rect.left : rect.right;
        screenToWorld(edgeX, rect.top + rect.height / 2, ANCHOR_Z, anchor);

        start.copy(anchor).sub(coreCentre).normalize();
        start.multiplyScalar(coreRadius).add(coreCentre);

        // Bowed toward the viewer, so a cable reads as slack hanging in
        // space rather than as a ruled line between two points.
        control1.copy(start).lerp(anchor, 0.34);
        control1.z += 2.6;
        control2.copy(start).lerp(anchor, 0.72);
        control2.z += 1.1;

        cable.curve.v0.copy(start);
        cable.curve.v1.copy(control1);
        cable.curve.v2.copy(control2);
        cable.curve.v3.copy(anchor);

        // Eased rather than switched, so a card lighting up is a surge down
        // the cable and not a state flip.
        const target = stage.dataset.active === "" ? 1 : 0;
        cable.glow += (target - cable.glow) * 0.07;

        for (let seg = 0; seg <= CABLE_SEGMENTS; seg++) {
          cable.curve.getPoint(seg / CABLE_SEGMENTS, sample);
          cable.positions.setXYZ(seg, sample.x, sample.y, sample.z);
        }
        cable.positions.needsUpdate = true;
        cable.line.geometry.setDrawRange(0, CABLE_SEGMENTS + 1);
        cable.material.opacity = (0.62 + cable.glow * 0.38) * level;

        cable.node.position.copy(anchor);
        cable.node.lookAt(camera.position);
        cable.node.scale.setScalar((1 + cable.glow * 0.7) * level);

        // Charge, running core to card. An active module is fed faster.
        const speed = 0.22 + cable.glow * 0.5;
        for (let p = 0; p < 2; p++) {
          const t = (time * speed + i * 0.17 + p * 0.5) % 1;
          cable.curve.getPoint(t, sample);
          packetScale.setScalar((0.85 + cable.glow * 0.9) * level);
          packetMatrix.compose(sample, packetQuaternion, packetScale);
          packets.setMatrixAt(packetIndex++, packetMatrix);
        }
      });

      // Anything past the number of cards on the page stays parked.
      while (packetIndex < DOCK_MAX * 2) {
        packetScale.setScalar(0);
        packetMatrix.compose(coreCentre, packetQuaternion, packetScale);
        packets.setMatrixAt(packetIndex++, packetMatrix);
      }
      packets.instanceMatrix.needsUpdate = true;
    }

    /** `time` is GSAP's ticker clock, in seconds. */
    function frame(time: number) {
      if (!running || width === 0) return;

      /*
       * How present the machine is. It runs at full strength through the
       * hero, dims to a backdrop once the modules dock onto it, and is gone
       * by the time they are. Driven from the scrubbed state rather than
       * from a raw scroll read, so it never steps.
       */
      const level = (1 - DOCKED_DIM * state.dock) * (1 - state.exit);
      host!.style.opacity = level.toFixed(3);
      if (level <= 0.02) {
        if (hostVisible) {
          hostVisible = false;
          host!.style.visibility = "hidden";
        }
        // Invisible: no reason to spend a WebGL frame on it.
        return;
      }
      if (!hostVisible) {
        hostVisible = true;
        host!.style.visibility = "visible";
      }

      // The dolly through the hero. The dock phase eases it back out again,
      // so the machine settles behind the modules instead of looming.
      const p = state.enter;

      // Idle machinery. Every ring turns at its own rate and the inner ones
      // counter-rotate, so the assembly never reads as one spinning object.
      gearOuter.rotation.z = time * 0.055 + p * 0.9;
      gearMid.rotation.z = -time * 0.095 - p * 1.6;
      gearInner.rotation.z = time * 0.17 + p * 2.4;
      shellA.rotation.z = 0.4 + time * 0.03;
      shellB.rotation.z = -0.9 - time * 0.045;

      heart.rotation.y = time * 0.22;
      heart.rotation.x = time * 0.13;
      // Slow breathing pulse, held well short of a flash.
      lit.emissiveIntensity = 1.35 + Math.sin(time * 0.9) * 0.28;

      arms.forEach((arm, i) => {
        const wave = Math.sin(time * 0.42 + arm.phase);
        arm.elbow.rotation.x = -0.34 + wave * 0.1;
        arm.shoulder.rotation.z = Math.sin(time * 0.3 + arm.phase * 0.6) * 0.06;
        // Arms withdraw as the camera pushes past them, so they clear the
        // frame instead of clipping through the lens.
        arm.shoulder.position.z = -1.2 - p * (3 + i * 0.4);
      });

      dust.rotation.y = time * 0.012;
      dust.rotation.z = time * 0.006;
      dust.position.y = Math.sin(time * 0.16) * 0.5;

      travellerA.position.set(
        Math.cos(time * 0.5) * 4.4,
        Math.sin(time * 0.42) * 2.6,
        Math.sin(time * 0.5) * 3.2,
      );
      travellerB.position.set(
        Math.cos(-time * 0.33 + 2) * 5.6,
        Math.sin(-time * 0.29 + 2) * 3.4,
        Math.cos(-time * 0.33) * 3.6 - 2,
      );

      // Layers separate as you descend: the board falls away, the core comes
      // to meet you, the arms sweep past. That parallax is what makes the
      // scroll feel like entering the machine rather than scaling it.
      far.position.z = -7 - p * 9;
      far.rotation.z = p * 0.14;
      mid.position.z = p * 5.2;
      core.rotation.x = p * 0.34;
      glow.material.opacity = 0.95 - p * 0.45;

      // Mouse parallax. Eased rather than applied directly, and small enough
      // that it reads as the frame breathing, not as a control.
      pointer.x += (pointer.tx - pointer.x) * 0.045;
      pointer.y += (pointer.ty - pointer.y) * 0.045;
      root.rotation.y = pointer.x * 0.11 + Math.sin(time * 0.08) * 0.03;
      root.rotation.x = pointer.y * 0.07;

      camera.position.z = REST_DISTANCE - p * 7 + state.dock * 5.5;
      camera.position.y = 0.4 + p * 1.5 - state.dock * 0.9;
      camera.lookAt(0, p * 0.7 * (1 - state.dock), 0);
      // The dock measures against this frame's camera, so its matrices have
      // to be current before any unprojection happens.
      camera.updateMatrixWorld();

      updateDock(time, state.dock * (1 - state.exit));

      renderer.render(scene, camera);
    }

    function handlePointerMove(event: PointerEvent) {
      if (event.pointerType !== "mouse") return;
      pointer.tx = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.ty = (event.clientY / window.innerHeight) * 2 - 1;
    }

    const phases: gsap.core.Tween[] = [];

    if (!reduced) {
      /*
       * One scrubbed tween per act, each anchored to the thing it describes
       * rather than to a share of one long timeline. An earlier version split
       * a single timeline by duration across hero + modules, which made the
       * proportions depend on how tall the module grid happened to be — the
       * cables only reached the cards halfway down the section. Anchoring
       * each act to its own trigger is what makes the machine hand over
       * exactly as the modules arrive, at any grid height.
       */
      const modules = document.querySelector("#ai-agents");

      // Act one: the dolly into the machine, across the hero.
      phases.push(
        gsap.to(state, {
          enter: 1,
          ease: "none",
          scrollTrigger: {
            trigger: "#home",
            start: "top top",
            end: "bottom top",
            scrub: 1.1,
            invalidateOnRefresh: true,
          },
        }),
      );

      if (modules) {
        // Act two: the machine settles back and runs its cables out, finishing
        // exactly as the module grid reaches the top of the screen.
        phases.push(
          gsap.to(state, {
            dock: 1,
            ease: "none",
            scrollTrigger: {
              trigger: modules,
              start: "top 60%",
              end: "top top",
              scrub: 1.1,
              invalidateOnRefresh: true,
            },
          }),
        );

        // Act three: it lets go as the last module leaves.
        phases.push(
          gsap.to(state, {
            exit: 1,
            ease: "none",
            scrollTrigger: {
              trigger: modules,
              start: "bottom 80%",
              end: "bottom top",
              scrub: 1.1,
              invalidateOnRefresh: true,
            },
          }),
        );
      }

      window.addEventListener("pointermove", handlePointerMove, { passive: true });
      gsap.ticker.add(frame);
    }

    // A backgrounded tab should not be rendering WebGL.
    function handleVisibilityChange() {
      running = !document.hidden;
    }
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // One frame either way, so the scene is correct on load and — under
    // reduced motion, where nothing is ever added to the ticker — it simply
    // sits there, lit, composed and still.
    frame(0);

    /* -------------------------------------------------------------- cleanup */

    return () => {
      running = false;
      gsap.ticker.remove(frame);
      phases.forEach((phase) => {
        phase.scrollTrigger?.kill();
        phase.kill();
      });
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      resizeObserver.disconnect();

      // Instanced meshes hold their own per-instance buffers, and the
      // environment map is a render target the PMREM generator handed us —
      // none of it is covered by disposing the shared lists.
      scene.traverse((object) => {
        if (object instanceof THREE.InstancedMesh) object.dispose();
      });
      geometries.forEach((value) => value.dispose());
      materials.forEach((value) => value.dispose());
      textures.forEach((value) => value.dispose());
      environment.dispose();
      scene.clear();

      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    };
  }, [reduced]);

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      className={cn(
        "pointer-events-none -z-10",
        // Normally the machine owns the whole viewport, so the camera can
        // dolly into it as the page scrolls and it can hand over to the
        // sections below. With motion off there is no dolly and no fade, so
        // it stays inside the hero rather than sitting behind the whole page.
        reduced ? "absolute inset-0" : "fixed inset-0",
      )}
      // The canvas is painted, not laid out — it has no effect on document
      // flow, so nothing here can shift the page.
      style={{ contain: "strict" }}
    />
  );
}
