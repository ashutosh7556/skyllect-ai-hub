/**
 * Walks the agent section's release and reports where each module actually
 * is on screen — centre, size and opacity — so the flight out of the rings
 * can be checked against the core's own position rather than by eye.
 */
import { chromium } from "playwright";

const PORT = process.env.PORT ?? 3000;
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

const layout = await page.evaluate(() => {
  const grid = document.querySelector("#ai-agents .grid");
  const r = grid.getBoundingClientRect();
  return {
    gridTop: Math.round(r.top + window.scrollY),
    gridBottom: Math.round(r.bottom + window.scrollY),
    vh: window.innerHeight,
  };
});
console.log("layout:", JSON.stringify(layout));

const probe = () =>
  page.evaluate(() => {
    const cells = [...document.querySelectorAll("[data-emerge]")];
    return {
      scrollY: Math.round(window.scrollY),
      cells: cells.map((c) => {
        const r = c.getBoundingClientRect();
        const cs = getComputedStyle(c);
        return {
          cx: Math.round(r.left + r.width / 2),
          cy: Math.round(r.top + r.height / 2),
          w: Math.round(r.width),
          op: Math.round(+cs.opacity * 100) / 100,
        };
      }),
    };
  });

// start "top 95%" -> scroll = gridTop - 0.95vh ; end "bottom 30%" -> gridBottom - 0.3vh
const from = layout.gridTop - 0.95 * layout.vh;
const to = layout.gridBottom - 0.3 * layout.vh;
// One reading per module slot, so each stop lands in a different release.
const stops = [
  ["hero", 200],
  ["pre", Math.round(from - 120)],
  ...Array.from({ length: 8 }, (_, i) => [
    `t${String(i).padStart(2, "0")}`,
    Math.round(from + ((to - from) * i) / 7),
  ]),
  ["after", Math.round(to + 300)],
];

for (const [name, y] of stops) {
  await page.evaluate((t) => window.scrollTo({ top: t, behavior: "instant" }), y);
  // Comfortably past the 2.2s scrub, so each reading is the resting state at
  // that scroll position rather than a frame mid-catch-up.
  await page.waitForTimeout(3400);
  const s = await probe();
  console.log(
    name,
    "y=" + s.scrollY,
    s.cells
      .map((c, i) => `${i}:(${c.cx},${c.cy}) w${c.w} o${c.op}`)
      .join("  "),
  );
  await page.screenshot({ path: `scripts/shots/emerge-${name}.png` });
}

await browser.close();
