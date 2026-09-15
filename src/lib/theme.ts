/**
 * The machine palette, in the form WebGL needs it.
 *
 * These are the same values as the CSS custom properties in globals.css —
 * kept here as numbers so the Three.js scene and the page around it cannot
 * drift apart. If one changes, change both.
 */
export const MACHINE = {
  /** Page ground. Also the fog colour, so geometry dissolves into the page. */
  background: 0x04060b,
  /** Brushed blue-gray metal — the body of every mechanical part. */
  metal: 0x55697f,
  /** Deeper metal for the parts meant to sit back in the frame. */
  metalDark: 0x2b3746,
  /** The single accent. Emissive rims, circuit traces, node lights. */
  accent: 0x5cc8e8,
  /** Atmosphere only: the far glow behind the core. Never a surface colour. */
  violet: 0x6a5ce0,
  /** Cool key light. */
  key: 0xbcd6f0,
} as const;
