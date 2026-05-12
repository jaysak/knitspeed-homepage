# KNITSPEED PRIME ENGINE ROADMAP
Author: Jay + Jarvis
Status: Active Build
Last Updated: 2026-05-10

---

# PROJECT VISION

Knitspeed is evolving from:
traditional textile trading website

into:

AI-assisted textile supply intelligence platform.

Core direction:
- buyer acquisition
- structured fabric intelligence
- CRM + sales intelligence
- production-aware quotation system
- future forecasting engine
- future procurement intelligence
- future agent-assisted sourcing

This is NOT just an ecommerce store.

The long-term direction resembles:
- textile CRM
- lightweight ERP
- sourcing intelligence platform
- buyer intent engine
- textile recommendation system

---

# BUSINESS CONTEXT

Company Structure:
- GSC = main company / yarn distribution
- Knitspeed = fabric-focused sub-brand

Business reality:
- real textile trading
- outsourced knitting + dyeing
- mixed supplier ecosystem
- naming inconsistency across industry
- customer trust depends heavily on responsiveness + delivery consistency

Platform must reflect REAL business operations.

---

# CURRENT STACK

Frontend:
- React
- Vite
- Tailwind

Backend:
- Supabase

Deployment:
- GitHub
- Vercel

Future:
- AI-assisted workflows
- buyer intelligence
- forecasting
- automated recommendations

---

# CORE PRINCIPLES

## 1. REAL DATA FIRST
Do NOT invent textile names.

System should derive:
- product categories
- structures
- yarn counts
- widths
from REAL sales data whenever possible.

---

## 2. BUYER-FACING LANGUAGE
Internal textile shorthand must become:
clear buyer-readable product naming.

Example:
30CMSJ/365

becomes:
30s Combed Cotton Single Jersey

---

## 3. PRIME ENGINE > RANDOM SCRAPING

Cold lead scraping is secondary.

Primary goal:
attract real buyers through:
- SEO
- structured product pages
- quotation flow
- inbound intent capture

The website itself becomes the lead engine.

---

## 4. STRUCTURED NORMALIZATION

Avoid chaos early.

Eventually normalize into:
- products_master
- product_variants
- quote_requests
- buyer_profiles
- lead_activity

---

# TEXTILE NAMING CONVENTIONS

## Structures
- SJ = Single Jersey
- RIB = Rib
- IT = Interlock

## Yarn Indicators
- CM = Combed Cotton
- CVC = Chief Value Cotton
- TC = Tetron Cotton blend
- TK = Poly ring spun
- TD = Top dyed
- OE = Open end
- OEW = Open end weaving yarn

## Width Rules
Examples:
- /365 = 36.5 inches
- /32 = 32 inches

---

# COMPLETED PHASES

## Phase 1
- homepage rebuild
- quote form
- GitHub + Vercel deployment
- Supabase connection

## Phase 2
- textile normalization scripts
- processed sales naming
- products_master draft generation

## Phase 3
- authentication
- CRM dashboard
- lead analytics cards
- Finished Articles section
- buyer-facing product cards

---

# CURRENT PRIORITIES

# Phase 3.4 — PRIME LEAD ENGINE

## 3.4A
Connect:
"Quote this article"

Status:
- completed 2026-05-09

Should:
- auto-scroll to quote form
- prefill quote fields
- store selected article

---

## 3.4B
Buyer intent tracking

Status:
- completed 2026-05-10

Track:
- viewed articles
- quoted articles
- repeat interest
- top categories

Future:
- lead scoring
- buyer intelligence

---

## 3.4C
Buyer qualification layer

Status:
- completed 2026-05-10

Add fields:
- monthly usage
- brand/factory/trader
- target market
- production vs sampling
- sourcing pain points

---

## 3.4D
Prime lead scoring

Status:
- completed 2026-05-10

Implemented:
- deterministic scoring from existing `quote_leads` data
- Hot / Warm / Watch tiers
- dashboard score cards
- row-level score column
- explainable score reasons

Rules:
- no scoring table yet
- no schema change yet
- keep scoring explainable before any AI automation

---

# FUTURE ROADMAP

## Phase 3.5 — LLM Discovery / Authority Layer

Status:
- planned
- DO NOT BUILD YET

