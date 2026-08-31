import assert from "node:assert/strict";
import {
  addPolicyToIndexes,
  classifyRunStatus,
  createPolicyIndexes,
  createStableCandidateId,
  findDuplicateReason,
  normalizeDocumentNo,
  normalizePolicyUrl
} from "./policy-quality.mjs";
import {
  approveCandidate,
  createCandidateItem,
  createEmptyLayer,
  inferSourceId,
  rejectCandidate,
  validateLayerSnapshot
} from "./lifecycle-core.mjs";
import { nhsaSource } from "./sources/nhsa.mjs";
import { ndcpaSource } from "./sources/ndcpa.mjs";
import {
  classifyDocumentType,
  deriveValidity,
  enrichPolicySchema,
  inferPolicyRelations,
  splitAgencies,
  validateP2PolicyFields
} from "./policy-schema.mjs";
import { classifyLinkResult, summarizeLinkHealth, validateLinkHealthReport } from "./link-health.mjs";

const existing = {
  id: "supp-001",
  title: "《关于测试政策的通知》",
  documentNo: "医保发〔2026〕1号",
  url: "https://www.nhsa.gov.cn/art/2026/1/1/art_104_1.html"
};

assert.equal(
  normalizePolicyUrl("http://WWW.NHSA.GOV.CN/art/2026/1/1/art_104_1.html?utm_source=test#top"),
  existing.url
);
assert.equal(normalizeDocumentNo("医保发[2026]1号"), existing.documentNo);

const firstId = createStableCandidateId(existing);
const secondId = createStableCandidateId({ ...existing });
assert.equal(firstId, secondId, "相同政策必须生成稳定候选 ID");
assert.equal(
  firstId,
  createStableCandidateId({ ...existing, title: "《标题格式调整后的测试政策》" }),
  "官方 URL 和文号不变时，标题格式调整不能改变候选 ID"
);

const indexes = createPolicyIndexes([existing]);
assert.equal(findDuplicateReason({ ...existing, id: "new-id" }, indexes), "url");
assert.equal(
  findDuplicateReason({ ...existing, id: "new-id", url: "https://www.nhsa.gov.cn/new.html" }, indexes),
  "documentNo"
);
assert.equal(
  findDuplicateReason({ ...existing, id: "new-id", url: "https://www.nhsa.gov.cn/new.html", documentNo: "" }, indexes),
  "title"
);

const fresh = {
  id: "candidate-fresh",
  title: "《另一项政策》",
  documentNo: "医保发〔2026〕2号",
  url: "https://www.nhsa.gov.cn/art/2026/1/2/art_104_2.html",
  agency: "国家医疗保障局"
};
assert.equal(findDuplicateReason(fresh, indexes), "");
addPolicyToIndexes(fresh, indexes);
assert.equal(findDuplicateReason(fresh, indexes), "id");

assert.equal(classifyRunStatus({ attempted: 3, succeeded: 3, candidates: 1 }), "completed_with_candidates");
assert.equal(classifyRunStatus({ attempted: 3, succeeded: 2, candidates: 0 }), "no_new_policy");
assert.equal(classifyRunStatus({ attempted: 3, succeeded: 0, candidates: 0 }), "source_failure");
assert.equal(classifyRunStatus({ attempted: 3, succeeded: 1, candidates: 0, deadlineReached: true }), "deadline_reached");

const candidate = createCandidateItem(fresh, {
  batchId: "test-batch",
  collectedAt: "2026-08-19T10:00:00+08:00"
});
assert.equal(candidate.review.status, "pending");
assert.equal(inferSourceId(fresh.url), "nhsa");
const approved = approveCandidate(candidate, {
  reviewer: "测试审核员",
  reviewedAt: "2026-08-19T11:00:00+08:00",
  basis: "依据官方原文和机构职责归口。",
  topic: "nhsa_services",
  secondary: "医保目录处"
});
assert.equal(approved.review.status, "approved");
assert.equal(approved.policy.reviewStatus, "已人工核验");
const rejected = rejectCandidate(candidate, {
  reviewer: "测试审核员",
  reviewedAt: "2026-08-19T11:00:00+08:00",
  reason: "页面为政策解读，不属于正式文件。"
});
assert.equal(rejected.review.reason, "页面为政策解读，不属于正式文件。");
const reviewedLayer = createEmptyLayer("reviewed", "2026-08-19T11:00:00+08:00");
reviewedLayer.items.push(approved);
assert.deepEqual(validateLayerSnapshot(reviewedLayer, "reviewed"), []);

const nhsaHtml = '<a href="/art/2026/7/17/art_104_21472.html">政策</a><a href="/col/col104/index.html">列表</a>';
assert.deepEqual(nhsaSource.extractUrls(nhsaHtml, nhsaSource.homepage), ["https://www.nhsa.gov.cn/art/2026/7/17/art_104_21472.html"]);
const ndcpaHtml = '<a href="/jbkzzx/c100014/common/content/content_2074752747875766272.html">政策</a>';
assert.deepEqual(ndcpaSource.extractUrls(ndcpaHtml, ndcpaSource.homepage), ["https://www.ndcpa.gov.cn/jbkzzx/c100014/common/content/content_2074752747875766272.html"]);

assert.deepEqual(splitAgencies("国家医疗保障局,财政部、国家卫生健康委员会"), ["国家医疗保障局", "财政部", "国家卫生健康委员会"]);
assert.equal(classifyDocumentType({ title: "《行政执法公示制度实施办法》" }), "正式政策");
assert.equal(classifyDocumentType({ title: "关于某事项公开征求意见的公告" }), "征求意见");
assert.equal(deriveValidity({ title: "测试", summary: "自2026年9月1日起施行。" }, "2026-08-19").status, "尚未施行");
assert.equal(inferPolicyRelations({ summary: "新版自2026年1月1日起执行，《旧版目录》同时废止。" })[0].type, "废止");
const enriched = enrichPolicySchema({ ...fresh, summary: "自2026年1月2日起施行。" }, { enrichedAt: "2026-08-19T11:00:00+08:00" });
assert.deepEqual(validateP2PolicyFields(enriched), []);

assert.equal(classifyLinkResult({ httpStatus: 200 }), "healthy");
assert.equal(classifyLinkResult({ httpStatus: 403 }), "blocked");
assert.equal(classifyLinkResult({ httpStatus: 404 }), "unavailable");
assert.equal(classifyLinkResult({ error: "TimeoutError" }), "inconclusive");
const linkSummary = summarizeLinkHealth([
  { status: "healthy" },
  { status: "blocked" },
  { status: "unavailable" },
  { status: "inconclusive" },
  { status: "not_checked" }
]);
assert.equal(linkSummary.coverageRate, 80);
assert.equal(linkSummary.availabilityRate, 66.7);
assert.deepEqual(validateLinkHealthReport({
  schemaVersion: 1,
  items: [{ url: existing.url, status: "healthy", recordIds: [existing.id] }]
}), []);

console.log("Policy update quality tests passed.");
