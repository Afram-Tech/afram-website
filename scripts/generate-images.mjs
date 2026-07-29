import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import sharp from "sharp";

const publicDir = fileURLToPath(new URL("../public", import.meta.url));
const logoSvg = readFileSync(`${publicDir}/logo.svg`);

async function generateAppleTouchIcon() {
  await sharp(logoSvg)
    .resize(120, 120, { fit: "contain" })
    .extend({
      top: 30,
      bottom: 30,
      left: 30,
      right: 30,
      background: "#eef7f7",
    })
    .flatten({ background: "#eef7f7" })
    .png()
    .toFile(`${publicDir}/apple-touch-icon.png`);
}

async function generateOgImage() {
  const svg = Buffer.from(`
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#021f24" />
          <stop offset="60%" stop-color="#00565e" />
          <stop offset="100%" stop-color="#007481" />
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#bg)" />
      <text x="80" y="220" font-family="Arial, sans-serif" font-size="72" font-weight="700" fill="#ffffff">Afram</text>
      <text x="80" y="280" font-family="Arial, sans-serif" font-size="34" fill="#a7dde1">Liberating Capital.</text>
      <foreignObject x="80" y="340" width="960" height="220">
        <p xmlns="http://www.w3.org/1999/xhtml" style="font-family: Arial, sans-serif; font-size: 27px; color: #d3ecee; margin: 0; line-height: 1.5;">
          A transparent real estate marketplace for buyers, vendors, and financiers — powered by blockchain.
        </p>
      </foreignObject>
    </svg>
  `);

  await sharp(svg).png().toFile(`${publicDir}/opengraph.png`);
}

await generateAppleTouchIcon();
await generateOgImage();

console.log("Generated apple-touch-icon.png and opengraph.png in public/");
