import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import { AppShell } from "@/components/layout/AppShell";
import "animate.css";
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
