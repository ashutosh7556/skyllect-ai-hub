import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { PERMISSION_ACTIONS } from "@/data/permissions";
import { cn } from "@/lib/utils";
import type { PermissionLevel } from "@/types";

const LEVEL_LABEL: Record<PermissionLevel, string> = {
  automatic: "Automatic",
  approval: "Approval Required",
  restricted: "Restricted",
};

const LEVEL_STYLE: Record<PermissionLevel, string> = {
  automatic: "border-white/20 text-white/80",
  approval: "border-white/10 text-white/60",
  restricted: "border-white/5 text-white/30",
};

// A leaf only shows a taste of each list — the rest lives behind View More.
const PREVIEW_COUNT = 3;

export function HumanControlledAi() {
  const levels: PermissionLevel[] = ["automatic", "approval", "restricted"];

  return (
    <section className="w-full px-5 py-8 sm:px-8 sm:py-10">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Human-controlled AI"
          title="AI should automate work without removing control."
          description="Your team controls what AI can see, what it can do, and when approval is required."
        />

        <div className="mt-6 grid gap-3 sm:mt-16 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {levels.map((level) => (
            <div key={level} className="rounded-2xl border border-white/10 p-4 sm:rounded-3xl sm:p-6">
              <h3 className="text-base font-medium text-white sm:text-lg">{LEVEL_LABEL[level]}</h3>
              <ul className="mt-3 flex flex-col gap-1.5 sm:mt-4 sm:gap-2">
                {PERMISSION_ACTIONS.filter((action) => action.level === level)
                  .slice(0, PREVIEW_COUNT)
                  .map((action) => (
                    <li
                      key={action.label}
                      className={cn(
                        "rounded-full border px-3 py-1 text-xs sm:py-1.5 sm:text-sm",
                        LEVEL_STYLE[level],
                      )}
                    >
                      {action.label}
                    </li>
                  ))}
                {level === "restricted" ? (
                  <li className="text-xs text-white/30 sm:text-sm">
                    Sensitive actions remain unavailable to AI unless specifically
                    authorized.
                  </li>
                ) : null}
              </ul>
            </div>
          ))}
        </div>

        <Button href="" variant="secondary" className="mt-5 sm:mt-8">
          View More
        </Button>
      </div>
    </section>
  );
}
