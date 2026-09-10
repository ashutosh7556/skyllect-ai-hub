import Image from "next/image";

const LOGO_SRC = "/images/skyllect-logo_2.png";
// Source file is 1224x283; pixel-scanned the brain+bulb mark to x≈213 before the wordmark starts.
const FULL_ASPECT = 1224 / 283;
const ICON_CROP_RATIO = 213 / 1224;
const ICON_HEIGHT = 36;

interface LogoProps {
  variant?: "icon" | "full";
  className?: string;
  /** Display height in px for the `full` lockup. */
  height?: number;
  /**
   * Marks this instance as the origin BulbBackdrop launches its bulb from.
   * Only the header sets it — a second marker would make the lookup ambiguous.
   */
  bulbOrigin?: boolean;
}

/**
 * The Skyllect logo file is a single wide lockup (icon + wordmark) designed
 * for light backgrounds. In the dark nav we only want the icon mark, so we
 * crop it out of the same file with an oversized <img> in an overflow-hidden
 * box rather than requiring a separate asset.
 */
export function Logo({
  variant = "full",
  className,
  height = 36,
  bulbOrigin = false,
}: LogoProps) {
  if (variant === "icon") {
    const scaledFullWidth = ICON_HEIGHT * FULL_ASPECT;
    const containerWidth = scaledFullWidth * ICON_CROP_RATIO;

    return (
      <span
        // Marked so the AI Agents section can launch its bulb from exactly
        // where this mark sits, whatever the viewport size.
        data-logo-icon=""
        className={className}
        style={{
          display: "inline-block",
          overflow: "hidden",
          height: ICON_HEIGHT,
          width: containerWidth,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={LOGO_SRC}
          alt=""
          style={{
            display: "block",
            height: ICON_HEIGHT,
            width: scaledFullWidth,
            maxWidth: "none",
          }}
        />
      </span>
    );
  }

  // Rendered at an explicit size rather than left to CSS: the source is
  // 1224x283, and Tailwind's preflight `img { height: auto }` fights a height
  // utility, so the lockup ends up hundreds of pixels tall.
  const width = Math.round(height * FULL_ASPECT);
  // The bulb occupies the left 213/1224 of the source, i.e. this much of the
  // rendered lockup.
  const markWidth = height * (FULL_ASPECT * ICON_CROP_RATIO);

  return (
    <span
      className={className}
      style={{ position: "relative", display: "inline-block", height, width }}
    >
      <Image
        src={LOGO_SRC}
        alt="Skyllect"
        width={width}
        height={height}
        priority
        style={{ height, width, maxWidth: "none" }}
      />

      {/*
       * Zero-visual marker over just the bulb portion of the lockup.
       * BulbBackdrop measures this to launch its bulb from exactly where the
       * mark sits — without it the animation starts from the centre of the
       * screen instead of out of the logo.
       */}
      <span
        {...(bulbOrigin ? { "data-logo-icon": "" } : {})}
        aria-hidden="true"
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          height,
          width: markWidth,
          pointerEvents: "none",
        }}
      />
    </span>
  );
}
