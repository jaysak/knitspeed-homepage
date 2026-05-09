# KNITSPEED PRIME ENGINE ROADMAP
Author: Jay + Jarvis
Status: Active Build
Last Updated: 2026-05-09

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

Should:
- auto-scroll to quote form
- prefill quote fields
- store selected article

---

## 3.4B
Buyer intent tracking

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

Add fields:
- monthly usage
- brand/factory/trader
- target market
- production vs sampling
- sourcing pain points

---

# FUTURE ROADMAP

## Phase 3.5
SEO product pages

Generate:
- /products/[slug]

Goal:
Google indexing + inbound leads

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

