import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import { AppShell } from "@/components/layout/AppShell";
import "./globals.css";

// Inter for body copy, Poppins for headings.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

// Server-side rendering: every page is rendered on the server for each request
// rather than prerendered at build time. Set on the root layout so it applies
// to all routes. Remove this line to return to static prerendering.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Skyllect — AI Working Inside Your Business",
  description:
    "Skyllect builds AI agents, automation systems, and custom software that connect with your existing tools, data, and workflows.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-background text-body">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
