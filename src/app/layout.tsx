import type { Metadata } from "next";
import { Lato } from "next/font/google";
import localFont from "next/font/local";
import { AppShell } from "@/components/layout/AppShell";
import "./globals.css";

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

// skyllect.com's heading face. Only the regular cut exists; headings are
// set bold on top of it, exactly as the live site does.
const sansation = localFont({
  variable: "--font-sansation",
  src: "./fonts/Sansation-Regular.ttf",
  weight: "400",
});

export const metadata: Metadata = {
  title: "Skyllect — AI Working Inside Your Business",
  description:
    "Skyllect builds AI agents, automation systems, and custom software that connect with your existing tools, data, and workflows.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${lato.variable} ${sansation.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-background text-body">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
