/**
 * Where the machine's rings are, on screen, right now.
 *
 * The agent cards are DOM and the rings they come out of are WebGL, so the
 * two have no way of knowing about each other. This is the one channel
 * between them: MachineCore parents an empty anchor to each gear, projects it
 * every frame, and writes the result here. AgentsTopic reads it on the same
 * tick and flies its cards out of those points.
 *
 * A plain module singleton rather than context or state: it is written sixty
 * times a second and read sixty times a second, and nothing about it should
 * ever reach React. One writer, one reader, no allocation per frame.
 *
 * Everything is in viewport pixels — the machine's canvas is fixed and
 * full-viewport, so its projection and the page's client coordinates are the
 * same space.
 */

export interface RingBerth {
  x: number;
  y: number;
  /**
   * How near the camera this berth currently is, relative to the core's own
   * depth: above 1 it is in front of the core, below 1 behind it. Used to
   * give a card born on a far ring a little more depth to climb out of.
   */
  depth: number;
}

export interface MachineRings {
  /**
   * True only while the machine is actually rendering and publishing. False
   * before the first frame, on a machine that never got a WebGL context, and
   * once the scene has dimmed out below the page. A reader that finds it
   * false has no berths to fly from and should show its content at rest.
   */
  live: boolean;
  /** The core's centre, in viewport pixels. */
  cx: number;
  cy: number;
  /** One berth per agent module, in module order. */
  berths: RingBerth[];
}

export const machineRings: MachineRings = {
  live: false,
  cx: 0,
  cy: 0,
  berths: [],
};
