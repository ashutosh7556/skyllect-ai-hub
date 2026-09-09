import { Button } from "@/components/ui/Button";

export function FinalCta() {
  return (
    <section className="px-5 py-20 sm:px-6 sm:py-32">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-2xl font-medium leading-[1.15] tracking-tight text-white sm:text-4xl sm:leading-[1.1] md:text-6xl">
          The Future Isn&apos;t AI Replacing Your Business.
          <br />
          <span className="text-white/50">It&apos;s AI Working Inside Your Business.</span>
        </h2>

        <p className="mx-auto mt-4 max-w-xl text-sm text-white/60 sm:mt-6 sm:text-base">
          Let Skyllect help you identify where AI can save time, reduce manual work,
          and improve operational efficiency.
        </p>

        <Button href="#contact" className="mt-7 sm:mt-10">
          Book an AI Workflow Consultation
        </Button>

        <p className="mt-5 text-xs text-white/40 sm:mt-6 sm:text-sm">
          No obligation. We&apos;ll start by understanding your business and
          identifying the workflows worth automating.
        </p>
      </div>
    </section>
  );
}
