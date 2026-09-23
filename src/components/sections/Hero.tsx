import type { ReactNode } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { TechLogo, type TechLogoSlug } from "@/components/technology/TechLogo";
import { cn } from "@/lib/utils";

// Staggered so a new ring leaves the bulb every 1.6s of the 4.8s cycle.
const RIPPLE_DELAYS = ["0s", "1.6s", "3.2s"];

// Technologies riding the two orbit rings inside the circle, in place of
// plain dots. Each ring turns at its own pace, in opposite directions.
const ORBITS: {
  inset: string;
  duration: string;
  reverse: boolean;
  border: string;
  tech: TechLogoSlug[];
}[] = [
  {
    inset: "6%",
    duration: "48s",
    reverse: false,
    border: "border-brand-blue/25",
    tech: ["react", "angular", "nodejs", "vue", "nextjs", "docker"],
  },
  {
    inset: "15%",
    duration: "36s",
    reverse: true,
    border: "border-brand-orange/30",
    tech: ["python", "laravel", "typescript", "mongodb"],
  },
];

// Short trust points under the hero copy.
const HERO_BADGES: { label: string; icon: ReactNode; iconClass: string }[] = [
  {
    label: "Custom AI Agents",
    iconClass: "text-brand-blue",
    icon: (
      <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4" fill="currentColor">
        <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1Zm3.2 5.2-3.8 3.9a.75.75 0 0 1-1.07 0L4.8 8.6a.75.75 0 1 1 1.06-1.06l1 1 3.27-3.4a.75.75 0 1 1 1.07 1.06Z" />
      </svg>
    ),
  },
  {
    label: "Works With Your Existing Tools",
    iconClass: "text-brand-orange",
    icon: (
      <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4" fill="currentColor">
        <path d="m8 1.2 1.9 4 4.4.5-3.3 3 .9 4.3L8 10.8 4.1 13l.9-4.3-3.3-3 4.4-.5Z" />
      </svg>
    ),
  },
  {
    label: "Offices in USA & India",
    iconClass: "text-brand-blue",
    icon: (
      <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <circle cx="8" cy="8" r="6.25" />
        <path d="M1.75 8h12.5M8 1.75c1.8 1.7 2.7 3.8 2.7 6.25S9.8 12.55 8 14.25C6.2 12.55 5.3 10.45 5.3 8S6.2 3.45 8 1.75Z" />
      </svg>
    ),
  },
];

export function Hero() {
  return (
    <section id="home" className="bg-mesh overflow-x-clip">
      <div className="container-site grid items-center gap-12 py-14 sm:py-20 lg:grid-cols-[1.2fr_1fr] lg:gap-10 lg:py-24">
        <div>
          {/* Two lines on desktop — "Put AI to Work" / "Inside Your Business" —
              so "Business" never ends up alone on a third line. */}
          <h1 className="font-display text-[clamp(2.1rem,1.3rem+2.6vw,3.25rem)] font-bold leading-[1.12] text-heading">
            Put <span className="text-gradient">AI</span> to Work{" "}
            <span className="lg:block lg:whitespace-nowrap">Inside Your Business</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-body sm:text-lg">
            Skyllect builds AI agents, automation systems, and custom software that connect with
            your existing tools, data, and workflows.
          </p>

          <ul className="mt-6 inline-flex flex-wrap items-center gap-x-5 gap-y-2 rounded-2xl border border-line bg-surface/70 px-5 py-3 xl:rounded-full">
            {HERO_BADGES.map((badge) => (
              <li
                key={badge.label}
                className="flex items-center gap-2 text-sm font-semibold text-brand-blue"
              >
                <span className={badge.iconClass}>{badge.icon}</span>
                {badge.label}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
            <Button href="#contact">Book an AI Workflow Consultation</Button>
            <Button href="#automation" variant="secondary">
              See What We Can Automate
            </Button>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          {/* The bulb and its orbits on a soft filled circle, without a border ring. */}
          <div className="relative flex aspect-square w-[min(500px,80vw)] items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-peach to-[#e3edff] shadow-[0_30px_60px_-30px_rgba(15,27,51,0.25)]">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
              {RIPPLE_DELAYS.map((delay) => (
                <span
                  key={delay}
                  className="bulb-ripple absolute inset-[4%] rounded-full border-2 border-brand-blue/30"
                  style={{ ["--delay" as string]: delay }}
                />
              ))}
              <span className="bulb-shine absolute -top-1/4 left-0 h-[150%] w-1/4 bg-gradient-to-r from-transparent via-white/45 to-transparent" />
            </div>

            <Image
              src="/images/bulb.png"
              alt=""
              width={202}
              height={270}
              priority
              className="relative h-auto w-[40%]"
            />

            {/* Technology logos riding the orbit rings, in front of the bulb
                so none of them ever pass behind it. */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
              {ORBITS.map((orbit) => (
                <span
                  key={orbit.inset}
                  className={cn(
                    "bulb-orbit absolute rounded-full border border-dashed",
                    orbit.border,
                    orbit.reverse && "bulb-orbit--reverse",
                  )}
                  style={{ inset: orbit.inset, ["--duration" as string]: orbit.duration }}
                >
                  {orbit.tech.map((slug, i) => {
                    const angle = (i / orbit.tech.length) * 2 * Math.PI - Math.PI / 2;
                    return (
                      <span
                        key={slug}
                        className="absolute -translate-x-1/2 -translate-y-1/2"
                        style={{
                          left: `${50 + 50 * Math.cos(angle)}%`,
                          top: `${50 + 50 * Math.sin(angle)}%`,
                        }}
                      >
                        {/* Counter-rotates against its ring so the logo stays upright. */}
                        <span
                          className={cn("bulb-orbit block", !orbit.reverse && "bulb-orbit--reverse")}
                          style={{ ["--duration" as string]: orbit.duration }}
                        >
                          <TechLogo slug={slug} className="tech-glow h-6 w-6 sm:h-8 sm:w-8" />
                        </span>
                      </span>
                    );
                  })}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
