import type { NavIconName } from "@/types";

/**
 * Line icons for the header menus, drawn inline rather than pulled from an
 * icon package — the project has no icon dependency and these are the only
 * glyphs the site needs. All of them inherit `currentColor` and sit on a
 * 24×24 grid so they line up at any size.
 */
const PATHS: Record<NavIconName, React.ReactNode> = {
  agents: (
    <>
      <rect x="4" y="7.5" width="16" height="11" rx="3.5" />
      <path d="M12 3.5v4M9 12.5h.01M15 12.5h.01M9.75 15.75h4.5" />
    </>
  ),
  automation: (
    <>
      <rect x="2.5" y="8.5" width="7" height="7" rx="2" />
      <rect x="14.5" y="8.5" width="7" height="7" rx="2" />
      <path d="M9.5 12h5M12.8 10.2 14.9 12l-2.1 1.8" />
    </>
  ),
  integrations: (
    <>
      <path d="M10.4 13.6a3.9 3.9 0 0 0 5.9.4l2-2a3.9 3.9 0 0 0-5.6-5.5l-1.1 1.1" />
      <path d="M13.6 10.4a3.9 3.9 0 0 0-5.9-.4l-2 2a3.9 3.9 0 0 0 5.6 5.5l1.1-1.1" />
    </>
  ),
  saas: (
    <>
      <path d="M12 3.5 20 8v8l-8 4.5L4 16V8z" />
      <path d="M12 12.2 20 8M12 12.2V20.5M12 12.2 4 8" />
    </>
  ),
  modernization: (
    <>
      <path d="M20.5 12a8.5 8.5 0 1 1-2.6-6.1" />
      <path d="M20.5 4.2V9h-4.8" />
    </>
  ),
  frontend: (
    <>
      <rect x="3" y="4.5" width="18" height="13" rx="2" />
      <path d="M3 8.5h18M8 21h8" />
    </>
  ),
  backend: (
    <>
      <rect x="3.5" y="4" width="17" height="6" rx="2" />
      <rect x="3.5" y="14" width="17" height="6" rx="2" />
      <path d="M7.5 7h.01M7.5 17h.01" />
    </>
  ),
  database: (
    <>
      <ellipse cx="12" cy="6" rx="7.5" ry="3" />
      <path d="M4.5 6v12c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3V6" />
      <path d="M4.5 12c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3" />
    </>
  ),
  design: (
    <>
      <path d="M14.5 3.5 20.5 9.5 8.5 21.5H2.5v-6z" />
      <path d="M12 6 18 12" />
    </>
  ),
  mobile: (
    <>
      <rect x="6.5" y="2.5" width="11" height="19" rx="2.5" />
      <path d="M10.75 18.5h2.5" />
    </>
  ),
  cloud: (
    <>
      <path d="M7.5 18.5a4.5 4.5 0 0 1-.6-8.96 6 6 0 0 1 11.55 1.55A3.95 3.95 0 0 1 17.5 18.5z" />
    </>
  ),

  // Delivery stages.
  discovery: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M15.4 15.4 21 21" />
    </>
  ),
  architecture: (
    <>
      <path d="M12 2.8 21 7.4 12 12 3 7.4z" />
      <path d="M3 12.2 12 16.8l9-4.6M3 16.8 12 21.4l9-4.6" />
    </>
  ),
  prototype: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2.5" />
      <path d="M3 9h18M9 9v11" />
    </>
  ),
  build: (
    <>
      <path d="M8.5 8 4.5 12l4 4M15.5 8l4 4-4 4M13.6 5.5l-3.2 13" />
    </>
  ),
  quality: (
    <>
      <path d="M12 2.9 20 5.6v5.9c0 4.6-3.2 8.3-8 9.6-4.8-1.3-8-5-8-9.6V5.6z" />
      <path d="M8.8 11.9 11.3 14.4l4-4.4" />
    </>
  ),
  launch: (
    <>
      <path d="M13.6 3.6c3.2 1 5.8 3.6 6.8 6.8L13 17.8l-6.8-6.8z" />
      <path d="M9.4 14.6 5 19M4.6 14.2 3 21l6.8-1.6" />
    </>
  ),
};

export function NavIcon({ name, className }: { name: NavIconName; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className ?? "h-[15px] w-[15px]"}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {PATHS[name]}
    </svg>
  );
}

/**
 * Two letters for multi-word names, one otherwise, so the AWS entries stay
 * distinguishable. Leading punctuation is dropped — ".NET" reads as N.
 */
export function monogram(label: string) {
  const words = label.replace(/^[^a-z0-9]+/i, "").split(/[\s/]+/).filter(Boolean);
  if (words.length > 1) return (words[0][0] + words[1][0]).toUpperCase();
  return (words[0]?.[0] ?? "?").toUpperCase();
}
