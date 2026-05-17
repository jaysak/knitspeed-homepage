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


---

## Phase 3.5N — Lightweight Knowledge 404 State

Status:
- complete
- verified locally

Goal:
- provide graceful recovery for invalid knowledge article routes

Implemented:
- lightweight knowledge fallback page
- implemented article recovery links
- navigation back to `/knowledge`
- pathname-based unknown route handling

Verified:
- `npm run build` passes
- `npm run lint` passes
- browser smoke confirmed existing knowledge pages remain stable
- browser smoke confirmed invalid knowledge routes render fallback page

Rules preserved:
- no React Router
- no CMS
- no sitemap
- no Supabase changes
- no quote flow changes
- no admin dashboard changes

Next likely safe slice:
- Phase 3.5O — Lightweight related-topic recommendation refinement
- keep internal-linking focused and registry-driven
- avoid SEO over-engineering


---

## Phase 3.5O — Lightweight Related-Topic Refinement

Status:
- complete
- verified locally

Goal:
- improve internal knowledge discovery while keeping architecture lightweight

Implemented:
- topic-cluster fallback recommendations
- preservation of manual related article ordering
- category labels for related article cards

Verified:
- `npm run build` passes
- `npm run lint` passes
- browser smoke confirmed related recommendations render correctly

Rules preserved:
- no React Router
- no CMS
- no sitemap
- no Supabase changes
- no quote flow changes
- no admin dashboard changes

Next likely safe slice:
- Phase 3.5P — Lightweight knowledge search/filtering on `/knowledge`
- keep registry-driven and client-side only


---

## Phase 3.5P — Lightweight Knowledge Search and Filtering

Status:
- complete
- verified locally

Goal:
- make the knowledge index easier for buyers to browse as article count grows

Implemented:
- client-side search input on `/knowledge`
- interactive topic filters
- result count
- clear filters action
- empty-state recovery

Verified:
- `npm run build` passes
- `npm run lint` passes
- browser smoke confirmed search/filter behavior on `/knowledge`

Rules preserved:
- no React Router
- no CMS
- no sitemap
- no Supabase changes
- no quote flow changes
- no admin dashboard changes

Next likely safe slice:
- Phase 3.5Q — Add fourth hand-authored buyer guide
- candidate: Combed Cotton vs Carded Cotton
- keep textile claims conservative and production-dependent


---

## Phase 3.5Q — Fourth Hand-Authored Buyer Guide

Status:
- complete
- verified locally

Goal:
- strengthen yarn-quality textile education coverage with a high-intent buyer topic

Implemented:
- Combed Cotton vs Carded Cotton article
- yarn-quality cluster expansion
- related knowledge integration

Verified:
- `npm run build` passes
- `npm run lint` passes
- browser smoke confirmed article routing and related recommendations

Rules preserved:
- no React Router
- no CMS
- no sitemap
- no Supabase changes
- no quote flow changes
- no admin dashboard changes

Next likely safe slice:
- Phase 3.5R — Lightweight article reading progress polish
- keep UI-only and lightweight


---

## Phase 3.5R — Lightweight Reading Progress Polish

Status:
- complete
- verified locally

Goal:
- improve article reading experience with lightweight UI feedback

Implemented:
- sticky reading progress bar
- scroll-based progress tracking

Verified:
- `npm run build` passes
- `npm run lint` passes
- browser smoke confirmed progress behavior on article pages

Rules preserved:
- no React Router
- no CMS
- no sitemap
- no Supabase changes
- no quote flow changes
- no admin dashboard changes

Next likely safe slice:
- Phase 3.5S — Add fifth hand-authored buyer guide
- candidate: What Causes Spirality in Knitted Fabric?


---

# CURRENT STRATEGIC DIRECTION — LLM TEXTILE INTELLIGENCE

Status:
- active and compounding

The Phase 3.5 knowledge layer has moved beyond isolated SEO pages.

It now functions as:
- buyer education
- semantic textile graph
- LLM retrieval layer
- sourcing trust accumulation
- quote-intent enrichment
- production-aware textile intelligence foundation

Current knowledge graph coverage includes:
- knitted fabric structures
- yarn quality
- GSM and fabric specification
- fabric behavior and spirality
- fabric finishing and garment feel
- garment-outcome sourcing considerations

Operating rule:
- build high-density textile reasoning slowly
- avoid shallow AI article generation
- avoid fake certainty
- avoid defect-panic framing
- preserve commercially safe language
- explain relationships between yarn, structure, finishing, washing, garment construction, and sourcing decisions

Strong future article candidates:
- Why Fabric GSM Can Feel Different
- What Causes Pilling in Knitted Fabrics
- How Shrinkage Is Evaluated in Apparel Fabrics
- Combed Cotton vs Compact Cotton
- How Fabric Width Affects Garment Production

