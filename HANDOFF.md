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
> Jarvis, read `HANDOFF.md`, `PROJECT_ROADMAP.md`, `DECISIONS.md`, and `SESSIONS.md`. Confirm current checkpoint is `73ae650`, Phase 3.4 is closed, Phase 3.5A-3.5C are complete, Phase 3.5D is implemented locally pending Jay's git checkpoint, then propose the next safe slice before patching.

---

# CURRENT REPO STATE

Branch:
- `main`

Latest product checkpoint:
- `73ae650 Add knowledge page structured data`

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
- implementation-active
- 3.5A complete
- 3.5B complete
- 3.5C complete
- 3.5D complete
- 3.5E v1 complete pending Jay's git checkpoint

Goal:
- turn Knitspeed into a machine-readable textile knowledge authority
- support future LLM discovery and high-intent inbound traffic

Phase plan:
- 3.5A Layout foundation
- 3.5B First real knowledge route
- 3.5C Schema + metadata
- 3.5D Internal linking + discovery flow
- 3.5E Quote attribution integration refinement

Implemented 3.5E v1:
- knowledge page QuoteCTA stores lightweight knowledge article context in sessionStorage
- knowledge CTA click records buyer intent event through existing helper
- homepage quote form hydrates knowledge attribution through the existing selectedArticle contract
- explicit #quote scroll handling brings users directly to the quote form after navigation
- quote payload compatibility is preserved through existing article metadata fields
- no Supabase schema, admin dashboard, routing, CMS, or scoring changes

Implemented 3.5A:
- `src/components/knowledge/KnowledgePageLayout.jsx`
- `src/components/knowledge/SpecSummaryGrid.jsx`
- `src/components/knowledge/FAQBlock.jsx`
- `src/components/knowledge/QuoteCTA.jsx`

Implemented 3.5B:
- `src/data/textileKnowledgePages.js`
- `src/pages/KnowledgeArticlePage.jsx`
- route: `/knowledge/single-jersey-vs-interlock`
- first real knowledge page: Single Jersey vs Interlock

Implemented 3.5C locally:
- `src/components/SEOJsonLd.jsx`
- `src/lib/seoSchema.js`
- JSON-LD support for Organization, Article, FAQPage, and BreadcrumbList
- knowledge page `document.title` and meta description handling
- no route, quote form, admin dashboard, Supabase schema, Prime scoring, or homepage behavior changes

Verified 3.5C locally:
- `npm run build` passes
- `npm run lint` passes
- browser smoke confirmed `/knowledge/single-jersey-vs-interlock` renders and includes 4 `application/ld+json` scripts
- browser smoke confirmed homepage still renders 9 existing article quote CTAs

Implemented 3.5D locally:
- added a small homepage Textile Knowledge discovery block linking to `/knowledge/single-jersey-vs-interlock`
- added a lightweight desktop nav Knowledge link
- added a footer Textile Knowledge link
- kept homepage hierarchy, quote behavior, quote payload, admin dashboard, Supabase schema, Prime scoring, and tracking systems unchanged

Verified 3.5D locally:
- `npm run build` passes
- `npm run lint` passes
- browser smoke confirmed homepage renders the new Textile Knowledge block
- browser smoke confirmed the discovery CTA navigates to `/knowledge/single-jersey-vs-interlock`
- browser smoke confirmed the knowledge route renders and keeps 4 JSON-LD scripts
- browser smoke confirmed `Quote this article` still selects the first article, reaches the quote form, and preserves `finished_article_card` plus article slug metadata

