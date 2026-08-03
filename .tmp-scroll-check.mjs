import { chromium } from "@playwright/test";

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
const page = await context.newPage();
await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });

const info = await page.evaluate(() => {
  const html = document.documentElement;
  const body = document.body;
  const cs = (el) => { const c = getComputedStyle(el); return { overflow: c.overflow, overflowY: c.overflowY, overflowX: c.overflowX, height: c.height, position: c.position }; };
  return {
    htmlStyle: cs(html),
    bodyStyle: cs(body),
    bodyInlineStyle: body.getAttribute("style"),
    htmlInlineStyle: html.getAttribute("style"),
    scrollHeight: body.scrollHeight,
    innerHeight: window.innerHeight,
    openDialogs: Array.from(document.querySelectorAll("dialog[open]")).length,
  };
});
console.log(JSON.stringify(info, null, 2));

// try actual scroll
await page.mouse.wheel(0, 800);
await page.waitForTimeout(200);
const scrollY = await page.evaluate(() => window.scrollY);
console.log("scrollY after wheel:", scrollY);

await browser.close();