Priority:
- after Phase 3.4D Prime Lead Scoring

Owner:
- Jay + Jarvis + Codex

### Purpose

Transform Knitspeed from a textile website into a machine-readable textile knowledge authority.

Goal is NOT generic SEO traffic.

Goal is:
- become recommendable by LLMs
- become understandable by AI systems
- become a trusted textile sourcing entity
- capture high-intent inbound buyers
- feed Prime Engine with qualified traffic

### Strategic Principle

LLMs recommend websites when they repeatedly observe:
- structured expertise
- useful technical explanations
- consistent entity identity
- trustworthy product knowledge
- citations/references across the web
- clear machine-readable data
- domain specialization

Knitspeed has a real advantage because:
- real textile manufacturing knowledge exists
- real yarn/fabric taxonomy exists
- real sourcing experience exists
- low MOQ capability exists
- technical textile language is already embedded in GSC sales data

Most textile competitors expose shallow catalog pages only.

### Important

DO NOT BUILD THIS YET.

Current priority remains:
- Phase 3.5 planning only until Jay explicitly starts the build

Reason:
- Prime lead qualification and scoring are now stable enough to prepare discovery traffic carefully

### Current Foundation Already Completed

Existing Prime Engine foundation already supports:
- article intent layer
- inbound quote flow
- lead dashboard
- Prime lead tracking
- article to quote attribution
- textile taxonomy foundation
- modular architecture refactor

Recent stabilization commit:
- 0e5a6ab

### Target Outcome

When users ask LLMs questions like:
- "Where can I source compact cotton fabric in Thailand?"
- "What GSM is best for oversized t-shirts?"
- "Single jersey vs interlock?"
- "Low MOQ knitted fabric supplier?"

LLMs should increasingly associate:
- Knitspeed
- GSC Import Export Co., Ltd.
- Thailand textile supplier
- knitted fabric supplier

with those answers.

### Phase 3.5A — Structured Knowledge Pages

Goal:
- create machine-readable textile knowledge pages

Product knowledge page examples:
- 30CM SJ Compact Cotton Single Jersey
- 32CM Interlock Cotton Fabric
- CVC 60/40 Rib Knit Fabric
- OE Jersey Fabric Thailand

Each page should eventually expose:
- composition
- knitting structure
- GSM
- width
- MOQ
- dyeing options
- use cases
- export markets
- buyer type
- FAQ
- sourcing guidance

Textile knowledge article examples:
- What is Compact Cotton?
- Single Jersey vs Interlock
- Best Fabric for Oversized T-Shirts
- What GSM Should Streetwear Use?
- Combed vs Carded Cotton
- How MOQ Affects Fabric Pricing
- Thai Textile Sourcing Explained
- What Causes Spirality in Knitted Fabric?

Purpose:
- capture AI-searchable informational intent

### Phase 3.5B — Structured Data / Schema

Goal:
- expose machine-readable schema.org metadata

Planned schema types:
- Organization
- Product
- Article
- FAQ
- BreadcrumbList

Initial technical direction:
- src/lib/seoSchema.js
- src/components/SEOJsonLd.jsx

Initial implementation should remain lightweight.

DO NOT perform routing overhaul initially.

### Phase 3.5C — Entity Consistency

Goal:
- strengthen consistent entity identity across platforms

Standardized entity references:
- Knitspeed
- GSC Import Export Co., Ltd.
- Thailand textile supplier
- knitted fabric supplier

Target platforms:
- website
- GitHub
- LinkedIn
- Facebook
- Instagram
- textile directories
- sourcing marketplaces

### Phase 3.5D — Prime Engine Integration

Goal:
- connect LLM discovery traffic directly into Prime Engine

Every article/product page should eventually support:
- quote CTA
- article attribution
- source tracking
- buyer qualification
- lead scoring
- sourcing pain-point capture

Current implementation status:
- 3.5A layout foundation complete
- 3.5B first knowledge page route complete
- 3.5C schema and metadata complete
- 3.5D internal discovery links complete
- 3.5E v1 knowledge quote attribution bridge complete

3.5E v1 notes:
- knowledge-page quote CTA now preserves article-like attribution into the existing Prime Engine quote flow
- implementation reused the existing selectedArticle/article metadata contract
- no Supabase schema, dashboard, routing overhaul, CMS, or scoring changes were made

