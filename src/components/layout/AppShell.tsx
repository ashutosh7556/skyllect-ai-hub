"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Preloader } from "@/components/animation/Preloader";
import { SmoothScrollProvider } from "@/components/animation/SmoothScrollProvider";
import { BulbBackdrop } from "@/components/animation/BulbBackdrop";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const pathname = usePathname();

  // The bulb belongs to the home page alone: it lifts out of the header logo
  // and anchors the AI Agents vortex, neither of which exists anywhere else.
  // On any other route it would just be a glow behind unrelated copy.
  const showBulb = pathname === "/";

  return (
    <>
      <Preloader onDone={() => setReady(true)} />
      <SmoothScrollProvider>
        {/* Sits behind every section; content below is lifted above it. */}
        {showBulb ? <BulbBackdrop /> : null}
        <Header />
        <main className={ready ? "relative z-10" : "relative z-10 invisible"}>{children}</main>
        <Footer />
      </SmoothScrollProvider>
    </>
  );
}
