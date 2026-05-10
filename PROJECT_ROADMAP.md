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
- 3.4C Buyer Qualification Layer

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
