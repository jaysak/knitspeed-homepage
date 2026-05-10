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

Magic words for next boot:
> Jarvis, read `HANDOFF.md`, `PROJECT_ROADMAP.md`, `DECISIONS.md`, and `SESSIONS.md`. Confirm current checkpoint is `de0dc52`, Phase 3.4 is closed, Phase 3.5 is planning-active, then propose the next safe slice before patching.

---

# CURRENT REPO STATE

Branch:
- `main`

Latest product checkpoint:
- `de0dc52 Extract homepage article intent modules`

Remote:
- `origin/main`

Local backup archive:
- `.codex-backups/`

Do not commit local backup archives unless Jay explicitly asks.

Supabase migration note:
- `supabase db push` is currently blocked by a migration-history mismatch around remote version `20260508`
- direct linked SQL query was used for the authenticated quote insert RLS fix

---

# COMPLETED CHECKPOINT

## Phase 3.4A-3.4B — Prime Article Flow + Buyer Intent

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
- local/session article intent tracking
- Prime dashboard insight cards
- curated homepage article allowlist/order layer
- authenticated quote insert RLS fix
- modular dashboard and quote form refactor
- build and lint passing

Verified 3.4B slice 3:
- file: `src/data/featuredArticleSlugs.js`
- homepage uses approved slugs first
- generated article data remains untouched
- fallback keeps top generated articles if allowlist has no matches
- verified with build, lint, and browser smoke test

---

# COMPLETED CHECKPOINT

## Phase 3.4C — Buyer Qualification Layer

Status:
- complete
- Supabase nullable columns applied
- authenticated `/admin/leads` visual confirmation completed

Goal:
- qualify Prime leads before scaling inbound discovery traffic

Implemented fields:
- `monthly_usage_kg`
- `buyer_type`
- `target_market`
- `production_stage`
- `sourcing_pain_points`

Implemented files:
- `supabase/migrations/202605101245_add_buyer_qualification_fields.sql`
- `src/components/QuoteForm.jsx`
- `src/App.jsx`
- `src/pages/AdminLeadsDashboard.jsx`

Verified so far:
- live `quote_leads` schema includes all five qualification columns
- `npm run build` passes
- `npm run lint` passes
- local browser quote submission succeeded
- Supabase insert succeeded with no `403` or `400`
- latest verified test lead appears in `quote_leads`: `3.4C Pain Point Test`
- authenticated `/admin/leads` displays `3.4C Pain Point Test` with buyer type, target market, monthly usage, production stage, and sourcing pain points

Do not build yet:
- Phase 3.5 LLM Discovery / Authority Layer
- Phase 3.5 is planned after 3.4C, not before it

---

# COMPLETED CHECKPOINT

## Phase 3.4D — Prime Lead Scoring

Status:
- complete
- authenticated `/admin/leads` visual confirmation completed

Goal:
- rank Prime leads using existing `quote_leads` fields only

Implemented approach:
- deterministic scoring helper in `src/lib/leadInsights.js`
- no new Supabase table
- no schema change
- no quote form change

Score factors:
- Prime source
- article intent
- quote quantity
- monthly usage
- buyer type
- production stage
- sourcing pain points
- commercial usage type

Verified so far:
- `npm run build` passes
- `npm run lint` passes
- live lead sanity check scores recent qualified leads as Hot and older article leads as Warm
- authenticated `/admin/leads` displays Hot Prime leads card, Top Prime lead scores card, and row-level Score column

---

# COMPLETED CHECKPOINT

## Phase 3.4E — Lead Action Workflow

Status:
- Phase 3.4 closed
- stable checkpoint verified
- build and lint passing
- live SQL applied
- authenticated visual confirmation completed from Jay's browser

Goal:
- add operational CRM behavior to inbound Prime leads without changing scoring or quote intake

Implemented fields:
- `lead_owner`
- `follow_up_at`

Existing workflow fields used:
- `sales_notes`
- `last_contact_at`
- `lead_status`

