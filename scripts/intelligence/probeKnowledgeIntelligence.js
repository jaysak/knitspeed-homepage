import {
  getKnowledgePageBySlug,
  getKnowledgePageOperationalContext
} from "../../src/lib/knowledgeRegistry.js";

const TEST_SLUGS = [
  "single-jersey-vs-interlock",
  "what-is-compact-cotton",
  "what-causes-spirality-in-knitted-fabric",
  "what-affects-colorfastness-in-cotton-knits",
  "how-fabric-width-affects-garment-yield",
  "how-gsm-width-and-yield-affect-fabric-usage",
  "tubular-vs-open-width-fabric",
  "tubular-vs-open-width-fabric"
];

for (const slug of TEST_SLUGS) {
  const page = getKnowledgePageBySlug(slug);

  if (!page) {
    console.log(`\n[missing] ${slug}`);
    continue;
  }

  const context =
    getKnowledgePageOperationalContext(slug);

  console.log("\n================================================");
  console.log(`slug: ${slug}`);
  console.log(`title: ${page.title}`);

  console.log("\n--- urgency");
  console.log(context?.urgency);

  console.log("\n--- sourcing stability");
  console.log(context?.sourcingStability);

  console.log("\n--- buyer progression");
  console.log(context?.buyerIntentProgression);

  console.log("\n--- recommendations");
  console.log(context?.recommendations);

  console.log("\n--- quote preparation");
  console.log(context?.quotePreparation);

  console.log("\n--- sourcing continuity");
  console.log(context?.sourcingContinuity);
}
