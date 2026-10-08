# Handoff: Umi Cleaning marketing site

## Overview
Marketing and booking website for **Umi Cleaning LLC**, a residential cleaning service in Portland, Oregon. Seven pages: Home, Checklist, Contact (quote request), Book (embedded ScheduleDrop booking form), Careers (embedded ScheduleDrop hiring form), Terms of Service, Privacy Policy. Mobile-first; must look right at 390px wide and scale to desktop (content max-width 1160px).

**Goal of this handoff:** build a fast, static, SEO-friendly site deployable to **Netlify**, with clean URLs.

## About the Design Files
Files in `design_reference/` are **design references created in HTML** — prototypes showing the intended look, copy and behavior. They use a proprietary runtime (`support.js`, `<x-dc>`, `{{ }}` template holes, `style-hover` attributes) that is **not** included and should **not** be shipped. Recreate the designs as plain production code.

**Recommended stack** (no existing codebase): Astro (or plain static HTML + one CSS file + a tiny vanilla JS file). Requirements:
- Static HTML output, no client-side framework needed. Pages must paint immediately (no JS-gated rendering).
- One shared stylesheet with CSS custom properties (tokens below). Convert the inline styles in the references into classes.
- Shared header/footer as components/partials.
- Images optimized (WebP/AVIF, responsive `srcset`, `loading="lazy"` below the fold; hero `fetchpriority="high"`).
- Proper `<title>`, meta description, Open Graph tags, favicon (use `assets/brand/umi-icon-512.png`), and `LocalBusiness` JSON-LD on Home.

## Fidelity
**High-fidelity.** Colors, typography, spacing, copy and responsive behavior are final unless marked PLACEHOLDER. Match pixel-closely. All copy is verbatim — do not rewrite (including the lowercase "we make it easy…" heading and "WHY CHOOSE US ?" label, which the client chose).

Items marked with a yellow `PLACEHOLDER` tag in the references are **internal notes — do not render them** on the live site; collect them in a TODO list instead (see "Open items").

## URLs (Netlify)
| Page | URL | Reference file |
|---|---|---|
| Home | `/` | Home.dc.html |
| Checklist | `/checklist` | Checklist.dc.html |
| Contact | `/contact` | Contact.dc.html |
| Book | `/book` | Book.dc.html |
| Terms of Service | `/terms-of-service` | Terms.dc.html |
| Privacy Policy | `/privacy-policy` | Privacy.dc.html |
| Careers | `/careers` | Careers.dc.html |

Update every internal link (`Home.dc.html#services` → `/#services`, `Book.dc.html` → `/book`, etc.).

## Design Tokens
```css
--accent:#4a6b4d;        /* forest sage – buttons, labels, links */
--accent-hover:#3d5a40;
--accent-deep:#35513a;
--accent-tint:#e8efe7;   /* pale sage fills */
--accent-line:#c8d8c6;   /* How-it-works step rules */
--bg:#f5f7f2;            /* page background */
--surface:#ffffff;       /* cards, alt sections, footer */
--on-accent:#ffffff;
--border:#e2e8dc; --border-2:#d3dbcd; --border-soft:#edf0e9;
--ink:#232b22; --ink-2:#485043; --muted:#757d70; --muted-soft:#bdc5b8;
--nav-bg:rgba(245,247,242,0.93);
```
Logo leaf green: `#6B8468` (in the logo artwork only).

**Fonts (Google Fonts):**
- `Outfit` 400/500/600 — body, UI, nav, buttons.
- `Source Serif 4` (opsz 8..60) 400, 500, italic 400 — headings, big numbers, prices.