Implemented files:
- `supabase/migrations/202605101820_add_lead_action_workflow_fields.sql`
- `supabase/migrations/202605101905_stabilize_lead_action_workflow.sql`
- `src/pages/AdminLeadsDashboard.jsx`
- `src/components/articles/FinishedArticleGrid.jsx`
- `src/lib/buyerIntent.js`

Implemented behavior:
- authenticated update RLS policy for `quote_leads`
- owner assignment per lead
- follow-up timestamp per lead
- internal sales notes per lead
- automatic `last_contact_at` update when notes are changed
- locked workflow statuses: new, contacted, quoted, negotiating, won, lost
- compatibility read fallback for prior `assigned_owner` and `next_followup_at` fields
- workflow filters for needs follow-up, scheduled follow-up, untouched over 3 days, and unassigned open leads
- follow-up due and unassigned open lead KPI cards
- workflow fields included in CSV export
- final post-3.4 stabilization extracted homepage article grid and buyer intent helpers without behavior changes

Verified so far:
- `npm run build` passes
- `npm run lint` passes
- local browser smoke reached protected `/admin/leads` gate
- Jay applied the 3.4E SQL successfully in Supabase
- authenticated `/admin/leads` screenshot displays Follow-ups due, Unassigned open, workflow filter, Action controls, Notes controls, and Last touched display
- code inspection confirms `lead_status`, `lead_owner`, `sales_notes`, `follow_up_at`, and `last_contact_at` save through Supabase updates and are reloaded through `select("*")`
- dashboard metrics, workflow filters, and CSV export use canonical workflow fields with compatibility fallbacks only
- homepage smoke confirmed curated Finished Articles order, selected article state, quote field prefill, quote metadata payload, scroll-to-quote behavior, and buyer intent event path still work after extraction

Notes:
- Prime scoring logic was not changed
- homepage and quote payload were not changed
- stable workflow field names are `lead_owner` and `follow_up_at`; prior `assigned_owner` and `next_followup_at` are compatibility fields only
- intelligence fields remain separate from workflow fields
- do not create more 3.4E sub-phases unless there is a real regression
- linked Supabase schema queries from this shell are still blocked by missing Supabase access token
- Supabase migration history still has the known remote mismatch around `20260508`; apply the 3.4E SQL intentionally rather than broad-pushing migrations unless history is repaired

---

# NEXT TASK

## Phase 3.5 — LLM Discovery / Authority Layer

Status:
- planning-active
- do not implement until Jay explicitly approves the first Phase 3.5 build slice

Goal:
- turn Knitspeed into a machine-readable textile knowledge authority
- support future LLM discovery and high-intent inbound traffic

First likely slice:
- inspect current routing and data shape
- plan lightweight knowledge-page structure
- avoid routing overhaul
- avoid fake/generated textile content
- keep Prime Engine lead quality intact

Completion gate for quote/lead work:
1. `npm run build` passes
2. `npm run lint` passes
3. local browser quote submission succeeds
4. Supabase insert succeeds with no `403` or `400` error
5. latest test lead appears in `quote_leads`
6. admin dashboard displays the new lead correctly

---

# STABILIZATION INSPECTION

Status:
- inspected 2026-05-10
- Phase 3.4 stabilization closed and verified

Current shape:
- `src/App.jsx` is about 435 lines
- `src/pages/AdminLeadsDashboard.jsx` owns `/admin/leads`
- `src/pages/AdminBuyersDashboard.jsx` owns `/admin/buyers`
- `src/components/QuoteForm.jsx` owns the rendered quote form
- `src/components/articles/FinishedArticleGrid.jsx` owns homepage Finished Articles rendering
- `src/lib/buyerIntent.js` owns local/session buyer intent helper functions
- `src/lib/leadInsights.js` owns shared lead count helpers
- `src/lib/textileLabels.js` owns shared textile display labels
- route branching, quote submit logic, and selected article state still live in `App.jsx`

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
