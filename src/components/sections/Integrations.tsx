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

// A topic only shows a taste of each list — the rest lives behind View More.
const PREVIEW_COUNT = 5;

/**
 * One topic on the shared stage. It owns no animation of its own: the stage
 * fades it in and out, and the gateway behind it is the stage's.
 */
export function Integrations() {
  return (
    <section id="integrations" className="w-full px-5 py-8 sm:px-8 sm:py-10">
      {/* Held to the left half so the gateway behind has the other. */}
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="AI integrations"
          title={
            <>
              Already using software that works well?
              <br />
              <span className="text-muted">You don&apos;t need to replace it.</span>
            </>
          }
          description="We integrate AI into your existing technology stack. AI becomes an intelligent layer across your existing systems."
          className="max-w-2xl"
        />

        <ul className="mt-6 flex max-w-2xl flex-wrap gap-2 sm:mt-10 sm:gap-3">
          {SYSTEMS.slice(0, PREVIEW_COUNT).map((system) => (
            <li
              key={system}
              className="rounded-full border border-edge px-3 py-1.5 text-xs text-hero-sub sm:px-4 sm:py-2 sm:text-sm"
            >
              {system}
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap gap-3 sm:mt-10">
          <Button href="#contact">Discuss an Integration</Button>
          <Button href="" variant="secondary">
            View More
          </Button>
        </div>
      </div>
    </section>
  );
}
