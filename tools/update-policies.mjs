import fs from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";

const root = path.resolve(import.meta.dirname, "..");
const seedsPath = path.join(root, "policy-update-seeds.json");
const dataPath = path.join(root, "policy-data.js");
const supplementPath = path.join(root, "policy-supplement.js");
const draftPath = path.join(root, "policy-auto-draft.js");
const logPath = path.join(root, "policy-update-log.json");

const args = new Set(process.argv.slice(2));
const mode = args.has("--apply") ? "apply" : "draft";
const maxPerSeed = Number(process.argv.find((arg) => arg.startsWith("--max="))?.split("=")[1] || 8);
const blockedPolicyUrlPattern = /(download\.html|\/col\/col\d+\/index\.html|\/common\/(?:list|second\/list)\.html|\/index\.html(?:$|[?#])|new_list\.shtml)/i;
const blockedPolicyTextPattern = /(客户端下载页|索引\s*标题\s*发文字号\s*发布日期|政策解读|政府信息公开指南|政府信息公开制度|机构职能|内设机构|主要职责|政务公开|手机版|微信公众号|首页|栏目|列表页|党建工作-|通知公告-|法律法规$|其他$)/;
const concretePolicySignalPattern = /(国卫|医保|国中医药|国疾控|卫办|医保办|发改|财社|国办发|国发|令第|公告|通知|意见|办法|规划|方案|标准|指南|目录|细则|决定|批复|函|令|公报|工作要点|实施方案|行动计划|监测指标体系|设置标准)/;

const seeds = JSON.parse(await fs.readFile(seedsPath, "utf8"));
const existing = await loadExistingDocuments();
const existingKeys = new Set(existing.map(documentKey));
const existingUrls = new Set(existing.map((item) => item.url).filter(Boolean));
const candidates = [];
const runLog = {
  generatedAt: new Date().toISOString(),
  mode,
  maxPerSeed,
  seeds: []
};

for (const seed of seeds) {
  const seedLog = { name: seed.name, query: seed.query, searched: [], candidates: 0, added: 0, skippedExisting: 0, skippedNonPolicy: 0, errors: [] };
  const urls = await collectSeedUrls(seed, maxPerSeed, seedLog);
  seedLog.candidates = urls.length;
  for (const url of urls) {
    if (existingUrls.has(url)) {
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
    const key = documentKey(doc);
    if (!existingKeys.has(key) && !candidates.some((item) => documentKey(item) === key)) {
      candidates.push(doc);
      seedLog.added += 1;
    }
  }
  runLog.seeds.push(seedLog);
}

const normalized = candidates.map((item, index) => ({
  id: `auto-${String(index + 1).padStart(3, "0")}`,
  ...item,
  reviewStatus: item.reviewStatus || "待人工审核",
  assignment: "人工归口候选"
}));

if (mode === "apply") {
  await appendToSupplement(normalized);
  console.log(`Applied ${normalized.length} candidate documents to ${supplementPath}`);
} else {
  if (normalized.length) {
    await writeDraft(normalized);
    console.log(`Wrote ${normalized.length} candidate documents to ${draftPath}`);
  } else {
    await fs.rm(draftPath, { force: true });
    console.log("No candidate documents found; draft file was not created.");
  }
}
await fs.writeFile(logPath, JSON.stringify(runLog, null, 2), "utf8");
console.log(`Wrote update log to ${logPath}`);

async function loadExistingDocuments() {
  const context = {};
  vm.createContext(context);
  const data = await fs.readFile(dataPath, "utf8");
  const supplement = await fs.readFile(supplementPath, "utf8").catch(() => "const policySupplementDocuments = [];");
  vm.runInContext(`${data}\n${supplement}\nthis.docs = [...policyDocuments, ...policySupplementDocuments];`, context);
  return context.docs || [];
}

async function searchGov(query, limit) {
  const encoded = encodeURIComponent(query);
  const searchUrls = [
    `https://sousuo.www.gov.cn/s.htm?t=zhengceku&q=${encoded}`,
    `https://sousuo.www.gov.cn/s.htm?t=zhengcelibrary&q=${encoded}`,
    `https://www.gov.cn/so/s?tab=all&qt=${encoded}`
  ];
  const found = [];
  for (const searchUrl of searchUrls) {
    const html = await fetchText(searchUrl).catch(() => "");
    for (const url of extractPolicyUrls(html, searchUrl)) {
      if (!found.includes(url)) found.push(url);
      if (found.length >= limit) return found;
    }
  }
  return found;
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
  const searchHits = await searchGov(seed.query, limit);
  seedLog.searched.push({ type: "search", source: seed.query, hits: searchHits.length });
  if (addUrls(searchHits)) return found;
  for (const sourceUrl of seed.sourceUrls || []) {
    const html = await fetchText(sourceUrl).catch((error) => {
      seedLog.errors.push({ url: sourceUrl, error: error.message });
      return "";
    });
    const urls = extractPolicyUrls(html, sourceUrl).filter((url) => matchesSeed(url, html, seed));
    seedLog.searched.push({ type: "source", source: sourceUrl, hits: urls.length });
    if (addUrls(urls)) return found;
  }
  return found;
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
  const agency = cleanText(
    firstMatch(html, /来源：\s*([^<\n]+)/)
    || firstMatch(html, /发布机构：\s*([^<\n]+)/)
    || inferAgency(title, seed)
  );
  const summary = cleanText(
    firstMatch(html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i)
    || firstParagraph(html)
    || title
  ).slice(0, 260);
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
    reviewStatus: "待人工审核"
  };
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      "user-agent": "Mozilla/5.0 policy-updater"
    }
  });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  const arrayBuffer = await response.arrayBuffer();
  return new TextDecoder("utf-8").decode(arrayBuffer);
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
  if (blockedPolicyUrlPattern.test(url)) return false;
  if (blockedPolicyTextPattern.test(text)) return false;
  return concretePolicySignalPattern.test(signalText);
}

function matchesSeed(url, html, seed) {
  const text = `${url} ${html}`.toLowerCase();
  return seed.name.toLowerCase().split(/\s+/).some((part) => text.includes(part))
    || seed.query.toLowerCase().split(/\s+/).slice(0, 4).some((part) => part.length > 1 && text.includes(part));
}

function documentKey(doc) {
  return `${doc.url || ""}::${doc.title || ""}`;
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
  if (title.includes("国家医保局") || seed.topic.startsWith("nhsa_")) return "国家医疗保障局";
  if (title.includes("国家疾控局") || seed.topic.startsWith("cdc_")) return "国家疾病预防控制局";
  if (title.includes("中医药")) return "国家中医药管理局";
  return "国家卫生健康委员会";
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

async function writeDraft(documents) {
  const body = `const policyAutoDraftDocuments = ${JSON.stringify(documents, null, 2)};\n`;
  await fs.writeFile(draftPath, body, "utf8");
}

async function appendToSupplement(documents) {
  if (!documents.length) return;
  const current = await fs.readFile(supplementPath, "utf8");
  const insert = documents.map((doc) => `,\n  ${JSON.stringify(doc, null, 2).replace(/\n/g, "\n  ")}`).join("");
  const updated = current.replace(/\n\];\s*$/, `${insert}\n];\n`);
  await fs.writeFile(supplementPath, updated, "utf8");
}
