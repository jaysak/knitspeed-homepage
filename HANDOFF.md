# KNITSPEED PRIME ENGINE HANDOFF

Author: Jay + Jarvis
Status: Current Tactical State
Last Updated: 2026-05-10

---

# START HERE

Read these files first:
1. `PROJECT_ROADMAP.md`
2. `DECISIONS.md`
3. `SESSIONS.md`
4. `HANDOFF.md`

---

# CURRENT REPO STATE

Branch:
- `main`

Latest product checkpoint:
- `0004816 Complete Prime article quote flow`

Remote:
- `origin/main`

Known local untracked backup files:
- `scripts/build_products_master.py.bak-p1`
- `src/App.jsx.bak-prime-payload`

Do not commit those backup files unless Jay explicitly asks.

Supabase migration note:
- `supabase db push` is currently blocked by a migration-history mismatch around remote version `20260508`
- direct linked SQL query was used for the authenticated quote insert RLS fix

---

# COMPLETED CHECKPOINT

## Phase 3.4A — Prime Article Quote Flow

Status:
- complete
- committed
- pushed

Implemented:
- finished article frontend data export
- homepage article cards
- article quote button
- selected article state
- quote metadata payload wiring
- build and lint passing

---

# NEXT TASK

## Phase 3.4B — Buyer Intent Tracking

Goal:
- track buyer interest in articles before and during quote submission

Current status:
- slice 1 implemented locally
- slice 2 implemented as dashboard insight cards
- no database schema changes yet

Possible subtasks:
1. Decide whether intent should graduate into Supabase:
   - `lead_activity`
   - additional fields on `quote_leads`
   - delayed until article pages exist
2. Add top article/category counters to dashboard
3. Improve distinction between rendered article cards and truly viewed articles
4. Decide retention/analytics policy for local intent events

Implemented in slice 1:
- local/session article intent tracking
- quote click tracking
- quote submit tracking
- compact Prime intent note appended to quote message
- dashboard article search/display visibility

Implemented in slice 2:
- Prime leads count card
- top quoted articles card
- top usage segments card
- recent Prime article inquiries card
- all insights use existing `quote_leads` data

RLS fix after slice 2:
- logged-in owner/admin quote submissions were failing with `403 Forbidden`
- added `Allow authenticated quote lead inserts` policy on `quote_leads`
- remote Supabase policy has been applied and verified
- fresh quote submit reached Supabase and appeared in dashboard
- verified test lead: `30s Combed Cotton Single Jersey`

Completion gate for quote/lead work:
1. `npm run build` passes
2. `npm run lint` passes
3. local browser quote submission succeeds
4. Supabase insert succeeds with no `403` or `400` error
5. latest test lead appears in `quote_leads`
6. admin dashboard displays the new lead correctly

Implemented in slice 3:
- curated homepage article allowlist/order layer
- file: `src/data/featuredArticleSlugs.js`
- homepage uses approved slugs first
- generated article data remains untouched
- fallback keeps top generated articles if allowlist has no matches
- verified with build, lint, and browser smoke test

---

# STABILIZATION INSPECTION

Status:
- inspected 2026-05-10
- stabilization refactor in progress and verified for extracted slices

Current shape:
- `src/App.jsx` is about 535 lines
- `src/pages/AdminLeadsDashboard.jsx` owns `/admin/leads`
- `src/pages/AdminBuyersDashboard.jsx` owns `/admin/buyers`
- `src/components/QuoteForm.jsx` owns the rendered quote form
- `src/lib/leadInsights.js` owns shared lead count helpers
- `src/lib/textileLabels.js` owns shared textile display labels
- homepage article sections, route branching, quote submit logic, and buyer intent tracking still live in `App.jsx`

Future component boundaries:
- `src/pages/HomePage.jsx`
- `src/pages/AdminLeadsDashboard.jsx`
- `src/pages/AdminBuyersDashboard.jsx`
- `src/components/articles/FinishedArticleGrid.jsx`
- `src/components/quote/QuoteForm.jsx`
- `src/components/admin/LeadInsightCards.jsx`
- `src/lib/buyerIntent.js`

Risk areas:
- homepage sections are growing around article curation and quote intent
- admin leads dashboard is accumulating analytics, filters, status updates, and export logic
- buyer dashboard has similar table/filter/update patterns that may duplicate lead dashboard patterns
- tracking currently mixes local browser events with quote payload enrichment
- quote insert still falls back to local storage, so failures must remain visible during verification
- Supabase migration history has a known remote mismatch around `20260508`; avoid broad migration changes until repaired intentionally

Recommended next stabilization step:
- extract homepage article grid and buyer intent helpers only if behavior can stay surgical
- do not rename `src/auth`, `AuthProvider`, `useProfile`, or `ProtectedRoute` yet
- quote form render was browser-smoked, but no new Supabase quote submission was performed during the refactor

Estimated time:
- 45-90 minutes for the next useful stabilization slice

---

# OPERATING STYLE

Jay prefers:
- terminal-first workflow
- inspect before modifying
- exact shell/patch commands
- surgical changes only
- preserve architecture unless explicitly refactoring
- preserve textile naming/business logic
- avoid overwriting large files blindly
- explain intended patch before applying
- build-test after meaningful patches

Default verification:
- `npm run build`
- `npm run lint`

Generated article data:
- `python3 scripts/export_finished_articles.py`

---

# USEFUL COMMANDS

Check repo:

```bash
git status --branch --short
git log --oneline --decorate -5
```

Run app:

```bash
npm run dev
```

Verify:

```bash
npm run build
npm run lint
```

Regenerate finished articles:

```bash
python3 scripts/export_finished_articles.py
```
