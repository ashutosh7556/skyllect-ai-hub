import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";

const SYSTEMS = [
  "CRM",
  "ERP",
  "E-commerce platforms",
  "Accounting software",
  "Email providers",
  "WhatsApp",
  "Customer support systems",
  "Inventory software",
  "Custom internal applications",
  "Third-party APIs",
];

export function Integrations() {
  return (
    <section id="integrations" className="w-full px-5 py-14 sm:px-6 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="AI integrations"
          title={
            <>
              Already using software that works well?
              <br />
              <span className="text-white/50">You don&apos;t need to replace it.</span>
            </>
          }
          description="We integrate AI into your existing technology stack. AI becomes an intelligent layer across your existing systems."
        />

        <ul className="mt-6 flex flex-wrap gap-2 sm:mt-10 sm:gap-3">
          {SYSTEMS.map((system) => (
            <li
              key={system}
              className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/70 sm:px-4 sm:py-2 sm:text-sm"
            >
              {system}
            </li>
          ))}
        </ul>

        <Button href="#contact" className="mt-6 sm:mt-10">
          Discuss an Integration
        </Button>
      </div>
    </section>
  );
}
