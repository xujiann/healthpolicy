import fs from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";

const root = path.resolve(import.meta.dirname, "..");
const outputPath = path.join(root, "policy-assignment-audit.csv");

const context = createBrowserLikeContext();
vm.createContext(context);
vm.runInContext(await fs.readFile(path.join(root, "policy-data.js"), "utf8"), context);
vm.runInContext(await fs.readFile(path.join(root, "policy-supplement.js"), "utf8"), context);
vm.runInContext(`${await fs.readFile(path.join(root, "script.js"), "utf8")}
this.auditRows = policies
  .filter((policy) => policy.assignment === "规则归口")
  .map((policy) => {
    const topic = topicById.get(policy.topic);
    return [
      policy.id,
      policy.year,
      policy.date,
      policy.documentNo,
      policy.title,
      policy.agency,
      policy.level,
      topic.name,
      policy.secondary,
      policy.keywords,
      policy.url,
      "待审核",
      "",
      ""
    ];
  });`, context);

const header = [
  "id",
  "年份",
  "日期",
  "文号",
  "标题",
  "发文机关",
  "文件类型",
  "当前司局",
  "当前处室",
  "关键词",
  "官方链接",
  "审核状态",
  "建议司局",
  "建议处室"
];
const lines = [header, ...context.auditRows].map((row) => row.map(csvCell).join(","));
await fs.writeFile(outputPath, `\uFEFF${lines.join("\n")}`, "utf8");
console.log(`Wrote ${context.auditRows.length} rows to ${outputPath}`);

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
