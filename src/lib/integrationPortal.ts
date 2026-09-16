/**
 * Where the gate's modules are on screen, and which one has left it.
 *
 * The third of these channels, after `machineRings` and `systemsLattice`, and
 * the same shape for the same reason: the gate is WebGL and the card that
 * flies out of it is DOM, so the only thing they can share is a plain module
 * singleton written once a frame and read once a frame.
 *
 * Positions are in viewport pixels. The portal's canvas is the full pinned
 * stage, which is itself pinned to the viewport, so its projection and the
 * page's client coordinates are the same space.
 */

export interface PortalModule {
  x: number;
  y: number;
}

export interface IntegrationPortalState {
  /** True only while the gate is rendering and publishing. */
  live: boolean;
  /** The gate's centre, in viewport pixels — the pivot a card arcs around. */
  cx: number;
  cy: number;
  /** One entry per integration, in module order. */
  modules: PortalModule[];
  /**
   * The highest module index that has been taken off the ring, or -1.
   *
   * Written by the topic, read by the gate: every module up to and including
   * this one dims its plate, its label and its cable, so the same integration
   * is never shown twice — once on the ring and once on the card it became —
   * and the ring empties as the topic works through it.
   */
  released: number;
}

export const integrationPortal: IntegrationPortalState = {
  live: false,
  cx: 0,
  cy: 0,
  modules: [],
  released: -1,
};
