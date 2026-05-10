# KNITSPEED PRIME ENGINE DECISIONS

Author: Jay + Jarvis
Status: Active
Last Updated: 2026-05-10

---

# PURPOSE

This file stores locked decisions that should survive across sessions.

Use this when deciding whether a change fits the Knitspeed Prime Engine direction.

---

# PRODUCT + BUSINESS DECISIONS

## Prime Engine First

The primary growth engine is inbound buyer intent:
- SEO
- structured product/article pages
- quote flow
- CRM follow-up

Cold lead scraping is secondary.

## Real Textile Data First

Do not invent textile product names.

Product structures, yarn counts, widths, naming, and buyer-facing articles should derive from real sales or normalized source data whenever possible.

## Preserve Raw Textile Naming

Raw textile naming data must be preserved separately from buyer-facing names.

Examples:
- raw shorthand can remain in processed/master files
- buyer-facing names can be generated into finished articles
- curated homepage selection should not delete or mutate raw/generated records

## Buyer-Facing Article Layer

Finished articles are the buyer-facing layer between raw SKUs and the quote form.

The current generated source is:
- `data/processed/finished_articles.csv`

The current frontend export is:
- `src/data/finishedArticles.js`

The export script is:
- `scripts/export_finished_articles.py`

## Curation Should Be Separate

Not every generated article belongs on the public homepage.

Future product curation should use a separate allowlist/order config rather than editing generated article data by hand.

## LLM Discovery Rules

Phase 3.5 builds Knitspeed as a machine-readable textile knowledge authority.

Rules:
- no fake textile content
- no bulk AI article generation
- no routing overhaul
- preserve Prime Engine attribution flow
- preserve buyer-facing naming conventions
- use reusable layouts first
- implement incrementally with checkpoints
- keep knowledge pages practical for buyers and grounded in real textile concepts

---

# TECHNICAL DECISIONS

## Stack

Current stack:
- React
- Vite
- Tailwind
- Supabase
- GitHub
- Vercel

## Auth + Dashboard Safety

Do not break existing auth/dashboard flows while changing the public quote engine.

Current protected routes:
- `/admin/leads`
- `/admin/buyers`

## Generated Files

Generated frontend files must include source comments and should be regenerated through scripts.

Do not manually edit generated data files unless explicitly fixing the generator output.

## Patch Style

Default workflow:
- inspect before modifying
- explain intended patch before applying
- use surgical patches
- use scripts for generated data
- build-test after meaningful patches
- avoid broad rewrites unless explicitly refactoring

## Completion Requires User-Flow Verification

Do not mark task complete just because build and lint pass.

For quote or lead work, completion requires:
1. `npm run build` passes
2. `npm run lint` passes
3. local browser quote submission succeeds
4. Supabase insert succeeds with no `403` or `400` error
5. latest test lead appears in `quote_leads`
6. admin dashboard displays the new lead correctly

If any step fails, mark the work as `implemented but not verified` and document the blocker in `SESSIONS.md` and `HANDOFF.md`.

---

# GIT DECISIONS

Use clean commits for checkpoints.

Do not stage unrelated dirty or backup files.

Known local backup files may exist and should not be committed unless explicitly requested:
- `scripts/build_products_master.py.bak-p1`
- `src/App.jsx.bak-prime-payload`