Next likely safe slice:
- Phase 3.5U — continue one hand-authored buyer guide only
- keep the same registry-driven architecture
- do not add CMS, sitemap, React Router, Supabase changes, admin changes, quote flow changes, or Prime scoring changes

---

# LATEST KNOWLEDGE CHECKPOINTS

Completed:
- Phase 3.5U — Why Fabrics With the Same GSM Can Feel Different
- Phase 3.5V — What Causes Pilling in Knitted Fabrics?

Current knowledge graph now covers:
- structure
- yarn quality
- GSM
- spirality
- finishing
- garment feel
- pilling and wear behavior

Important implementation note:
- future article insertion should use the safe final-array-marker pattern
- run `node --check src/data/textileKnowledgePages.js` before build/lint

---

# LATEST KNOWLEDGE SYSTEM STATE

Knowledge layer now includes:
- yarn quality intelligence
- fabric structure intelligence
- GSM interpretation
- finishing behavior
- spirality behavior
- pilling behavior
- shrinkage evaluation
- wash testing context
- fabric width production effects

System characteristics:
- sourcing-aware
- production-aware
- commercially safe
- avoids panic framing
- avoids blame-oriented language
- designed for long-term semantic authority

Knowledge index now grouped by:
- Fabric Structures
- Yarn Quality
- Fabric Specification
- Fabric Behavior
- Fabric Finishing
- Production Behavior

Important operational lesson:
- Quote CTA debugging issue was route confusion:
  - `/knowledge` = index
  - `/knowledge/:slug` = article page

---

# CURRENT CHECKPOINT — Phase 3.6C

Status:
- stable local checkpoint
- dyeing knowledge system active
- temporal manufacturing intelligence active internally

Implemented:
- production-aware dyeing knowledge pages
- registry-driven dyeing routes
- temporal manufacturing signal layer
- seasonal pressure logic
- dyeing complexity scoring
- sourcing volatility signals
- production readiness scoring
- defensive knowledge article rendering
- normalized related knowledge routing

Verified:
- dyeing article routes render
- related buyer guide links work
- build passes
- calm UX preserved

Current architecture direction:
semantic textile authority
→ production memory
→ relationship weighting
→ temporal manufacturing intelligence
→ future sourcing intelligence

Next likely safe slice:
- Phase 3.6C-2 — Quote urgency inference
- hidden operational weighting only
- no UI changes
- no schema changes
- no dashboard expansion


---

# LATEST CHECKPOINT TARGET — Knowledge Branding Watermark

Current status:
- watermark component added
- watermark asset expected at `public/branding/knitspeed-watermark.png`
- knowledge article page imports and renders `KnowledgeWatermark`
- visual confirmation still needed after local dev refresh

If watermark is not visible:
1. confirm asset exists:
   `ls -l public/branding/knitspeed-watermark.png`
2. confirm component import exists in:
   `src/pages/KnowledgeArticlePage.jsx`
3. confirm `<KnowledgeWatermark />` renders near `<ReadingProgressBar />`
4. temporarily increase opacity in:
   `src/components/branding/KnowledgeWatermark.jsx`
   from `opacity-[0.045]` to `opacity-[0.12]`
5. confirm z-index/background layering

Magic words for next boot:
> Jarvis, continue Knitspeed from checkpoint after operational context, manufacturing sensitivity, and knowledge watermark sprint. Repo is `knitspeed-homepage` at `/Users/jaythaveesak/Desktop/knitspeed-homepage`. Latest strategic state: semantic textile authority + dyeing intelligence + operational context + manufacturing sensitivity are active. Watermark was added but visual confirmation may still be pending. First check `HANDOFF.md`, `PROJECT_ROADMAP.md`, `DECISIONS.md`, and `SESSIONS.md`, then inspect git status before patching.


---

# CURRENT CHECKPOINT — Phase 3.6A Semantic Textile Knowledge Graph

Status:
- established
- build and lint passing
- visual confirmation completed

Implemented:
- semantic article metadata:
  - fabricFamilies
  - yarnFamilies
  - processFamilies
  - riskSignals
  - buyerJourneyStage
- weighted related knowledge scoring now uses shared semantic textile metadata
- related guide headings adapt by topic cluster
- `/knowledge` cluster headings now include calm semantic descriptions
- subtle knowledge watermark remains intentionally very light

Verified:
- `npm run build` passes
- `npm run lint` passes
- `/knowledge` visually reads as a structured textile intelligence hub
- article related guide headings are semantic instead of generic

Do next:
- 3.6A-5 Mobile Progressive Disclosure Layer
  - make dense secondary sections collapsible on mobile only
  - candidates: Related Guides, FAQ, Operational Context, Production Memory
  - keep core article content expanded
- after that: 3.6B Manufacturing Intelligence Layer

