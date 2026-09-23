import { cn } from "@/lib/utils";

/** Orange check mark used ahead of list items. */
export function Tick({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className={cn("mt-[4px] h-3.5 w-3.5 shrink-0 text-brand-orange", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3.5 8.5 6.5 11.5 12.5 5" />
    </svg>
  );
}
