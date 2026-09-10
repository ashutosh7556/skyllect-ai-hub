"use client";

import { useState } from "react";
import { SectionShell } from "@/components/technology/SectionShell";
import { cn } from "@/lib/utils";
import type { TechnologyPageContent } from "@/types";

/**
 * FAQ accordion. Built on a real <button> per row with aria-expanded and a
 * linked region, so it is operable by keyboard and announced correctly —
 * details/summary would be simpler but gives no control over the open
 * transition and behaves inconsistently with the site's motion.
 */
export function TechFaq({
  content,
  muted,
}: {
  content: TechnologyPageContent;
  muted?: boolean;
}) {
  const { faq } = content;
  const [open, setOpen] = useState<string | null>(faq.items[0]?.question ?? null);

  return (
    <SectionShell
      muted={muted}
      heading={faq.heading}
      accent={faq.accent}
      description={faq.description}
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-2.5">
        {faq.items.map((item, i) => {
          const isOpen = open === item.question;
          const panelId = `faq-panel-${i}`;
          const buttonId = `faq-button-${i}`;

          return (
            <div
              key={item.question}
              className={cn(
                "rounded-2xl border transition-colors duration-300",
                isOpen
                  ? "border-white/20 bg-white/[0.05]"
                  : "border-white/10 bg-white/[0.02] hover:border-white/15",
              )}
            >
              <h3>
                <button
                  type="button"
                  id={buttonId}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpen(isOpen ? null : item.question)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6 sm:py-5"
                >
                  <span className="text-sm font-medium text-white sm:text-base">
                    {item.question}
                  </span>
                  <span
                    aria-hidden="true"
                    className="relative flex h-5 w-5 shrink-0 items-center justify-center"
                  >
                    <span className="absolute h-px w-3.5 bg-white/60" />
                    <span
                      className={cn(
                        "absolute h-3.5 w-px bg-white/60 transition-transform duration-300",
                        isOpen && "scale-y-0",
                      )}
                    />
                  </span>
                </button>
              </h3>

              {isOpen ? (
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className="px-5 pb-5 sm:px-6 sm:pb-6"
                >
                  <p className="text-sm leading-relaxed text-white/60">{item.answer}</p>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </SectionShell>
  );
}
