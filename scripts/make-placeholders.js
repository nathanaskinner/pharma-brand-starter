// Generates simple abstract placeholder images (gradients + label) so the demo builds without stock photos.
// Replace files in src/assets/images with real, licensed, MLR-approved images.
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const images = {
  "hero-home": ["#3b2a8c", "#e8603c"], "hero-doctor": ["#24195c", "#7a6bd1"],
  "card-right-for-me": ["#5a4bb5", "#f2a07b"], "card-starting": ["#3b2a8c", "#9bd1c8"],
  "card-savings": ["#e8603c", "#ffd8a8"], "card-results": ["#24195c", "#e8603c"],
  "card-safety": ["#3b6e8c", "#c6e2f0"], "card-stories": ["#8c2a6b", "#f7c6d9"],
  "card-together": ["#2a8c6b", "#c6f0de"], "card-support": ["#8c6b2a", "#f0e2c6"],
  "card-faq": ["#4b4b6b", "#dcd6ec"], "story-alex": ["#3b2a8c", "#f2a07b"],
  "how-to-take": ["#24195c", "#9bd1c8"], "article-routine": ["#5a4bb5", "#ffd8a8"],
  "article-questions": ["#3b6e8c", "#f7c6d9"], "article-moving": ["#2a8c6b", "#ffd8a8"],
  "article-eating": ["#e8603c", "#c6f0de"], "article-sleep": ["#24195c", "#c6e2f0"],
  "article-progress": ["#8c6b2a", "#dcd6ec"],
};

const svg = (a, b, label) => `
<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>
  <rect width="1600" height="1000" fill="url(#g)"/>
  <circle cx="1250" cy="300" r="260" fill="#fff" fill-opacity="0.12"/>
  <circle cx="300" cy="820" r="380" fill="#fff" fill-opacity="0.08"/>
  <text x="80" y="920" font-family="Helvetica, Arial, sans-serif" font-size="48" fill="#fff" fill-opacity="0.85">${label} · placeholder</text>
</svg>`;

await mkdir("src/assets/images/og", { recursive: true });
for (const [name, [a, b]] of Object.entries(images)) {
  await sharp(Buffer.from(svg(a, b, name))).jpeg({ quality: 82 }).toFile(`src/assets/images/${name}.jpg`);
}
await sharp(Buffer.from(svg("#3b2a8c", "#e8603c", "Fictiva demo")))
  .resize(1200, 630, { fit: "cover" }).jpeg({ quality: 82 }).toFile("src/assets/images/og/default.jpg");
console.log(`Created ${Object.keys(images).length + 1} placeholder images.`);
