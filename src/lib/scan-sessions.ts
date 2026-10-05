import { randomBytes } from "node:crypto";
import type { MobilePlatform } from "@/lib/app-platform";

/**
 * Links a QR code shown on a desktop to the phone that scans it, so the
 * desktop page can react once the scan happens.
 *
 * Each desktop view gets a session id baked into its QR code. The phone's
 * visit marks the session scanned, and the desktop polls for that. Sessions
 * live in this server process's memory: enough for one Node server, but they
 * reset on restart and are not shared between several server instances.
 */

export interface ScanSession {
  createdAt: number;
  /** Latest scan; a second phone scanning the same code replaces it. */
  scan: { platform: MobilePlatform; at: number } | null;
}

const TTL_MS = 15 * 60 * 1000;
/** Upper bound so a flood of page views cannot grow memory without limit. */
const MAX_SESSIONS = 5000;
const ID_PATTERN = /^[a-f0-9]{16}$/;

// Kept on globalThis so the page and the status route share one map, even
// where the bundler gives them separate copies of this module.
const store = globalThis as typeof globalThis & { __scanSessions?: Map<string, ScanSession> };
const sessions = (store.__scanSessions ??= new Map());

function prune(now: number) {
  for (const [id, session] of sessions) {
    if (now - session.createdAt > TTL_MS) sessions.delete(id);
  }
  // Maps iterate in insertion order, so this drops the oldest first.
  for (const id of sessions.keys()) {
    if (sessions.size <= MAX_SESSIONS) break;
    sessions.delete(id);
  }
}

export function createScanSession(): string {
  const now = Date.now();
  prune(now);
  const id = randomBytes(8).toString("hex");
  sessions.set(id, { createdAt: now, scan: null });
  return id;
}

/** Records a phone's visit. Unknown or expired ids are ignored. */
export function markScanned(id: string | undefined, platform: MobilePlatform) {
  if (!id || !ID_PATTERN.test(id)) return;
  const session = sessions.get(id);
  const now = Date.now();
  if (session && now - session.createdAt <= TTL_MS) session.scan = { platform, at: now };
}

export function getScanSession(id: string | null): ScanSession | undefined {
  if (!id || !ID_PATTERN.test(id)) return undefined;
  const session = sessions.get(id);
  if (!session || Date.now() - session.createdAt > TTL_MS) return undefined;
  return session;
}
