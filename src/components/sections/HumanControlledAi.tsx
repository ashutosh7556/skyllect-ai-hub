import { SectionHeading } from "@/components/ui/SectionHeading";
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

export function HumanControlledAi() {
  const levels: PermissionLevel[] = ["automatic", "approval", "restricted"];

  return (
    <section className="px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Human-controlled AI"
          title="AI should automate work without removing control."
          description="Your team controls what AI can see, what it can do, and when approval is required."
        />

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {levels.map((level) => (
            <div key={level} className="rounded-3xl border border-white/10 p-6">
              <h3 className="text-lg font-medium text-white">{LEVEL_LABEL[level]}</h3>
              <ul className="mt-4 flex flex-col gap-2">
                {PERMISSION_ACTIONS.filter((action) => action.level === level).map(
                  (action) => (
                    <li
                      key={action.label}
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-sm",
                        LEVEL_STYLE[level],
                      )}
                    >
                      {action.label}
                    </li>
                  ),
                )}
                {level === "restricted" ? (
                  <li className="text-sm text-white/30">
                    Sensitive actions remain unavailable to AI unless specifically
                    authorized.
                  </li>
                ) : null}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
