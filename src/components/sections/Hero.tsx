import { Button } from "@/components/ui/Button";
import { BackgroundVideo } from "@/components/animation/BackgroundVideo";
import { LogoMarquee } from "@/components/sections/LogoMarquee";
import { HERO_VIDEO_SRC } from "@/data/media";

export function Hero() {
  return (
    <section id="home" className="relative flex min-h-screen flex-col overflow-visible">
      <div className="absolute inset-0 -z-20 overflow-hidden">
        <BackgroundVideo
          src={HERO_VIDEO_SRC}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[527px] w-[984px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gray-950 opacity-90 blur-[82px]"
      />

      <div className="relative z-10 flex flex-1 flex-col">
        <div className="flex flex-1 flex-col justify-center px-6 pt-28 pb-16 sm:px-8">
          <p className="mb-6 text-sm font-medium uppercase tracking-[0.3em] text-foreground/50">
            Skyllect
          </p>

          <h1 className="font-display max-w-4xl text-[clamp(2.75rem,8vw,6.5rem)] font-normal leading-[1.02] tracking-[-0.024em] text-foreground">

            Put{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(to left, #6366f1, #a855f7, #fcd34d)",
              }}
            >
              AI
            </span>{" "}
            to Work Inside Your Business
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-hero-sub opacity-80 md:text-xl">
            We build AI agents, automation systems, and custom software that connect
            with your existing tools, data, and workflows.
          </p>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-hero-sub opacity-60">
            From logistics and supply operations to manufacturing, sales, customer
            support, and internal processes — Skyllect helps businesses reduce
            repetitive work, improve response times, and operate more efficiently.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button href="#contact">Book an AI Workflow Consultation</Button>
            <Button href="#automation" variant="glass">
              See What We Can Automate
            </Button>
          </div>
        </div>

        <LogoMarquee />
      </div>
    </section>
  );
}
