import type { Metadata } from "next";
import Image from "next/image";
import { ContactForm } from "@/components/contact/ContactForm";
import { SOCIAL_LINKS } from "@/components/layout/Footer";
import { LineIcon } from "@/components/ui/FeatureCards";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Book an AI Workflow Consultation — Skyllect",
  description:
    "Tell us which workflows slow your team down. Skyllect will map where AI agents and automation can save time, then help you build it.",
};

const CONTACT_DETAILS = [
  {
    label: "Email",
    value: "info@skyllect.com",
    href: "mailto:info@skyllect.com",
    icon: (
      <LineIcon>
        <rect x="3" y="5" width="18" height="14" rx="2.5" />
        <path d="m4 7 8 6 8-6" />
      </LineIcon>
    ),
  },
  {
    label: "Phone",
    value: "+91 90997 81144",
    href: "tel:+919099781144",
    icon: (
      <LineIcon>
        <path d="M5 4h3.5l1.8 4.5-2.3 1.4a11 11 0 0 0 6.1 6.1l1.4-2.3L20 15.5V19a1.5 1.5 0 0 1-1.6 1.5A16.5 16.5 0 0 1 3.5 5.6 1.5 1.5 0 0 1 5 4Z" />
      </LineIcon>
    ),
  },
  {
    label: "USA office",
    value: "5425 Capay Valley Ln, Antioch CA 94531",
    href: "https://maps.google.com/?q=5425+Capay+Valley+Ln,+Antioch,+CA+94531",
    icon: (
      <LineIcon>
        <path d="M12 21s-6.5-6.2-6.5-11.2a6.5 6.5 0 0 1 13 0C18.5 14.8 12 21 12 21Z" />
        <circle cx="12" cy="9.8" r="2.4" />
      </LineIcon>
    ),
  },
  {
    label: "India office",
    value: "339 Golden Square, Mota Varachha, Surat 394101, Gujarat",
    href: "https://maps.google.com/?q=339+Golden+Square,+Mota+Varachha,+Surat+394101,+Gujarat,+India",
    icon: (
      <LineIcon>
        <path d="M12 21s-6.5-6.2-6.5-11.2a6.5 6.5 0 0 1 13 0C18.5 14.8 12 21 12 21Z" />
        <circle cx="12" cy="9.8" r="2.4" />
      </LineIcon>
    ),
  },
];

// What happens after someone gets in touch.
const NEXT_STEPS = [
  { title: "We review your request", text: "A solutions engineer reads it and replies within one business day." },
  { title: "Workflow discovery call", text: "A 30-minute call to understand the process you want to automate." },
  { title: "Your automation roadmap", text: "A practical plan showing where AI saves the most time first." },
];

export default function ContactPage() {
  return (
    <>
      {/* Intro with the illustration. */}
      <section className="bg-mesh overflow-x-clip">
        <div className="container-site grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
          <Reveal>
            <p className="mb-4 inline-flex rounded-full bg-mist px-3.5 py-1 text-xs font-bold uppercase tracking-[0.18em] text-brand-blue">
              Contact us
            </p>
            <h1 className="font-display text-[clamp(2.1rem,1.3rem+2.6vw,3.25rem)] font-bold leading-[1.12] text-heading">
              Book an <span className="text-gradient">AI Workflow</span> Consultation
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-body sm:text-lg">
              Tell us which processes slow your team down. We&apos;ll show you where AI agents and
              automation can save time — working with the tools you already use.
            </p>

            <ul className="mt-8 flex flex-col gap-4">
              {NEXT_STEPS.map((step, i) => (
                <li key={step.title} className="flex gap-4">
                  <span className="card-header-strong flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-heading">{step.title}</p>
                    <p className="mt-0.5 text-[15px] text-body">{step.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal className="flex justify-center">
            <Image
              src="/images/contact-robot.png"
              alt="A friendly Skyllect AI assistant beside a laptop, surrounded by contact channels"
              width={1478}
              height={895}
              priority
              sizes="(max-width: 1024px) 90vw, 640px"
              className="h-auto w-full max-w-[640px]"
            />
          </Reveal>
        </div>
      </section>

      {/* Contact details and the form. */}
      <section className="py-16 sm:py-20">
        <div className="container-site grid gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.6fr)]">
          <Reveal>
            <aside className="card-header-strong flex h-full flex-col rounded-[1.5rem] p-7 text-white sm:p-9">
              <h2 className="font-display text-2xl font-bold">Get in touch</h2>
              <p className="mt-2 text-[15px] leading-relaxed text-white/85">
                Prefer to reach us directly? Our working hours are 10:00 – 19:00.
              </p>

              <ul className="mt-8 flex flex-col gap-5">
                {CONTACT_DETAILS.map((detail) => (
                  <li key={detail.label}>
                    <a
                      href={detail.href}
                      target={detail.href.startsWith("http") ? "_blank" : undefined}
                      rel={detail.href.startsWith("http") ? "noreferrer" : undefined}
                      className="group flex gap-4"
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15 transition-colors duration-200 group-hover:bg-white/25">
                        {detail.icon}
                      </span>
                      <span>
                        <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-white/70">
                          {detail.label}
                        </span>
                        <span className="mt-0.5 block text-[15px] leading-snug font-medium group-hover:underline">
                          {detail.value}
                        </span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-8">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/70">Follow us</p>
                <ul className="mt-3 flex gap-3">
                  {SOCIAL_LINKS.map((social) => (
                    <li key={social.label}>
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Skyllect on ${social.label}`}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 transition-colors duration-200 hover:bg-white hover:text-brand-blue"
                      >
                        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-[18px] w-[18px]">
                          {social.icon}
                        </svg>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </Reveal>

          <Reveal>
            <div className="card h-full p-7 sm:p-9">
              <h2 className="font-display text-2xl font-bold text-heading">Tell us about your business</h2>
              <p className="mt-2 mb-7 text-[15px] text-body">
                A few details help us come prepared. Fields marked <span className="text-brand-orange">*</span> are required.
              </p>
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
