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

## Decision — Keep Textile Intelligence Layer Silent and Production-Aware

We will continue expanding Knitspeed's LLM/textile intelligence through compounding operational structures instead of visible feature sprawl.

Accepted direction:
- Separate semantic content from production memory
- Keep production intelligence deterministic and inspectable
- Use relationship weighting internally before exposing any scoring UI
- Avoid flashy AI labels, dashboards, or aggressive recommendations
- Prioritize textile causality, sourcing safety, and manufacturing trust

Current approved layers:
- Knowledge graph / topic clusters
- Buyer intent tracking
- Production memory
- Relationship weighting
- Runtime operational enrichment

---

## Decision — Dyeing Knowledge Ownership

Dyeing and manufacturing intelligence should remain owned by Knitspeed as internal manufacturing knowledge.

Rules:
- do not expose individual expert/operator names publicly in frontend metadata
- preserve human expertise internally while keeping platform authority unified
- frame dyeing behavior as production-aware operational guidance
- avoid defect-panic or blame-oriented language
- preserve sourcing-safe and commercially safe positioning

Accepted architecture:
- semantic textile authority
- production memory
- relationship weighting
- temporal manufacturing signals

Rejected direction:
- flashy AI dashboards
- exposed internal scoring systems
- noisy prediction UX
- fake automation language


---

## Decision — Expand Textile Knowledge Through Manufacturing Reality

Knitspeed knowledge expansion should prioritize:
- production behavior
- sourcing realism
- dyeing and finishing causality
- operational textile understanding

Avoid:
- generic SEO spam
- shallow article generation
- broad unrelated content expansion

Preferred expansion areas:
- dyeing
- finishing
- shrinkage
- colorfastness
- wash behavior
- garment outcome logic
- sourcing expectations


---

## Decision — Subtle Knowledge Branding Only

Knowledge pages may carry a subtle Knitspeed watermark or ownership cue.

Rules:
- do not overpower the article content
- do not convert knowledge pages into marketing banners
- keep watermark barely noticeable
- preserve clean editorial sourcing-intelligence feel
- avoid further design interference unless needed for readability or trust


---

## Decision — Semantic Textile Graph Before Manufacturing Intelligence

Knitspeed knowledge pages should now be treated as structured textile intelligence nodes, not flat articles.

Accepted semantic primitives:
- fabricFamilies
- yarnFamilies
- processFamilies
- riskSignals
- buyerJourneyStage

Rules:
- use semantic relationships to improve related guide logic
- keep relationship scoring deterministic and inspectable
- preserve calm editorial UX
- avoid noisy AI labels or dashboard-style recommendations
- keep mobile density management as progressive disclosure, not hidden content

Sequencing:
1. semantic graph foundation
2. mobile progressive disclosure
3. manufacturing intelligence expansion
4. buyer-intent inference
5. operational textile OS


## Decision — Canonical Semantic Taxonomy Enforcement

Knitspeed semantic clusters must now use canonical internal keys.

Approved canonical clusters:
- fabric-structures
- yarn-quality
- fabric-specification
- fabric-behavior
- fabric-finishing
- fabric-dyeing
- textile-production
- garment-production
- decoration-printing

Rules:
- never invent semantic keys inline
- canonical keys must remain lowercase slug format
- display labels must remain separate from canonical keys
- semantic insertions require grep verification before patching
- taxonomy verification should run before semantic commits

Reason:
- prevent ontology drift
- preserve semantic graph integrity
- stabilize future recommendation and inference systems

---

## Decision — Freeze Knowledge Breadth and Shift Toward Intelligence Depth

The Knitspeed knowledge layer has reached sufficient semantic coverage for the current operational scope.

Approximate current scale:
- ~40 high-density textile operational knowledge articles

Platform boundary:
- fabric
- dyeing
- finishing
- garment production
- decoration behavior
- washing behavior
- sourcing outcomes
- operational manufacturing causality

Avoid future drift into:
- generic fashion media
- trend content
- broad printing-industry encyclopedic expansion
- lifestyle/editorial content
- shallow SEO expansion

Strategic direction now shifts toward:
- semantic continuity
- operational inference
- procurement continuity intelligence
- sourcing-memory reasoning
- manufacturing causality weighting
- deterministic operational enrichment

Priority rule:
- future defensibility should come from intelligence depth, not article quantity

UI rule:
- preserve calm sourcing-aware UX
- avoid noisy AI recommendation systems
- avoid engagement-gamification patterns
- keep operational intelligence mostly hidden and inspectable


---

## Decision — Procurement Cognition Must Remain Deterministic and Hidden

Knitspeed procurement intelligence should remain deterministic, inspectable, and operationally grounded.

Accepted intelligence layers:
- sourcing continuity memory
- buyer journey accumulation
- weighted procurement cognition
- temporal signal weighting
- internal probe observability

Rules:
- no visible AI scoring UI
- no recommendation spam
- no engagement optimization
- no black-box buyer profiling
- no dashboard bloat
- no generic personalization language

Purpose:
- interpret operational sourcing context
- identify repeated concern patterns
- distinguish active sourcing momentum from stale curiosity
- support future quote-context continuity
- preserve calm sourcing-aware UX

Priority:
- intelligence depth and coherence over feature count


## 2026-05-12 — Phase 4 production hardening direction

Decision:
Freeze semantic/article expansion and prioritize production hardening.

Rationale:
Knowledge breadth and procurement cognition reached stable operational depth. Current bottlenecks are deployment stability, quote continuity, metadata consistency, observability, and domain migration readiness.

