"use client";

import { useEffect, useState } from "react";
import { StoreSplash } from "@/components/app-download/StoreSplash";
import { detectPlatform, type MobilePlatform } from "@/lib/app-platform";

/**
 * In-browser backup for the server's phone detection. iPads on iPadOS 13+
 * send a desktop Mac user agent, so the server shows them the page; here they
 * are recognised by their touch screen and get the same opening animation
 * before going to the App Store.
 */
export function StoreRedirect({
  appStoreUrl,
  playStoreUrl,
  icon,
}: {
  appStoreUrl: string;
  playStoreUrl: string;
  icon: string;
}) {
  const [platform, setPlatform] = useState<MobilePlatform | null>(null);

  useEffect(() => {
    const isIPadOS = navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
    // Detection needs the browser, so it can only run after the first render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPlatform(isIPadOS ? "ios" : detectPlatform(navigator.userAgent));
  }, []);

  if (!platform) return null;
  return <StoreSplash then={{ store: platform, url: platform === "ios" ? appStoreUrl : playStoreUrl }} icon={icon} />;
}
