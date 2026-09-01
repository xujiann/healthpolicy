import fs from "node:fs/promises";
import path from "node:path";
import {
  evaluateCandidateForAutoPublication,
  fetchOfficialPolicyEvidence,
  prepareAutoApprovedPolicy
} from "./auto-publication-core.mjs";
import { approveCandidate, validateLayerSnapshot } from "./lifecycle-core.mjs";
import { addPolicyToIndexes, createPolicyIndexes, findDuplicateReason } from "./policy-quality.mjs";

const root = path.resolve(import.meta.dirname, "..");
const lifecycleDir = path.join(root, "policy-lifecycle");
const reportPath = path.join(lifecycleDir, "auto-publication.json");
const args = Object.fromEntries(process.argv.slice(2).map((arg) => {
  const [key, ...rest] = arg.replace(/^--/, "").split("=");
  return [key, rest.join("=") || true];
}));
const maxCandidates = positiveInteger(args.max, 20);
const timeoutMs = positiveInteger(args["timeout-ms"], 12000);
const timestamp = new Date().toISOString();

const snapshots = {};
for (const layer of ["candidates", "reviewed", "rejected"]) {
  snapshots[layer] = JSON.parse(await fs.readFile(path.join(lifecycleDir, `${layer}.json`), "utf8"));
  const errors = validateLayerSnapshot(snapshots[layer], layer);
  if (errors.length) throw new Error(`${layer} 层校验失败：\n${errors.join("\n")}`);
}

const reviewedIndexes = createPolicyIndexes(snapshots.reviewed.items.map((item) => item.policy));
const retained = [];
const reportItems = [];
let evaluated = 0;
let published = 0;

for (const item of snapshots.candidates.items) {
  if (evaluated >= maxCandidates) {
    retained.push(item);
    reportItems.push({
      id: item.policy.id,
      title: item.policy.title,
      status: "deferred",
      reasons: [`超过本轮 ${maxCandidates} 条复核上限，将在下轮继续`]
    });
    continue;
  }
  evaluated += 1;
  const evidence = await fetchOfficialPolicyEvidence(item, { timeoutMs });
  const evaluation = evaluateCandidateForAutoPublication(item, evidence);
  if (evaluation.eligible) {
    const policy = prepareAutoApprovedPolicy(item, evidence, evaluation.classification, timestamp);
    const duplicateReason = findDuplicateReason(policy, reviewedIndexes);
    if (duplicateReason) {
      evaluation.eligible = false;
      evaluation.errors.push(`与正式库重复：${duplicateReason}`);
    } else {
      const approved = approveCandidate({ ...item, policy }, {
        reviewer: "GitHub Actions 自动发布器",
        reviewedAt: timestamp,
        basis: `自动发布门禁：${evaluation.source.name}正式政策栏目；标题、发布日期、文号和发文机关与官方页面一致；归口命中“${evaluation.classification.rule}”规则；摘要来自官方正文。`,
        topic: evaluation.classification.topic,
        secondary: evaluation.classification.secondary,
        method: "automatic",
        confidence: "high",
        evidence: {
          sourceUrl: evidence.sourceUrl,
          resolvedUrl: evidence.resolvedUrl,
          pageTitle: evidence.pageTitle,
          publishDate: evidence.publishDate,
          documentNo: evidence.documentNo,
          summarySource: evidence.summarySource,
          contentUrl: evidence.contentUrl,
          verifiedAt: evidence.verifiedAt
        }
      });
      snapshots.reviewed.items.push(approved);
      addPolicyToIndexes(approved.policy, reviewedIndexes);
      published += 1;
      reportItems.push({
        id: approved.policy.id,
        title: approved.policy.title,
        status: "published",
        sourceId: approved.collection.sourceId,
        sourceUrl: approved.policy.url,
        topic: approved.policy.topic,
        secondary: approved.policy.secondary,
        verifiedAt: evidence.verifiedAt
      });
      continue;
    }
  }
  retained.push({
    ...item,
    review: {
      ...item.review,
      automation: {
        evaluatedAt: timestamp,
        eligible: false,
        reasons: [...new Set(evaluation.errors)]
      }
    }
  });
  reportItems.push({
    id: item.policy.id,
    title: item.policy.title,
    status: "quarantined",
    sourceId: item.collection.sourceId,
    sourceUrl: item.policy.url,
    reasons: [...new Set(evaluation.errors)]
  });
}

snapshots.candidates.items = retained;
snapshots.candidates.updatedAt = timestamp;
if (published) snapshots.reviewed.updatedAt = timestamp;
for (const layer of ["candidates", "reviewed", "rejected"]) {
  const errors = validateLayerSnapshot(snapshots[layer], layer);
  if (errors.length) throw new Error(`${layer} 层自动发布后校验失败：\n${errors.join("\n")}`);
}

const report = {
  schemaVersion: 1,
  generatedAt: timestamp,
  mode: "unattended-high-confidence",
  summary: {
    queuedBefore: snapshots.candidates.items.length + published,
    evaluated,
    published,
    quarantined: reportItems.filter((item) => item.status === "quarantined").length,
    deferred: reportItems.filter((item) => item.status === "deferred").length,
    remaining: retained.length
  },
  items: reportItems
};

await Promise.all([
  fs.writeFile(path.join(lifecycleDir, "candidates.json"), `${JSON.stringify(snapshots.candidates, null, 2)}\n`, "utf8"),
  fs.writeFile(path.join(lifecycleDir, "reviewed.json"), `${JSON.stringify(snapshots.reviewed, null, 2)}\n`, "utf8"),
  fs.writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8")
]);

console.log(`自动发布完成：复核 ${evaluated} 条，发布 ${published} 条，隔离 ${report.summary.quarantined} 条，剩余 ${retained.length} 条。`);

function positiveInteger(value, fallback) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}
