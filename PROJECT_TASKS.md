# KNITSPEED HOMEPAGE — TASK ROADMAP

Last Updated: 2026-05-06

---

# COMPLETED ✅

## Infrastructure
- GitHub repo connected
- Vercel deployment live
- Supabase connected
- Supabase CLI linked
- .gitignore cleaned
- Local + production workflow verified

## Quote System
- quote_leads insert working
- schema mapping fixed
- textile dropdown polish
- consultation-style helper text
- small quantity messaging
- response expectation trust signal

---

# NEXT TASKS 🚀

## TASK 1 — Form UX Polish
Estimate: 30–45 min

- improve spacing/alignment
- mobile responsiveness check
- validation polish
- success/error UX cleanup
- optional field indicators

---

## TASK 2 — Real Product Naming Extraction
Estimate: 1–2 hrs

Goal:
Extract real textile product names from sales data.

Output:
- real GSM naming
- real fabric categories
- common constructions
- product terminology aligned with GSC business

---

## TASK 3 — products_master Table
Estimate: 45–90 min

Goal:
Create structured textile product database.

Possible columns:
- product_code
- product_name
- fabric_type
- gsm
- composition
- width
- stock_unit
- active_status

---

## TASK 4 — Dynamic Product Dropdown
Estimate: 45–90 min

Goal:
Load fabric options directly from Supabase instead of hardcoded JSX.

Benefits:
- scalable
- editable without code
- future inventory integration

---

## TASK 5 — Internal Lead Dashboard
Estimate: 2–4 hrs

Goal:
Internal staff dashboard for quote leads.

Features:
- recent inquiries
- lead status
- callback tracking
- filtering
- future LINE integration

---

## TASK 6 — KG Retail / Small Lot Logic
Estimate: 2–3 hrs

Goal:
Support sample orders and small-batch buying flow.

Potential:
- MOQ guidance
- retail markup logic
- estimated rolls/kg conversion

---

## TASK 7 — Domain Migration Strategy
Estimate: TBD

Goal:
Move from old GoDaddy WordPress structure toward modern GitHub/Vercel architecture.

---

# LONG TERM VISION 🌎

Knitspeed evolving toward:
- textile supply intelligence system
- real production visibility
- customer forecasting
- safety stock planning
- reorder recommendations
- AI-assisted sales pipeline
- future agent-assisted procurement


---

# TASK 2 — Real Product Naming Extraction
Estimate: 1–2 hrs initial pass

Goal:
Extract real textile product naming from actual GSC sales data and normalize into structured master data.

---

## SUBTASK 2.1 — Inspect Source Data
Estimate: 15–20 min

Deliverables:
- identify useful columns
- confirm naming patterns
- identify textile abbreviations
- identify units and widths
- detect noisy data columns

Completion Criteria:
- documented usable columns
- understood naming structure
- ready for extraction step

Checkpoint:
- commit findings notes

---

## SUBTASK 2.2 — Extract Unique Product Names
Estimate: 20–30 min

Deliverables:
- unique Clothno/product names
- frequency overview
- duplicate detection
- raw export list

Completion Criteria:
- clean unique naming list exported
- obvious junk entries identified

Checkpoint:
- export CSV snapshot
- commit extraction scripts/notes

---

## SUBTASK 2.3 — Decode Naming Structure
Estimate: 30–45 min

Deliverables:
- yarn count patterns
- composition abbreviations
- knit structure decoding
- width interpretation
- naming conventions

Examples:
- SJ = Single Jersey
- RB = Rib
- IT = Interlock
- CVC = Chief Value Cotton

Completion Criteria:
- initial textile naming dictionary established
- normalization rules documented

Checkpoint:
- naming_rules.md
- commit decoding logic

---

## SUBTASK 2.4 — Build Product Categories
Estimate: 30–45 min

Deliverables:
- normalized categories
- fabric structure grouping
- composition grouping
- reusable dropdown values

Completion Criteria:
- usable categories for frontend dropdowns
- suitable for products_master table

Checkpoint:
- categories CSV/MD committed

---

## SUBTASK 2.5 — Generate products_master Draft
Estimate: 20–30 min

Deliverables:
- products_master draft CSV
- normalized columns
- preliminary product codes

Suggested Columns:
- product_code
- product_name
- fabric_structure
- composition
- yarn_count
- gsm
- width
- active_status

Completion Criteria:
- import-ready draft generated
- suitable for Supabase import

Checkpoint:
- products_master_draft.csv committed

---

RULE:
No subtask left partially ambiguous before ending session.
Each subtask must end in:
- notes
- export
- commit
- or explicit checkpoint state

