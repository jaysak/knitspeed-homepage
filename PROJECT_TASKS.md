# KNITSPEED HOMEPAGE — PROJECT TASKS
Updated: 2026-05-06

---

# CURRENT STATUS

## Infrastructure
- [x] GitHub repository connected
- [x] Vercel deployment pipeline working
- [x] Production deployment confirmed
- [x] Local Vite development working
- [x] Homepage publicly accessible via deployment URL

## Quote Form
- [x] Form UI stabilized
- [x] Submit flow fixed
- [x] Graceful error handling added
- [x] Local fallback lead storage implemented
- [ ] Supabase production connection unresolved
- [ ] Remove temporary fallback/debug scaffolding later

## Supabase Findings
- Supabase hostname could not resolve:
  divpreezwaxutcbigdxp.supabase.co

- Root issue appears infrastructure/DNS/project-related
  rather than frontend code or RLS.

- Future action:
  create clean production-grade Supabase project later.

---

# NEXT PRIORITY TASKS

## TASK 1 — Clean Production Polish
Priority: HIGH
Estimate: 30–60 min

- remove temporary debug code
- remove temporary fallback messaging
- improve mobile spacing
- improve CTA consistency
- final typography cleanup

---

## TASK 2 — Rebuild Supabase Properly
Priority: HIGH
Estimate: 1–2 hrs

Goals:
- create stable production project
- reconnect env vars
- verify DNS resolution
- recreate quote_leads table
- verify RLS correctly
- production quote inserts working

---

## TASK 3 — Build products_master
Priority: HIGH
Estimate: 1–2 hrs

Goals:
- real textile naming conventions
- GSM grouping
- fabric category taxonomy
- cotton/CVC/TC/rib/interlock structure
- aligned with GSC real sales terminology

---

## TASK 4 — Dynamic Quote Dropdowns
Priority: HIGH
Estimate: 45–90 min

Goals:
- load fabric types from DB
- load usage types from DB
- reduce human input errors
- standardize incoming quote leads

---

## TASK 5 — Lead Intake Dashboard
Priority: MEDIUM
Estimate: 2–4 hrs

Goals:
- view quote requests
- status pipeline
- customer follow-up tracking
- export leads
- future CRM integration

---

## TASK 6 — Retail KG Pricing Logic
Priority: MEDIUM
Estimate: 2–3 hrs

Goals:
- support small lot buyers
- markup logic for KG sales
- preserve roll pricing separately
- sample order capability

---

## TASK 7 — Domain Migration
Priority: MEDIUM
Estimate: TBD

Goals:
- migrate from old GoDaddy Wordpress
- preserve SEO
- connect knitspeed.com cleanly
- redirect strategy
- modern frontend stack only

---

# LONGER TERM VISION

## Knitspeed Platform Direction
- textile supply intelligence system
- real production visibility
- customer forecasting
- safety stock planning
- reorder recommendations
- AI-assisted sales pipeline
- future agent-assisted procurement

---

# IMPORTANT LESSONS LEARNED

## Debugging Order
1. DNS / hostname
2. deployment URL
3. environment variables
4. network connectivity
5. database
6. frontend code

Do not assume frontend bug first.

