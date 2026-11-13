// Fails the build if any page breaks a compliance or SEO rule.
// Runs after every build (npm run build). Add rules as the client's requirements grow.
import { readdir, readFile } from "node:fs/promises";

const OUT = "_site";
const PLACEHOLDER_JOB_CODE = "US-FIC-0000-XX";
const env = process.env.VERCEL_ENV ?? process.env.ELEVENTY_ENV ?? "development";
const isProduction = env === "production";

const files = (await readdir(OUT, { recursive: true })).filter((f) => f.endsWith(".html"));
const problems = [];
const titles = {};

for (const file of files) {
  const html = await readFile(`${OUT}/${file}`, "utf8");
  const where = `/${file}`;

  // Compliance
  if (!html.includes('data-isi="none"') && !html.includes('id="isi"')) problems.push(`${where}: missing ISI`);
  const jobCode = html.match(/data-job-code="([^"]*)"/)?.[1];
  if (!jobCode) problems.push(`${where}: missing job code`);
  if (isProduction && jobCode === PLACEHOLDER_JOB_CODE) problems.push(`${where}: placeholder job code in production`);
  if (isProduction && html.includes('class="review-banner"')) problems.push(`${where}: review banner in production build`);
  if (isProduction && html.includes('class="seo-review"')) problems.push(`${where}: SEO review panel in production build`);

  // SEO
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1]?.trim();
  const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1]?.trim();
  if (!title) problems.push(`${where}: missing <title>`);
  else (titles[title] ??= []).push(where);
  if (title && title.length > 65) problems.push(`${where}: title over 65 chars (${title.length})`);
  if (!desc) problems.push(`${where}: missing meta description`);
  if (desc && desc.length > 160) problems.push(`${where}: description over 160 chars (${desc.length})`);
  if (!html.includes('rel="canonical"')) problems.push(`${where}: missing canonical`);
  const h1s = (html.match(/<h1[\s>]/g) ?? []).length;
  if (h1s !== 1) problems.push(`${where}: expected exactly one <h1>, found ${h1s}`);

  // Accessibility basics
  if (/<img(?![^>]*\balt=)[^>]*>/.test(html)) problems.push(`${where}: <img> without alt attribute`);
  if (!/<html[^>]+lang="/.test(html)) problems.push(`${where}: <html> missing lang`);
}

for (const [title, pages] of Object.entries(titles)) {
  if (pages.length > 1) problems.push(`Duplicate title "${title}": ${pages.join(", ")}`);
}

if (problems.length) {
  console.error(`\n✖ Compliance check failed (${problems.length} problem${problems.length > 1 ? "s" : ""}, env: ${env}):\n  ${problems.join("\n  ")}\n`);
  process.exit(1);
}
console.log(`✔ Compliance check passed: ${files.length} pages (env: ${env}).`);
