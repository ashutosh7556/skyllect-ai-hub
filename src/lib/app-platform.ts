export type MobilePlatform = "ios" | "android";

/**
 * Works out which app store a user agent belongs to. Shared by the server
 * redirect and the in-browser fallback, so both agree on the rules.
 */
export function detectPlatform(ua: string): MobilePlatform | null {
  if (/android/i.test(ua)) return "android";
  if (/iphone|ipad|ipod/i.test(ua)) return "ios";
  return null;
}
