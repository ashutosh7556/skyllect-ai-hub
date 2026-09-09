import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";

const QUESTIONS = [
  "What customer orders are delayed?",
  "Which quotations haven't received a response?",
  "Which customers have overdue invoices?",
  "What materials should we purchase this week?",
  "Which shipments require attention?",
  "Which leads should sales contact today?",
];

// A leaf only shows a taste of each list — the rest lives behind View More.
const PREVIEW_COUNT = 4;

export function OneAiLayer() {
  return (
    <section className="w-full px-5 py-8 sm:px-8 sm:py-10">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="One assistant" title="One AI Layer Across Your Business" />

        <div className="mt-6 grid gap-2 sm:mt-16 sm:grid-cols-2 sm:gap-3">
          {QUESTIONS.slice(0, PREVIEW_COUNT).map((question) => (
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

        <Button href="" variant="secondary" className="mt-5 sm:mt-8">
          View More
        </Button>
      </div>
    </section>
  );
}
