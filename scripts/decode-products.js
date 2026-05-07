import fs from "fs";

const inputPath = "./data/processed/unique_products_raw.csv";
const outputPath = "./data/processed/decoded_products_v1.csv";

const raw = fs.readFileSync(inputPath, "utf8").trim();
const lines = raw.split("\n");
const headers = lines[0].split(",");

function parseCsvLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"' && line[i + 1] === '"') {
      current += '"';
      i++;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current);
  return result;
}

function cleanCode(code) {
  return String(code || "")
    .trim()
    .replace(/^\*+/, "")
    .replace(/\s+/g, "")
    .toUpperCase();
}

function decodeWidth(widthRaw, code) {
  const fromCode = code.includes("/") ? code.split("/").pop() : "";
  const raw = String(fromCode || widthRaw || "").replace(/[^0-9]/g, "");

  if (!raw) return "";

  if (raw.length === 3 && raw.endsWith("5")) {
    return `${raw.slice(0, 2)}.5`;
  }

  return raw;
}

function decodeStructure(code, ftype) {
  if (code.includes("SJ")) return "Single Jersey";
  if (code.includes("RB")) return "Rib";
  if (code.includes("IT") || code.includes("INT")) return "Interlock";
  return ftype || "";
}

function decodeYarnCount(code) {
  const match = code.match(/^(\d+)/);
  return match ? match[1] : "";
}

function decodeYarnCode(code) {
  let body = code.split("/")[0];
  body = body.replace(/^(\d+)/, "");

  if (body.includes("TC80/20")) return "TC80/20";
  if (body.includes("CVC")) return "CVC";
  if (body.includes("CM")) return "CM";
  if (body.includes("SM")) return "SM";
  if (body.includes("TD104")) return "TD104";
  if (body.includes("OEW")) return "OEW";
  if (body.includes("TK")) return "TK";

  return body.replace(/SJ|RB|IT|INT/g, "");
}

function makeProductName({ yarn_count, yarn_code, fabric_structure, width_inch }) {
  const yarnText = yarn_count && yarn_code ? `${yarn_count}${yarn_code}` : yarn_count || yarn_code || "Unknown";
  const structureText = fabric_structure || "Unknown Fabric";
  const widthText = width_inch ? `${width_inch}"` : "Unknown width";
  return `${yarnText} ${structureText} ${widthText}`;
}

const rows = lines.slice(1).map((line) => {
  const values = parseCsvLine(line);
  const row = Object.fromEntries(headers.map((h, i) => [h, values[i] || ""]));

  const normalized_code = cleanCode(row.clothno_clean);
  const yarn_count = decodeYarnCount(normalized_code);
  const fabric_structure = decodeStructure(normalized_code, row.ftype);
  const yarn_code = decodeYarnCode(normalized_code);
  const width_inch = decodeWidth(row.fwidth, normalized_code);
  const product_name = makeProductName({
    yarn_count,
    yarn_code,
    fabric_structure,
    width_inch,
  });

  return {
    ...row,
    normalized_code,
    yarn_count,
    yarn_code,
    fabric_structure,
    width_inch,
    product_name,
  };
});

const outputHeaders = [
  "normalized_code",
  "product_name",
  "yarn_count",
  "yarn_code",
  "fabric_structure",
  "width_inch",
  "clothno_raw",
  "ftype",
  "fwidth",
  "occurrence_count",
  "total_kg",
  "avg_price_kg",
];

const csv = [
  outputHeaders.join(","),
  ...rows.map((row) =>
    outputHeaders
      .map((field) => `"${String(row[field] ?? "").replaceAll('"', '""')}"`)
      .join(",")
  ),
].join("\n");

fs.writeFileSync(outputPath, csv);

console.log("\n=== DECODED PRODUCTS V1 ===");
console.log(rows.length);
console.table(rows.slice(0, 30).map((r) => ({
  normalized_code: r.normalized_code,
  product_name: r.product_name,
  yarn_count: r.yarn_count,
  yarn_code: r.yarn_code,
  fabric_structure: r.fabric_structure,
  width_inch: r.width_inch,
  occurrence_count: r.occurrence_count,
})));

console.log("\nSaved:");
console.log(outputPath);
