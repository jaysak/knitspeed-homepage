export const knowledgeContinuityMap = {
  "what-is-compact-cotton": {
    relatedKnowledge: [
      {
        label: "Single Jersey Fabric",
        href: "/knowledge/what-is-single-jersey-fabric",
      },
      {
        label: "Combed vs Carded Cotton",
        href: "/knowledge/combed-vs-carded-cotton",
      },
      {
        label: "Fabric GSM Guide",
        href: "/knowledge/understanding-fabric-gsm",
      },
    ],

    relatedGarments: [
      "Oversized Tees",
      "Premium Basics",
      "Streetwear",
    ],
  },

  "what-is-single-jersey-fabric": {
    relatedKnowledge: [
      {
        label: "Compact Cotton",
        href: "/knowledge/what-is-compact-cotton",
      },
      {
        label: "Fabric GSM Guide",
        href: "/knowledge/understanding-fabric-gsm",
      },
      {
        label: "Printing Fabric Guide",
        href: "/knowledge/fabric-for-screen-printing",
      },
    ],

    relatedGarments: [
      "T-Shirts",
      "Retail Basics",
      "Printing",
    ],
  },
};

export function getKnowledgeContinuity(slug) {
  return (
    knowledgeContinuityMap[slug] || {
      relatedKnowledge: [],
      relatedGarments: [],
    }
  );
}
