import XLSX from "xlsx";

const workbook = XLSX.readFile("./data/raw/gsc_sales_2026.xlsx");

console.log("\n=== SHEETS ===");
console.log(workbook.SheetNames);

const firstSheet = workbook.SheetNames[0];
const worksheet = workbook.Sheets[firstSheet];

const data = XLSX.utils.sheet_to_json(worksheet);

console.log("\n=== TOTAL ROWS ===");
console.log(data.length);

console.log("\n=== SAMPLE ROW ===");
console.log(data[0]);

console.log("\n=== COLUMNS ===");
console.log(Object.keys(data[0] || {}));

console.log("\n=== SAMPLE CLOTHNO VALUES ===");

const clothNos = data
  .map((row) => row.Clothno)
  .filter(Boolean)
  .slice(0, 20);

console.log(clothNos);