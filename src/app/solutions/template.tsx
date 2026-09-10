/**
 * A template is given a fresh key per route, so this remounts on every
 * solution change and replays the enter animation — the layout above it does
 * not. That split is what animates only the content area.
 */
export default function SolutionsTemplate({ children }: { children: React.ReactNode }) {
  return <div className="solution-enter">{children}</div>;
}
