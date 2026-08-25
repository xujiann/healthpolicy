import fs from "node:fs/promises";
import path from "node:path";
import {
  addPolicyToIndexes,
  classifyRunStatus,
  createPolicyIndexes,
  createStableCandidateId,
  findDuplicateReason,
  normalizePolicyUrl
} from "./policy-quality.mjs";
import { createCandidateItem, inferSourceId } from "./lifecycle-core.mjs";
import { policySources } from "./sources/registry.mjs";

const root = path.resolve(import.meta.dirname, "..");
const seedsPath = path.join(root, "policy-update-seeds.json");
const lifecycleDir = path.join(root, "policy-lifecycle");
const reviewedPath = path.join(lifecycleDir, "reviewed.json");
const candidatesPath = path.join(lifecycleDir, "candidates.json");
const rejectedPath = path.join(lifecycleDir, "rejected.json");
const sourceHealthPath = path.join(lifecycleDir, "source-health.json");
const logPath = path.join(root, "policy-update-log.json");

const args = new Set(process.argv.slice(2));
if (args.has("--apply")) {
  console.error("--apply 已禁用：自动任务只能生成候选草稿，人工审核后才能更新正式库。");
  process.exit(64);
}
const mode = "draft";
const maxPerSeed = Number(process.argv.find((arg) => arg.startsWith("--max="))?.split("=")[1] || 8);
const seedLimit = Number(process.argv.find((arg) => arg.startsWith("--seed-limit="))?.split("=")[1] || 0);
const deadlineMs = Number(process.argv.find((arg) => arg.startsWith("--deadline-ms="))?.split("=")[1] || 0);
const startedAt = Date.now();
const blockedPolicyUrlPattern = /(download\.html|\/col\/col\d+\/index\.html|\/common\/(?:list|second\/list)\.html|\/index\.html(?:$|[?#])|new_list\.shtml)/i;
const blockedPolicyTextPattern = /(客户端下载页|索引\s*标题\s*发文字号\s*发布日期|政策解读|政府信息公开指南|政府信息公开制度|机构职能|内设机构|主要职责|政务公开|手机版|微信公众号|首页|栏目|列表页|党建工作-|通知公告-|法律法规$|其他$)/;
const blockedInterpretationPattern = /(\/zhengce\/jiedu\/|\/zhengce\/tujie\/|一图读懂|图表：|详解《|聚焦《|出炉，|新华社权威快报|新闻发布会)/;
const concretePolicySignalPattern = /(国卫|医保|国中医药|国疾控|卫办|医保办|发改|财社|国办发|国发|令第|公告|通知|意见|办法|规划|方案|标准|指南|目录|细则|决定|批复|函|令|公报|工作要点|实施方案|行动计划|监测指标体系|设置标准)/;
const invalidAgencyPattern = /^(\d+|中国政府网|.*官网|来源.*)$/;

const seeds = JSON.parse(await fs.readFile(seedsPath, "utf8"));
const adapterSeeds = policySources.map((source) => ({
  name: `官方来源：${source.name}`,
  query: "",
  sourceUrls: source.listUrls,
  topic: source.defaultTopic,
  secondary: source.defaultSecondary,
  sourceAdapter: source
}));
const selectedSeeds = seedLimit > 0 ? seeds.slice(0, seedLimit) : seeds;
const activeSeeds = [...adapterSeeds, ...selectedSeeds];
const existing = await loadExistingDocuments();
const existingIndexes = createPolicyIndexes(existing);
const rejectedSnapshot = await readJson(rejectedPath).catch(() => ({ items: [] }));
const rejectedIndexes = createPolicyIndexes(rejectedSnapshot.items.map((item) => item.policy));
const previousCandidates = await readJson(candidatesPath).catch(() => ({
  schemaVersion: 1,
  layer: "candidates",
  updatedAt: new Date().toISOString(),
  items: []
}));
const candidateIndexes = createPolicyIndexes(previousCandidates.items.map((item) => item.policy));
const candidates = [];
const previousLog = await readJson(logPath).catch(() => ({}));
const runLog = {
  generatedAt: new Date().toISOString(),
  ...(previousLog.manualReview ? { manualReview: previousLog.manualReview } : {}),
  mode,
  maxPerSeed,
  seedLimit: seedLimit || seeds.length,
  adapters: policySources.map((source) => source.id),
  deadlineMs: deadlineMs || null,
  seeds: []
};

for (const seed of activeSeeds) {
  if (isPastDeadline()) {
    runLog.deadlineReached = true;
    break;
  }
  const seedLog = {
    name: seed.name,
    query: seed.query,
    searched: [],
    requests: { attempted: 0, succeeded: 0, failed: 0 },
    candidates: 0,
    added: 0,
    skippedExisting: 0,
    skippedRejected: 0,
    skippedDuplicate: 0,
    skippedNonPolicy: 0,
    duplicateReasons: {},
    errors: []
  };
  const urls = await collectSeedUrls(seed, maxPerSeed, seedLog);
  seedLog.candidates = urls.length;
  for (const url of urls) {
    if (existingIndexes.urls.has(normalizePolicyUrl(url))) {
      seedLog.skippedExisting += 1;
      continue;
    }
    const doc = await fetchPolicy(url, seed).catch((error) => ({
      id: "",
      year: new Date().getFullYear(),
      date: String(new Date().getFullYear()),
      topic: seed.topic,
      secondary: seed.secondary,
      title: `待核验：${url}`,
      agency: "",
      level: "政策文件",
      summary: `抓取失败：${error.message}`,
      url,
      keywords: seed.name,
      reviewStatus: "待人工核验"
    }));
    if (doc.reviewStatus === "待人工核验") seedLog.errors.push({ url, error: doc.summary });
    if (!isConcretePolicyDocument(doc)) {
      seedLog.skippedNonPolicy += 1;
      seedLog.errors.push({ url, error: "跳过非具体政策文件页面" });
      continue;
    }
    doc.id = createStableCandidateId(doc);
    const existingReason = findDuplicateReason(doc, existingIndexes);
    const rejectedReason = findDuplicateReason(doc, rejectedIndexes);
    const candidateReason = findDuplicateReason(doc, candidateIndexes);
    const duplicateReason = existingReason || rejectedReason || candidateReason;
    if (duplicateReason) {
      if (existingReason) seedLog.skippedExisting += 1;
      else if (rejectedReason) seedLog.skippedRejected += 1;
      else seedLog.skippedDuplicate += 1;
      seedLog.duplicateReasons[duplicateReason] = (seedLog.duplicateReasons[duplicateReason] || 0) + 1;
      continue;
    }
    candidates.push(doc);
    addPolicyToIndexes(doc, candidateIndexes);
    seedLog.added += 1;
  }
  runLog.seeds.push(seedLog);
}

const normalized = candidates.map((item) => ({
  ...item,
  id: createStableCandidateId(item),
  reviewStatus: item.reviewStatus || "待人工审核",
  assignment: "人工归口候选"
}));
const batchId = `policy-scan-${runLog.generatedAt.slice(0, 10)}`;
const candidateItems = normalized.map((policy) => createCandidateItem(policy, {
  batchId,
  sourceId: inferSourceId(policy.url),
  sourceUrl: policy.url,
  collectedAt: runLog.generatedAt
}));

const requestSummary = runLog.seeds.reduce((summary, seed) => ({
  attempted: summary.attempted + seed.requests.attempted,
  succeeded: summary.succeeded + seed.requests.succeeded,
  failed: summary.failed + seed.requests.failed
}), { attempted: 0, succeeded: 0, failed: 0 });
runLog.summary = {
  ...requestSummary,
  candidates: candidateItems.length,
  pendingCandidates: previousCandidates.items.length + candidateItems.length,
  deadlineReached: Boolean(runLog.deadlineReached)
};
runLog.status = classifyRunStatus(runLog.summary);
const sourceHealth = buildSourceHealth(runLog, existing);
await fs.writeFile(sourceHealthPath, `${JSON.stringify(sourceHealth, null, 2)}\n`, "utf8");

if (runLog.status === "source_failure" || runLog.status === "deadline_reached") {
  console.error(`Policy update did not complete: ${runLog.status}. Existing candidate queue was preserved.`);
} else if (candidateItems.length) {
  const snapshot = {
    ...previousCandidates,
    updatedAt: runLog.generatedAt,
    items: [...previousCandidates.items, ...candidateItems]
  };
  await fs.writeFile(candidatesPath, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");
  console.log(`Added ${candidateItems.length} documents to ${candidatesPath}`);
} else {
  console.log(`No new policy documents found; ${previousCandidates.items.length} pending candidates were preserved.`);
}
await fs.writeFile(logPath, JSON.stringify(runLog, null, 2), "utf8");
console.log(`Wrote update log to ${logPath}`);
if (runLog.status === "source_failure") process.exitCode = 2;
if (runLog.status === "deadline_reached") process.exitCode = 3;

async function loadExistingDocuments() {
  const reviewed = await readJson(reviewedPath);
  return reviewed.items.map((item) => item.policy);
}

async function searchGov(query, limit, seedLog) {
  const encoded = encodeURIComponent(query);
  const searchUrls = [
    `https://sousuo.www.gov.cn/s.htm?t=zhengceku&q=${encoded}`,
    `https://sousuo.www.gov.cn/s.htm?t=zhengcelibrary&q=${encoded}`,
    `https://www.gov.cn/so/s?tab=all&qt=${encoded}`
  ];
  const found = [];
  for (const searchUrl of searchUrls) {
    if (isPastDeadline()) return found;
    const html = await fetchLogged(searchUrl, seedLog, "search");
    if (!html) continue;
    const before = found.length;
    for (const url of extractPolicyUrls(html, searchUrl)) {
      if (!found.includes(url)) found.push(url);
      if (found.length >= limit) return found;
    }
    seedLog.searched.push({ type: "search", source: searchUrl, hits: found.length - before, status: "ok" });
  }
  return found;
}

async function readJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, "utf8"));
}

async function collectSeedUrls(seed, limit, seedLog) {
  const found = [];
  const addUrls = (urls) => {
    for (const url of urls) {
      if (!found.includes(url)) found.push(url);
      if (found.length >= limit) return true;
    }
    return false;
  };
  if (!seed.sourceAdapter) {
    const searchHits = await searchGov(seed.query, limit, seedLog);
    if (addUrls(searchHits)) return found;
  }
  for (const sourceUrl of seed.sourceUrls || []) {
    if (isPastDeadline()) return found;
    const html = await fetchLogged(sourceUrl, seedLog, "source");
    if (!html) continue;
    const urls = seed.sourceAdapter
      ? seed.sourceAdapter.extractUrls(html, sourceUrl)
      : extractPolicyUrls(html, sourceUrl).filter((url) => matchesSeed(url, html, seed));
    seedLog.searched.push({ type: "source", source: sourceUrl, hits: urls.length, status: "ok" });
    if (addUrls(urls)) return found;
  }
  return found;
}

async function fetchLogged(url, seedLog, type) {
  seedLog.requests.attempted += 1;
  try {
    const html = await fetchText(url);
    seedLog.requests.succeeded += 1;
    return html;
  } catch (error) {
    seedLog.requests.failed += 1;
    seedLog.searched.push({ type, source: url, hits: 0, status: "failed" });
    seedLog.errors.push({ url, error: error.message });
    return "";
  }
}

async function fetchPolicy(url, seed) {
  const html = await fetchText(url);
  const title = cleanText(
    firstMatch(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i)
    || firstMatch(html, /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i)
    || firstMatch(html, /<title>([^<]+)<\/title>/i)
    || seed.name
  )
    .replace(/_中国政府网$/, "")
    .replace(/^国家医疗保障局\s+政策法规\s+/, "")
    .replace(/-国家疾病预防控制局$/, "")
    .replace(/-国家卫生健康委员会$/, "");
  const date = normalizeDate(
    firstMatch(html, /(\d{4})[-年](\d{1,2})[-月](\d{1,2})日?/)
    || firstMatch(html, /(\d{4})[-年](\d{1,2})/)
    || String(new Date().getFullYear())
  );
  const extractedAgency = cleanText(
    firstMatch(html, /来源：\s*([^<\n]+)/)
    || firstMatch(html, /发布机构：\s*([^<\n]+)/)
  );
  const agency = !extractedAgency || invalidAgencyPattern.test(extractedAgency)
    ? inferAgency(title, seed)
    : extractedAgency;
  const extractedSummary = cleanText(
    firstMatch(html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i)
    || firstParagraph(html)
    || title
  ).slice(0, 260);
  const summary = /^(?:来源|文件下载链接)[:：]/.test(extractedSummary) ? title : extractedSummary;
  const documentNo = extractDocumentNo(`${html} ${title}`);
  return {
    year: Number(date.slice(0, 4)),
    date,
    topic: seed.topic,
    secondary: seed.secondary,
    title: wrapTitle(title),
    agency,
    level: inferLevel(title),
    summary,
    url,
    keywords: `${seed.name} ${seed.query}`,
    documentNo,
    reviewStatus: "待人工审核"
  };
}

async function fetchText(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(url, {
    headers: {
      "user-agent": "Mozilla/5.0 policy-updater"
    },
    signal: controller.signal
    });
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
    const arrayBuffer = await response.arrayBuffer();
    return new TextDecoder("utf-8").decode(arrayBuffer);
  } finally {
    clearTimeout(timeout);
  }
}