**Type scale:**
- H1 hero: Source Serif 4 400, `clamp(34px,4.6vw,52px)`, line-height 1.08, letter-spacing -0.02em. Mobile: 36px / 1.1.
- H1 inner pages: Source Serif 4 400, `clamp(34px,5vw,52px)` / 1.05 (Book: `clamp(32px,4.5vw,46px)`).
- H2 sections: Source Serif 4 400, `clamp(30px,4vw,44px)` / 1.1, -0.02em.
- Eyebrow label: Outfit 500, 13px, uppercase, letter-spacing 0.08em, `--accent`.
- Stat numbers: Source Serif 4 500, `clamp(44px,5vw,60px)` / 1, -0.03em, `--accent`.
- Price: Source Serif 4 400, 44px / 1.
- Body lead: 17px / 1.5 `--ink-2`. Card body: 15px / 1.5. Small: 14px.

**Radii:** cards 20px (16px on mobile service cards), inputs 10px, menu button 12px, pills/buttons 999px.
**Spacing:** section padding 96px 20px; content max-width 1160px (Checklist 960px); card grid gap 16px; section header block margin-bottom 44px.
**Shadow:** primary hero button `0 8px 24px rgba(53,81,58,0.3)`. Otherwise flat with 1px borders.

## Global components

### Header / Nav (Nav.dc.html)
- Fixed, 64px tall, inner max-width 1160px, padding 0 20px. Inner pages add a 64px spacer below.
- Left: logo mark (34px tall) + two-line wordmark: "Umi Cleaning" (Outfit 600, 20px, -0.02em) over "Portland" (Source Serif 4 italic 400, 13px, letter-spacing 0.02em, opacity 0.8, 3px top margin).
- Desktop (>860px): links Services · How It Works · Checklist · Contact (15px, gap 28px), phone "503-479-4668" (`tel:+15034794668`, 500), "Book Now" pill (accent bg, 15px 500, padding 10px 18px).
- Mobile (≤860px): row gap 10px. Phone pill "(503) 479-4668" (`tel:+15034794668`, 13px 500, letter-spacing -0.01em, padding 9px 12px, nowrap) + 44×44 **circular hamburger button** (1px `--border-2`, radius 50%, three 18px×2px lines 6px apart; animates to an X when open: top/bottom lines rotate ±45°, middle fades). Opens a full-width panel below the bar: same links (17px, padding 12px 4px, divider `--border-soft`) + phone in accent. Tapping an anchor link closes the panel.
- **Scroll state:** at `scrollY <= 40` on Home (over the dark hero photo) the header is transparent, all text white, the phone/"Book Now" pill is white (`rgba(255,255,255,0.94)`) with dark ink text, hamburger `rgba(255,255,255,0.14)` with `rgba(255,255,255,0.5)` border, and the **light logo** (`umi-mark-light.png`) shows. After 40px **or while the mobile menu is open**: background `--nav-bg` + `backdrop-filter: blur(10px)` + 1px bottom border, full-color logo (`umi-mark.png`), accent pill with white text. Transition background 0.2s ease. On pages without a hero, use the scrolled style always.
- Mobile (≤760px): hide the page scrollbar (`scrollbar-width:none`, `::-webkit-scrollbar{display:none}`); scrolling still works.
- Implement with a few lines of vanilla JS (toggle `data-scrolled` on scroll / menu open, toggle the menu panel).

### Footer (in Home.dc.html; reuse on all pages)
White surface, top border, padding 56px 20px 40px, 4 auto-fit columns (min 200px), gap 40px:
1. Logo (44px) + "Umi Cleaning" (22px 600) + blurb "Residential cleaning in Portland, Oregon. Thorough, reliable, and tailored to your home." (15px/1.6 `--muted`).
2. **Company** (12px 500 uppercase 0.1em `--muted-soft`): Services, How it works, Contact, Cleaning checklist, Join our team (→/careers).
3. **Reach us**: (503) 479-4668 (`tel:5034794668`), hello@umicleaning.com (mailto), Request a quote (→/contact), Portland, OR, "Mon–Sat · 8 AM – 6 PM" (`--muted`).
4. Pill "Bonded & Insured · Portland, OR" (tint bg, deep text, 7px accent dot), "© 2026 Umi Cleaning. All rights reserved.", links Terms of Service · Privacy Policy (14px `--muted`).
Links 15px `--ink-2`, hover `--accent`.

