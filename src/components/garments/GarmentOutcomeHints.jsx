const GARMENT_HINTS = [
  {
    key: "oversized",
    label: "Oversized Tees",
    icon: "/visuals/garments/icons/oversized-tee.png",
  },
  {
    key: "printing",
    label: "Printing",
    icon: "/visuals/garments/icons/printing.png",
  },
  {
    key: "soft",
    label: "Soft Hand",
    icon: "/visuals/garments/icons/soft-hand.png",
  },
  {
    key: "structure",
    label: "Structured Fit",
    icon: "/visuals/garments/icons/structured-fit.png",
  },
];

function resolveHints(article = {}) {
  const text = [
    article.articleName,
    article.fabricStructure,
    article.materialFamily,
    article.seoSlug,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const hints = [];

  if (
    text.includes("single jersey") ||
    text.includes("compact") ||
    text.includes("combed")
  ) {
    hints.push(GARMENT_HINTS[0]);
    hints.push(GARMENT_HINTS[2]);
  }

  if (text.includes("interlock") || text.includes("rib")) {
    hints.push(GARMENT_HINTS[3]);
  }

  hints.push(GARMENT_HINTS[1]);

  return [...new Map(hints.map((h) => [h.key, h])).values()].slice(0, 3);
}

export default function GarmentOutcomeHints({ article }) {
  const hints = resolveHints(article);

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {hints.map((hint) => (
        <div
          key={hint.key}
          className="inline-flex items-center gap-2 rounded-full border border-slate-100 bg-slate-50/80 px-3 py-1.5"
        >
          <img
            src={hint.icon}
            alt=""
            className="h-4 w-4 object-contain opacity-70"
            loading="lazy"
          />

          <span className="text-[11px] font-semibold text-slate-600">
            {hint.label}
          </span>
        </div>
      ))}
    </div>
  );
}