function isPastDeadline() {
  return deadlineMs > 0 && Date.now() - startedAt > deadlineMs;
}

function extractPolicyUrls(html, baseUrl) {
  const urls = new Set();
  const absolutePattern = /https?:\/\/(?:www|app|big5\.www)\.gov\.cn\/(?:zhengce|govdata|lianbo)[^"'<>\s]+|https?:\/\/(?:www\.)?(?:nhc|nhsa|ndcpa|natcm)\.gov\.cn\/[^"'<>\s]+/g;
  for (const match of html.matchAll(absolutePattern)) {
    addUrl(match[0]);
  }
  const hrefPattern = /href=["']([^"']+)["']/gi;
  for (const match of html.matchAll(hrefPattern)) {
    addUrl(match[1]);
  }
  function addUrl(raw) {
    try {
      const url = new URL(raw.replace(/&amp;/g, "&"), baseUrl).href.replace(/[),.;]+$/, "");
      if (!isPolicyLikeUrl(url)) return;
      urls.add(url);
    } catch {
      // Ignore malformed links from search result markup.
    }
  }
  return [...urls];
}

function isPolicyLikeUrl(url) {
  if (blockedPolicyUrlPattern.test(url)) return false;
  return /(?:www|big5\.www)\.gov\.cn\/(?:zhengce|lianbo)\/.*(?:content_\d+|P\d+.*\.pdf|\.htm)/.test(url)
    || /(?:nhc|nhsa|ndcpa|natcm)\.gov\.cn\/.*(?:content|art|article|P\d+.*\.pdf|\.shtml|\.pdf)/.test(url);
}

