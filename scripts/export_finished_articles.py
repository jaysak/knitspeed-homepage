import csv
import json
from pathlib import Path

INPUT_CSV = Path("data/processed/finished_articles.csv")
OUTPUT_JS = Path("src/data/finishedArticles.js")


def clean_number(value):
    text = str(value or "").strip()
    if not text:
        return ""

    try:
        number = float(text)
    except ValueError:
        return text

    if number.is_integer():
        return str(int(number))

    return str(number)


def split_widths(value):
    widths = []

    for item in str(value or "").split(","):
        width = clean_number(item)
        if width:
            widths.append(width)

    return widths


articles = []

with INPUT_CSV.open(newline="", encoding="utf-8") as f:
    reader = csv.DictReader(f)

    for row in reader:
        articles.append(
            {
                "articleId": row["article_id"],
                "articleName": row["article_name"],
                "seoSlug": row["seo_slug"],
                "usageSegment": row["usage_segment"],
                "materialFamily": row["material_family"],
                "fabricStructure": row["fabric_structure"],
                "yarnCount": clean_number(row["yarn_count"]),
                "availableWidths": split_widths(row["available_widths"]),
                "linkedProducts": int(row["linked_products"] or 0),
                "leadPriority": row["lead_priority"],
            }
        )

OUTPUT_JS.parent.mkdir(parents=True, exist_ok=True)

with OUTPUT_JS.open("w", encoding="utf-8") as f:
    f.write("// Auto-generated from data/processed/finished_articles.csv\n")
    f.write("// Do not edit manually. Run scripts/export_finished_articles.py instead.\n\n")
    f.write("export const FINISHED_ARTICLES = ")
    json.dump(articles, f, indent=2, ensure_ascii=False)
    f.write(";\n")

print(f"Exported {len(articles)} finished articles to {OUTPUT_JS}")
