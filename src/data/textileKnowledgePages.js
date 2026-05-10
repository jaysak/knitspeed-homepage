export const TEXTILE_KNOWLEDGE_PAGES = [
  {
    slug: "single-jersey-vs-interlock",
    eyebrow: "Textile knowledge",
    title: "Single Jersey vs Interlock",
    subtitle:
      "A practical buyer guide to two common knitted fabric structures and how to choose between them for apparel production.",
    shortAnswer:
      "Single Jersey is usually chosen when buyers want a lighter, flexible knitted fabric with a clear front and back face. Interlock is usually chosen when buyers want a smoother, more stable double-knit fabric with a balanced face on both sides. The best choice depends on garment use, target hand feel, finishing, color, and production requirements.",
    comparison: [
      {
        name: "Single Jersey",
        specs: {
          composition: "Can be made in cotton, blends, or synthetic fibers",
          structure: "Single-knit structure with different front and back faces",
          width: "Confirmed by production spec",
          gsm: "Depends on yarn, knitting density, and finishing",
          moq: "Confirmed after sourcing check",
          useCases: ["T-shirts", "fashion tops", "light casualwear"],
        },
      },
      {
        name: "Interlock",
        specs: {
          composition: "Can be made in cotton, blends, or synthetic fibers",
          structure: "Double-knit structure with a smoother, more stable hand",
          width: "Confirmed by production spec",
          gsm: "Depends on yarn, knitting density, and finishing",
          moq: "Confirmed after sourcing check",
          useCases: ["uniforms", "babywear", "smooth casualwear"],
        },
      },
    ],
    guidance: [
      "Choose Single Jersey when drape, lightness, and cost efficiency matter more than body and structure.",
      "Choose Interlock when the garment needs a smoother surface, more stability, or a more balanced feel on both sides.",
      "For printing, embroidery, uniforms, or repeat production, confirm shrinkage, colorfastness, finishing, and width before ordering production quantity.",
      "Ask for fabric recommendations based on garment type, target market, required hand feel, color, and quantity instead of choosing by fabric name alone.",
    ],
    mistakes: [
      "Comparing fabric only by name without checking GSM, width, finishing, and shrinkage.",
      "Assuming all Single Jersey or all Interlock fabrics behave the same across yarn counts, blends, and dyeing methods.",
      "Choosing a fabric before confirming how it will be cut, sewn, printed, washed, or worn.",
      "Using sample hand feel as the only decision point without confirming production consistency.",
    ],
    faqs: [
      {
        question: "Is Interlock always better than Single Jersey?",
        answer:
          "No. Interlock is more stable and smooth for some garments, but Single Jersey can be a better choice for lighter T-shirts and flexible casualwear. The right fabric depends on the garment and production target.",
      },
      {
        question: "Can both fabrics be made from cotton?",
        answer:
          "Yes. Both structures can be knitted with cotton or cotton blends. Composition should be confirmed separately from the fabric structure.",
      },
      {
        question: "Should buyers choose by GSM first?",
        answer:
          "GSM matters, but it should be checked together with structure, width, hand feel, shrinkage, finishing, and intended use. A GSM number alone does not fully describe the fabric.",
      },
      {
        question: "Can Knitspeed help choose between these fabrics?",
        answer:
          "Yes. Knitspeed can support sourcing discussions by matching fabric structure, quantity, use case, and production needs before quoting.",
      },
    ],
  },
];

export function getTextileKnowledgePage(slug) {
  return TEXTILE_KNOWLEDGE_PAGES.find((page) => page.slug === slug) || null;
}
