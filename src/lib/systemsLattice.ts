/**
 * Where the Beyond Chat lattice's nodes are, and how lit each one is.
 *
 * The same arrangement as `machineRings`: the lattice is WebGL, the card in
 * front of it is DOM, and this is the only channel between them. SystemsLattice
 * projects its nodes once a frame and writes them here; the card's feed reads
 * them on the same tick and runs a line from each one into its own edge.
 *
 * Positions are in the lattice host's own pixels, not the viewport's. The host
 * and the card's feed overlay are both `inset-0` on the same pinned container,
 * so one set of coordinates serves both — and it keeps working through the pin
 * without either side having to know the scroll position.
 */

export interface LatticeNode {
  x: number;
  y: number;
  /**
   * 0..1, as the section's charge wave reaches this node. The card's feed is
   * driven from this rather than from its own scroll trigger, so a line into
   * the card can never energise before the node feeding it has.
   */
  lit: number;
}

export interface SystemsLatticeState {
  /** True only while the lattice is rendering and publishing. */
  live: boolean;
  /** Size of the host the positions are measured in. */
  width: number;
  height: number;
  nodes: LatticeNode[];
}

export const systemsLattice: SystemsLatticeState = {
  live: false,
  width: 0,
  height: 0,
  nodes: [],
};
