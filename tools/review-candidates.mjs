import fs from "node:fs/promises";
import path from "node:path";
import { approveCandidate, rejectCandidate, validateLayerSnapshot } from "./lifecycle-core.mjs";
import { createPolicyIndexes, findDuplicateReason } from "./policy-quality.mjs";

const root = path.resolve(import.meta.dirname, "..");
const lifecycleDir = path.join(root, "policy-lifecycle");
const args = Object.fromEntries(process.argv.slice(2).map((arg) => {
  const [key, ...rest] = arg.replace(/^--/, "").split("=");
  return [key, rest.join("=")];
}));
const decision = args.approve ? "approve" : args.reject ? "reject" : "";
const candidateId = args.approve || args.reject;
if (!decision || !candidateId || !args.reviewer) {
  throw new Error("用法：--approve=<id> 或 --reject=<id>，并提供 --reviewer=<姓名>；通过时需 --basis，驳回时需 --reason。");
}

const snapshots = {};
for (const layer of ["candidates", "reviewed", "rejected"]) {
  snapshots[layer] = JSON.parse(await fs.readFile(path.join(lifecycleDir, `${layer}.json`), "utf8"));
}
const index = snapshots.candidates.items.findIndex((item) => item.policy.id === candidateId);
if (index === -1) throw new Error(`未找到候选：${candidateId}`);
const [candidate] = snapshots.candidates.items.splice(index, 1);
const timestamp = new Date().toISOString();
if (decision === "approve") {
  const approved = approveCandidate(candidate, {
    reviewer: args.reviewer,
    reviewedAt: timestamp,
    basis: args.basis,
    topic: args.topic,
    secondary: args.secondary
  });
  const duplicateReason = findDuplicateReason(approved.policy, createPolicyIndexes(snapshots.reviewed.items.map((item) => item.policy)));
  if (duplicateReason) throw new Error(`候选与正式库重复：${duplicateReason}`);
  snapshots.reviewed.items.push(approved);
} else {
  snapshots.rejected.items.push(rejectCandidate(candidate, {
    reviewer: args.reviewer,
    reviewedAt: timestamp,
    reason: args.reason
  }));
}
for (const layer of ["candidates", "reviewed", "rejected"]) {
  snapshots[layer].updatedAt = timestamp;
  const errors = validateLayerSnapshot(snapshots[layer], layer);
  if (errors.length) throw new Error(`${layer} 层校验失败：\n${errors.join("\n")}`);
  await fs.writeFile(path.join(lifecycleDir, `${layer}.json`), `${JSON.stringify(snapshots[layer], null, 2)}\n`, "utf8");
}
console.log(`${candidateId} 已${decision === "approve" ? "通过" : "驳回"}，请运行 build-policy-artifacts 和 verify-policy-site。`);