function isConcretePolicyDocument(doc) {
  const url = doc.url || "";
  const text = `${doc.title || ""} ${doc.summary || ""}`;
  const signalText = `${doc.title || ""} ${doc.summary || ""} ${doc.documentNo || ""} ${doc.level || ""}`;
  const agency = String(doc.agency || "").trim();
  if (blockedPolicyUrlPattern.test(url)) return false;
  if (blockedPolicyTextPattern.test(text)) return false;
  if (blockedInterpretationPattern.test(`${url} ${text}`)) return false;
  if (!agency || invalidAgencyPattern.test(agency)) return false;
  return concretePolicySignalPattern.test(signalText);
}

function matchesSeed(url, html, seed) {
  const text = `${url} ${html}`.toLowerCase();
  return seed.name.toLowerCase().split(/\s+/).some((part) => text.includes(part))
    || seed.query.toLowerCase().split(/\s+/).slice(0, 4).some((part) => part.length > 1 && text.includes(part));
}

function firstMatch(text, pattern) {
  const match = text.match(pattern);
  if (!match) return "";
  return match.slice(1).filter(Boolean).join("-");
}

function firstParagraph(html) {
  const match = html.match(/<p[^>]*>([\s\S]{20,500}?)<\/p>/i);
  return match ? match[1] : "";
}