### Buttons
- Primary: accent bg, white, Outfit 500 16px, padding 14px 24–26px, min-height 48–50px, radius 999px, hover `--accent-hover`.
- Secondary (light pages): white bg, 1px `--border-2`, ink text.
- Secondary (on hero): `rgba(255,255,255,0.14)` bg, 1px `rgba(255,255,255,0.55)` border, white text, `backdrop-filter: blur(6px)`, hover `rgba(255,255,255,0.24)`.

## Screens

### Home (`/`) — section order
1. **Hero** — full-bleed photo `assets/photos/hero.png` (`background-size:cover`, center). **Mobile (≤760px) uses a different photo: `assets/photos/hero-mobile.png`**, `background-position:center 40%`, fallback color `#ece7dd`. Min-height 82vh (mobile 84svh). Two dark scrims (see reference for exact gradients). Mobile scrims are lighter: vertical `rgba(16,24,17,0.5) 0% → 0.4 50% → 0.36 85% → 0.15 100%` plus radial center `rgba(16,24,17,0.3) → transparent`. 56px fade to `--bg` at the bottom.
   - Content (max-width 560px, left-aligned desktop; **centered horizontally and vertically on mobile**, max-width 360px). Text-shadow `0 2px 16px rgba(12,19,12,0.6)`.
   - Badge pill (accent bg, white 13px 500, padding 7px 14px) with green live dot (`#4ADE80`, 8px, ring `0 0 0 3px rgba(74,222,128,0.4)`): "Now booking in Portland & surrounding metro".
   - H1: "Portland's premium home cleaning, " + italic span in `#cbdcc7`: "book a clean home in minutes."
   - Buttons: "Book a Clean" (→/book) and "Call or text (503) 479-4668" (`tel:+15034794668`, secondary-on-hero style), side by side (flex:1, min-width 150px, max-width 420px total). Mobile: stacked, centered, max-width 280px.
   - Trust line 15px 500 `#e9eee6`: "Bonded & insured · Cancel anytime".
   - Lead paragraph (desktop only, hidden ≤760px): "Life's busy enough. We make it easy to get a clean home, fast, with cleaners you can trust, on a schedule that works for you".
2. **Trust strip**: white, bordered top/bottom, centered row (wraps, gap 12px 36px), 14px `--ink-2`. Each item: 18px line icon (stroke `--accent`, 1.8 width, round caps; SVG paths in reference) + label, gap 8px:
   - Shield with check: "Bonded & insured"
   - Clock: "Same-day availability"
   - Person with check: "Background-checked cleaners" (**mobile label: "Vetted cleaners"**)
   - Credit card: "Pay after the job"
   - **Mobile (≤760px): 2×2 grid**, gap 14px 12px, 13.5px.
3. **Why Choose Us** (`#why-us`) — label "WHY CHOOSE US ?", H2 "we make it easy to get a spotless home with cleaners you can trust", sub "same day availability, real prices up front, and a cleaner on the way." Three stat cards (white, 1px border, r20, padding 28px): "4.9" + star icon (34px, currentColor) / "Average rating across all homes cleaned."; "100%" / "Satisfaction guaranteed. Not thrilled with something? Tell us within 24 hours and we'll come back to make it right, free."; "2 min" / "Average time to get booked, from address to confirmed visit."
4. **Services** (`#services`, white band) — label "Services", H2 "Four ways we clean". Four cards (bg `--bg`, r20, overflow hidden): square 1:1 photo on top, then padding 22px: title (Source Serif 24px), description (14.5px/1.55), link.
   - Standard cleans — "Kitchens, bathrooms, bedrooms and living areas. Book it whenever you need it." — "See what's included →" (/checklist) — `svc-standard.webp`
   - Recurring cleans — "Weekly to monthly. The more often you book, the less you pay per visit." — "Set up recurring cleans →" (/book) — `svc-recurring.webp`
   - Deep cleans — "Baseboards, inside appliances and detail work. Ideal for a first visit." — "Book a deep clean →" (/book) — `svc-deep.webp`
   - Move-in & move-out cleans — "Cabinets, closets and appliances in an empty home. Built for deposits." — "Book a move clean →" (/book) — `svc-move.webp`
   - Below the grid, centered (margin-top 32px): secondary button "See what's included in each clean" with an 18px clipboard-check line icon (accent stroke) → /checklist. White bg, 1px `--border-2`, hover border/text `--accent`.
   - Desktop: auto-fit min 260px. **Mobile (≤760px): 2×2 grid**, gap 10px, r16, padding 12px 12px 14px, title 17px/1.2, **description hidden**, link 13px.