### Future Data Capture Ideas

Potential qualification fields:
- monthly usage
- buyer type
- target market
- production vs sampling
- sourcing pain points

These belong first to:
- Phase 3.4C

before scaling discovery traffic.

### Important Implementation Rules

Do not:
- build all pages at once
- create massive CMS complexity
- over-engineer SEO system
- create fake/generated textile content
- duplicate shallow AI-generated articles

Do:
- leverage real textile expertise
- leverage real product naming
- leverage real GSC taxonomy
- build slowly with stable architecture
- prioritize machine-readable clarity
- prioritize inbound buyer quality

### Suggested Future File Structure

    src/
      data/
        textileKnowledgeArticles.js
        productKnowledgePages.js

      lib/
        seoSchema.js

      components/
        SEOJsonLd.jsx
        FAQBlock.jsx
        ArticlePage.jsx
        ProductKnowledgePage.jsx

### Current Status

Status:
- planned only

No implementation started yet.

Current active phase:
- 3.5N Lightweight Knowledge 404 State complete
- next likely slice: 3.5O Lightweight related-topic recommendation refinement

---

## Phase 3.6
Database normalization

Target tables:
- products_master
- product_variants
- buyer_profiles
- quote_requests
- lead_activity

---

## Phase 3.7
Internal Sales OS

Features:
- call notes
- supplier history
- reorder prediction
- production issue tracking
- AI recommendations

---

# OPERATIONAL MEMORY FILES

Use these root-level files to keep future sessions clean:

- `PROJECT_ROADMAP.md` = where we are going
- `DECISIONS.md` = what we must not forget
- `SESSIONS.md` = what happened
- `HANDOFF.md` = what to do next

---

# IMPORTANT DEVELOPMENT RULES

## Before major edits
Create backups:
- .bak files
- Git commits

---

## Deployment Flow

Local →
Git commit →
GitHub →
Vercel auto deploy

---

## Debugging Order

1. DNS
2. deployment
3. environment variables
4. Supabase
5. frontend logic

Do NOT assume frontend first.

---

# LONG TERM VISION

Knitspeed eventually becomes:

"textile supply intelligence system"

with:
- real production visibility
- forecasting
- reorder prediction
- AI-assisted sourcing
- agent-assisted procurement

---

## Phase 3.5 — Textile Intelligence Layer Evolution

Status:
- active and compounding

Phase 3.5 is no longer only a lightweight LLM discovery experiment.

It is evolving into a textile intelligence layer that connects:
- buyer education
- fabric specification reasoning
- sourcing context
- production behavior
- garment outcome expectations
- machine-readable semantic authority

### Strategic Purpose

The goal is to make Knitspeed understandable and recommendable by AI systems while also making human buyers trust the sourcing conversation more.

This is achieved through practical textile reasoning, not shallow SEO content.

The knowledge layer should help buyers understand:
- why similar fabrics can behave differently
- how yarn quality affects fabric outcome
- how structure affects garment behavior
- how GSM relates to hand feel and use case
- how finishing changes garment perception
- how production variables affect final results
- why communication before quotation matters

### Current Semantic Coverage

Implemented knowledge areas now include:
- Single Jersey vs Interlock
- Compact Cotton
- T-shirt GSM selection
- Combed Cotton vs Carded Cotton
- Spirality considerations in knitted fabrics
- Fabric finishing and garment feel

### Core Content Principles

Do:
- write production-aware buyer guidance
- connect fabric concepts to garment outcomes
- use sourcing-aware and commercially safe framing
- preserve uncertainty where production conditions matter
- explain textile relationships across yarn, structure, finishing, washing, and garment construction
- keep articles hand-authored and grounded in real textile concepts

Do not:
- publish shallow AI-generated articles
- invent product specifications
- invent MOQ, inventory, or supplier guarantees
- overstate technical certainty
- blame suppliers, factories, yarn, or buyers
- frame normal production considerations as panic defects
- add CMS/routing/sitemap complexity before needed

### Strategic Interpretation

The knowledge layer is becoming an operational intelligence asset, not a marketing blog.

Each article should strengthen:
- textile-context coherence
- Knitspeed's specialty positioning
- sourcing conversation quality
- semantic authority for LLM retrieval
- buyer confidence before quote submission
- future recommendation and sourcing intelligence potential

