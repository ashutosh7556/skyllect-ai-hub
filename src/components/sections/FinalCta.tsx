import { Button } from "@/components/ui/Button";

export function FinalCta() {
  return (
    <section className="px-6 py-32">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-4xl font-medium leading-[1.1] tracking-tight text-white md:text-6xl">
          The Future Isn&apos;t AI Replacing Your Business.
          <br />
          <span className="text-white/50">It&apos;s AI Working Inside Your Business.</span>
        </h2>

        <p className="mx-auto mt-6 max-w-xl text-white/60">
          Let Skyllect help you identify where AI can save time, reduce manual work,
          and improve operational efficiency.
        </p>

        <Button href="#contact" className="mt-10">
          Book an AI Workflow Consultation
        </Button>

        <p className="mt-6 text-sm text-white/40">
          No obligation. We&apos;ll start by understanding your business and
          identifying the workflows worth automating.
        </p>
      </div>
    </section>
  );
}
