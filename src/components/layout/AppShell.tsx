"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Preloader } from "@/components/animation/Preloader";
import { SmoothScrollProvider } from "@/components/animation/SmoothScrollProvider";
import { BulbBackdrop } from "@/components/animation/BulbBackdrop";
import { NodeNetwork } from "@/components/animation/NodeNetwork";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const pathname = usePathname();

  // The bulb belongs to the home page alone: it lifts out of the header logo
  // and anchors the AI Agents vortex, neither of which exists anywhere else.
  // On any other route it would just be a glow behind unrelated copy.
  const isHome = pathname === "/";

  // The bulb belongs to the home page alone.
  const showBulb = isHome;

  /*
   * The particle field is global, but the home page already paints its own
   * per-section instances (AI Agents, Systems Integration, Workflow) at
   * different densities and palettes. Adding a page-level layer there too
   * would stack two fields in those sections and change how home looks, so
   * home keeps its own and every other route gets this one.
   *
   * Parameters are copied from the AI Agents section so the field is
   * identical site-wide. NodeNetwork already returns null under
   * prefers-reduced-motion and re-seeds itself on resize.
   */
  const showAmbientField = !isHome;

  return (
    <>
      <Preloader onDone={() => setReady(true)} />
      <SmoothScrollProvider>
        {/* Sits behind every section; content below is lifted above it. */}
        {showBulb ? <BulbBackdrop /> : null}

        {showAmbientField ? (
          <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
            <NodeNetwork
              className="h-full w-full"
              density={1 / 32000}
              lineColor="150, 180, 255"
              dotColor="200, 215, 255"
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
