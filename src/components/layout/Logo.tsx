import Image from "next/image";

const LOGO_SRC = "/images/skyllect-logo_2.png";
// Source file is 1224x283.
const FULL_ASPECT = 1224 / 283;

interface LogoProps {
  className?: string;
  /** Display height in px. */
  height?: number;
}

/** The Skyllect lockup (bulb mark + wordmark), made for light backgrounds. */
export function Logo({ className, height = 44 }: LogoProps) {
  // Rendered at an explicit size rather than left to CSS: Tailwind's preflight
  // `img { height: auto }` fights a height utility on this wide source.
  const width = Math.round(height * FULL_ASPECT);

  return (
    <Image
      src={LOGO_SRC}
      alt="Skyllect"
      width={width}
      height={height}
      priority
      className={className}
      style={{ height, width, maxWidth: "100%", objectFit: "contain" }}
    />
  );
}
