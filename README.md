# Umi Cleaning website

Marketing and booking site for **Umi Cleaning LLC**, a residential cleaning service in Portland, Oregon.
It is plain static HTML with one shared stylesheet and one small vanilla JS file. There are no runtime dependencies. It is built for Netlify with clean URLs.

## Quick start

Requires Node 20+ (see `.nvmrc`). There is nothing to `npm install`.

```bash
npm run dev      # build, serve at http://localhost:8080, rebuild on every change in src/
npm run build    # write the production site to dist/
npm run serve    # serve the existing dist/ (other port: npm run serve -- 3000)
npm start        # build + serve
npm run clean    # delete dist/
```

## Project structure

```
├── netlify.toml            Netlify build settings, headers, redirects
├── package.json
├── scripts/
│   ├── build.mjs           Assembles pages + partials into dist/ (clean URLs, sitemap, robots.txt)
│   └── serve.mjs           Local static server that mimics Netlify's clean URLs
├── src/
│   ├── pages/              One file per page. Front-matter comment sets <title>/description
│   │   ├── index.html          /
│   │   ├── checklist.html      /checklist
│   │   ├── contact.html        /contact          (Netlify Forms quote request)
│   │   ├── book.html           /book             (ScheduleDrop booking iframe)
│   │   ├── careers.html        /careers          (ScheduleDrop hiring iframe)
│   │   ├── terms-of-service.html
│   │   ├── privacy-policy.html
│   │   └── 404.html
│   ├── partials/           layout.html (<head>, fonts, meta, OG), header.html, footer.html
│   ├── data/checklist.json Checklist table data (rendered to HTML at build time)
│   ├── css/styles.css      All styles: design tokens on :root, then components and pages
│   ├── js/main.js          Nav scroll state + mobile menu, checklist accordion, form submit
│   ├── assets/img|icons    Optimized WebP images, favicons, OG image
│   └── static/             Copied to the site root (favicon.ico, site.webmanifest)
└── design/                 Original design handoff (reference only, not deployed)
```

### Adding or editing a page
Create `src/pages/<slug>.html`. It must start with:

```html
<!--
title: Page Title | Umi Cleaning
description: One-sentence meta description.
-->
<main id="main" class="page"> … </main>
```

It is published at `/<slug>`. Optional front-matter keys: `hero: true` (transparent header over a hero photo) and `noindex: true`. Page-specific `<head>` tags go between `<!-- @head -->` and `<!-- @endhead -->`.

## Deploying to Netlify

1. In Netlify, choose **Add new site → Import from Git** and pick this repo. `netlify.toml` already sets the build command (`npm run build`) and the publish directory (`dist`).
2. **Forms:** Netlify finds the `quote` form on its own at deploy time. Under **Forms → Form notifications**, add an email notification to `hello@umicleaning.com`.
3. **Domain:** add `umicleaning.com` under Domain management and create only the DNS records Netlify asks for. **Do not move DNS to Cloudflare** and do not touch the Google Workspace MX/SPF/DKIM/DMARC records.
4. If the production URL is not `https://umicleaning.com`, set a `SITE_URL` environment variable. It is used for canonical URLs, Open Graph, JSON-LD and the sitemap.

See [`TODO.md`](TODO.md) for open items from the client.
