import XLSX from "xlsx";
import fs from "fs";

const workbook = XLSX.readFile("./data/raw/gsc_sales_2026.xlsx");
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(sheet);

const productMap = new Map();

for (const row of rows) {
  const raw = String(row.Clothno || "").trim();
  if (!raw) continue;

  const key = raw.toUpperCase().replace(/\s+/g, " ");

  if (!productMap.has(key)) {
    productMap.set(key, {
      clothno_raw: raw,
      clothno_clean: key,
      ftype: row.Ftype || "",
      fwidth: row.Fwidth || "",
      count: 0,
      total_kg: 0,
      avg_price_kg_total: 0,
      avg_price_kg_count: 0,
    });
  }

  const item = productMap.get(key);
  item.count += 1;
  item.total_kg += Number(row.Sumkg || 0);

  const price = Number(row.Kgprice || 0);
  if (price > 0) {
    item.avg_price_kg_total += price;
    item.avg_price_kg_count += 1;
  }
}

const products = [...productMap.values()]
  .map((item) => ({
    clothno_raw: item.clothno_raw,
    clothno_clean: item.clothno_clean,
    ftype: item.ftype,
    fwidth: item.fwidth,
    occurrence_count: item.count,
    total_kg: item.total_kg.toFixed(2),
    avg_price_kg:
      item.avg_price_kg_count > 0
        ? (item.avg_price_kg_total / item.avg_price_kg_count).toFixed(2)
        : "",
  }))
  .sort((a, b) => b.occurrence_count - a.occurrence_count);

fs.mkdirSync("./data/processed", { recursive: true });

const csvHeader = [
  "clothno_raw",
  "clothno_clean",
  "ftype",
  "fwidth",
  "occurrence_count",
  "total_kg",
  "avg_price_kg",
];

const csvRows = products.map((p) =>
  csvHeader
    .map((field) => `"${String(p[field] ?? "").replaceAll('"', '""')}"`)
    .join(",")
);

fs.writeFileSync(
  "./data/processed/unique_products_raw.csv",
  [csvHeader.join(","), ...csvRows].join("\n")
);

console.log("\n=== UNIQUE PRODUCTS EXTRACTED ===");
console.log(products.length);

console.log("\n=== TOP 30 PRODUCTS BY OCCURRENCE ===");
console.table(products.slice(0, 30));

console.log("\nSaved:");
console.log("data/processed/unique_products_raw.csv");