Do not do next:
- no CMS
- no routing overhaul
- no Supabase changes
- no admin dashboard changes
- no quote flow changes
- no noisy AI UI

Magic words for next boot:
> Jarvis, continue Knitspeed from Phase 3.6A checkpoint. Semantic textile knowledge graph is established, build/lint passed, and `/knowledge` visual check is complete. Next safe slice is 3.6A-5 Mobile Progressive Disclosure Layer before starting 3.6B Manufacturing Intelligence. First inspect HANDOFF.md, PROJECT_ROADMAP.md, DECISIONS.md, and SESSIONS.md, then inspect git status before patching.

---

# CURRENT CHECKPOINT — Phase 3.6B-3 Production Relationships UI

Status:
- implemented locally
- build and lint passing
- visual smoke completed
- pending Jay's git checkpoint

Implemented:
- `src/components/production/ProductionRelationshipsPanel.jsx`
- knowledge article wiring for `getKnowledgePageManufacturingCausality(slug)`
- mobile progressive disclosure wrapper reused for Production relationships
- calm sourcing-aware card showing up to 3 affected production areas

Verified:
- `npm run build` passes
- `npm run lint` passes
- `/knowledge/single-jersey-vs-interlock` renders the Production relationships panel
- visual smoke confirms affected areas render calmly:
  - drape
  - edge curling
  - washing behavior
- browser console errors: none

Notes:
- requested `node --check` commands fail on `.jsx` in current Node v25 with `ERR_UNKNOWN_FILE_EXTENSION`; Vite build and ESLint passed as the JSX validation path
- no changes to `textileKnowledgePages.js`
- no routing changes
- no Supabase, admin dashboard, quote flow, Prime scoring, or schema changes
- existing untracked watermark files remain untouched:
  - `public/branding/knitspeed-watermark1.png`
  - `public/branding/knitspeed-watermark2.png`

Magic words for next boot:
> Jarvis, continue Knitspeed from Phase 3.6B-3 Production Relationships UI. Production relationships are implemented locally and visually smoked on `/knowledge/single-jersey-vs-interlock`, build/lint pass, and Jay may still need to commit. First inspect HANDOFF.md, PROJECT_ROADMAP.md, DECISIONS.md, SESSIONS.md, and git status before patching.

---

# CURRENT CHECKPOINT — Phase 3.6C Operational Inference Expansion

Status:
- stable local checkpoint
- build and lint passing
- browser smoke stable

Implemented:
- quote urgency inference
- sourcing stability inference
- buyer intent progression memory
- operational context enrichment runtime

Implemented files:
- `src/lib/intelligence/quoteUrgencyInference.js`
- `src/lib/intelligence/sourcingStabilityInference.js`
- `src/lib/intelligence/buyerIntentProgression.js`
- `src/lib/knowledgeRegistry.js`

Current hidden intelligence stack:
- semantic textile graph
- production memory
- relationship weighting
- manufacturing causality
- operational context
- temporal manufacturing signals
- quote urgency inference
- sourcing stability inference
- buyer intent progression memory

Verified:
- `npm run build` passes
- `npm run lint` passes
- article routes remain stable
- no visible UX regressions

Rules preserved:
- no Supabase changes
- no admin dashboard changes
- no quote flow changes
- no AI scoring UI
- deterministic inspectable logic only

Next likely safe slice:
- Phase 3.6D Operational Recommendation Intelligence
- hidden recommendation seeds only
- no UI expansion yet

Magic words for next boot:
> Jarvis, continue Knitspeed from Phase 3.6C Operational Inference Expansion. Quote urgency inference, sourcing stability inference, and buyer intent progression memory are active. Build/lint pass and browser smoke remained stable. First inspect HANDOFF.md, PROJECT_ROADMAP.md, DECISIONS.md, SESSIONS.md, and git status before patching.


---

# CURRENT CHECKPOINT — Phase 3.6D Operational Recommendation Intelligence

Status:
- implemented
- build and lint passing

Implemented:
- `src/lib/intelligence/operationalRecommendations.js`
- `src/lib/intelligence/quotePreparationIntelligence.js`
- operational context now includes recommendation and quote-preparation intelligence

Current hidden intelligence stack:
- semantic textile graph
- production memory
- relationship weighting
- manufacturing causality
- operational context
- temporal manufacturing signals
- quote urgency inference
- sourcing stability inference
- buyer intent progression memory
- operational recommendation intelligence
- quote preparation intelligence

Verified:
- `npm run build` passes
- `npm run lint` passes

Rules preserved:
- no Supabase changes
- no admin dashboard changes
- no quote flow changes
- no visible AI scoring
- no recommendation UI yet

Next:
- pause after Phase 3.6 completion checkpoint
- later consider Phase 3.7 Internal Sales OS bridge or 3.6 UI surfacing only after review

