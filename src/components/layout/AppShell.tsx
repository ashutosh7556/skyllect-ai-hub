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

  // The bulb is the home page's motif — it lifts out of the logo and anchors
  // the AI Agents vortex. The technology pages have neither, so it would just
  // be a glow sitting behind unrelated copy.
  const showBulb = !pathname?.startsWith("/technology");

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
