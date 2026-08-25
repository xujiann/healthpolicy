import { createStableCandidateId } from "./policy-quality.mjs";
import { enrichPolicySchema, validateP2PolicyFields } from "./policy-schema.mjs";

export const lifecycleSchemaVersion = 1;
export const lifecycleLayers = ["candidates", "reviewed", "rejected"];

export function createEmptyLayer(layer, updatedAt = new Date().toISOString()) {
  if (!lifecycleLayers.includes(layer)) throw new Error(`未知数据层：${layer}`);
  return { schemaVersion: lifecycleSchemaVersion, layer, updatedAt, items: [] };
}

export function inferSourceId(url) {
  let hostname = "";
  try {
    hostname = new URL(String(url || "")).hostname.toLowerCase();
  } catch {
    return "unknown";
  }
  if (hostname.endsWith("nhsa.gov.cn")) return "nhsa";
  if (hostname.endsWith("ndcpa.gov.cn")) return "ndcpa";
  if (hostname.endsWith("nhc.gov.cn")) return "nhc";
  if (hostname.endsWith("natcm.gov.cn")) return "natcm";
  if (hostname.endsWith("gov.cn")) return "gov-cn";
  return hostname || "unknown";
}

export function createCandidateItem(policy, collection = {}) {
  const normalizedPolicy = enrichPolicySchema({
    ...policy,
    id: policy.id || createStableCandidateId(policy),
    reviewStatus: "待人工审核",
    assignment: "人工归口候选"
  }, { enrichedAt: collection.collectedAt || new Date().toISOString() });
  const collectedAt = collection.collectedAt || new Date().toISOString();
  return {
    policy: normalizedPolicy,
    collection: {
      batchId: collection.batchId || `batch-${collectedAt.slice(0, 10)}`,
      sourceId: collection.sourceId || inferSourceId(policy.url),
      sourceUrl: collection.sourceUrl || policy.url,
      collectedAt
    },
    review: { status: "pending" }
  };
}

export function approveCandidate(item, { reviewer, reviewedAt, basis, topic, secondary } = {}) {
  requireText(reviewer, "审核人");
  requireText(basis, "归口依据");
  const timestamp = reviewedAt || new Date().toISOString();
  const policy = {
    ...item.policy,
    ...(topic ? { topic } : {}),
    ...(secondary ? { secondary } : {}),
    reviewStatus: "已人工核验",
    assignment: "人工归口"
  };
  requireText(policy.topic, "司局归口");
  requireText(policy.secondary, "处室归口");
  return {
    ...item,
    policy,
    review: {
      status: "approved",
      reviewer,
      reviewedAt: timestamp,
      basis
    }
  };
}

export function rejectCandidate(item, { reviewer, reviewedAt, reason } = {}) {
  requireText(reviewer, "审核人");
  requireText(reason, "驳回原因");
  return {
    ...item,
    policy: { ...item.policy, reviewStatus: "已驳回" },
    review: {
      status: "rejected",
      reviewer,
      reviewedAt: reviewedAt || new Date().toISOString(),
      reason
    }
  };
}

export function validateLayerSnapshot(snapshot, expectedLayer) {
  const errors = [];
  if (snapshot?.schemaVersion !== lifecycleSchemaVersion) errors.push("schemaVersion 无效");
  if (snapshot?.layer !== expectedLayer) errors.push(`layer 应为 ${expectedLayer}`);
  if (!Array.isArray(snapshot?.items)) return [...errors, "items 必须为数组"];
  const ids = new Set();
  for (const [index, item] of snapshot.items.entries()) {
    const prefix = `${expectedLayer}[${index}]`;
    const policy = item?.policy;
    if (!policy || typeof policy !== "object") {
      errors.push(`${prefix}.policy 缺失`);
      continue;
    }
    if (!String(policy.id || "").trim()) errors.push(`${prefix}.policy.id 缺失`);
    else if (ids.has(String(policy.id))) errors.push(`${prefix}.policy.id 重复：${policy.id}`);
    else ids.add(String(policy.id));
    if (!isOfficialUrl(policy.url)) errors.push(`${prefix}.policy.url 不是有效官方 HTTPS 链接`);
    for (const error of validateP2PolicyFields(policy)) errors.push(`${prefix}.policy.${error}`);
    if (!String(item?.collection?.batchId || "").trim()) errors.push(`${prefix}.collection.batchId 缺失`);
    if (!String(item?.collection?.sourceId || "").trim()) errors.push(`${prefix}.collection.sourceId 缺失`);
    if (!isIsoDate(item?.collection?.collectedAt)) errors.push(`${prefix}.collection.collectedAt 无效`);
    if (expectedLayer === "candidates" && item?.review?.status !== "pending") errors.push(`${prefix}.review.status 应为 pending`);
    if (expectedLayer === "reviewed") {
      if (!["approved", "legacy_imported"].includes(item?.review?.status)) errors.push(`${prefix}.review.status 无效`);
      if (!String(item?.review?.reviewer || "").trim()) errors.push(`${prefix}.review.reviewer 缺失`);
      if (!isIsoDate(item?.review?.reviewedAt)) errors.push(`${prefix}.review.reviewedAt 无效`);
      if (!String(item?.review?.basis || "").trim()) errors.push(`${prefix}.review.basis 缺失`);
    }
    if (expectedLayer === "rejected") {
      if (item?.review?.status !== "rejected") errors.push(`${prefix}.review.status 应为 rejected`);
      if (!String(item?.review?.reviewer || "").trim()) errors.push(`${prefix}.review.reviewer 缺失`);
      if (!isIsoDate(item?.review?.reviewedAt)) errors.push(`${prefix}.review.reviewedAt 无效`);
      if (!String(item?.review?.reason || "").trim()) errors.push(`${prefix}.review.reason 缺失`);
    }
  }
  return errors;
}

function isIsoDate(value) {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value) && !Number.isNaN(Date.parse(value));
}

function isOfficialUrl(value) {
  try {
    const url = new URL(String(value || ""));
    return url.protocol === "https:" && /(?:^|\.)gov\.cn$/i.test(url.hostname);
  } catch {
    return false;
  }
}

function requireText(value, label) {
  if (!String(value || "").trim()) throw new Error(`${label}不能为空`);
}