Magic words for next boot:
> Jarvis, continue Knitspeed after Phase 3.6D. Operational recommendation intelligence and quote preparation intelligence are implemented, build/lint pass, and 3.6 hidden sourcing-copilot primitives are established. First inspect HANDOFF.md, PROJECT_ROADMAP.md, DECISIONS.md, SESSIONS.md, and git status before patching.


---

# CURRENT CHECKPOINT — Phase 3.7B Garment Production Intelligence

Status:
- stable
- build/lint/probe passing

Implemented:
- garment-production semantic cluster
- garment manufacturing operational knowledge expansion
- garment yield and consumption intelligence
- tubular/open-width production reasoning
- quotation realism education

Current major garment-production articles:
- How Fabric Width Affects Garment Yield
- How GSM, Width, and Yield Affect Fabric Usage
- Tubular vs Open Width Fabric
- Why Two Factories Estimate Fabric Consumption Differently

Probe system:
- `npm run probe:intelligence`
- behavioral intelligence verification operational
- hidden reasoning outputs validated after semantic expansion

Architectural state:
- textile intelligence
- garment manufacturing intelligence
- operational sourcing intelligence
- sourcing continuity memory
- behavioral verification infrastructure

Rules preserved:
- calm editorial UX
- no AI clutter
- deterministic inspectable logic
- no admin/dashboard sprawl
- semantic-first architecture

Next likely direction:
- garment size range consumption intelligence
- print/decorative production intelligence
- deeper apparel manufacturing semantics
- future procurement continuity evolution

Magic words for next boot:
> Jarvis, continue Knitspeed from Phase 3.7B Garment Production Intelligence. Garment-production semantic cluster and operational manufacturing articles are active, probe/build/lint pass, and behavioral verification infrastructure is operational. First inspect HANDOFF.md, PROJECT_ROADMAP.md, DECISIONS.md, SESSIONS.md, and git status before patching.



---

# CURRENT CHECKPOINT — Phase 3.7 Garment + Decoration Intelligence Expansion

Status:
- stable semantic checkpoint
- taxonomy normalized
- build/lint passing
- garment-production and decoration-printing clusters stabilized

Implemented:
- garment size ratio intelligence
- oversized garment consumption intelligence
- garment wash behavior intelligence
- garment feel variance intelligence
- print placement intelligence
- large print garment-feel intelligence
- print cracking intelligence
- print hand-feel intelligence

Semantic taxonomy stabilized:
- fabric-structures
- yarn-quality
- fabric-specification
- fabric-behavior
- fabric-finishing
- fabric-dyeing
- textile-production
- garment-production
- decoration-printing

Operational lessons:
- semantic taxonomy drift appeared between canonical keys and display labels
- ontology normalization now required before semantic expansion
- future semantic additions must verify canonical cluster keys before insertion

New operating discipline:
- grep semantic keys before insertion
- run taxonomy verification before commit
- separate canonical semantic keys from display labels
- avoid inline semantic-string invention

Verified:
- npm run build passes
- npm run lint passes
- taxonomy verification stable
- no sparse-array corruption remains
- decoration-printing cluster isolated correctly
- garment-production cluster stabilized correctly

Current architecture direction:
textile intelligence
→ garment production intelligence
→ decoration and print intelligence
→ sourcing continuity reasoning
→ future procurement intelligence

Next likely safe slice:
- Phase 3.7H — Advanced Decoration Intelligence
- candidates:
  - puff print behavior
  - DTG vs screen print behavior
  - heat-transfer durability
  - print breathability
- preserve calm sourcing-aware editorial UX
- preserve deterministic inspectable logic

---

# CURRENT CHECKPOINT — Phase 3.7H Decoration Intelligence Consolidation

Status:
- stable semantic checkpoint
- build/lint/probe passing
- decoration intelligence expansion complete
- article expansion intentionally paused

Implemented:
- puff print behavior
- DTG vs screen printing behavior
- heat transfer durability
- print breathability
- discharge printing behavior
- print aging after repeated washing

Strategic clarification:
- Knitspeed knowledge scope is now intentionally bounded
- platform focus remains:
  fabric → production → garment outcome → sourcing intelligence
- avoid drifting into generic fashion/design/printing-industry content expansion

Current platform identity:
- production-aware textile sourcing intelligence
- semantic textile operational infrastructure
- deterministic operational reasoning system

Important strategic decision:
- no further article expansion planned for now
- semantic breadth considered sufficient (~40 high-density operational articles)
- future defensibility should come from:
  - semantic continuity
  - operational inference
  - procurement intelligence
  - sourcing continuity memory
  - manufacturing causality reasoning

Next likely safe slice:
- Phase 3.8A — Procurement Continuity Intelligence

