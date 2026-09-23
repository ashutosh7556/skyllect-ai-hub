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
        <div className="card p-6 sm:p-8">
          <h3 className="font-display text-lg font-bold text-heading sm:text-xl">
            Connected systems
          </h3>
          <ul className="mt-5 flex flex-wrap gap-2 sm:gap-3">
            {CONNECTED_SYSTEMS.map((system) => (
              <li key={system} className="chip px-4 py-2 text-sm">
                {system}
              </li>
            ))}
          </ul>
        </div>

        <div className="card p-6 sm:p-8">
          <h3 className="font-display text-lg font-bold text-heading sm:text-xl">Your AI can</h3>
          <ul className="mt-5 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
            {CAPABILITIES.map((capability) => (
              <li key={capability} className="flex gap-2.5 text-[15px] leading-relaxed text-body">
                <Tick />
                {capability}
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
