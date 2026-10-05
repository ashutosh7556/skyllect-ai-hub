import type { Metadata } from "next";
import Image from "next/image";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { userAgent } from "next/server";
import QRCode from "qrcode";
import { siApple, siGoogleplay } from "simple-icons";
import { ScanStatus } from "@/components/app-download/ScanStatus";
import { StoreRedirect } from "@/components/app-download/StoreRedirect";
import { AccentHeading } from "@/components/technology/SectionShell";
import { TKPS_APP as APP } from "@/data/apps/tkps";
import { detectPlatform } from "@/lib/app-platform";
import { createScanSession, markScanned } from "@/lib/scan-sessions";

export async function generateMetadata(): Promise<Metadata> {
  const url = pageUrl(await headers());
  return {
    title: `Download the ${APP.name} App - Skyllect`,
    description: APP.description,
    metadataBase: new URL(new URL(url).origin),
    openGraph: {
      title: `${APP.name} App`,
      description: APP.tagline,
      url,
      images: [{ url: APP.icon, width: 256, height: 256 }],
    },
  };
}

const STORES = [
  { label: "App Store", caption: "Download on the", href: APP.appStoreUrl, icon: siApple },
  { label: "Google Play", caption: "Get it on", href: APP.playStoreUrl, icon: siGoogleplay },
];

/**
 * This page's own address, built from the request so the QR code points back
 * at whichever domain is serving it (behind a proxy, the forwarded headers).
 */
function pageUrl(h: Headers) {
  const host = h.get("x-forwarded-host") ?? h.get("host");
  if (!host) return APP.shareUrl;
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}/app/tkps`;
}

export default async function TkpsAppPage({ searchParams }: PageProps<"/app/tkps">) {
  // Phones that scan the QR code land here and go straight to their store.
  // Desktops, and link-preview bots, get the page itself.
  const h = await headers();
  const ua = userAgent({ headers: h });
  const platform = ua.isBot ? null : detectPlatform(ua.ua);
  if (platform) {
    // A code shown on a desktop carries its session id; tell that desktop.
    // A failure here must never stop the phone reaching its store.
    const { s } = await searchParams;
    await markScanned(typeof s === "string" ? s : undefined, platform).catch(() => {});
    redirect(platform === "ios" ? APP.appStoreUrl : APP.playStoreUrl);
  }

  // Each desktop view gets its own code, so it can see when that code is scanned.
  // Bots get the plain address, and no session is stored for them.
  const url = pageUrl(h);
  // If the session store is down, fall back to a plain code.
  const sessionId = ua.isBot ? null : await createScanSession().catch(() => null);
  const qrUrl = sessionId ? `${url}?s=${sessionId}` : url;

  // High error correction so the app icon can sit over the middle of the code.
  const qrSvg = await QRCode.toString(qrUrl, {
    type: "svg",
    errorCorrectionLevel: "H",
    margin: 0,
    color: { dark: "#0c0919", light: "#ffffff" },
  });

  return (
    <div className="px-5 pt-32 pb-20 sm:px-8 sm:pt-40 sm:pb-28">
      {!ua.isBot && <StoreRedirect appStoreUrl={APP.appStoreUrl} playStoreUrl={APP.playStoreUrl} />}

      <div className="mx-auto max-w-[1200px]">
        {/* App intro beside the QR code. */}
        <section className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-center lg:gap-14">
          <div>
            <div className="flex items-center gap-4">
              <Image
                src={APP.icon}
                alt={`${APP.name} app icon`}
                width={256}
                height={256}
                priority
                className="h-16 w-16 rounded-2xl border border-white/10 sm:h-20 sm:w-20"
              />
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/50">Official app</p>
            </div>

            <h1 className="mt-6 font-display text-[clamp(2rem,5vw,3.5rem)] font-normal leading-[1.06] tracking-[-0.02em] text-balance text-foreground">
              <AccentHeading text={`${APP.name} App`} accent="App" />
            </h1>
            <p className="mt-3 text-base text-white/60 sm:text-lg">{APP.community}</p>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-hero-sub opacity-80">{APP.description}</p>

            <ul className="mt-8 flex flex-wrap gap-3">
              {STORES.map((store) => (
                <li key={store.label}>
                  <a
                    href={store.href}
                    target="_blank"
                    rel="noreferrer"
                    className="liquid-glass flex items-center gap-3 rounded-xl px-5 py-2.5 text-foreground transition-transform duration-300 hover:-translate-y-0.5 motion-reduce:transition-none"
                  >
                    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor">
                      <path d={store.icon.path} />
                    </svg>
                    <span className="leading-tight">
                      <span className="block text-[11px] text-white/60">{store.caption}</span>
                      <span className="block text-lg font-medium">{store.label}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Scan card for desktop visitors; phones are redirected before they get here. */}
          <div
            className="mx-auto w-full max-w-[400px] rounded-2xl border border-white/10 p-6 text-center sm:rounded-3xl sm:p-8 lg:mr-0"
            style={{
              background:
                "radial-gradient(120% 120% at 30% 0%, rgba(99,102,241,0.24) 0%, rgba(168,85,247,0.12) 42%, rgba(12,9,25,1) 82%)",
            }}
          >
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/60">Scan to download</p>

            {sessionId ? (
              <ScanStatus sessionId={sessionId} qrSvg={qrSvg} qrUrl={qrUrl} icon={APP.icon} />
            ) : (
              <>
                <div className="relative mx-auto mt-5 aspect-square w-full max-w-[260px] rounded-2xl bg-white p-4">
                  <div aria-hidden="true" className="[&>svg]:h-full [&>svg]:w-full" dangerouslySetInnerHTML={{ __html: qrSvg }} />
                  <span className="sr-only">QR code linking to {qrUrl}</span>
                </div>
                <p className="mt-6 font-display text-lg font-medium text-white">Point your phone camera here</p>
              </>
            )}

            <div className="mt-5 flex items-center justify-center gap-5 border-t border-white/10 pt-5 text-sm text-white/45">
              {STORES.map((store) => (
                <span key={store.label} className="flex items-center gap-1.5">
                  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                    <path d={store.icon.path} />
                  </svg>
                  {store.label}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Screenshots, then what the app does. */}
        <section className="mt-20 sm:mt-28">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-[clamp(1.5rem,3.6vw,2.25rem)] font-medium leading-[1.15] tracking-tight text-balance text-white">
              <AccentHeading text="Everything the trust shares, in one place" accent="in one place" />
            </h2>
            <p className="mt-3 text-sm text-white/55 sm:text-base">{APP.tagline} Events, photos, students and news.</p>
          </div>

          <div className="-mx-5 mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 lg:gap-8">
            {APP.screenshots.map((shot) => (
              <Image
                key={shot.src}
                src={shot.src}
                alt={shot.alt}
                width={600}
                height={1299}
                sizes="(max-width: 640px) 72vw, 400px"
                className="h-auto w-[72%] shrink-0 snap-center rounded-2xl border border-white/10 sm:w-full sm:rounded-3xl"
              />
            ))}
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-5">
            {APP.features.map((feature, i) => (
              <div key={feature.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/40">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-3 text-base font-medium text-white sm:text-lg">{feature.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-white/55">{feature.text}</p>
              </div>
            ))}
          </div>

          <p className="mt-12 text-center text-sm text-white/40">Designed and developed by Skyllect Private Limited.</p>
        </section>
      </div>
    </div>
  );
}