Planned direction:
- hidden operational continuity memory
- deterministic sourcing-context accumulation
- operational concern pattern recognition
- knowledge journey signal interpretation
- no visible AI recommendation UI
- no dashboard expansion
- no scoring UX
- no chatbot layer

Rules preserved:
- calm editorial UX
- deterministic inspectable logic
- no ontology drift
- no AI gimmick UI
- no semantic cluster sprawl

Magic words for next boot:
> Jarvis, continue Knitspeed from Phase 3.7H consolidation checkpoint. Decoration intelligence expansion is complete, article expansion is intentionally paused, and next direction is Phase 3.8A Procurement Continuity Intelligence. Focus on silent operational continuity reasoning and sourcing-memory intelligence only. First inspect HANDOFF.md, PROJECT_ROADMAP.md, DECISIONS.md, SESSIONS.md, and git status before patching.


---

# CURRENT CHECKPOINT — Phase 3.8A–3.8E Procurement Cognition Layer

Status:
- stable architecture checkpoint
- build/lint/probe passing
- procurement cognition layer active
- no UI expansion
- no schema changes
- no article expansion

Implemented:
- Phase 3.8A: procurement continuity memory enrichment
- Phase 3.8B: buyer journey accumulation layer
- Phase 3.8C: weighted procurement cognition
- Phase 3.8D: temporal procurement signal weighting
- Phase 3.8E: intelligence observability through internal probe

Current intelligence stack:
- semantic textile graph
- manufacturing causality
- operational recommendations
- quote preparation intelligence
- sourcing continuity memory
- buyer journey cognition
- weighted intent interpretation
- temporal signal weighting
- probe observability

Strategic result:
- Knitspeed now reasons beyond isolated content pages
- system can interpret sourcing trajectory, repeated operational concerns, weighted intent, and procurement readiness
- intelligence remains deterministic, inspectable, and hidden from public UX

Rules preserved:
- no AI chatbot layer
- no recommendation spam
- no buyer score UI
- no dashboard bloat
- no user-profiling language
- no generic content expansion

Next likely safe direction:
- pause expansion
- inspect cognition quality over real usage
- later consider quote-context continuity bridge only after review

Magic words for next boot:
> Jarvis, continue Knitspeed from Phase 3.8 procurement cognition checkpoint. Phase 3.8A–3.8E are implemented with sourcing continuity memory, buyer journey accumulation, weighted procurement cognition, temporal signal weighting, and probe observability. Build/lint/probe pass. Do not add more articles or UI. First inspect HANDOFF.md, PROJECT_ROADMAP.md, DECISIONS.md, SESSIONS.md, and git status before patching.


---

# CURRENT CHECKPOINT — Phase 4.1C–4.1E Production Hardening

Status:
- complete
- pushed to origin/main
- production verified

Latest checkpoints:
- `5235550 Add deterministic knowledge integrity verification`
- `52f30c4 Add deterministic sitemap generation`
- `1c8caca Add deployment integrity verification`
- `5bb327f Advertise sitemap in robots`

Implemented:
- public GSC references removed from frontend/schema copy
- Knitspeed now stands alone publicly as the brand
- `scripts/verifyKnowledgeIntegrity.js`
- `scripts/normalizeKnowledgeMetadata.js`
- `scripts/generateSitemap.js`
- `scripts/verifyDeploymentIntegrity.js`
- `public/sitemap.xml`
- `public/robots.txt` advertises sitemap

New scripts:
- `npm run normalize:knowledge`
- `npm run verify:knowledge`
- `npm run verify:deployment`
- `npm run generate:sitemap`

Verification state:
- `npm run verify:knowledge` passes
- `npm run verify:deployment` passes
- `npm run generate:sitemap` generates 42 routes
- sitemap XML validation passed
- `npm run build` passes
- `npm run lint` passes
- production `/robots.txt` now shows:
  - `Sitemap: https://knitspeed-homepage.vercel.app/sitemap.xml`
- production `/sitemap.xml` reachable
- homepage and `/knowledge` headers verified on Vercel

Important:
- semantic/article expansion remains frozen
- intelligence breadth is sufficient for now
- current priority is production hardening, deployment stability, domain readiness, and future visual intelligence later
- do not add more articles unless Jay explicitly approves a final foundational exception
- future custom domain migration will require updating canonical site URL and sitemap domain

Next likely safe direction:
- pause and observe deployment behavior
- later prepare custom domain migration
- later visual textile intelligence layer:
  - fabric to garment use-case visuals
  - sourcing examples
  - fabric application guidance
- optional future performance hardening if bundle size becomes a real issue

Magic words for next boot:
> Jarvis, continue Knitspeed from Phase 4.1C–4.1E production hardening checkpoint. Semantic expansion is frozen, Knitspeed public branding is standalone, deterministic verification scripts are active, sitemap and robots are deployed, and production was verified. First inspect HANDOFF.md, PROJECT_ROADMAP.md, DECISIONS.md, SESSIONS.md, then inspect git status before patching.