Rules:
- no fake textile content
- no bulk AI article generation
- no routing overhaul
- preserve Prime Engine attribution flow
- preserve buyer-facing naming conventions
- use reusable layouts first
- implement incrementally with checkpoints

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
- `src/pages/KnowledgeArticlePage.jsx` owns first public knowledge article rendering
- `src/components/QuoteForm.jsx` owns the rendered quote form
- `src/components/articles/FinishedArticleGrid.jsx` owns homepage Finished Articles rendering
- `src/components/knowledge/*` owns reusable knowledge page layout blocks
- `src/data/textileKnowledgePages.js` owns conservative hand-authored textile knowledge page data
- `src/lib/buyerIntent.js` owns local/session buyer intent helper functions
- `src/lib/leadInsights.js` owns shared lead count helpers
- `src/lib/textileLabels.js` owns shared textile display labels
- route branching, quote submit logic, selected article state, and minimal knowledge route branching still live in `App.jsx`

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

---

## Phase 3.5G — Knowledge Navigation + Entity Consistency

Status:
- complete
- verified locally

Goal:
- introduce a lightweight knowledge discovery hub before expanding article coverage

Implemented:
- `/knowledge` index route
- registry-driven article listing
- conservative entity consistency language
- implemented-page-only discovery flow

Verified:
- npm run build passes
- npm run lint passes
- browser smoke confirmed `/knowledge` render
- browser smoke confirmed knowledge article navigation works
- browser smoke confirmed existing knowledge schema behavior remains intact

Rules preserved:
- no CMS
- no routing overhaul
- no fake textile content
- no Supabase changes
- no Prime scoring changes

Next likely safe slice:
- Phase 3.5H — Knowledge Taxonomy + Topic Clustering
- keep implementation lightweight and registry-driven
- avoid content explosion


---

## Phase 3.5H — Knowledge Taxonomy + Topic Clustering

Status:
- complete
- verified locally

Goal:
- strengthen knowledge organization before expanding article coverage

Implemented:
- topic cluster metadata
- buyer intent metadata
- tags for the implemented knowledge page
- registry helpers for topic clusters
- topic navigation on `/knowledge`

Verified:
- npm run build passes
- npm run lint passes
- browser smoke confirmed `/knowledge` topic display
- browser smoke confirmed existing article page remains stable

Rules preserved:
- no fake pages
- no CMS
- no sitemap
- no Supabase changes
- no quote flow changes
- no admin dashboard changes

Next likely safe slice:
- Phase 3.5I — Add second hand-authored knowledge article
- candidate: What Is Compact Cotton?
- keep it conservative and grounded in real textile terminology


---

## Phase 3.5I — Second Hand-Authored Knowledge Article

Status:
- complete
- verified locally

Goal:
- expand knowledge coverage carefully with one real buyer-facing textile education article

Implemented:
- Compact Cotton knowledge article
- `/knowledge/what-is-compact-cotton` route
- registry integration
- topic/tag metadata
- related knowledge linking

Verified:
- npm run build passes
- npm run lint passes
- browser smoke confirmed both knowledge articles render
- browser smoke confirmed `/knowledge` lists implemented pages only

Rules preserved:
- no fake specs
- no CMS
- no sitemap
- no Supabase changes
- no quote flow changes
- no admin dashboard changes

Next likely safe slice:
- Phase 3.5J — Knowledge Schema Refinement for Multiple Articles
- keep lightweight
- avoid routing overhaul unless necessary


---

## Phase 3.5I — Second Hand-Authored Knowledge Article

Status:
- complete
- verified locally

Goal:
- expand knowledge coverage carefully with one real buyer-facing textile education article

Implemented:
- Compact Cotton knowledge article
- `/knowledge/what-is-compact-cotton` route
- registry integration
- topic/tag metadata
- related knowledge linking

Verified:
- npm run build passes
- npm run lint passes
- browser smoke confirmed both knowledge articles render
- browser smoke confirmed `/knowledge` lists implemented pages only

Rules preserved:
- no fake specs
- no CMS
- no sitemap
- no Supabase changes
- no quote flow changes
- no admin dashboard changes

Next likely safe slice:
- Phase 3.5J — Knowledge Schema Refinement for Multiple Articles
- keep lightweight
- avoid routing overhaul unless necessary


---

## Phase 3.5I — Second Hand-Authored Knowledge Article

