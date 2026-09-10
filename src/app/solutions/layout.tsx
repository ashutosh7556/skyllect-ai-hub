import { SolutionsShell } from "@/components/solutions/SolutionsShell";

/**
 * Persists across every solution. Because this is a layout rather than part
 * of the page, React keeps it mounted when you switch — the rail and chrome
 * never remount, which is what makes the change read as one experience
 * rather than a page load.
 */
export default function SolutionsLayout({ children }: { children: React.ReactNode }) {
  return <SolutionsShell>{children}</SolutionsShell>;
}