function cleanText(value) {
  return String(value || "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;|&#160;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeDate(value) {
  const parts = String(value).match(/\d{4}|\d{1,2}/g) || [String(new Date().getFullYear())];
  const year = parts[0];
  const month = parts[1] ? parts[1].padStart(2, "0") : "";
  const day = parts[2] ? parts[2].padStart(2, "0") : "";
  return [year, month, day].filter(Boolean).join("-");
}

function inferAgency(title, seed) {
  if (title.includes("国务院")) return "国务院";
  if (title.includes("国家医保局") || seed.topic.startsWith("nhsa_")) return "国家医疗保障局";
  if (title.includes("国家疾控局") || seed.topic.startsWith("cdc_")) return "国家疾病预防控制局";
  if (title.includes("中医药")) return "国家中医药管理局";
  return "国家卫生健康委员会";
}

function extractDocumentNo(value) {
  const text = cleanText(value);
  const patterns = [
    /(?:国卫|国中医药|医保|国疾控|国办|国发|财社|人社部发|卫办|发改社会|药监)[^，。；;\s（）()《》]{0,18}[〔\[]\d{4}[〕\]][^，。；;\s（）()《》]{0,8}号/,
    /国家药品监督管理局公告\d{4}年第\d+号/,
    /(?:GB|WS\/T)\s?\d{3,5}(?:\.\d+)?[—-]\d{4}/i
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[0]) return match[0].replace(/\s+/g, "");
  }
  return "";
}

