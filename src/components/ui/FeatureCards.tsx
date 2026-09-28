import type { ReactNode } from "react";

/**
 * Building blocks for the paired feature cards (Connected systems / Your AI
 * can, We analyze / Then identify), so both sections share one design.
 */

/** Line icon drawn on a 24px grid, stroked in the current text colour. */
export function LineIcon({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className ?? "h-5 w-5"}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

/** A white card holding a titled block. */
export function FeatureCard({ children }: { children: ReactNode }) {
  return <div className="card flex flex-col p-6 sm:p-8">{children}</div>;
}

/** Card title with a small gradient icon badge beside it. */
export function CardTitle({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="card-header-strong flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white">
        {icon}
      </span>
      <h3 className="font-display text-xl font-bold text-heading sm:text-2xl">{children}</h3>
    </div>
  );
}

/** Equal-height icon tiles that stretch to fill the card beside a taller neighbour. */
export function IconTileGrid({ items }: { items: { label: string; icon: ReactNode }[] }) {
  return (
    <ul className="mt-6 grid flex-1 auto-rows-fr grid-cols-2 gap-3 sm:grid-cols-3">
      {items.map((item) => (
        <li
          key={item.label}
          className="flex flex-col items-center justify-center gap-2.5 rounded-2xl border border-line bg-background px-3 py-4 text-center transition duration-200 hover:border-brand-blue hover:bg-surface motion-reduce:transition-none"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface text-brand-blue shadow-[0_4px_12px_-6px_rgba(15,27,51,0.25)]">
            {item.icon}
          </span>
          <span className="text-sm leading-snug font-semibold text-heading sm:text-[15px]">
            {item.label}
          </span>
        </li>
      ))}
    </ul>
  );
}

/** Two-column rows, each with a check badge. An odd last row spans both columns. */
export function CheckRowList({ items }: { items: string[] }) {
  return (
    <ul className="mt-6 grid flex-1 auto-rows-fr gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <li
          key={item}
          className="flex items-center gap-3 rounded-xl border border-line bg-background px-4 py-3 transition duration-200 hover:border-brand-blue hover:bg-surface sm:last:odd:col-span-2 motion-reduce:transition-none"
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-mist text-brand-blue ring-1 ring-brand-blue/15">
            <LineIcon className="h-3.5 w-3.5">
              <path d="m5 12.5 4.5 4.5L19 7.5" strokeWidth={2.6} />
            </LineIcon>
          </span>
          <span className="text-[15px] leading-snug font-semibold text-heading">{item}</span>
        </li>
      ))}
    </ul>
  );
}
