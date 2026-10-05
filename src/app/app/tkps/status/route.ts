import { NextResponse, type NextRequest } from "next/server";
import { getScanSession } from "@/lib/scan-sessions";

/** Polled by the desktop QR card: has a phone scanned this session's code yet? */
export async function GET(request: NextRequest) {
  // A store error reads as "no scan yet"; the card just keeps waiting.
  const session = await getScanSession(request.nextUrl.searchParams.get("s")).catch(() => undefined);
  return NextResponse.json(
    session ? { status: "active", scan: session.scan } : { status: "unknown", scan: null },
    { headers: { "Cache-Control": "no-store" } },
  );
}
