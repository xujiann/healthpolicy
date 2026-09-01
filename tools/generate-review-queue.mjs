import fs from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const candidates = JSON.parse(await fs.readFile(path.join(root, "policy-lifecycle", "candidates.json"), "utf8"));
const lines = [
  "# 自动发布隔离队列",
  "",
  `生成时间：${candidates.updatedAt}`,
  "",
  `未通过自动发布门禁：${candidates.items.length} 条`,
  ""
];
if (!candidates.items.length) {
  lines.push("当前没有隔离候选，所有高置信候选均已自动发布。", "");
} else {
  lines.push("以下记录不会自动上线，可在补充证据后人工处理。", "", "| 候选 ID | 日期 | 文号 | 标题 | 来源 | 自动门禁结果 |", "|---|---|---|---|---|---|");
  for (const item of candidates.items) {
    const policy = item.policy;
    const reasons = item.review?.automation?.reasons?.join("；") || "等待下一轮自动复核";
    lines.push(`| \`${escapeCell(policy.id)}\` | ${escapeCell(policy.date)} | ${escapeCell(policy.documentNo || "待核")} | [${escapeCell(policy.title)}](${policy.url}) | ${escapeCell(item.collection.sourceId)} | ${escapeCell(reasons)} |`);
  }
  lines.push("", "审核命令示例：", "", "```powershell", "node tools/review-candidates.mjs --approve=<候选ID> --reviewer=<姓名> --basis=<归口依据>", "node tools/review-candidates.mjs --reject=<候选ID> --reviewer=<姓名> --reason=<驳回原因>", "```", "");
}
await fs.writeFile(path.join(root, "policy-review-queue.md"), `${lines.join("\n")}\n`, "utf8");
console.log(`Wrote ${candidates.items.length} review queue rows.`);

function escapeCell(value) {
  return String(value ?? "").replace(/\|/g, "\\|").replace(/[\r\n]+/g, " ");
}
