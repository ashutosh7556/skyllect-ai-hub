"use client";

import { useState } from "react";
import { Preloader } from "@/components/animation/Preloader";
import { SmoothScrollProvider } from "@/components/animation/SmoothScrollProvider";
import { BulbBackdrop } from "@/components/animation/BulbBackdrop";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  return (
    <>
      <Preloader onDone={() => setReady(true)} />
      <SmoothScrollProvider>
        {/* Sits behind every section; content below is lifted above it. */}
        <BulbBackdrop />
        <Header />
        <main className={ready ? "relative z-10" : "relative z-10 invisible"}>{children}</main>
        <Footer />
      </SmoothScrollProvider>
    </>
  );
}
