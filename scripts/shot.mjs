import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: "no-preference" });
await page.goto("http://localhost:3001", { waitUntil: "networkidle" });
await page.waitForTimeout(2500);
const agents = await page.evaluate(() => Math.round(document.querySelector("#ai-agents").getBoundingClientRect().top + window.scrollY));
const shots = [["t0", 60], ["t1", 220], ["t2", 430]];
for (const [name, y] of shots) {
  await page.evaluate(t => window.scrollTo({ top: t, behavior: "instant" }), y);
  await page.waitForTimeout(1300);
  const st = await page.evaluate(() => {
    const img = document.querySelector('img[src="/images/bulb.png"]');
    const r = img.getBoundingClientRect();
    const cs = getComputedStyle(img.parentElement);
    return { z: getComputedStyle(img.parentElement.parentElement).zIndex, op:+(+cs.opacity).toFixed(2),
             topEdge: Math.round(r.top), cy: Math.round(r.top + r.height/2), h: Math.round(r.height) };
  });
  console.log(name, "scrollY="+y, JSON.stringify(st));
  await page.screenshot({ path: `scripts/${name}.png` });
}
await browser.close();
