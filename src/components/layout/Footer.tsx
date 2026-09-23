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

function Arrow() {
  return (
    <svg aria-hidden="true" viewBox="0 0 12 12" className="h-3 w-3 shrink-0 text-brand-orange" fill="currentColor">
      <path d="M6.5 1.5 11 6l-4.5 4.5V7.4H1V4.6h5.5z" />
    </svg>
  );
}

function FooterTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-5 text-xl font-black text-heading sm:text-2xl">{children}</h2>;
}

export function Footer() {
  return (
    <footer id="contact" className="border-t border-line bg-surface py-12 text-body sm:py-16">
      <div className="container-site grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1.2fr] lg:gap-8">
        <div className="max-w-sm">
          <Link href="/" className="inline-flex items-center">
            <Logo height={48} />
          </Link>
          <p className="mt-4 text-[15px] leading-relaxed text-body">
            Engineering AI into real business operations.
          </p>
        </div>

        <div>
          <FooterTitle>Navigation</FooterTitle>
          <ul className="flex flex-col gap-3">
            {FOOTER_LINKS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex items-center gap-2.5 text-[15px] text-body hover:text-brand-orange"
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
            <li>
              <a href="mailto:info@skyllect.com" className="hover:text-brand-orange">
                info@skyllect.com
              </a>
            </li>
            <li>Working Hours: 10:00 – 19:00</li>
          </ul>
        </div>
      </div>

      <div className="container-site mt-10 sm:mt-14">
        <div className="border-t border-line pt-6 text-sm text-muted">
          © {new Date().getFullYear()} Skyllect. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
