import fs from "node:fs/promises";
import path from "node:path";
import { enrichPolicySchema } from "./policy-schema.mjs";

const root = path.resolve(import.meta.dirname, "..");
const lifecycleDir = path.join(root, "policy-lifecycle");
const enrichedAt = "2026-08-19T23:59:00+08:00";
const snapshots = {};
for (const layer of ["candidates", "reviewed", "rejected"]) {
  const filePath = path.join(lifecycleDir, `${layer}.json`);
  snapshots[layer] = JSON.parse(await fs.readFile(filePath, "utf8"));
  snapshots[layer].items = snapshots[layer].items.map((item) => ({
    ...item,
    policy: enrichPolicySchema(item.policy, { enrichedAt, referenceDate: "2026-08-19" })
  }));
  snapshots[layer].updatedAt = enrichedAt;
}

const allPolicies = Object.values(snapshots).flatMap((snapshot) => snapshot.items.map((item) => item.policy));
for (const source of allPolicies) {
  for (const relation of source.relations) {
    if (relation.targetId || !relation.targetTitle) continue;
    const target = allPolicies.find((candidate) => candidate.id !== source.id && titleContains(candidate.title, relation.targetTitle));
    if (!target) continue;
    relation.targetId = target.id;
    if (relation.type === "废止") {
      target.validity = {
        ...target.validity,
        status: "已废止",
        expiryDate: source.validity.effectiveDate || source.date || target.validity.expiryDate,
        basis: `${source.documentNo} 明确废止 ${relation.targetTitle}。`,
        verification: "cross_document"
      };
    }
  }
}

for (const layer of ["candidates", "reviewed", "rejected"]) {
  await fs.writeFile(
    path.join(lifecycleDir, `${layer}.json`),
    `${JSON.stringify(snapshots[layer], null, 2)}\n`,
    "utf8"
  );
}
console.log(`Enriched ${allPolicies.length} lifecycle policies with P2 fields.`);

function titleContains(candidateTitle, targetTitle) {
  const normalize = (value) => String(value || "")
    .normalize("NFKC")
    .replace(/[《》〈〉\s　，,。；;：:“”‘’]/g, "");
  const candidate = normalize(candidateTitle);
  const target = normalize(targetTitle);
  return target.length >= 8 && candidate.includes(target);
}
