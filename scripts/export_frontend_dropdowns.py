import pandas as pd
import json
from pathlib import Path

INPUT_CSV = "data/processed/products_master_draft.csv"

OUTPUT_JSON = "src/data/productDropdowns.json"
OUTPUT_ENUMS = "src/data/textileEnums.js"

df = pd.read_csv(INPUT_CSV)

def clean_values(series):
    values = []
    for v in series.dropna():
        text = str(v).strip()
        if text and text.lower() not in ["nan", "none", "unknown"]:
            values.append(text)
    return sorted(set(values))

def clean_numbers(series):
    values = []
    for v in series.dropna():
        try:
            n = float(v)
            if n.is_integer():
                values.append(str(int(n)))
            else:
                values.append(str(n))
        except Exception:
            pass
    return sorted(set(values), key=lambda x: float(x))

dropdowns = {
    "product_categories": clean_values(df["product_category"]),
    "fabric_structures": clean_values(df["fabric_structure"]),
    "material_families": clean_values(df["material_family"]),
    "source_types": clean_values(df["source_type"]),
    "yarn_counts": clean_numbers(df["yarn_count"]),
    "width_inches": clean_numbers(df["width_inches"]),
    "gsm": clean_numbers(df["gsm"]),
    "colors": clean_values(df["color"]),
    "units": clean_values(df["unit"]),
    "manual_review_options": ["false", "true"],
}

Path("src/data").mkdir(parents=True, exist_ok=True)

with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
    json.dump(dropdowns, f, indent=2, ensure_ascii=False)

lines = [
    "// Auto-generated from data/processed/products_master_draft.csv",
    "// Do not edit manually. Run scripts/export_frontend_dropdowns.py instead.",
    "",
]

for key, values in dropdowns.items():
    const_name = key.upper()
    lines.append(f"export const {const_name} = [")
    for item in values:
        escaped = str(item).replace('"', '\\"')
        lines.append(f'  "{escaped}",')
    lines.append("];")
    lines.append("")

with open(OUTPUT_ENUMS, "w", encoding="utf-8") as f:
    f.write("\n".join(lines))

print("✅ Frontend dropdown export completed")
print(f"JSON: {OUTPUT_JSON}")
print(f"ENUMS: {OUTPUT_ENUMS}")

for key, values in dropdowns.items():
    print(f"{key}: {len(values)} options")
