import { chromium } from "playwright";

const URL = process.env.URL ?? "http://localhost:3001";

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  // Headless Chromium defaults to "reduce", which would silently put the page
  // into its no-animation fallback and make these measurements meaningless.
  reducedMotion: "no-preference",
});

const errors = [];
page.on("console", (msg) => {
  if (msg.type() === "error" || msg.type() === "warning") errors.push(`[${msg.type()}] ${msg.text()}`);
});
page.on("pageerror", (err) => errors.push(`[pageerror] ${err.message}`));

await page.goto(URL, { waitUntil: "networkidle" });
await page.waitForTimeout(2500);

const layout = await page.evaluate(() => ({
  htmlHeight: document.documentElement.scrollHeight,
  bodyHeight: document.body.scrollHeight,
  innerHeight: window.innerHeight,
  htmlComputedHeight: getComputedStyle(document.documentElement).height,
  bodyDisplay: getComputedStyle(document.body).display,
  maxScroll: document.documentElement.scrollHeight - window.innerHeight,
}));

const triggers = await page.evaluate(() => {
  const ST = window.ScrollTrigger ?? window.gsap?.core?.globals?.().ScrollTrigger;
  if (!ST) return { available: false };
  return {
    available: true,
    count: ST.getAll().length,
    list: ST.getAll().map((t) => ({
      start: Math.round(t.start),
      end: Math.round(t.end),
      distance: Math.round(t.end - t.start),
      pinned: !!t.pin,
      triggerId: t.trigger?.id || t.trigger?.className?.slice(0, 40) || "?",
    })),
  };
});

const agentsBox = await page.evaluate(() => {
  const el = document.getElementById("ai-agents");
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return { offsetTop: el.offsetTop, height: Math.round(r.height), scrollHeight: el.scrollHeight };
});

console.log("=== LAYOUT ===");
console.log(JSON.stringify(layout, null, 2));
console.log("=== #ai-agents ===");
console.log(JSON.stringify(agentsBox, null, 2));
console.log("=== SCROLLTRIGGERS ===");
console.log(JSON.stringify(triggers, null, 2));

// Walk down the page and sample what the agent cards are actually doing.
const samples = [];
// Sweep the #ai-agents pinned range specifically, not the whole document.
const sweepFrom = agentsBox.offsetTop;
const sweepTo = agentsBox.offsetTop + agentsBox.height;
const STEPS = 24;
for (let i = 0; i <= STEPS; i++) {
  const y = Math.round(sweepFrom + ((sweepTo - sweepFrom) * i) / STEPS);
  await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), y);
  await page.waitForTimeout(500);
  const s = await page.evaluate(() => {
    const section = document.getElementById("ai-agents");
    const cards = section ? [...section.querySelectorAll(".liquid-glass")] : [];
    const first = cards[0];
    return {
      scrollY: Math.round(window.scrollY),
      cardPosition: first ? getComputedStyle(first).position : "?",
      pinned: (() => {
        const inner = section?.querySelector(":scope > div:nth-child(2)");
        return inner ? getComputedStyle(inner).position : "?";
      })(),
      visibleCards: cards
        .map((c, idx) => {
          const cs = getComputedStyle(c);
          const op = parseFloat(cs.opacity);
          const r = c.getBoundingClientRect();
          return { idx, op: +op.toFixed(2), y: Math.round(r.top), vis: cs.visibility };
        })
        .filter((c) => c.op > 0.05 && c.vis !== "hidden"),
    };
  });
  samples.push(s);
}

console.log("=== SCROLL SAMPLES (#ai-agents cards with opacity > .05) ===");
for (const s of samples) {
  const focused = s.visibleCards.filter((c) => c.op > 0.85).map((c) => `#${c.idx}`);
  console.log(
    `scrollY=${String(s.scrollY).padStart(6)} vis=${s.visibleCards.length} ` +
      `focused=${focused.length ? focused.join(",") : "-"}  ` +
      s.visibleCards.map((c) => `#${c.idx}:${c.op}`).join(" "),
  );
}

console.log("=== CONSOLE ERRORS/WARNINGS ===");
console.log(errors.length ? errors.slice(0, 20).join("\n") : "(none)");

await browser.close();
