# Product Categories — Knitspeed / GSC

## Purpose

Create normalized reusable categories for both:
- real GSC/Knitspeed product data
- frontend quote dropdowns
- future products_master table

The system uses two layers:

1. Commercial naming layer  
   What customer/supplier calls the product.

2. Technical normalized layer  
   Clean structured fields for database, filtering, analytics, and AI.

---

# 1. product_category

Main business category.

Allowed values:

- knitted_fabric
- woven_fabric
- yarn
- traded_textile
- accessory
- unknown

Notes:
- knitted_fabric = GSC/Knitspeed core fabric roll / kg products
- woven_fabric = shirting, uniform, fashion woven samples
- yarn = yarn trading / input material
- traded_textile = bought from other traders, composition may be hidden
- accessory = future trims / textile accessories
- unknown = temporary bucket during decoding

---

# 2. fabric_structure

Physical fabric construction.

Allowed values:

## Knitted
- single_jersey
- rib
- interlock
- pique
- fleece
- french_terry
- mesh
- other_knit

## Woven
- plain_weave
- twill
- oxford
- poplin
- dobby
- satin
- other_woven

## Generic
- yarn_only
- non_fabric
- unknown

---

# 3. material_family

Normalized material group.

Allowed values:

- cotton
- cvc
- tc
- polyester
- rayon
- spandex_blend
- modal
- mixed_blend
- hidden_composition
- unknown

Notes:
- Use hidden_composition when supplier/trader intentionally hides exact content.
- Use mixed_blend when some blend is known but not exact.
- Do not force exact composition unless data confirms it.

---

# 4. source_type

Where product comes from.

Allowed values:

- own_stock
- made_to_order
- bought_from_supplier
- bought_from_trader
- customer_sample
- unknown

Notes:
- own_stock = available Knitspeed/GSC stock
- made_to_order = can produce from yarn/greige/dyeing process
- bought_from_supplier = normal supplier/factory
- bought_from_trader = market/trader source, often hidden composition
- customer_sample = physical sample brought by customer or sourced for matching

---

# 5. frontend dropdown enums

## Product Category Dropdown

- Knitted Fabric
- Woven Fabric
- Yarn
- Traded Textile / Sourced Product
- Not Sure

## Fabric Structure Dropdown

- Single Jersey
- Rib
- Interlock
- Pique
- Fleece
- French Terry
- Mesh
- Woven Shirting
- Woven Uniform
- Other / Not Sure

## Material Dropdown

- Cotton
- CVC
- TC
- Polyester
- Rayon
- Spandex Blend
- Mixed / Unknown Composition
- Supplier Hidden Composition
- Not Sure

## Source Type Dropdown

- Knitspeed Stock
- Made to Order
- Bought from Supplier
- Bought from Trader
- Customer Sample Matching
- Not Sure

---

# 6. Mapping Rules

## Product codes

- SJ → single_jersey
- RB / RIB → rib
- IT / INTERLOCK → interlock

## Materials

- CM / Combed / Cotton → cotton
- CVC → cvc
- TC / TC80/20 → tc
- POLY / Polyester → polyester
- unknown trader name → hidden_composition or mixed_blend

## Width

Keep width separate from category logic.

Examples:
- /365 = 36.5 inches
- /32 = 32 inches

---

# 7. Design Principle

Do not over-normalize too early.

The goal is not to reveal every true composition.
The goal is to let GSC/Knitspeed operate with real textile market behavior:

- some names are commercial
- some compositions are hidden
- some products are traded
- some are made in-house
- some are customer samples
- some are incomplete but still useful
