// Works on Vercel (VERCEL_ENV: production | preview) and anywhere else (ELEVENTY_ENV).
const environment = process.env.VERCEL_ENV ?? process.env.ELEVENTY_ENV ?? "development";

export default {
  environment,
  isProduction: environment === "production",
  commit: (process.env.VERCEL_GIT_COMMIT_SHA ?? process.env.GITHUB_SHA ?? "local").slice(0, 7),
  buildTime: new Date().toISOString(),
  year: new Date().getFullYear(),
};