---

# CURRENT CHECKPOINT — Phase 4.2 Homepage Visual Intelligence UX

Status:
- stable local/product checkpoint
- pushed to origin/main
- visual inspection completed after progressive disclosure refactor

Latest checkpoint:
- 28a9a61 Refine homepage sourcing intelligence hierarchy

Implemented:
- deterministic product intelligence layer
- buyer-facing article summaries
- product insight badges
- visual fabric guidance
- decision confidence guidance
- comparative fabric reasoning
- garment outcome guidance
- future visual placeholder architecture
- collapsible secondary insight sections

Current homepage structure:
- visible surface layer:
  - article name
  - buyer summary
  - future textile visual placeholder
  - key insight badges
  - Request Fabric Quote CTA
- collapsible depth layer:
  - Buyer Guidance
  - Comparison Notes
  - Garment Outcome

Strategic result:
- Homepage now behaves as a calm sourcing intelligence interface
- Intelligence depth is preserved without overwhelming the buyer
- Visual placeholder architecture prepares the platform for future textile imagery
- Real images are intentionally deferred until UX hierarchy stabilizes

Next safe tasks:
1. Phase 4.2H-1 Visual QA
   - desktop scan rhythm
   - mobile stacking
   - card height
   - CTA visibility
2. Phase 4.2H-2 Density Refinement
   - reduce visible chip count if needed
   - tighten placeholder height
   - reduce repeated wording
3. Phase 4.2H-3 Mobile Progressive Polish
   - check collapsible usability
   - reduce scroll fatigue
4. Phase 4.3A Real Textile Visual System later
   - fabric macro crops
   - garment silhouette hints
   - textile texture visuals
   - only after hierarchy is stable

Do not do next:
- no more intelligence module expansion
- no new knowledge articles
- no real images yet
- no custom domain migration yet
- no CMS
- no AI chatbot layer

Magic words for next boot:
> Jarvis, continue Knitspeed from Phase 4.2 Homepage Visual Intelligence UX checkpoint. Homepage sourcing intelligence cards, visual placeholders, and collapsible insight hierarchy are implemented and pushed. Next priority is visual QA, density refinement, and mobile hierarchy polish before adding real textile images or migrating domain. First inspect HANDOFF.md, PROJECT_ROADMAP.md, DECISIONS.md, SESSIONS.md, then inspect git status before patching.

---

# CURRENT CHECKPOINT — Phase 4.2M Mobile Sourcing UX + Garment Knowledge Continuity

Status:
- implemented locally
- verification passing
- ready for git checkpoint

Implemented:
- mobile hero compression
- product cards moved immediately after hero
- homepage product card density refinement
- mobile card ergonomics refinement
- quote continuity card with selected fabric visual preview
- "Choose another fabric" shortcut from quote form back to products
- contextual knowledge hooks in product decision guidance
- hidden premature "What are you making?" section
- first garment sourcing guide:
  - `/knowledge/t-shirt-fabric-sourcing`
- homepage garment sourcing guide entry point
- sourcing continuation blocks inside T-shirt guide

Current UX flow:
- Hero
- Finished Articles
- Garment sourcing guide entry
- Knowledge support
- Quote
- Additional trust/support sections

Strategic result:
- Knitspeed homepage now feels product-first
- mobile buyer journey is cleaner
- quote flow retains context
- garment sourcing knowledge layer has started
- knowledge now supports inquiry instead of remaining passive content

Verification:
- npm run verify:knowledge passes
- npm run verify:deployment passes
- npm run generate:sitemap passes
- npm run build passes
- npm run lint passes
- desktop visual QA passed
- iPhone local Wi-Fi QA passed

Important notes:
- hidden use-case section should not be revived until it links to real garment sourcing guides
- future garment guides should be added one at a time
- preserve product-first homepage rhythm
- do not reintroduce cognitive overload above products

Magic words for next boot:
> Jarvis, continue Knitspeed from Phase 4.2M checkpoint. Mobile sourcing UX, product-first homepage ordering, quote continuity, contextual knowledge hooks, and the first garment sourcing guide `/knowledge/t-shirt-fabric-sourcing` are implemented. The "What are you making?" section is hidden until it can link to real garment sourcing guides. First inspect HANDOFF.md, PROJECT_ROADMAP.md, DECISIONS.md, SESSIONS.md, then inspect git status before patching.



---

# CURRENT CHECKPOINT — Phase 4.2M Navigation + Continuity Stabilization

Status:
- stable local checkpoint
- build/lint passing
- continuity navigation architecture corrected

