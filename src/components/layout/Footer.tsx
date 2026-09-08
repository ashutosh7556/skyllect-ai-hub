import Link from "next/link";
import { NAV_ITEMS } from "@/data/navigation";
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
    <footer id="contact" className="border-t border-white/10 bg-black px-6 py-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 lg:flex-row lg:justify-between">
        <div className="max-w-sm">
          <div className="inline-block rounded-2xl bg-white px-5 py-4">
            <Logo className="h-8 w-auto" />
          </div>
          <p className="mt-4 text-sm leading-relaxed text-white/50">
            Engineering AI into real business operations.
          </p>
        </div>

        <div className="grid grow grid-cols-2 gap-8 sm:grid-cols-3">
          <div>
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-white/40">
              Navigation
            </p>
            <ul className="flex flex-col gap-3">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/60 transition-colors duration-200 hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-white/40">
              Services
            </p>
            <ul className="flex flex-col gap-3">
              {SERVICE_LINKS.map((service) => (
                <li key={service} className="text-sm text-white/60">
                  {service}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-white/40">
              Contact
            </p>
            <ul className="flex flex-col gap-3 text-sm text-white/60">
              <li>hello@skyllect.com</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-16 flex max-w-6xl items-center justify-between border-t border-white/10 pt-8 text-xs text-white/40">
        <span>© {new Date().getFullYear()} Skyllect. All rights reserved.</span>
      </div>
    </footer>
  );
}
