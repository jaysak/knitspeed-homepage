# Knitspeed Textile Naming Rules v1

## Core Format

Typical pattern:

PRODUCT_CODE / WIDTH

Example:
30CMSJ/365

Meaning:
- 30 = yarn count
- CM = combed cotton yarn
- SJ = Single Jersey
- 365 = 36.5 inch fabric width

---

## Confirmed Structure Codes

- SJ = Single Jersey
- RB = Rib
- IT = Interlock

---

## Confirmed Material / Yarn Codes

- CM = Combed cotton yarn
- CVC = CVC cotton/polyester blend
- TC80/20 = TC blend 80/20
- SM = Semi-combed or related internal yarn category, needs confirmation
- TD104 = internal blend/category, needs confirmation
- OEW = Open-end yarn / OE-related category, needs confirmation

---

## Width Rules

Width is usually after `/`.

Examples:
- /365 = 36.5"
- /375 = 37.5"
- /32 = 32"
- /84 = 84"

Rule:
- 3-digit width ending with 5 usually means decimal width.
- 365 -> 36.5
- 375 -> 37.5
- 345 -> 34.5
- 445 -> 44.5
- 2-digit width stays direct inch value.

---

## Cleanup Rules

Before decoding:
- remove leading `*`
- remove extra spaces
- uppercase English codes
- preserve Thai descriptive text when present
- normalize inconsistent spacing around SJ / RB / IT

---

## Examples

### 30CMSJ/365
- yarn_count: 30
- yarn_code: CM
- fabric_structure: Single Jersey
- width: 36.5"

### 30CMRB/32
- yarn_count: 30
- yarn_code: CM
- fabric_structure: Rib
- width: 32"

### 45TC80/20IT/84
- yarn_count: 45
- yarn_code: TC80/20
- fabric_structure: Interlock
- width: 84"

## Subtask 2.3 Status
In Progress

---

# Real Textile Market Reality

Textile naming in actual operations is not always technically standardized.

Common realities:
- suppliers hide composition
- traders rename products
- customers use their own aliases
- same fabric may have multiple market names
- composition may be partially unknown
- outsourced/traded products may not follow internal naming rules

Therefore:
products_master must support both:
- technical normalization
- commercial naming flexibility

---

# Proposed Product Architecture

## Layer 1 — Commercial Layer

Fields:
- display_name
- market_name
- supplier_alias
- customer_alias
- sales_description

Purpose:
- customer-facing naming
- sales communication
- supplier relationship handling
- market terminology flexibility

---

## Layer 2 — Technical Layer

Fields:
- product_category
- fabric_structure
- weave_type
- knit_type
- yarn_count
- composition_known
- composition_estimated
- composition_status
- width_inch
- gsm
- finish_type
- source_type

Purpose:
- normalization
- filtering
- forecasting
- AI recommendations
- inventory logic
- analytics

---

# Proposed composition_status Values

- confirmed
- estimated
- supplier_hidden
- unknown

---

# Proposed product_category Values

- knitted_fabric
- woven_fabric
- traded_fabric
- development_item
- sample_only

---

# Proposed fabric_structure Values

Knitted:
- Single Jersey
- Rib
- Interlock
- Pique
- Fleece
- French Terry

Woven:
- Twill
- Oxford
- Poplin
- Satin

---

# Strategic Direction

Knitspeed products_master should become:
- operationally realistic
- commercially flexible
- technically structured
- AI-ready
- future ERP-compatible

This avoids over-rigid ERP behavior while preserving data intelligence.
