"use client";

import { useEffect } from "react";
import { detectPlatform } from "@/lib/app-platform";

/**
 * In-browser backup for the server redirect. iPads on iPadOS 13+ send a desktop
 * Mac user agent, so the server shows them the page; here they are recognised
 * by their touch screen and sent to the App Store.
 */
export function StoreRedirect({ appStoreUrl, playStoreUrl }: { appStoreUrl: string; playStoreUrl: string }) {
  useEffect(() => {
    const isIPadOS = navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
    const platform = isIPadOS ? "ios" : detectPlatform(navigator.userAgent);
    if (platform === "ios") window.location.replace(appStoreUrl);
    if (platform === "android") window.location.replace(playStoreUrl);
  }, [appStoreUrl, playStoreUrl]);

  return null;
}
