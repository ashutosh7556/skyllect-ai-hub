import type { Metadata } from "next";
import Image from "next/image";
import { ContactForm } from "@/components/contact/ContactForm";
import { SOCIAL_LINKS } from "@/components/layout/Footer";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Book an AI Workflow Consultation — Skyllect",
  description:
    "Tell us which workflows slow your team down. Skyllect will map where AI agents and automation can save time, then help you build it.",
};

const CONTACT_DETAILS = [
  {
    label: "Surat, Gujarat 394101",
    href: "https://maps.google.com/?q=339+Golden+Square,+Mota+Varachha,+Surat+394101,+Gujarat,+India",
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
        <path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
      </svg>
    ),
  },
  {
    label: "+91 90997 81144",
    href: "tel:+919099781144",
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
        <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1l-2.2 2.23Z" />
      </svg>
    ),
  },
  {
    label: "info@skyllect.com",
    href: "mailto:info@skyllect.com",
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
        <path d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm9 7.2L4 7.1V8l8 5.1L20 8v-.9l-8 5.1Z" />
      </svg>
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

      {/* Contact card overlapping a large form panel, as in the reference. */}
      <section className="contact-grid-bg relative py-16 sm:py-24">
        <div className="container-site relative">
          <Reveal>
            <div className="relative flex flex-col-reverse gap-6 lg:block lg:pl-[240px]">
              {/* The form panel: a deep-to-light blue wash with a soft grid. */}
              <div className="contact-panel relative overflow-hidden rounded-[2rem] px-6 pt-8 pb-10 sm:px-10 lg:py-12 lg:pr-14 lg:pl-[150px]">
                <div className="relative mx-auto max-w-2xl lg:mx-0">
                  <ContactForm />
                </div>
              </div>

              {/* The blue contact card, overlapping the panel's left edge on desktop. */}
              <aside className="relative rounded-[1.5rem] border-[6px] border-[#1d5fa8] bg-[linear-gradient(180deg,#3f7fbf_0%,#2466ad_55%,#1a5ca3_100%)] p-6 text-white shadow-[0_24px_48px_-24px_rgba(15,27,51,0.55)] lg:absolute lg:top-1/2 lg:left-0 lg:w-[300px] lg:-translate-y-1/2">
                <h2 className="font-display text-[34px] leading-tight font-medium">Contact Us</h2>
                <ul className="mt-6 flex flex-col gap-5 pl-4">
                  {CONTACT_DETAILS.map((detail) => (
                    <li key={detail.label}>
                      <a
                        href={detail.href}
                        target={detail.href.startsWith("http") ? "_blank" : undefined}
                        rel={detail.href.startsWith("http") ? "noreferrer" : undefined}
                        className="flex items-center gap-3 text-[17px] text-white/85 hover:text-white"
                      >
                        <span className="text-white/80">{detail.icon}</span>
                        {detail.label}
                      </a>
                    </li>
                  ))}
                </ul>
                <ul className="mt-7 flex gap-3">
                  {SOCIAL_LINKS.map((social) => (
                    <li key={social.label}>
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Skyllect on ${social.label}`}
                        className="flex h-9 w-9 items-center justify-center rounded-md bg-white/20 text-white/90 transition-colors duration-200 hover:bg-white hover:text-brand-blue"
                      >
                        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-[18px] w-[18px]">
                          {social.icon}
                        </svg>
                      </a>
                    </li>
                  ))}
                </ul>
              </aside>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