---

### Phase 3.5U-3.5V Expansion

Recent knowledge layer expansion:
- Why Fabrics With the Same GSM Can Feel Different
- What Causes Pilling in Knitted Fabrics?

Strategic effect:
- strengthened garment-outcome reasoning
- deepened fabric behavior intelligence
- improved buyer education around real production variability
- reinforced Knitspeed's positioning as a sourcing-aware knitted fabric knowledge authority

Next strong candidates:
- How Shrinkage Is Evaluated in Apparel Fabrics
- How Fabric Width Affects Garment Production
- Combed Cotton vs Compact Cotton

---

### Phase 3.5W-3.5Y Completion

Completed:
- production behavior knowledge expansion
- grouped knowledge browsing structure
- article CTA flow polish

Strategic result:
- Knitspeed knowledge layer now behaves more like an operational textile intelligence system than a marketing blog

Near-future opportunities:
- lightweight "Knowledge Basis" trust block
- related guide recommendation refinement
- production glossary layer
- garment category knowledge paths
- structured textile semantic schema

## Phase 3.6 Roadmap — Textile Operational Intelligence

### Completed
- Phase 3.6A: Production Memory Layer v0
- Phase 3.6B: Relationship Weighting Engine v0

### Next
- Phase 3.6C: Temporal Manufacturing Intelligence
- Add seasonal production pressure signals
- Add quote urgency inference
- Add sourcing stability signals
- Keep all signals internal before exposing customer-facing logic

---

## Phase 3.6C — Temporal Manufacturing Intelligence

Status:
- active
- first implementation complete

Implemented:
- seasonal production pressure signals
- dyeing complexity weighting
- sourcing volatility signals
- production readiness signals
- operational dyeing knowledge expansion

Strategic direction:
- hidden operational intelligence only
- deterministic and inspectable logic
- no visible AI clutter
- no noisy operational dashboards
- preserve calm sourcing-aware UX

Current manufacturing intelligence coverage:
- cotton knit dyeing process
- dyeing painpoints
- reactive dyeing
- finishing effects
- shrinkage and width behavior
- colorfastness considerations
- spirality considerations
- operational production guidance

Next:
- quote urgency inference
- hidden sourcing stability weighting
- future procurement intelligence foundation


---

## Dyeing Intelligence Expansion

Status:
- active
- expanding successfully

Current coverage:
- cotton knit dyeing
- lab dip vs bulk shade
- dark shade control
- colorfastness
- shrinkage after dyeing
- compacting vs stentering
- finishing effects
- reactive dyeing

Strategic role:
- manufacturing-aware semantic authority
- buyer education
- sourcing trust
- LLM retrieval strengthening
- operational textile positioning

Future possibility:
- sourcing context layer
- cotton market awareness
- production volatility notes
- textile operational updates


---

## Operational Context Intelligence Layer

Status:
- active
- early operational intelligence now surfaced

Implemented:
- operational context signal system
- dynamic relevance filtering
- manufacturing sensitivity scoring
- sourcing-context article enrichment
- textile operational reasoning framework

Current operational awareness:
- cotton pricing volatility
- dark reactive dyeing pressure
- seasonal production pressure
- finishing stability sensitivity
- dimensional stability sensitivity
- shade approval sensitivity
- knit structure behavior sensitivity

Strategic role:
- sourcing education
- buyer trust
- operational transparency
- future quote intelligence foundation
- future procurement intelligence foundation


---

## Knowledge Branding Layer

Status:
- lightweight implementation added

Purpose:
- make knowledge pages subtly recognizable as Knitspeed-owned material
- support buyer sharing and marketing team usage
- preserve clean sourcing-intelligence aesthetic

Rules:
- branding must remain subtle
- avoid banner-heavy marketing design
- keep focus on textile intelligence and buyer education
- no aggressive visual redesign


---

## Phase 3.6A — Semantic Textile Knowledge Graph

Status:
- established

Purpose:
- turn knowledge articles from flat educational pages into structured textile intelligence nodes
- support better related guide logic, semantic navigation, future buyer-intent inference, and manufacturing intelligence

Implemented:
- semantic metadata primitives:
  - fabricFamilies
  - yarnFamilies
  - processFamilies
  - riskSignals
  - buyerJourneyStage
