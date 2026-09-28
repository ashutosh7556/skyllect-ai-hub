import type { ReactNode } from "react";
import { siWhatsapp } from "simple-icons";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  CardTitle,
  CheckRowList,
  FeatureCard,
  IconTileGrid,
  LineIcon,
} from "@/components/ui/FeatureCards";

const CONNECTED_SYSTEMS: { label: string; icon: ReactNode }[] = [
  {
    label: "CRM",
    icon: (
      <LineIcon>
        <circle cx="9" cy="8" r="3.2" />
        <path d="M3.5 19c.6-3 2.9-4.8 5.5-4.8s4.9 1.8 5.5 4.8M15.5 5.3a3 3 0 0 1 0 5.6M17.5 14.6c1.6.6 2.7 2.1 3 4.4" />
      </LineIcon>
    ),
  },
  {
    label: "ERP",
    icon: (
      <LineIcon>
        <path d="M12 3 3 7.5l9 4.5 9-4.5L12 3ZM3 12l9 4.5 9-4.5M3 16.5 12 21l9-4.5" />
      </LineIcon>
    ),
  },
  {
    label: "Email",
    icon: (
      <LineIcon>
        <rect x="3" y="5" width="18" height="14" rx="2.5" />
        <path d="m4 7 8 6 8-6" />
      </LineIcon>
    ),
  },
  {
    label: "WhatsApp",
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill={`#${siWhatsapp.hex}`}>
        <path d={siWhatsapp.path} />
      </svg>
    ),
  },
  {
    label: "Inventory",
    icon: (
      <LineIcon>
        <path d="M3.5 7.5 12 3l8.5 4.5v9L12 21l-8.5-4.5v-9ZM3.5 7.5 12 12l8.5-4.5M12 12v9" />
      </LineIcon>
    ),
  },
  {
    label: "Accounting software",
    icon: (
      <LineIcon>
        <rect x="5" y="3" width="14" height="18" rx="2" />
        <rect x="8" y="6" width="8" height="3.5" rx="0.8" />
        <path d="M8.5 13h.01M12 13h.01M15.5 13h.01M8.5 16.5h.01M12 16.5h.01M15.5 16.5h.01" strokeWidth={2.4} />
      </LineIcon>
    ),
  },
  {
    label: "Internal databases",
    icon: (
      <LineIcon>
        <ellipse cx="12" cy="5.5" rx="7.5" ry="2.8" />
        <path d="M4.5 5.5v6c0 1.5 3.4 2.8 7.5 2.8s7.5-1.3 7.5-2.8v-6M4.5 11.5v6c0 1.5 3.4 2.8 7.5 2.8s7.5-1.3 7.5-2.8v-6" />
      </LineIcon>
    ),
  },
  {
    label: "Customer portals",
    icon: (
      <LineIcon>
        <rect x="3" y="4.5" width="18" height="15" rx="2.5" />
        <path d="M3 9h18M6.5 6.8h.01M9 6.8h.01" />
      </LineIcon>
    ),
  },
  {
    label: "Third-party APIs",
    icon: (
      <LineIcon>
        <path d="m8.5 8-4 4 4 4M15.5 8l4 4-4 4M13.5 6l-3 12" />
      </LineIcon>
    ),
  },
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
    <section className="relative isolate overflow-hidden py-16 sm:py-20">
      {/* Background: the circuit video, colour-inverted to suit the light page,
          under a light blue overlay so the content stays easy to read. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <video
          className="systems-bg-video absolute inset-0 h-full w-full object-cover"
          src="/videos/systems-bg.mp4"
          poster="/images/systems-bg-poster.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(234,241,255,0.84)_0%,rgba(246,248,253,0.76)_50%,rgba(227,237,255,0.84)_100%)]" />
      </div>

      <div className="container-site">
        <SectionHeading
          title="AI That Works With Your Real Business Systems"
          description={
            <>
              Most AI tools stop at answering questions.{" "}
              <span className="font-bold text-heading">We go further.</span> Skyllect connects AI
              with the systems your business already uses.
            </>
          }
        />

        <div className="mt-10 grid gap-5 sm:mt-14 lg:grid-cols-[1fr_1.35fr] lg:gap-6">
          <FeatureCard>
            <CardTitle
              icon={
                <LineIcon>
                  <path d="M9 3v4M15 3v4M7 7h10v4a5 5 0 0 1-10 0V7ZM12 16v5" />
                </LineIcon>
              }
            >
              Connected systems
            </CardTitle>

            <IconTileGrid items={CONNECTED_SYSTEMS} />
          </FeatureCard>

          <FeatureCard>
            <CardTitle
              icon={
                <LineIcon>
                  <path d="M12 3.5 13.8 8.2 18.5 10l-4.7 1.8L12 16.5l-1.8-4.7L5.5 10l4.7-1.8L12 3.5ZM18.5 16l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8.8-2Z" />
                </LineIcon>
              }
            >
              Your AI can
            </CardTitle>

            <CheckRowList items={CAPABILITIES} />
          </FeatureCard>
        </div>

        <p className="font-display mt-10 max-w-2xl text-xl font-bold leading-snug text-brand-blue sm:mt-14 sm:text-2xl">
          Your employees remain in control while AI handles repetitive operational work.
        </p>
      </div>
    </section>
  );
}
