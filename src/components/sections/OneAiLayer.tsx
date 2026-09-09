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
    <section className="w-full px-5 py-14 sm:px-6 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="One assistant" title="One AI Layer Across Your Business" />

        <div className="mt-6 grid gap-2 sm:mt-16 sm:grid-cols-2 sm:gap-3">
          {QUESTIONS.map((question) => (
            <p
              key={question}
              className="rounded-xl border border-white/10 p-3 text-xs text-white/70 sm:rounded-2xl sm:p-5 sm:text-base"
            >
              “{question}”
            </p>
          ))}
        </div>

        <p className="mt-6 max-w-2xl text-sm text-white/50 sm:mt-10 sm:text-base">
          Instead of opening five different systems, your team asks one intelligent
          assistant. The AI retrieves information from your actual systems and gives
          your team actionable answers.
        </p>
      </div>
    </section>
  );
}
