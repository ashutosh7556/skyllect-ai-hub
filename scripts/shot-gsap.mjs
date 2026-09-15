/**
 * Walks the four animated topics and reports what is actually on screen at a
 * handful of scroll positions — element counts, opacities and positions — so
 * the GSAP layers can be checked without eyeballing every frame.
 */
import { chromium } from "playwright";

const PORT = process.env.PORT ?? 3011;
const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  reducedMotion: "no-preference",
});
page.on("pageerror", (e) => console.log("PAGEERROR:", e.message));
page.on("console", (m) => {
  if (m.type() === "error") console.log("CONSOLE:", m.text());
});

await page.goto(`http://localhost:${PORT}`, { waitUntil: "networkidle" });
await page.waitForTimeout(3000);

const tops = await page.evaluate(() => {
  const at = (sel) => {
    const el = document.querySelector(sel);
    return el ? Math.round(el.getBoundingClientRect().top + window.scrollY) : null;
  };
  return {
    agents: at("#ai-agents"),
    beyond: at("#ai-agents")
      ? Math.round(
          document.querySelector("#ai-agents").getBoundingClientRect().bottom +
            window.scrollY,
        )
      : null,
    automation: at("#automation"),
    integrations: at("#integrations"),
    docHeight: document.body.scrollHeight,
  };
});
console.log("tops:", JSON.stringify(tops));

const probe = () =>
  page.evaluate(() => {
    const num = (v) => Math.round(v * 100) / 100;
    const info = (sel) => {
      const els = [...document.querySelectorAll(sel)];
      return {
        n: els.length,
        op: els.slice(0, 3).map((e) => num(+getComputedStyle(e).opacity)),
      };
    };
    const chip = document.querySelector("[data-system-chip]");
    return {
      scrollY: Math.round(window.scrollY),
      railPulse: info("[data-rail-pulse]"),
      feed: info("[data-feed]"),
      cardSweep: info("[data-card-sweep]"),
      corner: info("[data-corner]"),
      edgeLight: info("[data-edge-light]"),
      breath: info("[data-breath]"),
      bus: (() => {
        const b = document.querySelector("[data-bus]");
        if (!b) return null;
        return {
          len: Math.round(b.getTotalLength()),
          offset: Math.round(+getComputedStyle(b).strokeDashoffset.replace("px", "")),
        };
      })(),
      lamps: info("[data-lamp]"),
      chipBorder: chip ? getComputedStyle(chip).borderColor : null,
      runDot: info("[data-run-dot]"),
      ping: info("[data-ping]"),
      wfFrame: (() => {
        const f = document.querySelector("#automation .absolute.inset-0");
        return f ? getComputedStyle(f).transform : null;
      })(),
    };
  });

const stops = [
  ["01-agents", tops.agents + 200],
  ["02-agents-deep", tops.agents + 900],
  ["03-beyond", tops.beyond + 400],
  ["04-beyond-mid", tops.beyond + 1800],
  ["05-workflow", tops.automation + 600],
  ["06-workflow-mid", tops.automation + 2600],
  ["07-integrations", tops.integrations + 120],
  ["08-integrations-late", tops.integrations + 520],
];

for (const [name, y] of stops) {
  await page.evaluate((t) => window.scrollTo({ top: t, behavior: "instant" }), y);
  await page.waitForTimeout(2200);
  console.log(name, JSON.stringify(await probe()));
  await page.screenshot({ path: `scripts/shots/gsap-${name}.png` });
}

await browser.close();