Implementation direction:
- Keep architecture lightweight
- Avoid routing overhaul
- Avoid CMS/admin expansion
- Avoid telemetry SaaS dependencies
- Preserve calm sourcing-aware UX
- Prefer deterministic verification over runtime analytics noise

Production hardening priorities:
1. Metadata + canonical stability
2. Quote continuity resilience
3. Deterministic observability tooling
4. SEO/indexing sanity
5. Domain migration readiness

---

## 2026-05-12 — Decision: Knitspeed Public Brand Stands Alone

Decision:
Remove public-facing GSC / GSC Import Export references from the frontend knowledge and schema layer for now.

Rationale:
- Knitspeed should consolidate as the public buyer-facing textile intelligence brand
- GSC can remain operational/legal context internally
- public semantic authority should accrue primarily to Knitspeed
- cleaner brand memory for buyers, crawlers, and LLM retrieval

Rules:
- public pages should foreground Knitspeed
- do not reintroduce GSC into public metadata unless there is a specific legal/domain reason
- preserve Knitspeed's Thailand knitted fabric sourcing positioning
- keep operational/legal company details separate from public knowledge branding

---

## 2026-05-12 — Decision: Phase 4 Uses Deterministic Verification Before Deployment

Decision:
Production hardening should rely on deterministic local verification scripts before pushing.

Required hardening checks:
- `npm run verify:knowledge`
- `npm run verify:deployment`
- `npm run generate:sitemap`
- `npm run build`
- `npm run lint`

Rationale:
- semantic graph has reached sufficient breadth
- future risk is ontology drift, metadata drift, route drift, and deployment inconsistency
- verification should be lightweight, inspectable, and dependency-minimal
- avoid noisy analytics or SaaS telemetry unless a clear business need appears



---

## 2026-05-12 — Decision: Homepage Intelligence Must Use Progressive Disclosure

Decision:
Homepage product cards should not expose every sourcing intelligence layer by default.

Rationale:
The homepage is for buyer comprehension and quote confidence, not full knowledge-page depth. Too many visible panels create scan fatigue and make product cards feel like compressed knowledge pages.

Accepted homepage hierarchy:
- visible:
  - product/article name
  - short buyer summary
  - visual placeholder or future textile image zone
  - key insight badges
  - quote CTA
- collapsible:
  - Buyer Guidance
  - Comparison Notes
  - Garment Outcome

Rules:
- preserve intelligence depth through drill-down
- keep homepage scan-friendly
- prioritize visual anchor and CTA clarity
- avoid adding more intelligence panels before density refinement
- future real images must fit the established visual placeholder architecture
- real textile images should come before final custom domain migration, but only after UX hierarchy is stable

---

## 2026-05-12 — Decision: Garment Sourcing Guides Must Be Meaningful Entry Points

Decision:
The "What are you making?" section should remain hidden until each visible use-case card links to a real garment sourcing guide or meaningful guided sourcing path.

Rationale:
Cards like T-shirts, Polo, Uniforms, Screen Printing, and Sampling imply deeper help. If they only scroll to products, the interaction feels underpowered and may reduce trust.

Accepted direction:
- build garment sourcing guides one at a time
- start with T-shirt Fabric Sourcing Guide
- future use-case cards should link to real guide routes
- garment guides should connect knowledge to quote inquiry

Rules:
- do not revive use-case cards as decorative UI
- do not create fake guide pages just to fill navigation
- keep garment guides sourcing-aware and production-grounded
- preserve homepage product-first flow
- knowledge integration should support buyer decisions, not overwhelm product discovery


---

## 2026-05-13 — Decision: Production Parity Before UX Iteration

Decision:
Before continuing homepage or knowledge UX refinement, confirm Vercel production deployment is green and reflects the latest commit.

Rules:
- do not assume local equals production
- check Vercel deployment status after meaningful pushes
- if production does not update, inspect build logs before making more UI patches
- avoid continuing design iteration on top of a broken deployment baseline

Rationale:
A failed production build masked homepage visual changes and made image/debugging issues look like asset problems when the real blocker was untracked imported files.

---

## 2026-05-13 — Decision: Avoid Duplicate Textile Imagery

Decision:
Homepage product cards should not show both a real texture strip and a real tactile image in the same card.

Accepted hierarchy:
- subtle abstract textile rhythm or whitespace
- one main tactile visual
- buyer summary
- quote CTA
- progressive disclosure

Avoid:
- repeated real fabric images
- decorative texture strips that compete with the main product visual
- placeholder visuals that do not improve sourcing comprehension

Rationale:
The product card should feel calm, premium, and sourcing-aware, not like a crowded catalog or image demo.


---

## 2026-05-13 — Decision: Domain Stabilization Before Further Production UX

Decision:
Before additional public UX polish, stabilize the production domain identity.

Current production reality:
- www.knitspeed.com is operational on Vercel
- root knitspeed.com still needs propagation/canonical stabilization
- SPA routing requires Vercel rewrite config for direct routes

Rules:
- do not continue major production UI changes until domain behavior is verified
- do not touch email DNS records while fixing website routing
- keep GoDaddy as domain/email/DNS authority for now
- keep Vercel as frontend deployment platform
- prefer one canonical public domain before sitemap/Search Console submission
- avoid committing unfinished legacy image extraction until assets are selected and organized

Rationale:
Marketing onboarding requires credible public identity, stable routing, branded email, and clean website behavior more than new features.