Implemented:
- split Knowledge continuity navigation behavior by page context
- `/knowledge` index now routes back to homepage
- `/knowledge/:slug` article pages now route back to `/knowledge`
- normalized Explore Fabrics continuity path to:
  - `/#finished-articles`
- removed continuity routing loop caused by shared hardcoded nav behavior
- preserved lightweight non-router architecture

Verification:
- `npm run build` passes
- `npm run lint` passes
- browser UX continuity verified manually

Current continuity flow:
- Homepage
  → Knowledge index
    → Back to Home
  → Knowledge article
    → Back to Knowledge
    → Explore Fabrics

Next likely safe tasks:
1. Phase 4.2M visual QA refinement
2. mobile spacing rhythm polish
3. homepage density refinement
4. continuity component cleanup
5. Phase 4.2N knowledge navigation stabilization planning
6. textile visual system planning

Rules preserved:
- no CMS
- no React Router
- no semantic expansion
- no dashboard sprawl
- no AI chatbot UX

Magic words for next boot:
> Jarvis, continue Knitspeed from the Phase 4.2M Navigation + Continuity Stabilization checkpoint. Knowledge continuity routing is now corrected: `/knowledge` routes back to Home while article pages route back to `/knowledge`. Explore Fabrics uses `/#finished-articles`. Build/lint pass. Next focus is visual QA, density refinement, continuity cleanup, and future navigation stabilization planning. First inspect HANDOFF.md, PROJECT_ROADMAP.md, DECISIONS.md, SESSIONS.md, then inspect git status before patching.

---

# CURRENT CHECKPOINT — Phase 4.2M Production Parity + Visual Stabilization

Status:
- stable
- production deployment healthy
- local and Vercel parity restored
- homepage visual hierarchy cleaned

Latest confirmed work:
- fixed Vercel deployment failures caused by untracked continuity files
- committed missing files:
  - `src/components/knowledge/RelatedKnowledgeContinuity.jsx`
  - `src/lib/knowledgeContinuityMap.js`
- removed custom Vercel rewrite config
- normalized texture asset paths to `/textures/...`
- confirmed texture assets are tracked in `public/textures`
- removed duplicate real texture strip from Finished Article cards
- simplified Garment Sourcing Guide card by removing the decorative T-shirt icon/visual block
- preserved T-Shirt Fabric Sourcing guide section, tags, copy, and CTA

Current homepage state:
- product-first homepage flow remains active
- Finished Article cards use one main tactile visual only
- garment sourcing guide entry is clean and editorial
- production now reflects local changes

Next likely safe tasks:
1. Phase 4.2M visual QA refinement
2. mobile spacing rhythm polish
3. homepage density refinement
4. continuity cleanup
5. Phase 4.2N knowledge navigation stabilization planning
6. textile visual system planning

Do not do next:
- no new article expansion
- no CMS
- no React Router
- no AI chatbot UX
- no dashboard sprawl
- no decorative placeholder expansion unless it improves sourcing clarity

Magic words for next boot:
> Jarvis, continue Knitspeed from the Phase 4.2M Production Parity + Visual Stabilization checkpoint. Vercel deployment is healthy again, missing continuity files were committed, texture paths are normalized, Finished Article cards no longer duplicate imagery, and the Garment Sourcing Guide card was simplified by removing the decorative T-shirt icon. First inspect HANDOFF.md, PROJECT_ROADMAP.md, DECISIONS.md, SESSIONS.md, then inspect git status before patching.


---

# CURRENT CHECKPOINT — Production Domain Migration + Marketing Readiness

Status:
- active stabilization
- www.knitspeed.com operational
- root knitspeed.com still needs stabilization
- SPA production routing fixed

Completed:
- GoDaddy DNS migration toward Vercel production started
- www.knitspeed.com serves the live Vercel production app
- Vercel SPA rewrite config added so direct routes like /knowledge work
- production knowledge routing verified after deployment
- marketing-readiness mode started for Accella onboarding
- legacy image/logo extraction started locally but should not be committed yet

Known issue:
- knitspeed.com root domain may still resolve to old legacy hosting during propagation or due to root A record/canonical setup
- next session should inspect GoDaddy root A record and Vercel domain assignment
- likely desired short-term setup: www.knitspeed.com as working production domain, root knitspeed.com redirecting to www until canonical hardening is finalized

Next steps:
1. verify GoDaddy A record for @ points only to Vercel target
2. confirm Vercel domain assignment for root and www
3. choose canonical domain strategy
4. update siteConfig canonical URL
5. regenerate sitemap
6. verify robots and sitemap on production
7. prep Search Console / analytics
8. integrate real textile images into homepage cards
9. add subtle legacy logo use on homepage and knowledge pages

Do not do next:
- no major homepage redesign
- no new article expansion
- no CMS
- no React Router migration
- no dashboard sprawl
- no unfinished asset commit

