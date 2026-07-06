import fs from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";

const root = path.resolve(import.meta.dirname, "..");
const context = createBrowserLikeContext();
vm.createContext(context);

vm.runInContext(await fs.readFile(path.join(root, "policy-data.js"), "utf8"), context);
vm.runInContext(await fs.readFile(path.join(root, "policy-supplement.js"), "utf8"), context);
vm.runInContext(`${await fs.readFile(path.join(root, "script.js"), "utf8")}
this.policyCount = policies.length;
this.milestoneCount = policyMilestones.length;
this.invalidPolicies = policies.filter((policy) => {
  const agency = String(policy.agency || "");
  const url = String(policy.url || "");
  const title = String(policy.title || "");
  return /^\\d+$/.test(agency)
    || /中国政府网|官网|来源/.test(agency)
    || /\\/zhengce\\/(?:jiedu|tujie)\\//.test(url)
    || /一图读懂|图表：|详解《|聚焦《|新闻发布会/.test(title);
}).map((policy) => ({
  id: policy.id,
  title: policy.title,
  agency: policy.agency,
  url: policy.url
}));
this.ruleAssignmentCount = policies.filter((policy) => policy.assignment === "规则归口").length;`, context);

if (context.invalidPolicies.length || context.milestoneCount < 8) {
  console.error(JSON.stringify({
    ok: false,
    policyCount: context.policyCount,
    milestoneCount: context.milestoneCount,
    invalidCount: context.invalidPolicies.length,
    invalidPolicies: context.invalidPolicies
  }, null, 2));
  process.exitCode = 1;
} else {
  console.log(JSON.stringify({
    ok: true,
    policyCount: context.policyCount,
    milestoneCount: context.milestoneCount,
    ruleAssignmentCount: context.ruleAssignmentCount
  }, null, 2));
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
