import { createHash } from "node:crypto";

const placeholderDocumentNos = new Set(["", "文号待核", "-", "无"]);

export function normalizePolicyUrl(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  try {
    const url = new URL(raw);
    url.protocol = "https:";
    url.hostname = url.hostname.toLowerCase();
    url.hash = "";
    for (const key of [...url.searchParams.keys()]) {
      if (/^(?:utm_|eqid|spm|from|source)/i.test(key)) url.searchParams.delete(key);
    }
    url.searchParams.sort();
    url.pathname = url.pathname.replace(/\/{2,}/g, "/").replace(/\/$/, "") || "/";
    return url.href.replace(/\?$/, "");
  } catch {
    return raw;
  }
}

export function normalizePolicyTitle(value) {
  return String(value || "")
    .normalize("NFKC")
    .replace(/[《》〈〉]/g, "")
    .replace(/[\s　]+/g, "")
    .replace(/[，,。；;：:、“”‘’]/g, "")
    .trim();
}

export function normalizeDocumentNo(value) {
  const normalized = String(value || "")
    .normalize("NFKC")
    .replace(/[\s　]+/g, "")
    .replace(/\[/g, "〔")
    .replace(/\]/g, "〕")
    .trim();
  return placeholderDocumentNos.has(normalized) ? "" : normalized;
}

export function createStableCandidateId(policy) {
  const officialIdentity = [
    normalizePolicyUrl(policy.url),
    normalizeDocumentNo(policy.documentNo)
  ].filter(Boolean).join("|");
  const identity = officialIdentity || normalizePolicyTitle(policy.title);
  return `candidate-${createHash("sha256").update(identity).digest("hex").slice(0, 16)}`;
}

export function createPolicyIndexes(documents) {
  const indexes = {
    ids: new Set(),
    urls: new Set(),
    documentNos: new Set(),
    titles: new Set()
  };
  for (const policy of documents) addPolicyToIndexes(policy, indexes);
  return indexes;
}

export function addPolicyToIndexes(policy, indexes) {
  if (policy.id) indexes.ids.add(String(policy.id));
  const url = normalizePolicyUrl(policy.url);
  const documentNo = normalizeDocumentNo(policy.documentNo);
  const title = normalizePolicyTitle(policy.title);
  if (url) indexes.urls.add(url);
  if (documentNo) indexes.documentNos.add(documentNo);
  if (title) indexes.titles.add(title);
}

export function findDuplicateReason(policy, indexes) {
  const id = policy.id ? String(policy.id) : "";
  const url = normalizePolicyUrl(policy.url);
  const documentNo = normalizeDocumentNo(policy.documentNo);
  const title = normalizePolicyTitle(policy.title);
  if (id && indexes.ids.has(id)) return "id";
  if (url && indexes.urls.has(url)) return "url";
  if (documentNo && indexes.documentNos.has(documentNo)) return "documentNo";
  if (title && indexes.titles.has(title)) return "title";
  return "";
}

export function duplicateValues(values, normalize = (value) => String(value || "").trim()) {
  const seen = new Set();
  const duplicates = new Set();
  for (const value of values) {
    const key = normalize(value);
    if (!key) continue;
    if (seen.has(key)) duplicates.add(key);
    seen.add(key);
  }
  return [...duplicates];
}

export function classifyRunStatus({ attempted, succeeded, candidates, deadlineReached }) {
  if (deadlineReached) return "deadline_reached";
  if (attempted > 0 && succeeded === 0) return "source_failure";
  if (candidates > 0) return "completed_with_candidates";
  return "no_new_policy";
}