function inferLevel(title) {
  for (const level of ["通知", "意见", "规划", "公告", "办法", "方案", "标准", "工作要点", "指南", "目录", "函"]) {
    if (title.includes(level)) return level;
  }
  return "政策文件";
}

function wrapTitle(title) {
  const trimmed = title.replace(/^《|》$/g, "");
  return `《${trimmed}》`;
}

function buildSourceHealth(log, reviewedDocuments) {
  const checkedAt = log.generatedAt;
  const sources = policySources.map((source) => {
    const seedLog = log.seeds.find((seed) => seed.name === `官方来源：${source.name}`);
    const requests = seedLog?.requests || { attempted: 0, succeeded: 0, failed: 0 };
    const status = requests.succeeded === 0
      ? "unavailable"
      : requests.failed > 0
        ? "degraded"
        : "healthy";
    const knownDates = reviewedDocuments
      .filter((policy) => inferSourceId(policy.url) === source.id)
      .map((policy) => policy.date)
      .filter(Boolean)
      .sort();
    return {
      id: source.id,
      name: source.name,
      homepage: source.homepage,
      policyList: source.listUrls[0],
      status,
      checkedAt,
      requests,
      documentsDiscovered: seedLog?.candidates || 0,
      newCandidates: seedLog?.added || 0,
      latestKnownPolicyDate: knownDates.at(-1) || null,
      reviewedDocuments: knownDates.length
    };
  });
  const healthyCount = sources.filter((source) => source.status === "healthy").length;
  const availableCount = sources.filter((source) => source.status !== "unavailable").length;
  return {
    schemaVersion: 1,
    generatedAt: checkedAt,
    overallStatus: healthyCount === sources.length ? "healthy" : availableCount > 0 ? "degraded" : "unavailable",
    sources
  };
}
