import { SectionShell } from "@/components/technology/SectionShell";
import type { TechnologyPageContent } from "@/types";

/** Client quotes. Attributed by role rather than name, as agreed with clients. */
export function TechTestimonials({
  content,
  muted,
}: {
  content: TechnologyPageContent;
  muted?: boolean;
}) {
  const { testimonials } = content;

  return (
    <SectionShell
      muted={muted}
      heading={testimonials.heading}
      accent={testimonials.accent}
      description={testimonials.description}
    >
      <div className="grid gap-4 lg:grid-cols-3 lg:gap-5">
        {testimonials.items.map((item) => (
          <figure
            key={item.author + item.role}
            className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:rounded-3xl sm:p-6"
          >
            <span
              aria-hidden="true"
              className="font-display text-4xl leading-none text-white/15"
            >
              &ldquo;
            </span>
            <blockquote className="mt-2 text-sm leading-relaxed text-white/70 sm:text-base">
              {item.quote}
            </blockquote>
            <figcaption className="mt-auto pt-6">
              <span className="block text-sm font-medium text-white">{item.author}</span>
              <span className="mt-0.5 block text-xs text-white/45">{item.role}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </SectionShell>
  );
}
