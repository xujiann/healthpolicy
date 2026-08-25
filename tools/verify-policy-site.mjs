import fs from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";
import { duplicateValues, normalizePolicyUrl } from "./policy-quality.mjs";
import { validateLayerSnapshot } from "./lifecycle-core.mjs";

const root = path.resolve(import.meta.dirname, "..");
const context = createBrowserLikeContext();
vm.createContext(context);

vm.runInContext(await fs.readFile(path.join(root, "policy-reviewed.js"), "utf8"), context);
vm.runInContext(await fs.readFile(path.join(root, "policy-materials.js"), "utf8"), context);
vm.runInContext(await fs.readFile(path.join(root, "policy-governance.js"), "utf8"), context);
vm.runInContext(`${await fs.readFile(path.join(root, "script.js"), "utf8")}
this.rawDocuments = [...policyReviewedDocuments];
this.relatedMaterials = [...policyRelatedMaterials];
this.topicDefinitions = topics.map((topic) => ({ id: topic.id, children: [...topic.children] }));
this.policyCount = policies.length;
this.milestoneCount = policyMilestones.length;
this.normalizedPolicies = policies.map((policy) => ({ ...policy }));
this.governance = policyGovernance;
this.invalidDisplayedPolicies = policies.filter((policy) => {
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

const rawDocuments = context.rawDocuments || [];
const lifecycleErrors = [];
for (const layer of ["candidates", "reviewed", "rejected"]) {
  const snapshot = JSON.parse(await fs.readFile(path.join(root, "policy-lifecycle", `${layer}.json`), "utf8"));
  lifecycleErrors.push(...validateLayerSnapshot(snapshot, layer));
}
const topicDefinitions = new Map((context.topicDefinitions || []).map((topic) => [topic.id, new Set(topic.children)]));
const blockedUrlPattern = /(download\.html|\/col\/col\d+\/index\.html|\/common\/(?:list|second\/list)\.html|\/index\.html(?:$|[?#])|new_list\.shtml|policyDocumentLibrary)/i;
const invalidAgencyPattern = /^(?:\d+|中国政府网|.*官网|来源.*)$/;
const pendingStatusPattern = /待人工(?:审核|核验)/;

const duplicateIds = duplicateValues(rawDocuments.map((policy) => policy.id));
const duplicateUrls = duplicateValues(rawDocuments.map((policy) => policy.url), normalizePolicyUrl);
const pendingPolicies = rawDocuments.filter((policy) => pendingStatusPattern.test(String(policy.reviewStatus || "")));
const emptySummaries = rawDocuments.filter((policy) => !String(policy.summary || "").trim());
const invalidAgencies = rawDocuments.filter((policy) => {
  const agency = String(policy.agency || "").trim();
  return !agency || invalidAgencyPattern.test(agency);
});
const blockedUrls = rawDocuments.filter((policy) => blockedUrlPattern.test(String(policy.url || "")));
const invalidAssignments = (context.normalizedPolicies || []).filter((policy) => {
  const children = topicDefinitions.get(policy.topic);
  return !children || !children.has(policy.secondary);
});
const missingAudit = rawDocuments.filter((policy) => {
  const audit = policy.audit || {};
  return !audit.batchId || !audit.sourceId || !audit.collectedAt || !audit.reviewer || !audit.reviewedAt || !audit.basis;
});
const formalUrls = new Set(rawDocuments.map((policy) => normalizePolicyUrl(policy.url)));
const invalidMaterials = (context.relatedMaterials || []).filter((material) => {
  let officialHttps = false;
  try {
    const url = new URL(material.url);
    officialHttps = url.protocol === "https:" && /(?:^|\.)gov\.cn$/i.test(url.hostname);
  } catch {
    officialHttps = false;
  }
  return !officialHttps
    || material.documentType === "正式政策"
    || !material.audit?.batchId
    || !material.audit?.reviewer
    || formalUrls.has(normalizePolicyUrl(material.url));
});
const knownIds = new Set(rawDocuments.map((policy) => policy.id));
const invalidRelations = rawDocuments.flatMap((policy) => (policy.relations || [])
  .filter((relation) => relation.targetId && !knownIds.has(relation.targetId))
  .map((relation) => ({ policyId: policy.id, targetId: relation.targetId })));
const p2CompletenessErrors = Number(context.governance?.p2?.coreFieldCompleteness || 0) >= 95
  ? []
  : [`P2 核心字段完整率低于 95%：${context.governance?.p2?.coreFieldCompleteness || 0}%`];
const p2UiErrors = [];
if (!context.document.querySelector("#structureMetrics").innerHTML.includes("核心字段完整率")) p2UiErrors.push("页面未渲染 P2 结构化指标");
const expectedMaterialCount = `${context.relatedMaterials.length} 条`;
if (!context.document.querySelector("#materialSummary").textContent.includes(expectedMaterialCount)) {
  p2UiErrors.push(`页面未渲染关联资料分库计数：期望 ${expectedMaterialCount}`);
}
if (!context.document.querySelector("#taskBoard").innerHTML.includes("证据覆盖")) p2UiErrors.push("十五五任务未渲染证据覆盖率");
if (!context.document.querySelector("#validityFilter").innerHTML.includes("已废止")) p2UiErrors.push("页面未提供效力状态筛选");
const errors = {
  lifecycleErrors,
  duplicateIds,
  pendingPolicies: compactPolicies(pendingPolicies),
  emptySummaries: compactPolicies(emptySummaries),
  invalidAgencies: compactPolicies(invalidAgencies),
  blockedUrls: compactPolicies(blockedUrls),
  invalidDisplayedPolicies: context.invalidDisplayedPolicies,
  invalidAssignments: compactPolicies(invalidAssignments),
  missingAudit: compactPolicies(missingAudit),
  invalidRelations,
  p2CompletenessErrors,
  p2UiErrors,
  invalidMaterials: invalidMaterials.map((material) => ({ id: material.id, title: material.title, url: material.url, documentType: material.documentType }))
};
const errorCount = Object.values(errors).reduce((count, items) => count + items.length, 0);

if (errorCount || context.milestoneCount < 8) {
  console.error(JSON.stringify({
    ok: false,
    rawPolicyCount: rawDocuments.length,
    policyCount: context.policyCount,
    milestoneCount: context.milestoneCount,
    errorCount,
    errors,
    warnings: { duplicateUrls }
  }, null, 2));
  process.exitCode = 1;
} else {
  console.log(JSON.stringify({
    ok: true,
    rawPolicyCount: rawDocuments.length,
    policyCount: context.policyCount,
    milestoneCount: context.milestoneCount,
    ruleAssignmentCount: context.ruleAssignmentCount,
    warnings: { duplicateUrls }
  }, null, 2));
}

const html = await fs.readFile(path.join(root, "policy.html"), "utf8");
for (const requiredAsset of ["policy-reviewed.js", "policy-materials.js", "policy-governance.js", "policy-review-queue.md"]) {
  if (!html.includes(requiredAsset) && requiredAsset !== "policy-review-queue.md") {
    console.error(`policy.html 未加载 ${requiredAsset}`);
    process.exitCode = 1;
  }
}

function compactPolicies(policies) {
  return policies.map((policy) => ({
    id: policy.id,
    title: policy.title,
    agency: policy.agency,
    url: policy.url,
    reviewStatus: policy.reviewStatus,
    topic: policy.topic,
    secondary: policy.secondary
  }));
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
