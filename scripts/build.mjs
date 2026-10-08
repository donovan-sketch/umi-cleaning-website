#!/usr/bin/env node
/**
 * Static site build. Zero dependencies.
 *
 *  src/pages/*.html   page bodies, each starting with a front-matter comment
 *  src/partials/      layout, header, footer
 *  src/data/          JSON rendered into pages at build time
 *  src/css, src/js, src/assets, src/static  copied as-is
 *
 * Output goes to dist/ with clean URLs: pages/checklist.html -> dist/checklist/index.html,
 * which Netlify serves at /checklist.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = path.join(root, "src");
const dist = path.join(root, "dist");

const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
const SITE_URL = (process.env.SITE_URL || pkg.homepage || "https://umicleaning.com").replace(/\/$/, "");
// Cache-busting token for the stylesheet and script.
const VERSION = Date.now().toString(36);

const read = (p) => fs.readFileSync(p, "utf8");
const partial = (name) => read(path.join(src, "partials", `${name}.html`));

const escapeHtml = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/** Replace {{key}} placeholders. Unknown keys are left in place so they show up in the check below. */
const fill = (tpl, vars) => tpl.replace(/\{\{(\w+)\}\}/g, (m, k) => (k in vars ? vars[k] : m));

/** Parse the leading <!-- key: value --> front-matter block of a page. */
function parsePage(file) {
  const raw = read(file);
  const m = raw.match(/^<!--\n([\s\S]*?)\n-->\n/);
  if (!m) throw new Error(`${path.relative(root, file)}: missing front-matter comment`);
  const meta = {};
  for (const line of m[1].split("\n")) {
    const i = line.indexOf(":");
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  for (const key of ["title", "description"]) {
    if (!meta[key]) throw new Error(`${path.relative(root, file)}: front matter needs "${key}"`);
  }
  let body = raw.slice(m[0].length);
  let head = "";
  const h = body.match(/<!-- @head -->\n([\s\S]*?)<!-- @endhead -->\n/);
  if (h) {
    head = h[1].trim();
    body = body.replace(h[0], "");
  }
  return { meta, head, body: body.trim() };
}

/** Checklist table rendered from src/data/checklist.json. */
function renderChecklist() {
  const { areas } = JSON.parse(read(path.join(src, "data", "checklist.json")));
  const tiers = ["Standard", "Deep", "Move In/Out"];
  const cell = (v, i) =>
    v
      ? `<span class="yes"><span aria-hidden="true">✓</span><span class="visually-hidden">${tiers[i]}: included</span></span>`
      : `<span class="no"><span aria-hidden="true">—</span><span class="visually-hidden">${tiers[i]}: not included</span></span>`;
  const groups = areas.map(([area, tasks], i) => {
    const id = `ck-${area.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
    const count = `${tasks.length} ${tasks.length === 1 ? "item" : "items"}`;
    const rows = tasks
      .map(([name, ...tiersIncluded]) => `<div class="ck-row"><span class="ck-task">${escapeHtml(name)}</span>${tiersIncluded.map(cell).join("")}</div>`)
      .join("\n        ");
    // Only "Whole home" (first area) starts open on mobile.
    return `
    <div class="ck-group" data-open="${i === 0}">
      <button type="button" class="ck-area" aria-expanded="true" aria-controls="${id}">
        <span>${escapeHtml(area)}</span>
        <span class="ck-count"><span>${count}</span><span class="ck-chev" aria-hidden="true">▼</span></span>
      </button>
      <div class="ck-rows" id="${id}">
        ${rows}
      </div>
    </div>`;
  });
  return `<div class="ck-table">
    <div class="ck-row ck-row--head" aria-hidden="true"><span>Area / Result</span><span>Std</span><span>Deep</span><span>Move<br>In/Out</span></div>${groups.join("")}
  </div>`;
}

function copyDir(from, to) {
  if (!fs.existsSync(from)) return;
  fs.cpSync(from, to, { recursive: true });
}

export function build() {
  fs.rmSync(dist, { recursive: true, force: true });
  fs.mkdirSync(dist, { recursive: true });

  const layout = partial("layout");
  const header = partial("header");
  const footer = partial("footer");
  const data = { checklist: renderChecklist() };

  const pagesDir = path.join(src, "pages");
  const pages = fs.readdirSync(pagesDir).filter((f) => f.endsWith(".html")).sort();
  const sitemap = [];

  for (const file of pages) {
    const name = file.replace(/\.html$/, "");
    const { meta, head, body } = parsePage(path.join(pagesDir, file));
    const hero = meta.hero === "true";

    const urlPath = name === "index" ? "/" : name === "404" ? null : `/${name}`;
    const outFile =
      name === "index" || name === "404"
        ? path.join(dist, `${name}.html`)
        : path.join(dist, name, "index.html");

    const vars = { site: SITE_URL, version: VERSION, ...data };
    let headExtra = fill(head, vars);
    if (meta.noindex === "true") headExtra = `<meta name="robots" content="noindex">\n${headExtra}`;

    const html = fill(layout, {
      title: escapeHtml(meta.title),
      description: escapeHtml(meta.description),
      url: SITE_URL + (urlPath || "/404"),
      site: SITE_URL,
      version: VERSION,
      head: headExtra,
      header: fill(header, { scrolled: hero ? "0" : "1", heroAttr: hero ? " data-over-hero" : "" }),
      footer,
      body: (hero ? "" : '<div class="nav-spacer" aria-hidden="true"></div>\n') + fill(body, vars),
    });

    const leftover = html.match(/\{\{\w+\}\}/);
    if (leftover) throw new Error(`${file}: unfilled placeholder ${leftover[0]}`);

    fs.mkdirSync(path.dirname(outFile), { recursive: true });
    fs.writeFileSync(outFile, html);
    if (urlPath) sitemap.push(urlPath);
    console.log(`  ${(urlPath || "404").padEnd(20)} -> ${path.relative(root, outFile)}`);
  }

  copyDir(path.join(src, "css"), path.join(dist, "css"));
  copyDir(path.join(src, "js"), path.join(dist, "js"));
  copyDir(path.join(src, "assets"), path.join(dist, "assets"));
  copyDir(path.join(src, "static"), dist);

  fs.writeFileSync(
    path.join(dist, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemap
      .map((p) => `  <url><loc>${SITE_URL}${p}</loc></url>`)
      .join("\n")}\n</urlset>\n`
  );
  fs.writeFileSync(path.join(dist, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);

  console.log(`Built ${pages.length} pages into dist/ (site URL ${SITE_URL})`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) build();
