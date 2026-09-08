import Image from "next/image";

const LOGO_SRC = "/images/skyllect-logo.png";
// Source file is 1224x283; pixel-scanned the brain+bulb mark to x≈213 before the wordmark starts.
const FULL_ASPECT = 1224 / 283;
const ICON_CROP_RATIO = 213 / 1224;
const ICON_HEIGHT = 36;

interface LogoProps {
  variant?: "icon" | "full";
  className?: string;
}

/**
 * The Skyllect logo file is a single wide lockup (icon + wordmark) designed
 * for light backgrounds. In the dark nav we only want the icon mark, so we
 * crop it out of the same file with an oversized <img> in an overflow-hidden
 * box rather than requiring a separate asset.
 */
export function Logo({ variant = "full", className }: LogoProps) {
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

  return (
    <Image
      src={LOGO_SRC}
      alt="Skyllect"
      width={1224}
      height={283}
      className={className}
    />
  );
}
