import { Button } from "@/components/ui/Button";
import { MachineCore } from "@/components/animation/MachineCore";
import { HeroRail } from "@/components/animation/HeroRail";

export function Hero() {
  return (
    <section id="home" className="relative flex min-h-screen flex-col overflow-visible">
      {/* The machine. Procedural WebGL, fixed to the viewport so scroll can
          carry the camera into it and hand over to the sections below. */}
      <MachineCore />

      {/*
       * Legibility scrim. The core sits dead centre and its rim light is the
       * brightest thing on the page, so the copy needs its own ground — a
       * soft pool of the page colour under the left half of the frame, which
       * keeps the machinery visible around and behind the text rather than
       * dimming the whole canvas.
       *
       * It hangs past the bottom of the section and is masked away over that
       * overhang. Ending it flush with the section drew a hard horizontal
       * seam across the machine, because the gradient is still well short of
       * transparent where the hero stops.
       */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -bottom-40 -z-[5]"
        style={{
          background:
            "radial-gradient(110% 85% at 26% 46%, rgba(4,6,11,0.93) 0%, rgba(4,6,11,0.72) 38%, rgba(4,6,11,0.18) 68%, rgba(4,6,11,0) 100%)",
          maskImage:
            "linear-gradient(to bottom, #000 0%, #000 62%, rgba(0,0,0,0) 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, #000 0%, #000 62%, rgba(0,0,0,0) 100%)",
        }}
      />

      {/* Fills the gutter the page container leaves to the left of the copy. */}
      <HeroRail />

      <div className="relative z-10 flex flex-1 flex-col">
        {/*
         * Same container as every section below — 1200px, centred, inside the
         * page gutter. The hero was the one block sitting flush to the
         * viewport edge, so its heading started further left than all the
         * copy under it and the page had no consistent left margin.
         */}
        <div className="flex flex-1 flex-col justify-center px-5 pt-24 pb-10 sm:px-8 sm:pt-28 sm:pb-16">
          <div className="mx-auto w-full max-w-[1200px]">
            <p className="mb-6 flex items-center gap-2.5 font-mono text-[11px] tracking-[0.28em] text-muted uppercase sm:mb-8">
            <span
              aria-hidden="true"
              className="inline-block h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_10px_2px_rgba(92,200,232,0.55)]"
            />
              Applied AI Systems
            </p>

            <h1 className="font-display max-w-4xl text-[clamp(2.75rem,8vw,6.5rem)] leading-[1.02] font-normal tracking-[-0.024em] text-foreground">
              Put <span className="text-accent-soft">AI</span> to Work Inside Your Business
            </h1>

            <p className="mt-6 max-w-xl text-sm leading-relaxed text-hero-sub sm:text-base">
              Agents, automation and integration engineered into the systems you
              already run.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:gap-4">
              <Button href="#contact">Book an AI Workflow Consultation</Button>
              <Button href="#automation" variant="glass">
                See What We Can Automate
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
