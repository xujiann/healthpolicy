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
let linkHealth = { generatedAt: null, overallStatus: "unknown", summary: { total: 0, checked: 0, decisive: 0, reachable: 0, unavailable: 0, inconclusive: 0, unchecked: 0, coverageRate: null, availabilityRate: null }, items: [] };
try {
  linkHealth = JSON.parse(await fs.readFile(path.join(lifecycleDir, "link-health.json"), "utf8"));
} catch {
  // Link health is allowed to be absent before P3 observability is initialized.
}
let updateLog = { generatedAt: null, seeds: [], status: "unknown" };
try {
  updateLog = JSON.parse(await fs.readFile(path.join(root, "policy-update-log.json"), "utf8"));
} catch {
  // Collection metrics remain unknown when no run log is present.
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
const collectionMetrics = summarizeCollectionRun(updateLog);
const approvedDecisions = layers.reviewed.items.filter((item) => item.review.status === "approved").length;
const rejectedDecisions = layers.rejected.items.length;
const decidedCandidates = approvedDecisions + rejectedDecisions;
const governance = {
  generatedAt: [
    ...Object.values(layers).map((layer) => layer.updatedAt),
    sourceHealth.generatedAt,
    linkHealth.generatedAt,
    updateLog.generatedAt
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
  p3: {
    collection: collectionMetrics,
    review: {
      backlog: layers.candidates.items.length,
      approved: approvedDecisions,
      rejected: rejectedDecisions,
      decided: decidedCandidates,
      approvalRate: percentage(approvedDecisions, decidedCandidates)
    },
    linkHealth: {
      generatedAt: linkHealth.generatedAt || null,
      overallStatus: linkHealth.overallStatus || "unknown",
      ...linkHealth.summary
    }
  },
  sourceHealth
};
await fs.writeFile(
  path.join(root, "policy-governance.js"),
  `// 由 tools/build-policy-artifacts.mjs 生成，请勿直接编辑。\nconst policyGovernance = ${JSON.stringify(governance, null, 2)};\n`,
  "utf8"
);
console.log(`Built ${reviewedDocuments.length} reviewed policies and governance metadata.`);

function summarizeCollectionRun(log) {
  const seeds = Array.isArray(log?.seeds) ? log.seeds : [];
  let attempted = 0;
  let succeeded = 0;
  let failed = 0;
  let candidatesAdded = 0;
  for (const seed of seeds) {
    const searched = Array.isArray(seed.searched) ? seed.searched : [];
    const errors = new Set((seed.errors || []).map((item) => item.url));
    const seedAttempted = Number.isFinite(seed.requests?.attempted) ? seed.requests.attempted : searched.length;
    const seedSucceeded = Number.isFinite(seed.requests?.succeeded)
      ? seed.requests.succeeded
      : searched.filter((item) => item.status === "ok" || (!item.status && !errors.has(item.source))).length;
    attempted += seedAttempted;
    succeeded += seedSucceeded;
    failed += Number.isFinite(seed.requests?.failed) ? seed.requests.failed : Math.max(0, seedAttempted - seedSucceeded);
    candidatesAdded += Number(seed.added || 0);
  }
  if (log?.summary) {
    attempted = Number(log.summary.attempted ?? attempted);
    succeeded = Number(log.summary.succeeded ?? succeeded);
    failed = Number(log.summary.failed ?? failed);
    candidatesAdded = Number(log.summary.candidates ?? candidatesAdded);
  }
  return {
    generatedAt: log?.generatedAt || null,
    status: log?.status || "unknown",
    attempted,
    succeeded,
    failed,
    candidatesAdded,
    successRate: percentage(succeeded, attempted)
  };
}

function percentage(value, total) {
  return total ? Number((value / total * 100).toFixed(1)) : null;
}
