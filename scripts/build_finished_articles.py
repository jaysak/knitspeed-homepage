import pandas as pd
from pathlib import Path

INPUT_FILE = "data/processed/products_master_draft.csv"
OUTPUT_FILE = "data/processed/finished_articles.csv"

df = pd.read_csv(INPUT_FILE)

article_records = []

grouped = df.groupby([
    "material_family",
    "fabric_structure",
    "yarn_count",
    "usage_segment"
], dropna=False)

for idx, ((material, structure, yarn, usage), group) in enumerate(grouped):

    material_map = {
        "combed_cotton": "Combed Cotton",
        "semi_combed_cotton": "Semi Combed Cotton",
        "cotton": "Cotton",
        "cvc": "CVC",
        "tc": "TC Blend",
        "polyester": "Polyester",
        "mixed_blend": "Mixed Blend",
        "unknown": "Specialty Fabric"
    }

    structure_map = {
        "single_jersey": "Single Jersey",
        "rib": "Rib",
        "interlock": "Interlock",
        "unknown": "Special Structure"
    }

    material_name = material_map.get(material, str(material))
    structure_name = structure_map.get(structure, str(structure))

    yarn_text = ""

    if pd.notna(yarn):
        yarn_text = f"{int(float(yarn))}s "

    article_name = f"{yarn_text}{material_name} {structure_name}".strip()

    slug = (
        article_name.lower()
        .replace('"', "")
        .replace(".", "-")
        .replace(" ", "-")
    )

    widths = sorted([
        str(x)
        for x in group["width_inches"].dropna().unique()
    ])

    article_records.append({
        "article_id": f"A{idx+1:04}",
        "article_name": article_name,
        "seo_slug": slug,
        "usage_segment": usage,
        "material_family": material,
        "fabric_structure": structure,
        "yarn_count": yarn,
        "available_widths": ", ".join(widths),
        "linked_products": len(group),
        "lead_priority": "prime"
    })

articles_df = pd.DataFrame(article_records)

articles_df = articles_df.sort_values(
    by=["usage_segment", "article_name"]
)

articles_df.to_csv(OUTPUT_FILE, index=False)

print(f"Built {len(articles_df)} finished articles")
print(f"Saved to: {OUTPUT_FILE}")
