"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { scrollToTop } from "@/hooks/useLenis";

interface HomeLinkProps {
  children: ReactNode;
  className?: string;
  /** Anything the caller needs to do as well, such as closing a menu. */
  onNavigate?: () => void;
}

/**
 * The logo link.
 *
 * `/#home` is right when the reader is on another route — it loads the home
 * page and lands on the hero. On the home page itself it is not: the browser
 * jumps the scroll position instantly, which skips every pinned section
 * between here and the top and leaves their triggers to catch up afterwards.
 * Lenis then writes its own position back on the next frame, so the page can
 * even slide away from where the jump sent it.
 *
 * So on home it scrolls rather than navigates, through Lenis, and the page
 * unwinds the way it was scrolled.
 */
export function HomeLink({ children, className, onNavigate }: HomeLinkProps) {
  const pathname = usePathname();

  return (
    <Link
      href="/#home"
      className={className}
      onClick={(event) => {
        onNavigate?.();
        if (pathname !== "/") return;
        event.preventDefault();
        scrollToTop();
      }}
    >
      {children}
    </Link>
  );
}
