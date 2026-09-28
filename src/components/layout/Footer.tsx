import Link from "next/link";
import { FOOTER_LINKS } from "@/data/navigation";
import { Logo } from "@/components/layout/Logo";

const SERVICE_LINKS = [
  "AI Automation",
  "AI Agents",
  "AI Integrations",
  "AI SaaS Development",
  "Legacy Software Modernization",
];

// Skyllect's profiles, as linked from skyllect.com.
export const SOCIAL_LINKS: { label: string; href: string; icon: React.ReactNode }[] = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/skyllect",
    icon: (
      <path d="M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2.3H8v3h2.5V21h3Z" fill="currentColor" />
    ),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/skyllect/",
    icon: (
      <>
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" fill="none" stroke="currentColor" strokeWidth={1.8} />
        <circle cx="12" cy="12" r="3.8" fill="none" stroke="currentColor" strokeWidth={1.8} />
        <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
      </>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/skyllect/",
    icon: (
      <path d="M6.94 8.5H3.56V20h3.38V8.5ZM5.25 3a1.97 1.97 0 1 0 0 3.94 1.97 1.97 0 0 0 0-3.94ZM20.44 13.2c0-3.1-1.66-4.95-4.28-4.95-1.5 0-2.52.82-2.93 1.6V8.5H9.9V20h3.37v-6.02c0-1.44.63-2.5 2.03-2.5 1.33 0 1.77.95 1.77 2.44V20h3.37v-6.8Z" fill="currentColor" />
    ),
  },
];

function Arrow() {
  return (
    <svg aria-hidden="true" viewBox="0 0 12 12" className="h-3 w-3 shrink-0 text-brand-orange" fill="currentColor">
      <path d="M6.5 1.5 11 6l-4.5 4.5V7.4H1V4.6h5.5z" />
    </svg>
  );
}

function FooterTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="font-display mb-5 text-lg font-semibold text-heading sm:text-xl">{children}</h2>;
}

export function Footer() {
  return (
    <footer id="contact" className="border-t border-line bg-surface pt-12 text-body sm:pt-16">
      {/* Brand and the three link columns share one row. */}
      <div className="container-site grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.1fr_1.3fr_1.1fr_1.2fr] lg:gap-8">
        <div className="max-w-xs">
          <Link href="/" className="inline-flex items-center">
            <Logo height={46} />
          </Link>
          <p className="mt-4 text-[15px] leading-relaxed text-body">
            Engineering AI into real business operations.
          </p>

          <ul className="mt-6 flex items-center gap-3">
            {SOCIAL_LINKS.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Skyllect on ${social.label}`}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-band text-brand-blue transition duration-200 hover:border-brand-blue hover:bg-brand-blue hover:text-white motion-reduce:transition-none"
                >
                  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-[18px] w-[18px]">
                    {social.icon}
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <FooterTitle>Navigation</FooterTitle>
          <ul className="flex flex-col gap-3">
            {FOOTER_LINKS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex items-center gap-2.5 text-[15px] text-body hover:text-brand-orange lg:whitespace-nowrap"
                >
                  <Arrow />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <FooterTitle>Services</FooterTitle>
          <ul className="flex flex-col gap-3">
            {SERVICE_LINKS.map((service) => (
              <li key={service} className="flex items-center gap-2.5 text-[15px] text-body">
                <Arrow />
                {service}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <FooterTitle>Contact Us</FooterTitle>
          <ul className="flex flex-col gap-4 text-[15px] text-body">
            <li>
              <a
                href="https://maps.google.com/?q=5425+Capay+Valley+Ln,+Antioch,+CA+94531"
                target="_blank"
                rel="noreferrer"
                className="leading-relaxed hover:text-brand-orange"
              >
                <address className="not-italic">5425 Capay Valley Ln, Antioch CA 94531</address>
              </a>
            </li>
            <li>
              <a
                href="https://maps.google.com/?q=339+Golden+Square,+Mota+Varachha,+Surat+394101,+Gujarat,+India"
                target="_blank"
                rel="noreferrer"
                className="leading-relaxed hover:text-brand-orange"
              >
                <address className="not-italic">
                  339 Golden Square, Mota Varachha (Digital Valley), Surat 394101, Gujarat, India
                </address>
              </a>
            </li>
            <li>Working Hours: 10:00 – 19:00</li>
          </ul>
        </div>
      </div>

      {/* Full-width bottom bar: copyright on the left, contact email on the right. */}
      <div className="mt-12 border-t border-line bg-background sm:mt-14">
        <div className="container-site flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-sm text-muted">
            © {new Date().getFullYear()} Skyllect. All rights reserved.
          </span>
          <a
            href="mailto:info@skyllect.com"
            className="font-display inline-flex items-center gap-2 text-base font-semibold text-brand-blue hover:text-brand-orange"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="5" width="18" height="14" rx="2.5" />
              <path d="m4 7 8 6 8-6" />
            </svg>
            info@skyllect.com
          </a>
        </div>
      </div>
    </footer>
  );
}
