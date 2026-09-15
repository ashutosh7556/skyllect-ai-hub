import { chromium } from "playwright";

const base = process.env.BASE_URL ?? "http://localhost:3100";
const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1861, height: 914 },
  reducedMotion: "no-preference",
});

await page.goto(base, { waitUntil: "networkidle" });
await page.waitForTimeout(3000);
await page.screenshot({ path: "scripts/shots/v-hero.png" });

// The band where the hero used to draw a seam into the machine.
await page.evaluate(() => window.scrollTo({ top: 520, behavior: "instant" }));
await page.waitForTimeout(1800);
await page.screenshot({ path: "scripts/shots/v-seam.png" });

await browser.close();
