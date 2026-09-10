import {
  siAngular,
  siAstro,
  siBootstrap,
  siCss,
  siFigma,
  siGraphql,
  siHtml5,
  siJavascript,
  siMui,
  siNextdotjs,
  siNuxt,
  siRedux,
  siReact,
  siRemix,
  siSass,
  siStorybook,
  siSvelte,
  siTailwindcss,
  siTanstack,
  siTypescript,
  siVite,
  siVitest,
  siVuedotjs,
  siWebpack,
} from "simple-icons";

/**
 * Brand marks come from simple-icons. They are imported one by one rather
 * than looked up off the package namespace so the bundler can drop the three
 * thousand icons we do not use — a dynamic lookup would pull in the lot.
 *
 * This renders on the server, so the marks cost no client JavaScript.
 */
const ICONS = {
  react: siReact,
  nextjs: siNextdotjs,
  angular: siAngular,
  vue: siVuedotjs,
  svelte: siSvelte,
  astro: siAstro,
  remix: siRemix,
  nuxt: siNuxt,
  typescript: siTypescript,
  javascript: siJavascript,
  html: siHtml5,
  css: siCss,
  sass: siSass,
  tailwind: siTailwindcss,
  bootstrap: siBootstrap,
  mui: siMui,
  redux: siRedux,
  tanstack: siTanstack,
  vite: siVite,
  webpack: siWebpack,
  storybook: siStorybook,
  vitest: siVitest,
  graphql: siGraphql,
  figma: siFigma,
} as const;

export type TechLogoSlug = keyof typeof ICONS;

export function techLogoTitle(slug: TechLogoSlug) {
  return ICONS[slug].title;
}

/**
 * Several brands are black or near-black — Next.js, Remix and Angular all
 * are — which would make them invisible on this background. Anything below
 * the luminance floor falls back to off-white instead of its brand colour.
 */
function displayColor(hex: string) {
  const channel = (at: number) => parseInt(hex.slice(at, at + 2), 16) / 255;
  const luminance = 0.2126 * channel(0) + 0.7152 * channel(2) + 0.0722 * channel(4);
  return luminance < 0.22 ? "#E6E4F0" : `#${hex}`;
}

export function TechLogo({ slug, className }: { slug: TechLogoSlug; className?: string }) {
  const icon = ICONS[slug];

  return (
    <svg
      role="img"
      aria-label={icon.title}
      viewBox="0 0 24 24"
      className={className ?? "h-7 w-7"}
      fill={displayColor(icon.hex)}
    >
      <path d={icon.path} />
    </svg>
  );
}
