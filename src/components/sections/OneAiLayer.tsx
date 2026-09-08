import { SectionHeading } from "@/components/ui/SectionHeading";

const QUESTIONS = [
  "What customer orders are delayed?",
  "Which quotations haven't received a response?",
  "Which customers have overdue invoices?",
  "What materials should we purchase this week?",
  "Which shipments require attention?",
  "Which leads should sales contact today?",
];

export function OneAiLayer() {
  return (
    <section className="px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="One assistant" title="One AI Layer Across Your Business" />

        <div className="mt-16 grid gap-3 sm:grid-cols-2">
          {QUESTIONS.map((question) => (
            <p
              key={question}
              className="rounded-2xl border border-white/10 p-5 text-white/70"
            >
              “{question}”
            </p>
          ))}
        </div>

        <p className="mt-10 max-w-2xl text-white/50">
          Instead of opening five different systems, your team asks one intelligent
          assistant. The AI retrieves information from your actual systems and gives
          your team actionable answers.
        </p>
      </div>
    </section>
  );
}