- weighted semantic relationship scoring
- contextual related-guide labels
- knowledge cluster descriptions on `/knowledge`
- calm semantic hub structure

Strategic role:
- foundation for textile reasoning
- foundation for future sourcing-intent inference
- foundation for manufacturing-aware recommendations
- foundation for future operational textile intelligence

Next:
- 3.6A-5 Mobile Progressive Disclosure Layer
- 3.6B Manufacturing Intelligence Layer

---

## Phase 3.6C — Operational Inference Layer

Status:
- active
- operational inference foundation established

Implemented:
- quote urgency inference
- sourcing stability inference
- buyer intent progression memory

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

Strategic direction:
- deterministic sourcing-aware reasoning
- manufacturing-aware intelligence
- calm editorial UX
- no visible AI clutter
- no noisy prediction dashboards

Next:
- Phase 3.6D Operational Recommendation Intelligence
- hidden recommendation and sourcing-guidance seeding
- future procurement intelligence foundation


---

## Phase 3.6D — Operational Recommendation Intelligence

Status:
- implemented

Implemented:
- operational recommendation seeds
- quote preparation intelligence
- hidden sourcing discussion guidance
- hidden sampling focus inference
- hidden quote-readiness inference

Strategic result:
- Knitspeed now has early sourcing-copilot primitives beneath the textile knowledge layer
- Intelligence remains deterministic and inspectable
- No visible AI feature sprawl introduced


---

## Phase 3.7B — Garment Production Intelligence Layer

Status:
- active and expanding

Implemented:
- garment-production semantic cluster
- garment yield intelligence
- GSM/width/consumption education
- tubular vs open-width operational knowledge
- quotation and marker-efficiency education

Current platform identity:
- textile manufacturing intelligence
- garment production intelligence
- operational sourcing intelligence
- behavioral verification infrastructure

Next possible expansions:
- garment size range consumption logic
- print and decoration intelligence
- screen-print operational behavior
- embroidery and wash-behavior knowledge
- production sequencing intelligence


---

## Phase 4.1C–4.1E — Production Hardening Foundation

Status:
- complete

Implemented:
- deterministic knowledge integrity verification
- metadata normalization pipeline
- semantic taxonomy enforcement
- deployment integrity verification
- deterministic sitemap generation
- robots sitemap advertisement
- Knitspeed-only public brand cleanup

Operational scripts:
- `npm run normalize:knowledge`
- `npm run verify:knowledge`
- `npm run verify:deployment`
- `npm run generate:sitemap`

Current production hardening state:
- 40 knowledge pages verified
- 42 sitemap routes generated
- sitemap deployed
- robots advertises sitemap
- Vercel production deployment verified

Strategic rule:
- semantic/article expansion remains frozen
- Phase 4 priority remains production readiness, canonical/domain stability, crawlability, observability, and buyer trust infrastructure

Next likely directions:
- observe deployed behavior
- prepare future custom domain migration
- later visual textile intelligence layer
- optional performance hardening/code splitting only when needed



---

## Phase 4.2 — Homepage Visual Intelligence UX

Status:
- active refinement
- core implementation complete

Completed:
- 4.2A Product intelligence guidance
- 4.2B Buyer summary hierarchy
- 4.2C Visual fabric guidance
- 4.2D Decision confidence layer
- 4.2E Comparative buyer reasoning
- 4.2F Garment outcome guidance
- 4.2G Visual placeholder architecture
- 4.2H Initial progressive disclosure hierarchy

Strategic purpose:
- translate textile intelligence into buyer comprehension on the main landing page
- help buyers understand fabric use, sourcing fit, garment outcome, and comparison context before requesting a quote
- preserve calm sourcing-aware UX instead of creating noisy AI dashboards

Current UX model:
- homepage surface layer stays simple and visual
- deeper sourcing intelligence is available through collapsible sections
- future image zones are reserved but not yet populated

Next:
- visual QA
- density refinement
- mobile hierarchy polish
- later real textile visual system
- later performance hardening
- later custom domain migration

Rules:
- no new article expansion
- no real images until hierarchy stabilizes
- no homepage feature sprawl
- preserve deterministic mappings
- keep public UX calm, premium, and sourcing-aware
