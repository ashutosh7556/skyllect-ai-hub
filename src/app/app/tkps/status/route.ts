import { NextResponse, type NextRequest } from "next/server";
import { getScanSession } from "@/lib/scan-sessions";

/** Polled by the desktop QR card: has a phone scanned this session's code yet? */
export function GET(request: NextRequest) {
  const session = getScanSession(request.nextUrl.searchParams.get("s"));
  return NextResponse.json(
    session ? { status: "active", scan: session.scan } : { status: "expired", scan: null },
    { headers: { "Cache-Control": "no-store" } },
  );
}
