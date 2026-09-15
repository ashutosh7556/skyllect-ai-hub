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

export function Footer() {
  return (
    <footer id="contact" className="relative z-10 border-t border-edge bg-surface px-5 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 sm:gap-12 lg:flex-row lg:justify-between">
        <div className="max-w-sm">
          {/*
           * The lockup is transparent and its wordmark is brand blue/orange,
           * so it reads on the dark footer without the white chip it used to
           * sit on. It carries its own wordmark, so no text beside it.
           */}
          <Link href="/#home" className="inline-flex items-center">
            <Logo variant="full" height={40} />
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Engineering AI into real business operations.
          </p>
        </div>

        <div className="grid grow grid-cols-2 gap-6 sm:grid-cols-3 sm:gap-8 [&>div:last-child]:col-span-2 sm:[&>div:last-child]:col-span-1">
          <div>
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-muted/70">
              Navigation
            </p>
            <ul className="flex flex-col gap-1 sm:gap-3">
              {FOOTER_LINKS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-flex min-h-10 items-center text-sm text-muted transition-colors duration-200 hover:text-foreground sm:min-h-0"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-muted/70">
              Services
            </p>
            <ul className="flex flex-col gap-3">
              {SERVICE_LINKS.map((service) => (
                <li key={service} className="text-sm text-muted">
                  {service}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-muted/70">
              Contact Us
            </p>
            <ul className="flex flex-col gap-4 text-sm text-muted">
              <li>
                <a
                  href="https://maps.google.com/?q=5425+Capay+Valley+Ln,+Antioch,+CA+94531"
                  target="_blank"
                  rel="noreferrer"
                  className="not-italic leading-relaxed transition-colors duration-200 hover:text-foreground"
                >
                  <address className="not-italic">
                    5425 Capay Valley Ln, Antioch CA 94531
                  </address>
                </a>
              </li>
              <li>
                <a
                  href="https://maps.google.com/?q=339+Golden+Square,+Mota+Varachha,+Surat+394101,+Gujarat,+India"
                  target="_blank"
                  rel="noreferrer"
                  className="leading-relaxed transition-colors duration-200 hover:text-foreground"
                >
                  <address className="not-italic">
                    339 Golden Square, Mota Varachha (Digital Valley), Surat 394101,
                    Gujarat, India
                  </address>
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@skyllect.com"
                  className="transition-colors duration-200 hover:text-foreground"
                >
                  info@skyllect.com
                </a>
              </li>
              <li className="text-muted/70">Working Hours: 10:00 – 19:00</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 flex max-w-6xl items-center justify-between border-t border-edge pt-6 text-xs text-muted/70 sm:mt-16 sm:pt-8">
        <span>© {new Date().getFullYear()} Skyllect. All rights reserved.</span>
      </div>
    </footer>
  );
}
