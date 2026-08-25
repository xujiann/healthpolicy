import fs from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";

const root = path.resolve(import.meta.dirname, "..");
const outputPath = path.join(root, "policy-priority-review.csv");
const limit = Number(process.argv.find((arg) => arg.startsWith("--max="))?.split("=")[1] || 50);

const context = createBrowserLikeContext();
vm.createContext(context);
vm.runInContext(await fs.readFile(path.join(root, "policy-reviewed.js"), "utf8"), context);
vm.runInContext(await fs.readFile(path.join(root, "policy-governance.js"), "utf8"), context);
vm.runInContext(`${await fs.readFile(path.join(root, "script.js"), "utf8")}
this.priorityReviewRows = policies
  .filter((policy) => policy.assignment === "规则归口")
  .map((policy) => {
    const topic = topicById.get(policy.topic);
    const text = [policy.title, policy.summary, policy.keywords].join(" ");
    let score = Math.max(0, Number(policy.year) - 2015) * 4;
    if (/规划|纲要|实施方案|行动计划|指导意见/.test(text)) score += 24;
    if (/基本医疗|医保|基层|公立医院|医疗质量|疾控|药品目录|生育|老龄|医养/.test(text)) score += 18;
    if (/国务院|国家卫生健康|国家医疗保障|国家疾病预防控制/.test(policy.agency)) score += 10;
    return { policy, topic, score };
  })
  .sort((a, b) => b.score - a.score || b.policy.date.localeCompare(a.policy.date))
  .slice(0, ${limit})
  .map(({ policy, topic, score }, index) => [
    index + 1,
    score,
    policy.id,
    policy.year,
    policy.date,
    policy.documentNo,
    policy.title,
    policy.agency,
    topic.name,
    policy.secondary,
    policy.url,
    "待复核",
    "",
    "",
    ""
  ]);`, context);

const header = [
  "优先级",
  "评分",
  "id",
  "年份",
  "日期",
  "文号",
  "标题",
  "发文机关",
  "当前司局",
  "当前处室",
  "官方链接",
  "复核状态",
  "建议司局",
  "建议处室",
  "复核说明"
];
const lines = [header, ...context.priorityReviewRows].map((row) => row.map(csvCell).join(","));
await fs.writeFile(outputPath, `\uFEFF${lines.join("\n")}`, "utf8");
console.log(`Wrote ${context.priorityReviewRows.length} priority review rows to ${outputPath}`);

function csvCell(value) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

function createBrowserLikeContext() {
  const makeEl = () => ({
    textContent: "",
    innerHTML: "",
    value: "all",
    href: "",
    hidden: false,
    clientWidth: 1100,
    clientHeight: 720,
    dataset: {},
    style: {},
    children: [],
    classList: { add() {}, remove() {}, toggle() {} },
    setAttribute() {},
    appendChild(child) { this.children.push(child); },
    append(...children) { this.children.push(...children); },
    remove() {},
    addEventListener() {},
    querySelectorAll() { return []; },
    querySelector() { return null; },
    scrollIntoView() {}
  });
  const elements = new Map();
  return {
    console,
    Blob: function Blob() {},
    URL: { createObjectURL() { return ""; }, revokeObjectURL() {} },
    document: {
      querySelector(selector) {
        if (!elements.has(selector)) elements.set(selector, makeEl());
        return elements.get(selector);
      },
      createElement() { return makeEl(); },
      createElementNS() { return makeEl(); },
      body: makeEl()
    },
    window: { addEventListener() {} },
    requestAnimationFrame() { return 1; },
    cancelAnimationFrame() {},
    setTimeout() {},
    clearTimeout() {}
  };
}
