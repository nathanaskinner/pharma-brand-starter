import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import * as esbuild from "esbuild";
import { load as loadYaml } from "js-yaml";
import markdownIt from "markdown-it";
import hubs from "./src/_data/hubs.js";

const md = markdownIt({ html: true, typographer: true });
const isProduction = () =>
  (process.env.VERCEL_ENV ?? process.env.ELEVENTY_ENV) === "production";

export default function (eleventyConfig) {
  // YAML data files (site.yml, isi.yml, ...)
  eleventyConfig.addDataExtension("yml,yaml", (contents) => loadYaml(contents));

  // Static files copied as-is
  eleventyConfig.addPassthroughCopy({ "src/assets/fonts": "assets/fonts" });
  eleventyConfig.addPassthroughCopy({ "src/assets/images/og": "assets/images/og" });
  eleventyConfig.addPassthroughCopy({ "src/assets/pdf": "pdf" });

  // Responsive images: every <img> in the output becomes a <picture> with AVIF/WebP
  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    formats: ["avif", "webp", "jpeg"],
    widths: [480, 960, 1600],
    urlPath: "/assets/img/",
    outputDir: "./_site/assets/img/",
    htmlOptions: {
      imgAttributes: { loading: "lazy", decoding: "async", sizes: "(min-width: 64rem) 50vw, 100vw" },
      pictureAttributes: {},
    },
  });

  // Markdown filters for rich text stored in YAML / front matter (ISI, callouts)
  eleventyConfig.addFilter("md", (str = "") => md.render(String(str)));
  eleventyConfig.addFilter("mdInline", (str = "") => md.renderInline(String(str)));
  eleventyConfig.addFilter("readableDate", (date) =>
    new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" })
      .format(date instanceof Date ? date : new Date(date))
  );

  // Collections
  const byOrder = (a, b) => (a.data.order ?? 99) - (b.data.order ?? 99);

  eleventyConfig.addCollection("articles", (api) =>
    api.getFilteredByGlob("src/articles/*.md").sort(byOrder)
  );

  // One entry per (hub × article): an article is written once and published in every hub it lists
  eleventyConfig.addCollection("articleHubPages", (api) => {
    const articles = api.getFilteredByGlob("src/articles/*.md").sort(byOrder);
    return hubs.flatMap((hub) =>
      articles
        .filter((article) => (article.data.hubs ?? []).includes(hub.key))
        .map((article) => ({ hub, article }))
    );
  });

  // Bundle CSS + JS with esbuild before each build
  eleventyConfig.on("eleventy.before", async () => {
    await esbuild.build({
      entryPoints: ["src/assets/css/main.css", "src/assets/js/main.js"],
      outbase: "src/assets",
      outdir: "_site/assets",
      bundle: true,
      minify: isProduction(),
      sourcemap: !isProduction(),
      format: "esm",
      logLevel: "warning",
    });
  });
  eleventyConfig.addWatchTarget("src/assets/css/");
  eleventyConfig.addWatchTarget("src/assets/js/");
}

export const config = {
  dir: { input: "src", includes: "_includes", data: "_data", output: "_site" },
  markdownTemplateEngine: "njk",
  htmlTemplateEngine: "njk",
};