# CURRENT STATE

Knitspeed production identity stabilized.

Canonical:
- knitspeed.com → www.knitspeed.com confirmed via 308 redirect

Brand system:
- normalized branding assets under /public/branding
- homepage + knowledge logo consistency complete
- sticky nav active
- mobile nav simplified to:
  [Logo] [Knowledge] [Quote]

Commercial readiness:
- mobile UX significantly improved
- knowledge layer now positioned as buyer education + sourcing intelligence
- suitable for Accella onboarding/demo discussion

Immediate next work:
- email + LINE contact refinement
- product image duplication reduction
- footer/contact polish



---

# CURRENT CHECKPOINT — Phase 4.3A Contact Trust Layer

Status:
- stable
- production-ready
- build/lint/verification passing
- mobile LINE flow verified

Implemented:
- official LINE OA deep link
- branded email trust layer
- mobile-first contact CTA refinement
- hero CTA continuity stabilization
- repo cleanup and temporary texture note cleanup

Production contact layer:
- LINE OA: https://lin.ee/6bLsSlt
- sales email: sales@knitspeed.com

Verified:
- LINE CTA opens correctly on mobile
- email trust layer renders correctly
- npm run verify:knowledge passes
- npm run verify:deployment passes
- npm run generate:sitemap passes
- npm run build passes
- npm run lint passes
- working tree clean

Current strategic direction:
- pause infra/intelligence expansion
- next phase is textile visual system
- focus on real tactile fabric imagery
- support upcoming marketing onboarding with accella.co.th

Next likely safe slice:
- Phase 4.3B Textile Visual System
- macro texture imagery
- tactile fabric presentation
- sourcing-oriented product visuals
- preserve calm premium hierarchy
- one image per card initially

Magic words for next boot:
> Jarvis, continue Knitspeed from Phase 4.3A Contact Trust Layer checkpoint. Official LINE OA and branded email trust layer are live, mobile CTA flow is verified, and next phase is the textile visual system for upcoming marketing onboarding. Focus on real tactile fabric imagery and calm sourcing-aware presentation. First inspect HANDOFF.md, PROJECT_ROADMAP.md, DECISIONS.md, SESSIONS.md, then inspect git status before patching.

---

# CURRENT CHECKPOINT — Phase 4.2N–4.2O Homepage Thai UX + Product Intelligence Refinement

Status:
- stable local checkpoint
- build/lint passing
- ready for production push

Implemented:
- homepage brand identity section added after hero
- Thai-first buyer copy introduced while keeping English textile terminology where natural
- homepage CTAs and card section labels translated into Thai
- product card density refined for better scan rhythm
- product intelligence now includes yarn-count overlays:
  - 20s = heavier, more opaque, oversized/uniform-friendly
  - 30s = balanced daily retail use
  - 40s = lighter, finer, premium feel
- yarn-quality overlays added:
  - combed
  - semi-combed
  - compact
  - CVC
- garment outcome and comparative reasoning logic now differentiates products more clearly
- TC featured card hidden from homepage until blend-ratio data is enriched
- broken T-shirt sourcing guide link fixed to `/knowledge/t-shirt-fabric-sourcing`

Important:
- do not over-infer TC behavior until historical blend data is added
- future TC/CVC work should use proper fields such as blend family, cotton ratio, poly ratio, handfeel expectation, commercial positioning, and production notes
- T-shirt sourcing guide route works but needs navigation/header polish later

Next likely safe tasks:
1. push current checkpoint to production
2. photograph real warehouse/fabric visuals with iPhone
3. replace placeholder/redundant imagery with real textile image hierarchy
4. later plan TC/CVC historical data enrichment and DB-safe schema additions

---

# CURRENT CHECKPOINT — Thai/English UX Language Harmony v1

Status:
- implemented locally
- visual QA completed on `/knowledge/t-shirt-fabric-sourcing`

Implemented:
- T-shirt Fabric Sourcing Guide converted toward Thai-first UX rhythm
- English textile semantic anchors preserved
- card titles and body copy now read more naturally for Thai buyers
- page still keeps machine-readable textile context through terminology and route structure

Current language pattern:
- Thai controls the reading flow
- English preserves textile entities and LLM/search semantics
- no duplicated bilingual paragraphs
- no over-translation of industry-native terms

Verified visually:
- intro copy improved
- Daily Wear card body improved
- Premium/Compact Cotton card body improved
- GSM card body improved
- overall page feels calmer and more Thai-native

Next likely safe task:
- continue language harmony pass across adjacent homepage/knowledge sections
- update one page/section at a time
- preserve English semantic anchors
- run build/lint after each meaningful copy pass

Do not do next:
- no full bilingual duplication
- no TH/EN routing yet
- no CMS
- no bulk translation
- no loss of textile terminology

