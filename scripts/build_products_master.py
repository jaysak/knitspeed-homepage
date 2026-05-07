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
        return "cotton"

    # OE weaving / OE knitting
    if "OEW" in n or "OE" in n:
        return "cotton"

    # Generic polyester
    if "POLY" in n:
        return "polyester"

    # Cotton / combed
    if "CM" in n or "COMBED" in n or "COTTON" in n:
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

def extract_width(name):
    match = re.search(r"/(\d+)", str(name))

    if match:
        raw = match.group(1)

        if len(raw) == 3:
            return float(raw) / 10

        return float(raw)

    return None

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
        "product_category": category,
        "fabric_structure": structure,
        "material_family": material,
        "source_type": "unknown",
        "yarn_count": row.get("yarn_count", None),
        "width_inches": row.get("width_inch", width),
        "gsm": None,
        "color": None,
        "unit": "kg",
        "confidence_score": 0.7,
        "notes": ""
    }

    records.append(record)

master_df = pd.DataFrame(records)

master_df.to_csv(OUTPUT_FILE, index=False)

print(f"Built {len(master_df)} products")
print(f"Saved to: {OUTPUT_FILE}")
