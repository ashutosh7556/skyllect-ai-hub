import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Tick } from "@/components/ui/Tick";

const CONNECTED_SYSTEMS = [
  "CRM",
  "ERP",
  "Email",
  "WhatsApp",
  "Inventory",
  "Accounting software",
  "Internal databases",
  "Customer portals",
  "Third-party APIs",
];

const CAPABILITIES = [
  "Read incoming emails and enquiries",
  "Understand PDFs, invoices, purchase orders, and documents",
  "Check inventory and order status",
  "Generate quotations",
  "Update CRM and ERP systems",
  "Follow up with customers",
  "Track shipments",
  "Detect operational issues",
  "Prepare reports",
  "Recommend actions",
  "Escalate important decisions to your team",
];

export function SystemsIntegration() {
  return (
    <Section muted>
      <SectionHeading
        eyebrow="Beyond chat"
        title="AI That Works With Your Real Business Systems"
        description={
          <>
            Most AI tools stop at answering questions.{" "}
            <span className="font-bold text-heading">We go further.</span> Skyllect connects AI
            with the systems your business already uses.
          </>
        }
      />

      <div className="mt-10 grid gap-5 sm:mt-14 lg:grid-cols-[1fr_1.4fr] lg:gap-6">
        <div className="card flex flex-col p-6 sm:p-8">
          <h3 className="font-display text-xl font-bold text-heading sm:text-2xl">
            Connected systems
          </h3>
          {/* Equal-height tiles that stretch to fill the card, however tall
              its neighbour makes it. */}
          <ul className="mt-6 grid flex-1 auto-rows-fr grid-cols-2 gap-3 sm:grid-cols-3">
            {CONNECTED_SYSTEMS.map((system) => (
              <li
                key={system}
                className="flex items-center justify-center rounded-xl border border-[#ffd6b8] bg-peach px-3 py-3 text-center text-[15px] font-bold leading-snug text-[#c2560c] sm:text-base"
              >
                {system}
              </li>
            ))}
          </ul>
        </div>

        <div className="card p-6 sm:p-8">
          <h3 className="font-display text-xl font-bold text-heading sm:text-2xl">Your AI can</h3>
          {/* Flowing columns rather than a grid, so a two-line item does not
              leave a gap beside its shorter neighbour. */}
          <ul className="mt-6 columns-1 gap-x-8 sm:columns-2">
            {CAPABILITIES.map((capability) => (
              <li
                key={capability}
                className="mb-4 flex break-inside-avoid items-start gap-3 text-[15px] font-bold leading-snug text-heading sm:text-base"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-peach">
                  <Tick className="mt-0 h-3 w-3" />
                </span>
                <span className="pt-0.5">{capability}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="font-display mt-10 max-w-2xl text-xl font-bold leading-snug text-brand-blue sm:mt-14 sm:text-2xl">
        Your employees remain in control while AI handles repetitive operational work.
      </p>
    </Section>
  );
}