5. **Pricing: removed for now.** The client is finalizing prices. Do **not** build a pricing section or Pricing nav/footer links. Keep the layout easy to add later: the previous design is in `design_reference/Home-with-pricing.dc.html` (three cards: Standard / Deep / Move-Out, "Starting at" prices, between Services and How It Works).
5. **How It Works** (`#how-it-works`, bordered band) — label "How it works", H2 "From booking to done, in four steps". Ordered list, auto-fit min 230px, each item: 2px `--accent-line` top rule, serif number 36px accent, title 19px 500, body 15px.
   1. Book online in under a minute — Tell us about your home, pick a date and time, and see your instant estimate before you confirm.
   2. A cleaner is dispatched to your home — We match your booking with an independent cleaning professional in Portland and confirm the visit.
   3. Pay securely after the job's done — Your card on file is charged once the clean is complete. Final price is confirmed on arrival.
   4. Set it and forget it — Choose weekly, bi-weekly, every 3 weeks or monthly and your next clean books itself.
6. **Footer.**

Anchor sections need `scroll-margin-top: 88px`; `html{scroll-behavior:smooth}`.

### Checklist (`/checklist`)
Max-width 960px. Label "What's included", H1 "The cleaning checklist", sub "What's included in each service, by area. Extras can be added at booking."
Table card (white, r20): header row **Area / Result | Std | Deep | Move In/Out** (12px uppercase `--muted`; columns `1fr 72px 72px 72px`). Area header rows (15px 600 accent on `--bg`) show the area name left and the item count right ("14 items"). Task rows 15px with ✓ (accent) / — (`--muted-soft`).
- **Data is final** (from the client's spreadsheet): 4 areas: Whole home (14), Kitchen (15), Bathrooms (7), Laundry room (1). Copy the `data` array in `design_reference/Checklist.dc.html` verbatim (1 = included, 0 = not).
- **Mobile (≤760px): accordion.** Each area header is a button with a ▼ chevron (rotates 180° when open). Only "Whole home" is open on load; multiple can be open. Rows tighten to padding 9px 12px, 14px text, columns `1fr 44px 44px 52px`; main padding 40px 16px 64px. Desktop: all areas always open, no chevrons. Use `<details>/<summary>` or a few lines of JS.
- Below the table: "✓ included · — not included", then a **"Good to know"** list (copy verbatim from reference), then "Book a Clean" (/book) and "Get a quote" (/contact) buttons.

### Contact (`/contact`)
Two columns (auto-fit min 340px, gap 48px). Left: label "Contact", H1 "Get a quote", intro with "Book online" link, details block. Right: form card (white, r20, padding 28px) with Name*, Phone*, Email*, Address, ZIP*, Service select* (Standard Clean / Deep Clean / Move-In / Move-Out / Recurring cleaning / Not sure yet), SMS-consent checkbox (exact text in reference), "Request a Quote" button. Inputs 46px, r10, 1px `--border-2`, focus outline 2px accent. On submit show a tint success message "Thanks — request received. We'll be in touch shortly."
**Submission:** use **Netlify Forms** (`data-netlify="true"`, honeypot) unless the client provides a Jobber integration. Client intends to route leads to Jobber eventually.

### Book (`/book`)
Heading "Book a clean" + sub "Your estimate updates as you go. The final price is confirmed on arrival, and your card is charged after the job is done." Then a white bordered r20 card containing the **ScheduleDrop iframe** (full width, `height:max(900px, calc(100vh - 140px))`, no border). The exact iframe `src` (with token) is in `design_reference/Book.dc.html` — copy verbatim.

### Careers (`/careers`)
Same layout as Book: label "Join our team", H1 "Clean with Umi", sub "We're looking for reliable, detail-oriented cleaning professionals in the Portland area. Apply below and we'll be in touch." Then a white bordered r20 card containing the **ScheduleDrop hiring iframe** (full width, `height:max(900px, calc(100vh - 140px))`, no border). Exact `src` (with token) is in `design_reference/Careers.dc.html`; copy verbatim.

### Terms of Service (`/terms-of-service`) and Privacy Policy (`/privacy-policy`)
Long-form legal pages; copy the text **verbatim** from the references (they match the client's final Word documents). Terms is **one page** split into **Part One, Legal Terms** (sections 1–7) and **Part Two, Service Policies** (sections 8–14), plus 15. Contact; with a Contents box near the top linking to `#section-N`, `#part-one`, `#part-two`. Section 11 (Cancellations) contains a color-coded fee table (48+ hrs green / 24–48 hrs yellow / under 24 hrs red; exact colors in the reference). **No "Last updated" line** on either page (client decision). **No download/PDF option** on these pages.

## Interactions & Behavior
- Nav scroll state + mobile menu (see Header).
- Smooth anchor scrolling with 88px offset.
- Hover: links → `--accent`; primary buttons → `--accent-hover`.
- Breakpoints: 860px (nav), 760px (hero, trust strip and services mobile layouts, hidden scrollbar). Everything else is fluid (auto-fit grids with `minmax(min(100%,Npx),1fr)`).
- Touch targets ≥44px on mobile.

## Assets
- `assets/logo/umi-mark.png` — full-color house+leaves mark (nav after scroll, footer).
- `assets/logo/umi-mark-light.png` — light version for over the hero photo.
- `assets/brand/` — full logo files, 512px icon (favicon/OG), `colors.txt`.
- `assets/photos/hero.png` — desktop hero background.
- `assets/photos/hero-mobile.png` — mobile hero background (≤760px). In the reference it is loaded from `uploads/pasted-1791363724893-0.png`; use this file instead.
- `assets/photos/svc-standard.webp`, `svc-recurring.webp`, `svc-deep.webp`, `svc-move.webp` — the four service photos as currently cropped/used on the site (use these). `*-original.png` are the uncropped originals for two of them.

## Spam / bot protection
- Contact form (Netlify Forms): add a honeypot field (`netlify-honeypot`) and rely on Netlify's built-in spam filtering. Optional: Cloudflare Turnstile verified in a Netlify Function, only if spam becomes a problem.
- ScheduleDrop booking and hiring iframes are hosted by ScheduleDrop; no protection to add on our side.
- **Do not move DNS to Cloudflare.** Host on Netlify and point the domain with the minimum records Netlify asks for. Leave the existing **Google Workspace** MX, SPF, DKIM and DMARC records untouched so email keeps working.

## Open items (from client)
- **FAQ section:** client will supply questions/answers. Planned as an accordion (one open at a time) near the bottom of Home, above the footer.
- Pricing section is hidden until prices are final (see Home section 5).
- **Re-clean window mismatch:** the Home "100%" card says 24 hours; Terms section 13 (Re-Clean Guarantee) says 48 hours. Client to pick one before launch.
- Contact form destination: Netlify Forms (email to hello@umicleaning.com) until a Jobber request form/integration is provided.
- Checklist add-on prices (in the client's spreadsheet) are not shown on the site yet.

## Files
`design_reference/` — Home, Nav (header), Checklist, Contact, Book, Careers, Terms, Privacy `.dc.html`, plus `Home-with-pricing.dc.html` for the future pricing section. Read the markup for exact inline styles and copy; ignore the runtime-specific syntax.
