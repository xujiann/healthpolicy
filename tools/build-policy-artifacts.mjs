import fs from "node:fs/promises";
import path from "node:path";
import { validateLayerSnapshot } from "./lifecycle-core.mjs";

const root = path.resolve(import.meta.dirname, "..");
const lifecycleDir = path.join(root, "policy-lifecycle");
const materials = JSON.parse(await fs.readFile(path.join(lifecycleDir, "materials.json"), "utf8"));
const layers = {};
for (const layer of ["candidates", "reviewed", "rejected"]) {
  layers[layer] = JSON.parse(await fs.readFile(path.join(lifecycleDir, `${layer}.json`), "utf8"));
  const errors = validateLayerSnapshot(layers[layer], layer);
  if (errors.length) throw new Error(`${layer}.json 校验失败：\n${errors.join("\n")}`);
}

const reviewedDocuments = layers.reviewed.items.map(({ policy, collection, review }) => ({
  ...policy,
  audit: {
    batchId: collection.batchId,
    sourceId: collection.sourceId,
    collectedAt: collection.collectedAt,
    reviewer: review.reviewer,
    reviewedAt: review.reviewedAt,
    basis: review.basis,
    status: review.status
  }
}));
await fs.writeFile(
  path.join(root, "policy-reviewed.js"),
  `// 由 tools/build-policy-artifacts.mjs 生成，请勿直接编辑。\nconst policyReviewedDocuments = ${JSON.stringify(reviewedDocuments, null, 2)};\n`,
  "utf8"
);
const relatedMaterials = materials.items.map(({ material, collection, review }) => ({
  ...material,
  audit: {
    batchId: collection.batchId,
    sourceId: collection.sourceId,
    collectedAt: collection.collectedAt,
    reviewer: review.reviewer,
    reviewedAt: review.reviewedAt,
    basis: review.basis,
    status: review.status
  }
}));
await fs.writeFile(
  path.join(root, "policy-materials.js"),
  `// 由 tools/build-policy-artifacts.mjs 生成，请勿直接编辑。\nconst policyRelatedMaterials = ${JSON.stringify(relatedMaterials, null, 2)};\n`,
  "utf8"
);

let sourceHealth = { generatedAt: null, overallStatus: "unknown", sources: [] };
try {
  sourceHealth = JSON.parse(await fs.readFile(path.join(lifecycleDir, "source-health.json"), "utf8"));
} catch {
  // Source health is allowed to be absent during the initial migration.
}
sourceHealth.sources = (sourceHealth.sources || []).map((source) => {
  const sourcePolicies = reviewedDocuments.filter((policy) => policy.audit.sourceId === source.id);
  const sourceDates = sourcePolicies.map((policy) => policy.date).filter(Boolean).sort();
  return {
    ...source,
    reviewedDocuments: sourcePolicies.length,
    latestKnownPolicyDate: sourceDates.at(-1) || source.latestKnownPolicyDate || null
  };
});
const policyDates = reviewedDocuments.map((policy) => policy.date).filter(Boolean).sort();
const reviewDates = layers.reviewed.items.map((item) => item.review.reviewedAt).filter(Boolean).sort();
const p2FieldChecks = reviewedDocuments.flatMap((policy) => [
  policy.documentNo && policy.documentNo !== "文号待核",
  Array.isArray(policy.agencies) && policy.agencies.length > 0,
  Boolean(policy.documentType),
  Boolean(policy.validity?.status && policy.validity?.basis),
  Array.isArray(policy.relations)
]);
const groupCount = (values) => Object.fromEntries(Object.entries(Object.groupBy(values, (value) => value)).map(([key, items]) => [key, items.length]));
const governance = {
  generatedAt: [
    ...Object.values(layers).map((layer) => layer.updatedAt),
    sourceHealth.generatedAt
  ].filter(Boolean).sort().at(-1) || null,
  dataThrough: policyDates.at(-1) || null,
  lastReviewedAt: reviewDates.at(-1) || null,
  counts: {
    candidates: layers.candidates.items.length,
    reviewed: layers.reviewed.items.length,
    rejected: layers.rejected.items.length
  },
  p2: {
    coreFieldCompleteness: Number((p2FieldChecks.filter(Boolean).length / Math.max(1, p2FieldChecks.length) * 100).toFixed(1)),
    documentNumbersStructured: reviewedDocuments.filter((policy) => policy.documentNo !== "文号待核").length,
    explicitEffectiveDates: reviewedDocuments.filter((policy) => policy.validity?.effectiveDate).length,
    jointDocuments: reviewedDocuments.filter((policy) => policy.agencies?.length > 1).length,
    relations: reviewedDocuments.reduce((count, policy) => count + (policy.relations?.length || 0), 0),
    resolvedRelations: reviewedDocuments.reduce((count, policy) => count + (policy.relations?.filter((relation) => relation.targetId).length || 0), 0),
    validityStatuses: groupCount(reviewedDocuments.map((policy) => policy.validity?.status || "待核验")),
    documentTypes: groupCount(reviewedDocuments.map((policy) => policy.documentType || "其他资料")),
    materialTypes: groupCount(relatedMaterials.map((material) => material.documentType || "其他资料"))
  },
  sourceHealth
};
await fs.writeFile(
  path.join(root, "policy-governance.js"),
  `// 由 tools/build-policy-artifacts.mjs 生成，请勿直接编辑。\nconst policyGovernance = ${JSON.stringify(governance, null, 2)};\n`,
  "utf8"
);
console.log(`Built ${reviewedDocuments.length} reviewed policies and governance metadata.`);
