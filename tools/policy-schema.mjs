export const policyDocumentTypes = ["正式政策", "征求意见", "政策解读", "公示公告", "统计信息", "其他资料"];
export const policyValidityStatuses = ["现行有效", "尚未施行", "已废止", "已失效", "征求意见", "待核验", "不适用"];

export function splitAgencies(value) {
  const agencies = Array.isArray(value) ? value : String(value || "").split(/[,，、;；]+/);
  return [...new Set(agencies.map((agency) => agency.trim()).filter(Boolean))];
}

export function classifyDocumentType(policy, { force = false } = {}) {
  if (!force && policy.documentType && policyDocumentTypes.includes(policy.documentType)) return policy.documentType;
  const text = `${policy.title || ""} ${policy.summary || ""}`;
  const title = String(policy.title || "");
  const url = String(policy.url || "");
  if (/征求意见|公开征求/.test(text)) return "征求意见";
  if (/政策解读|一图读懂|图表：|详解《|聚焦《/.test(text) || /\/zhengce\/(?:jiedu|tujie)\//.test(url)) return "政策解读";
  if (/统计公报|统计数据|统计信息|数据发布/.test(text)) return "统计信息";
  if (/公示(?!制度)|建议答复|提案答复/.test(title)) return "公示公告";
  return "正式政策";
}

export function extractStructuredDocumentNo(policy) {
  const existing = String(policy.documentNo || "").trim();
  if (existing && !/^(?:文号待核|-|无)$/.test(existing)) return normalizeDocumentNo(existing);
  const text = `${policy.keywords || ""} ${policy.summary || ""} ${policy.title || ""}`;
  const patterns = [
    /(?:国卫|国中医药|医保|国疾控|国办|国发|财社|人社部发|卫办|发改社会|药监)[^，。；;\s（）()《》〈〉]{0,18}[〔\[]\d{4}[〕\]][^，。；;\s（）()《》〈〉]{0,8}号/,
    /国家药品监督管理局公告\d{4}年第\d+号/,
    /(?:GB|WS\/T)\s?\d{3,5}(?:\.\d+)?[—-]\d{4}/i,
    /(?:中华人民共和国国务院令|国家卫生健康委员会令|国家医疗保障局令)第\d+号/
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[0]) return normalizeDocumentNo(match[0]);
  }
  return "文号待核";
}

export function extractPolicyDates(policy) {
  const text = `${policy.summary || ""} ${policy.title || ""}`;
  return {
    effectiveDate: policy.validity?.effectiveDate || matchChineseDate(text, /自\s*(\d{4})年(\d{1,2})月(\d{1,2})日\s*起(?:正式)?(?:施行|执行|实施)/),
    expiryDate: policy.validity?.expiryDate || matchChineseDate(text, /有效期(?:至|截止至?)\s*(\d{4})年(\d{1,2})月(\d{1,2})日/)
  };
}

export function deriveValidity(policy, referenceDate = "2026-08-19") {
  const documentType = classifyDocumentType(policy);
  const dates = extractPolicyDates(policy);
  const existing = policy.validity || {};
  let status = existing.status;
  let basis = existing.basis;
  if (!status) {
    if (documentType === "征求意见") {
      status = "征求意见";
      basis = "根据文件标题或摘要识别为征求意见稿。";
    } else if (documentType !== "正式政策") {
      status = "不适用";
      basis = "非正式政策资料不适用政策效力状态。";
    } else if (dates.expiryDate && dates.expiryDate < referenceDate) {
      status = "已失效";
      basis = `摘要明确有效期至 ${dates.expiryDate}。`;
    } else if (dates.effectiveDate && dates.effectiveDate > referenceDate) {
      status = "尚未施行";
      basis = `摘要明确自 ${dates.effectiveDate} 起施行。`;
    } else if (dates.effectiveDate) {
      status = "现行有效";
      basis = `摘要明确自 ${dates.effectiveDate} 起施行；尚未完成后续废止状态核验。`;
    } else {
      status = "待核验";
      basis = "官方原文未在现有摘要中提供可自动确认的施行或废止日期。";
    }
  }
  return {
    status,
    effectiveDate: dates.effectiveDate || null,
    expiryDate: dates.expiryDate || null,
    basis: basis || "待补充效力依据。",
    verification: existing.verification || (status === "待核验" ? "pending" : "machine_extracted")
  };
}

export function inferPolicyRelations(policy) {
  const existing = Array.isArray(policy.relations) ? policy.relations : [];
  const text = `${policy.summary || ""} ${policy.title || ""}`;
  const inferred = [];
  collectRelation(text, /[《〈]([^》〉]{2,100})[》〉][^。；]{0,40}(?:同时废止|予以废止)/g, "废止", inferred);
  collectRelation(text, /(?:对|修订了)[《〈]([^》〉]{2,100})[》〉][^。；]{0,30}(?:进行|作出|完成)?修订?/g, "修订", inferred);
  collectRelation(text, /在[《〈]([^》〉]{2,100})[》〉]的?基础上/g, "沿用", inferred);
  const combined = [...existing, ...inferred];
  const seen = new Set();
  return combined.filter((relation) => {
    const key = `${relation.type}|${relation.targetTitle || ""}|${relation.targetDocumentNo || ""}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function enrichPolicySchema(policy, { enrichedAt = new Date().toISOString(), referenceDate = enrichedAt.slice(0, 10) } = {}) {
  const humanVerified = policy.structure?.status === "human_verified";
  const documentType = classifyDocumentType(policy, { force: !humanVerified });
  const policyForValidity = humanVerified ? { ...policy, documentType } : { ...policy, documentType, validity: undefined };
  return {
    ...policy,
    documentNo: extractStructuredDocumentNo(policy),
    agencies: splitAgencies(policy.agencies || policy.agency),
    documentType,
    validity: deriveValidity(policyForValidity, referenceDate),
    relations: inferPolicyRelations(policy),
    structure: {
      schemaVersion: 2,
      enrichedAt,
      status: policy.structure?.status || "machine_extracted"
    }
  };
}

export function validateP2PolicyFields(policy) {
  const errors = [];
  if (!String(policy.documentNo || "").trim()) errors.push("documentNo 缺失");
  if (!Array.isArray(policy.agencies) || !policy.agencies.length) errors.push("agencies 缺失");
  if (!policyDocumentTypes.includes(policy.documentType)) errors.push("documentType 无效");
  if (!policyValidityStatuses.includes(policy.validity?.status)) errors.push("validity.status 无效");
  if (!String(policy.validity?.basis || "").trim()) errors.push("validity.basis 缺失");
  if (!Array.isArray(policy.relations)) errors.push("relations 必须为数组");
  if (policy.structure?.schemaVersion !== 2) errors.push("structure.schemaVersion 应为 2");
  return errors;
}

function normalizeDocumentNo(value) {
  return String(value || "")
    .normalize("NFKC")
    .replace(/[\s　]+/g, "")
    .replace(/\[/g, "〔")
    .replace(/\]/g, "〕")
    .trim();
}

function matchChineseDate(text, pattern) {
  const match = String(text || "").match(pattern);
  if (!match) return null;
  return `${match[1]}-${String(match[2]).padStart(2, "0")}-${String(match[3]).padStart(2, "0")}`;
}

function collectRelation(text, pattern, type, target) {
  for (const match of String(text || "").matchAll(pattern)) {
    target.push({
      type,
      targetId: null,
      targetTitle: `《${match[1]}》`,
      targetDocumentNo: "",
      basis: match[0].slice(0, 160),
      verification: "machine_extracted"
    });
  }
}
