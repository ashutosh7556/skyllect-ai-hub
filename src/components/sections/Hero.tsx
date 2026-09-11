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

      {/*
       * Headline legibility scrim. This used to be a 984px circle centred in
       * the hero, which sat right on the fingertip contact and the holographic
       * rings of the hero clip and read as a black blob. Anchored to the left
       * instead, so it only darkens what actually sits behind the text.
       */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 -z-10 w-[min(920px,88vw)] bg-[radial-gradient(ellipse_at_left_center,rgba(4,0,14,0.94)_0%,rgba(4,0,14,0.6)_45%,transparent_78%)]"
      />

      {/* Lifts the near-black midpoint where the two hands meet. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[46%] left-[52%] -z-10 h-[min(680px,72vw)] w-[min(680px,72vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(151,106,255,0.22)_0%,rgba(99,102,241,0.11)_45%,transparent_70%)] blur-[64px]"
      />

      <div className="relative z-10 flex flex-1 flex-col">
        <div className="flex flex-1 flex-col justify-center px-6 pt-24 pb-10 sm:px-8 sm:pt-28 sm:pb-16">

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
          <div className="mt-7 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:gap-4">
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
