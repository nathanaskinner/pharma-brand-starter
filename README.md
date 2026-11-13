# Pharma Brand Starter (Eleventy)

A static-site starter for small and mid-size pharma brand sites, built with **Eleventy 3**. The demo content is for **Fictiva™ (fictivatide), a fictional product**. Every word and number is placeholder material. Images are generated placeholders, except the homepage photos, which come from Unsplash (see [Image credits](#image-credits)).

It shows a production-style setup for a regulated consumer site: section-based pages, a single source for Important Safety Information (ISI), job codes on every page, shared articles published in multiple hubs, MLR-friendly staging, and a build that fails when compliance rules are broken.

> **Not medical information.** Fictiva is not a real medicine. Search engines and AI crawlers are blocked on all builds while `site.demo` is `true`.

## Quick start

```bash
npm install
npm run dev          # http://localhost:8080 (staging mode: review banner + SEO panel)
npm run build        # build + compliance check
npm run build:prod   # production build (no banners, no styleguide)
```

Requires Node 20 or later. `npm run placeholders` regenerates the placeholder images.

## What's in it

| Feature | Where |
|---|---|
| About 30 pages: home, hubs, content pages, results, safety, stories, FAQ, dosing, cost, how to get, discussion guide, sign-up, PI | `src/pages/` |
| **Page builder**: pages list `sections`; each maps to a component | `src/_includes/layouts/page.njk`, `src/_includes/components/` |
| **Shared articles**: written once, published into every hub they list (6 articles → 9 pages) | `src/articles/`, `src/hub-articles.njk`, `src/_data/hubs.js` |
| **Single-source ISI**: full section plus sticky tray on every page | `src/_data/isi.yml`, `partials/isi-*.njk` |
| **Job codes** on every page, from front matter | `partials/footer.njk` |
| **Compliance check**: fails the build on missing ISI or job code, placeholder job codes or staging banners in production, missing or duplicate titles, long descriptions, missing canonical, not exactly one `<h1>`, images without `alt` | `scripts/check-compliance.js` |
| **MLR review mode**: staging banner showing the commit and build time, plus an SEO panel showing each page's title, description and job code | `partials/review-banner.njk`, `partials/seo-review.njk` |
| **Responsive images**: AVIF/WebP at several sizes, lazy-loaded | `@11ty/eleventy-img` transform in `eleventy.config.js` |
| **Vimeo facade**: player loads on click with `dnt=1` (no tracking cookies) | `components/video.njk`, `assets/js/video.js` |
| **Form embed**: FormAssembly in production; a non-submitting preview in the demo | `components/form-embed.njk`, `_data/forms.yml` |
| **Discussion guide**: answers stay in the browser | `components/quiz.njk`, `assets/js/quiz.js` |
| **Design tokens**: Figma variables → CSS custom properties | `_data/tokens.json`, `assets/css/tokens.css.njk` |
| **SEO**: canonical URLs (shared articles point to their primary hub), Open Graph, JSON-LD, XML and HTML sitemaps | `partials/head-meta.njk`, `partials/structured-data.njk`, `src/sitemap.*` |
| **AI search**: crawler policy in data, `llms.txt`, content readable without JavaScript | `_data/crawlers.yml`, `src/robots.txt.njk`, `src/llms.txt.njk` |
| **Styleguide**: every component on one page (not built in production) | `src/styleguide/` |
| **CloudCannon** visual editing config | `cloudcannon.config.yml` |
| **Vercel** config: security headers, caching, redirects | `vercel.json` |

## How content works

```
src/_data/      global data: site, nav, footer, ISI, documents, forms, videos, tokens, crawlers
src/pages/      one Markdown file per page; front matter holds title, description, jobCode and sections
src/articles/   shared articles (not published on their own)
```

All copy lives in data and content files, never in templates, so it's editable in CloudCannon and reviewable in git diffs.

A page:

```yaml
---
title: How to get Fictiva
description: Steps to talk to your healthcare provider, check coverage and fill a prescription.
jobCode: US-FIC-0150-01
sections:
  - _type: hero
    heading: Getting started is easier than you think
  - _type: steps
    items:
      - { title: Talk to your provider, body: Use the discussion guide to prepare. }
---
```

## Environments

| Environment | How it's set | Behavior |
|---|---|---|
| development | default | Review banner, SEO panel, styleguide, `noindex` |
| preview / staging | `VERCEL_ENV=preview` or `ELEVENTY_ENV=staging` | Same as development: used for MLR review |
| production | `VERCEL_ENV=production` or `ELEVENTY_ENV=production` | No banners or styleguide; stricter compliance checks |

## Deploying

**Vercel:** import the repo. `vercel.json` sets the build command and output folder. `main` is production; preview deployments are created for every branch, with a fixed URL for each MLR round.

**Elsewhere:** run `npm run build:prod` and upload `_site/` to any static host.

## Before using with a real brand

- Replace the ISI, PI and Medication Guide with the approved label text and PDFs.
- Set `site.demo: false`, the real domain, the OneTrust ID and the FormAssembly form IDs.
- Set the AI crawler policy in `crawlers.yml` with client legal.
- Replace the placeholder images with licensed, MLR-approved images.
- Confirm BAA coverage for hosting, forms and any other service that could touch patient data.

## Image credits

The homepage photos are used under the [Unsplash License](https://unsplash.com/license). They are cropped to 1600×1000.

| File | Photo | Photographer |
|---|---|---|
| `home-hero.jpg` | [Runner on a ridge at sunset](https://unsplash.com/photos/I1EWTM5mFEM) | Venti Views |
| `home-biking.jpg` | [Mountain biking near Las Vegas](https://unsplash.com/photos/OYACKxTLAAM) | Bundok Biker |
| `home-hiking.jpg` | [Hikers on the W trek, Chile](https://unsplash.com/photos/Yizrl9N_eDA) | Toomas Tartes |
| `home-paddling.jpg` | [Down the river](https://unsplash.com/photos/6F98shIQysI) | Razvan Chisu |
