import fs from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";
import { createEmptyLayer, inferSourceId } from "./lifecycle-core.mjs";

const root = path.resolve(import.meta.dirname, "..");
const lifecycleDir = path.join(root, "policy-lifecycle");
const reviewedPath = path.join(lifecycleDir, "reviewed.json");
const migratedAt = "2026-08-19T23:59:00+08:00";
const batchId = "p1-migration-2026-08-19";
const force = process.argv.includes("--force");

await fs.mkdir(lifecycleDir, { recursive: true });
try {
  await fs.access(reviewedPath);
  if (!force) throw new Error("reviewed.json 已存在；一次性迁移脚本不会覆盖现有审核记录。确需重建时显式传入 --force。");
} catch (error) {
  if (error?.code !== "ENOENT") throw error;
}
const context = {};
vm.createContext(context);
vm.runInContext(await fs.readFile(path.join(root, "policy-data.js"), "utf8"), context);
vm.runInContext(await fs.readFile(path.join(root, "policy-supplement.js"), "utf8"), context);
vm.runInContext("this.documents = [...policyDocuments, ...policySupplementDocuments]", context);

const reviewed = createEmptyLayer("reviewed", migratedAt);
reviewed.items = context.documents.map((policy) => {
  const normalizedPolicy = {
    ...policy,
    url: String(policy.url || "").replace(/^http:/i, "https:")
  };
  const manuallyVerified = policy.reviewStatus === "已人工核验" && policy.assignment === "人工归口";
  return {
    policy: normalizedPolicy,
    collection: {
      batchId,
      sourceId: inferSourceId(normalizedPolicy.url),
      sourceUrl: normalizedPolicy.url,
      collectedAt: migratedAt
    },
    review: manuallyVerified
      ? {
          status: "approved",
          reviewer: "政策库维护组",
          reviewedAt: migratedAt,
          basis: "已核对官方原文，并依据文件主题及机构职责完成人工归口。"
        }
      : {
          status: "legacy_imported",
          reviewer: "P1 数据迁移",
          reviewedAt: migratedAt,
          basis: "历史正式库迁移；已通过 P0 发布质量门禁，保留原规则归口并进入优先抽检队列。"
        }
  };
});

await fs.writeFile(reviewedPath, `${JSON.stringify(reviewed, null, 2)}\n`, "utf8");
for (const layer of ["candidates", "rejected"]) {
  const outputPath = path.join(lifecycleDir, `${layer}.json`);
  try {
    await fs.access(outputPath);
  } catch {
    await fs.writeFile(outputPath, `${JSON.stringify(createEmptyLayer(layer, migratedAt), null, 2)}\n`, "utf8");
  }
}
console.log(`Migrated ${reviewed.items.length} policies into ${reviewedPath}`);
