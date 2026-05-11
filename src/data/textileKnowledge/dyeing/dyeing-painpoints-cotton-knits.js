export const cottonKnitDyeingPainpoints = {
  slug: "dyeing-painpoints-cotton-knits",
  title: "Dyeing Painpoints in Cotton Knitted Fabric",
  category: "Dyeing & Finishing",
  expertSource: "Mr. Kasame",

  painpoints: [
    {
      id: "lab_dip_bulk_difference",
      title: "Lab Dip and Bulk Shade Difference",
      riskLevel: "high",
      explanation:
        "Lab dip is produced in controlled small-scale conditions. Bulk dyeing uses larger machines, different liquor ratio, different fabric movement, and production variables. This can create shade difference.",
      hiddenWeight: 8
    },
    {
      id: "cotton_absorbency_variation",
      title: "Cotton Absorbency Variation",
      riskLevel: "medium",
      explanation:
        "Different cotton yarn lots may absorb dyestuff differently. Even if yarn count is the same, fiber quality and preparation can affect shade result.",
      hiddenWeight: 6
    },
    {
      id: "single_jersey_spirality",
      title: "Single Jersey Spirality",
      riskLevel: "high",
      explanation:
        "Single jersey is more sensitive to twisting after wet processing. Yarn twist, knitting tension, and finishing route all influence spirality.",
      hiddenWeight: 8
    },
    {
      id: "gsm_width_instability",
      title: "GSM and Width Instability",
      riskLevel: "high",
      explanation:
        "Dyeing, drying, stentering, and compacting can shift finished GSM and width. Customers often misunderstand this if they compare directly with greige fabric.",
      hiddenWeight: 8
    },
    {
      id: "dark_shade_fastness",
      title: "Dark Shade Fastness Risk",
      riskLevel: "high",
      explanation:
        "Dark reactive shades require proper washing and soaping. Poor washing can lead to rubbing or washing fastness problems.",
      hiddenWeight: 9
    },
    {
      id: "uneven_dyeing",
      title: "Uneven Dyeing / Barre / Streaks",
      riskLevel: "high",
      explanation:
        "Uneven dyeing can come from yarn lot variation, knitting tension, poor pretreatment, machine loading, or dyeing control.",
      hiddenWeight: 9
    },
    {
      id: "softener_handfeel_variation",
      title: "Softener and Handfeel Variation",
      riskLevel: "medium",
      explanation:
        "Finishing chemical choice affects softness, absorbency, stretch recovery, shade appearance, and customer touch perception.",
      hiddenWeight: 5
    },
    {
      id: "reprocess_damage",
      title: "Reprocess Damage",
      riskLevel: "high",
      explanation:
        "Re-dyeing or corrective washing may save shade but can weaken fabric, change handfeel, increase shrinkage, or delay delivery.",
      hiddenWeight: 9
    }
  ]
};
