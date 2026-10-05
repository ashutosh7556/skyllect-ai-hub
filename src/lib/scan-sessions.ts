import { randomBytes } from "node:crypto";
import type { MobilePlatform } from "@/lib/app-platform";

/**
 * Links a QR code shown on a desktop to the phone that scans it, so the
 * desktop page can react once the scan happens.
 *
 * Each desktop view gets a session id baked into its QR code. The phone's
 * visit marks the session scanned, and the desktop polls for that.
 *
 * On Vercel every request can land on a different server instance, so the
 * sessions have to live in a shared store: Upstash Redis, reached over its
 * REST API. Connecting Upstash from the Vercel dashboard sets the env vars
 * read below. Without them (local dev) sessions fall back to this process's
 * memory, which only works on a single long-running server.
 */

export interface Scan {
  platform: MobilePlatform;
  at: number;
}

export interface ScanSession {
  /** Latest scan; a second phone scanning the same code replaces it. */
  scan: Scan | null;
}

const TTL_SECONDS = 15 * 60;
const ID_PATTERN = /^[a-f0-9]{16}$/;
const KEY_PREFIX = "tkps-scan:";

const REDIS_URL = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;

/** Runs one Redis command through the Upstash REST API. */
async function redis(command: (string | number)[]): Promise<unknown> {
  const res = await fetch(REDIS_URL!, {
    method: "POST",
    headers: { Authorization: `Bearer ${REDIS_TOKEN}` },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Upstash ${command[0]} failed: ${res.status}`);
  return ((await res.json()) as { result: unknown }).result;
}

// In-memory fallback, kept on globalThis so the page and the status route
// share one map even where the bundler gives them separate module copies.
const MAX_MEMORY_SESSIONS = 5000;
type MemoryEntry = { expiresAt: number; scan: Scan | null };
const store = globalThis as typeof globalThis & { __scanSessions?: Map<string, MemoryEntry> };
const memory = (store.__scanSessions ??= new Map());

function pruneMemory(now: number) {
  for (const [id, entry] of memory) {
    if (entry.expiresAt <= now) memory.delete(id);
  }
  // Maps iterate in insertion order, so this drops the oldest first.
  for (const id of memory.keys()) {
    if (memory.size <= MAX_MEMORY_SESSIONS) break;
    memory.delete(id);
  }
}

export async function createScanSession(): Promise<string> {
  const id = randomBytes(8).toString("hex");
  if (REDIS_URL && REDIS_TOKEN) {
    await redis(["SET", KEY_PREFIX + id, "null", "EX", TTL_SECONDS]);
  } else {
    const now = Date.now();
    pruneMemory(now);
    memory.set(id, { expiresAt: now + TTL_SECONDS * 1000, scan: null });
  }
  return id;
}

/** Records a phone's visit. Unknown or expired ids are ignored. */
export async function markScanned(id: string | undefined, platform: MobilePlatform): Promise<void> {
  if (!id || !ID_PATTERN.test(id)) return;
  const scan: Scan = { platform, at: Date.now() };
  if (REDIS_URL && REDIS_TOKEN) {
    // XX: only if the session exists, so random ids cannot create keys.
    await redis(["SET", KEY_PREFIX + id, JSON.stringify(scan), "XX", "KEEPTTL"]);
    return;
  }
  const entry = memory.get(id);
  if (entry && entry.expiresAt > Date.now()) entry.scan = scan;
}

export async function getScanSession(id: string | null): Promise<ScanSession | undefined> {
  if (!id || !ID_PATTERN.test(id)) return undefined;
  if (REDIS_URL && REDIS_TOKEN) {
    const value = await redis(["GET", KEY_PREFIX + id]);
    if (typeof value !== "string") return undefined;
    return { scan: JSON.parse(value) as Scan | null };
  }
  const entry = memory.get(id);
  if (!entry || entry.expiresAt <= Date.now()) return undefined;
  return { scan: entry.scan };
}