Status:
- complete
- verified locally

Goal:
- expand knowledge coverage carefully with one real buyer-facing textile education article

Implemented:
- Compact Cotton knowledge article
- `/knowledge/what-is-compact-cotton` route
- registry integration
- topic/tag metadata
- related knowledge linking

Verified:
- npm run build passes
- npm run lint passes
- browser smoke confirmed both knowledge articles render
- browser smoke confirmed `/knowledge` lists implemented pages only

Rules preserved:
- no fake specs
- no CMS
- no sitemap
- no Supabase changes
- no quote flow changes
- no admin dashboard changes

Next likely safe slice:
- Phase 3.5J — Knowledge Schema Refinement for Multiple Articles
- keep lightweight
- avoid routing overhaul unless necessary


---

## Phase 3.5J — Multi-Article Schema Refinement

Status:
- complete
- verified locally

Goal:
- stabilize structured data behavior now that multiple knowledge articles exist

Implemented:
- page-object-aware canonical URL helper
- canonical path support for knowledge article schema
- topic/tag-based Article about metadata
- expanded organization textile knowledge terms

Verified:
- npm run build passes
- npm run lint passes
- browser smoke confirmed article JSON-LD remains stable
- browser smoke confirmed Compact Cotton canonical Article URL is correct

Rules preserved:
- no CMS
- no sitemap
- no Supabase changes
- no quote flow changes
- no admin dashboard changes

Next likely safe slice:
- Phase 3.5K — Knowledge Index Metadata
- add document title/meta description for `/knowledge`
- optionally add lightweight CollectionPage schema only if kept simple


---

## Phase 3.5K — Knowledge Index Metadata

Status:
- complete
- verified locally

Goal:
- make the `/knowledge` index page machine-readable and metadata-complete

Implemented:
- document title for `/knowledge`
- meta description for `/knowledge`
- lightweight CollectionPage JSON-LD schema
- breadcrumb schema for knowledge index

Verified:
- npm run build passes
- npm run lint passes
- browser smoke confirmed index JSON-LD schema types
- browser smoke confirmed article pages remain stable

Rules preserved:
- no CMS
- no sitemap
- no Supabase changes
- no quote flow changes
- no admin dashboard changes

Next likely safe slice:
- Phase 3.5L — Add third hand-authored buyer guide
- candidate: What GSM Should T-Shirts Use?
- keep specs production-dependent and avoid fake numbers


---

## Phase 3.5L — Third Hand-Authored Buyer Guide

Status:
- complete
- verified locally

Goal:
- expand high-intent buyer education with a practical T-shirt GSM guide

Implemented:
- T-shirt GSM knowledge article
- `/knowledge/what-gsm-should-t-shirts-use` route
- registry integration
- topic/tag metadata
- related knowledge linking

Verified:
- npm run build passes
- npm run lint passes
- browser smoke confirmed `/knowledge` lists three articles
- browser smoke confirmed GSM article and related links render

Rules preserved:
- no fake GSM rule
- no fake specs
- no CMS
- no sitemap
- no Supabase changes
- no quote flow changes
- no admin dashboard changes

Next likely safe slice:
- Phase 3.5M — Knowledge Route Resolver Cleanup
- reduce manual route branching while avoiding React Router


---

## Phase 3.5M — Knowledge Route Resolver Cleanup

Status:
- complete
- verified locally

Goal:
- reduce route branching as knowledge article count grows

Implemented:
- registry-driven pathname resolver
- generic knowledge article rendering branch
- duplicate manual Compact Cotton route removed

Verified:
- npm run build passes
- npm run lint passes
- browser smoke confirmed knowledge index and article routes remain stable

Rules preserved:
- no React Router
- no CMS
- no sitemap
- no Supabase changes
- no quote flow changes
- no admin dashboard changes

Next likely safe slice:
- Phase 3.5N — Add lightweight knowledge 404 state
- keep it local and simple

