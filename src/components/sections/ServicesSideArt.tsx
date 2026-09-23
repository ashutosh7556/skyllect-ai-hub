import Image from "next/image";
import { cn } from "@/lib/utils";

interface Tile {
  key: string;
  /** Position and size within the base artwork, in its own pixels. */
  x: number;
  y: number;
  w: number;
  h: number;
}

interface Art {
  w: number;
  h: number;
  tiles: Tile[];
}

// The icon tiles were split out of each illustration so they can float on
// their own; these are the spots they were cut from.
const ART: Record<"left" | "right", Art> = {
  left: {
    w: 413,
    h: 678,
    tiles: [
      { key: "crm", x: 46, y: 105, w: 104, h: 92 },
      { key: "db", x: 285, y: 102, w: 96, h: 92 },
      { key: "chart", x: 11, y: 248, w: 92, h: 92 },
      { key: "gear", x: 44, y: 447, w: 96, h: 96 },
    ],
  },
  right: {
    w: 406,
    h: 678,
    tiles: [
      { key: "mail", x: 17, y: 153, w: 96, h: 92 },
      { key: "erp", x: 212, y: 90, w: 100, h: 92 },
      { key: "cloud", x: 291, y: 218, w: 96, h: 92 },
      { key: "chart", x: 271, y: 463, w: 92, h: 92 },
    ],
  },
};

/**
 * One of the two illustrations beside the services slider: the bulb and its
 * connecting lines stay put while each system tile (CRM, ERP, email…) gently
 * floats, staggered so they never move in unison.
 */
export function ServicesSideArt({ side, className }: { side: "left" | "right"; className?: string }) {
  const art = ART[side];
  const pct = (value: number, total: number) => `${(value / total) * 100}%`;

  return (
    <div
      aria-hidden="true"
      className={cn("relative w-full max-w-[380px]", className)}
      style={{ aspectRatio: `${art.w} / ${art.h}` }}
    >
      <Image
        src={`/images/services-side/${side}-base.png`}
        alt=""
        fill
        sizes="380px"
        className="object-contain"
      />
      {art.tiles.map((tile, i) => (
        <Image
          key={tile.key}
          src={`/images/services-side/${side}-${tile.key}.png`}
          alt=""
          width={tile.w}
          height={tile.h}
          className="side-tile absolute h-auto"
          style={{
            left: pct(tile.x, art.w),
            top: pct(tile.y, art.h),
            width: pct(tile.w, art.w),
            ["--delay" as string]: `${i * 0.8}s`,
          }}
        />
      ))}
    </div>
  );
}
