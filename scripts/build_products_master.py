import pandas as pd
import re
from pathlib import Path

INPUT_FILE = "data/processed/decoded_products_v1.csv"
OUTPUT_FILE = "data/processed/products_master_draft.csv"

df = pd.read_csv(INPUT_FILE)

records = []

def detect_structure(name):
    n = str(name).upper()

    if "SINGLE JERSEY" in n or "SJ" in n:
        return "single_jersey"

    if "RIB" in n or " RB" in n or "RB/" in n:
        return "rib"

    if "INTERLOCK" in n or "IT" in n:
        return "interlock"

    return "unknown"

def detect_material(name):
    n = str(name).upper()

    # CVC blends
    if "CVC" in n:
        return "cvc"

    # Tetron cotton
    if "TC" in n:
        return "tc"

    # Poly ring spun
    if "TK" in n:
        return "polyester"

    # Top dyed blended yarn
    if "TD" in n:
        return "mixed_blend"

    # Semi combed
    if "SM" in n:
        return "semi_combed_cotton"

    # OE weaving / OE knitting
    if "OEW" in n or "OE" in n:
        return "cotton"

    # Generic polyester
    if "POLY" in n:
        return "polyester"

    # Combed cotton
    if "CM" in n:
        return "combed_cotton"

    # Generic cotton fallback
    if "COMBED" in n or "COTTON" in n:
        return "cotton"

    return "unknown"

def detect_category(structure):
    if structure in [
        "single_jersey",
        "rib",
        "interlock"
    ]:
        return "knitted_fabric"

    return "traded_textile"


def build_display_name(row):
    yarn = row.get("yarn_count")
    width = row.get("width_inches")

    material_map = {
        "combed_cotton": "Combed Cotton",
        "semi_combed_cotton": "Semi Combed Cotton",
        "cotton": "Cotton",
        "cvc": "CVC",
        "tc": "TC Blend",
        "polyester": "Polyester",
        "mixed_blend": "Mixed Blend"
    }

    structure_map = {
        "single_jersey": "Single Jersey",
        "rib": "Rib",
        "interlock": "Interlock"
    }

    material = material_map.get(
        row.get("material_family"),
        "Fabric"
    )

    structure = structure_map.get(
        row.get("fabric_structure"),
        "Fabric"
    )

    parts = []

    if pd.notna(yarn):
        parts.append(f"{int(float(yarn))}s")

    if material != "Fabric":
        parts.append(material)

    if structure != "Fabric":
        parts.append(structure)

    if pd.notna(width):
        parts.append(f'{float(width):g}"')

    if parts:
        return " ".join(parts)

    fallback = row.get("commercial_name") or row.get("raw_product_name") or "Knitspeed Fabric"
    return str(fallback)

def build_seo_slug(display_name):
    slug = display_name.lower()

    slug = slug.replace('"', "")
    slug = slug.replace(".", "-")
    slug = slug.replace(" ", "-")

    while "--" in slug:
        slug = slug.replace("--", "-")

    return slug.strip("-")


def detect_usage_segment(structure):
    if structure == "single_jersey":
        return "tshirt"

    if structure == "rib":
        return "collar_cuff"

    if structure == "interlock":
        return "premium_fashion"

    return "general"


def extract_width(name):
    match = re.search(r"/(\d+)", str(name))

    if match:
        raw = match.group(1)

        if len(raw) == 3:
            return float(raw) / 10

        return float(raw)

    return None


def build_review_flags(record, combined_name):
    notes = []
    confidence = 0.85
    requires_review = False

    width = record.get("width_inches")
    material = record.get("material_family")
    structure = record.get("fabric_structure")
    raw = str(record.get("raw_product_name", "")).upper()
    commercial = str(record.get("commercial_name", ""))

    if pd.isna(width) or width is None:
        requires_review = True
        confidence -= 0.15
        notes.append("missing width")

    elif width > 120:
        record["width_inches"] = None
        requires_review = True
        confidence -= 0.30
        notes.append("suspicious width parsing")

    if material == "unknown":
        requires_review = True
        confidence -= 0.20
        notes.append("unknown material family")

    if structure == "unknown":
        requires_review = True
        confidence -= 0.15
        notes.append("unknown fabric structure")

    if "OEW" in raw:
        requires_review = True
        confidence -= 0.10
        notes.append("OE weaving yarn used in knitting context")

    thai_chars = any("\u0E00" <= ch <= "\u0E7F" for ch in commercial)
    if thai_chars:
        confidence -= 0.10
        notes.append("Thai commercial/pattern name preserved")

    record["confidence_score"] = round(max(confidence, 0.20), 2)
    record["requires_manual_review"] = requires_review
    record["review_reason"] = "; ".join(notes)

    return record

for idx, row in df.iterrows():

    raw_name = str(row.get("product_name", ""))
    code_name = str(row.get("normalized_code", ""))
    combined_name = raw_name + " " + code_name

    structure = detect_structure(combined_name)
    material = detect_material(raw_name)
    category = detect_category(structure)
    width = extract_width(raw_name)

    record = {
        "product_id": f"P{idx+1:05}",
        "commercial_name": raw_name,
        "raw_product_name": str(row.get("normalized_code", "")),

        "display_name": "",
        "seo_slug": "",
        "article_title": "",
        "usage_segment": "",
        "lead_priority": "prime",
        "product_category": category,
        "fabric_structure": structure,
        "material_family": material,
        "source_type": "unknown",
        "yarn_count": row.get("yarn_count", None),
        "width_inches": row.get("width_inch", width),
        "gsm": None,
        "color": None,
        "unit": "kg",
        "confidence_score": 0.85,
        "notes": "",
        "requires_manual_review": False,
        "review_reason": ""
    }

    record = build_review_flags(record, combined_name)

    record["display_name"] = build_display_name(record)

    record["seo_slug"] = build_seo_slug(
        record["display_name"]
    )

    record["article_title"] = (
        f'{record["display_name"]} Fabric'
    )

    record["usage_segment"] = detect_usage_segment(
        record["fabric_structure"]
    )

    records.append(record)

master_df = pd.DataFrame(records)

master_df.to_csv(OUTPUT_FILE, index=False)

print(f"Built {len(master_df)} products")
print(f"Saved to: {OUTPUT_FILE}")
