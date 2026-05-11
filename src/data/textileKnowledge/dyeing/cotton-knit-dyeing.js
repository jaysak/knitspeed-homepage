export const cottonKnitDyeingKnowledge = {
  slug: "cotton-knit-dyeing",
  title: "Cotton Knit Dyeing Process",
  category: "Dyeing & Finishing",
  sourceType: "factory_experience_plus_technical_validation",
  expertSource: "Mr. Kasame",
  commercialPurpose:
    "Help customers understand real dyeing risks, production dependencies, and quality-control checkpoints for cotton knitted fabric.",

  overview:
    "Cotton knitted fabric dyeing is not only a color process. It changes fabric behavior, width, GSM, shrinkage, handfeel, shade consistency, and delivery reliability. The final quality depends on yarn, knitting tension, scouring, bleaching, dyeing, washing, finishing, compacting, and quality inspection.",

  processFlow: [
    "Greige fabric receiving",
    "Fabric inspection",
    "Relaxation / preparation",
    "Scouring",
    "Bleaching when required",
    "Dyeing",
    "Soaping / washing",
    "Softening / finishing",
    "Drying",
    "Stenter or tumble drying depending on construction",
    "Compacting",
    "Final inspection",
    "Packing"
  ],

  keyPainpoints: [
    {
      topic: "Shade matching",
      explanation:
        "Lab dip approval does not guarantee perfect bulk shade. Bulk shade can shift due to machine condition, water quality, dyestuff lot, fabric absorbency, and process control.",
      customerTrustAngle:
        "Explain that lab dip is a control step, not a magic guarantee. Bulk production still needs careful shade monitoring."
    },
    {
      topic: "Shrinkage",
      explanation:
        "Cotton knit fabric usually shrinks after wet processing because loops relax and internal knitting tension is released.",
      customerTrustAngle:
        "Discuss expected shrinkage before quotation, especially for fitted garments or strict size specs."
    },
    {
      topic: "Width and GSM change",
      explanation:
        "After dyeing and finishing, fabric width and GSM can change. Compacting may improve shrinkage but also affects width, GSM, and handfeel.",
      customerTrustAngle:
        "Customers should understand that greige specs and finished specs are not identical."
    },
    {
      topic: "Dark color difficulty",
      explanation:
        "Dark shades such as black, navy, deep red, and bottle green usually require stronger dyeing control, longer washing, and higher colorfastness attention.",
      customerTrustAngle:
        "Dark colors may need more time and stricter testing, so urgency must be handled carefully."
    },
    {
      topic: "Colorfastness",
      explanation:
        "Washing, rubbing, perspiration, and light fastness can become customer complaints if dyeing and washing are not properly controlled.",
      customerTrustAngle:
        "For export or brand customers, testing requirements should be confirmed before production."
    },
    {
      topic: "Spirality",
      explanation:
        "Single jersey cotton fabric can twist after dyeing due to yarn twist, knitting construction, and wet-process relaxation.",
      customerTrustAngle:
        "Spirality risk should be explained early for single jersey and lightweight cotton items."
    },
    {
      topic: "Handfeel inconsistency",
      explanation:
        "Softener, enzyme, silicone, and finishing route affect touch. Too much softener can improve handfeel but may affect absorbency or shade.",
      customerTrustAngle:
        "Handfeel should be approved with realistic production expectations, not only showroom samples."
    },
    {
      topic: "Reprocess risk",
      explanation:
        "If shade, stains, uneven dyeing, or fastness fails, reprocessing can delay shipment and may damage fabric strength or handfeel.",
      customerTrustAngle:
        "Good planning prevents urgent re-dye decisions that create bigger quality risks."
    }
  ],

  operationalSignals: {
    increasesDyeingRisk: [
      "dark shade",
      "tight delivery date",
      "unknown greige source",
      "single jersey",
      "high shrinkage requirement",
      "strict colorfastness requirement",
      "first-time customer color",
      "no approved lab dip",
      "rush bulk order"
    ],
    improvesReliability: [
      "approved lab dip",
      "clear finished GSM and width",
      "known yarn source",
      "repeat color",
      "clear testing standard",
      "realistic delivery window",
      "pre-production fabric inspection"
    ]
  },

  customerConversationGuidance: [
    "Ask whether the customer needs greige spec or finished spec.",
    "Confirm color standard before dyeing.",
    "Check if lab dip is required.",
    "Clarify shrinkage tolerance.",
    "Clarify GSM and width tolerance after finishing.",
    "Ask whether colorfastness testing is required.",
    "Explain that rush dyeing increases quality risk."
  ]
};
