/**
 * Shared geometry for the Skyllect bulb backdrop.
 *
 * The bulb is a page-level fixed layer, but the AI Agents vortex has to spawn
 * its cards from exactly where the bulb sits — so both read these values
 * rather than each keeping their own copy.
 */
export const BULB_SRC = "/images/bulb.png";
export const BULB_HEIGHT = 500;
/** Offset from the vertical centre of the viewport, in px. */
export const BULB_Y_OFFSET = 170;
/** Resting opacity once it has settled in as a backdrop. */
export const BULB_IDLE_OPACITY = 0.3;
