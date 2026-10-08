#!/usr/bin/env node
/**
 * Tiny local server for dist/ that mimics Netlify's clean URLs:
 * /checklist -> dist/checklist/index.html, unknown paths -> dist/404.html.
 * Usage: node scripts/serve.mjs [port] [--watch]   (default 8080, or $PORT)
 * --watch builds first, then rebuilds whenever src/ changes (refresh the browser to see it).
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "dist");
const args = process.argv.slice(2);
const watch = args.includes("--watch");
const port = Number(args.find((a) => /^\d+$/.test(a)) || process.env.PORT || 8080);

if (watch) {
  const { build } = await import("./build.mjs");
  build();
  let timer;
  fs.watch(path.join(root, "..", "src"), { recursive: true }, () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      try {
        build();
      } catch (err) {
        console.error(err.message);
      }
    }, 100);
  });
}

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json",
  ".webmanifest": "application/manifest+json",
  ".xml": "application/xml",
  ".txt": "text/plain; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

function resolve(urlPath) {
  const clean = path.normalize(decodeURIComponent(urlPath)).replace(/^(\.\.[/\\])+/, "");
  const base = path.join(root, clean);
  if (!base.startsWith(root)) return null;
  for (const candidate of [base, path.join(base, "index.html"), `${base}.html`]) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) return candidate;
  }
  return null;
}

if (!fs.existsSync(root)) {
  console.error("dist/ not found. Run `npm run build` first.");
  process.exit(1);
}

http
  .createServer((req, res) => {
    const { pathname } = new URL(req.url, "http://localhost");
    // Netlify Forms only work when deployed; acknowledge locally so the form UI can be tested.
    if (req.method === "POST") {
      req.resume();
      req.on("end", () => res.writeHead(200).end("ok (local dev: form not stored)"));
      return;
    }
    const file = resolve(pathname);
    const status = file ? 200 : 404;
    const target = file || path.join(root, "404.html");
    res.writeHead(status, { "Content-Type": types[path.extname(target)] || "application/octet-stream" });
    fs.createReadStream(target).pipe(res);
  })
  .listen(port, () => console.log(`Serving dist/ at http://localhost:${port}`));
