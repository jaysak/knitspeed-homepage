export const usageSegmentLabels = {
  collar_cuff: "Collar / cuff",
  general: "General fabric",
  premium_fashion: "Premium fashion",
  tshirt: "T-shirt fabric",
};

export function titleize(value) {
  return String(value || "")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
