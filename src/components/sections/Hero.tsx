import Image from "next/image";
import { Button } from "@/components/ui/Button";

export function Hero() {
  return (
    <section id="home" className="bg-mesh">
      <div className="container-site grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-[1.15fr_1fr] lg:gap-16 lg:py-24">
        <div>
          <h1 className="font-display text-[clamp(2.1rem,1.4rem+3vw,4rem)] font-bold leading-[1.1] text-heading">
            Put <span className="text-gradient">AI</span> to Work Inside Your Business
          </h1>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
            <Button href="#contact">Book an AI Workflow Consultation</Button>
            <Button href="#automation" variant="secondary">
              See What We Can Automate
            </Button>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <div className="flex aspect-square w-[min(420px,60vw)] items-center justify-center rounded-full border-[10px] border-surface bg-gradient-to-br from-peach to-mist shadow-[0_30px_60px_-30px_rgba(15,27,51,0.25)]">
            <Image
              src="/images/bulb.png"
              alt=""
              width={202}
              height={270}
              priority
              className="h-auto w-[45%]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
