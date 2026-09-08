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
    <section id="integrations" className="px-6 py-28">
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

        <ul className="mt-10 flex flex-wrap gap-3">
          {SYSTEMS.map((system) => (
            <li
              key={system}
              className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/70"
            >
              {system}
            </li>
          ))}
        </ul>

        <Button href="#contact" className="mt-10">
          Discuss an Integration
        </Button>
      </div>
    </section>
  );
}
