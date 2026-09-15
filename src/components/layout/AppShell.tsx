"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Preloader } from "@/components/animation/Preloader";
import { SmoothScrollProvider } from "@/components/animation/SmoothScrollProvider";
import { NodeNetwork } from "@/components/animation/NodeNetwork";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const pathname = usePathname();

  const isHome = pathname === "/";

  /*
   * The node field is the quiet version of the machine: the same cool traces
   * and solder points, without the geometry. Home does not get it — the
   * WebGL core owns that page, and its own sections paint their fields — so
   * this is what carries the language onto every other route.
   *
   * NodeNetwork already returns null under prefers-reduced-motion and
   * re-seeds itself on resize.
   */
  const showAmbientField = !isHome;

  return (
    <>
      <Preloader onDone={() => setReady(true)} />
      <SmoothScrollProvider>
        {showAmbientField ? (
          <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
            <NodeNetwork
              className="h-full w-full"
              density={1 / 34000}
              lineColor="120, 165, 200"
              dotColor="150, 205, 230"
            />
          </div>
        ) : null}
        <Header />
        <main className={ready ? "relative z-10" : "relative z-10 invisible"}>{children}</main>
        <Footer />
      </SmoothScrollProvider>
    </>
  );
}
