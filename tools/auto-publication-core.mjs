import { normalizeDocumentNo, normalizePolicyTitle, normalizePolicyUrl } from "./policy-quality.mjs";
import { enrichPolicySchema, extractStructuredDocumentNo } from "./policy-schema.mjs";
import { policySources } from "./sources/registry.mjs";

const sourceAgencies = {
  nhsa: "国家医疗保障局",
  ndcpa: "国家疾病预防控制局"
};

const classificationRules = [
  ["nhsa_benefits", "长期护理保险处", "长期护理保险", /长期护理|长护险/],
  ["nhsa_benefits", "医疗救助处", "医疗救助", /医疗救助|困难群众|低收入|救助对象/],
  ["nhsa_benefits", "生育保障处", "生育保障", /生育保险|生育保障|生育津贴/],
  ["nhsa_benefits", "筹资待遇处", "筹资待遇", /居民医保|职工医保|待遇保障|参保|筹资|门诊共济|大病保险/],
  ["nhsa_fund", "飞行检查处", "飞行检查", /飞行检查|专项检查|现场检查/],
  ["nhsa_fund", "信用管理处", "信用管理", /信用评价|信用管理|信息披露|黑名单|失信/],
  ["nhsa_fund", "经办稽核处", "经办稽核", /稽核|经办内控|经办机构|内控管理/],
  ["nhsa_fund", "基金监管处", "基金监管", /基金监管|医保基金|欺诈骗保|违法违规|监督检查|常态化监管/],
  ["nhsa_price", "药品耗材招采处", "药品耗材招采", /集采|集中带量采购|带量采购|药品采购|耗材|招标采购|挂网|中选|配送/],
  ["nhsa_price", "医疗服务价格处", "医疗服务价格", /医疗服务价格|价格项目|价格调整|价格治理|价格立项|收费标准/],
  ["nhsa_price", "价格监测处", "价格监测", /价格监测|价格信息|价格指数/],
  ["nhsa_price", "采购平台处", "采购平台", /采购平台|招采平台/],
  ["nhsa_services", "支付方式改革处", "医保支付方式", /DRG|DIP|支付方式|按病种|病组|付费|总额预算/],
  ["nhsa_services", "医保目录处", "医保目录", /医保目录|药品目录|医用耗材目录|谈判药品|限定支付|商保创新药目录/],
  ["nhsa_services", "异地就医结算处", "异地就医结算", /异地就医|跨省直接结算|联网结算|转诊备案/],
  ["nhsa_services", "定点协议管理处", "定点协议管理", /定点医药机构|定点医疗机构|协议管理|医保服务协议/],
  ["nhsa_services", "经济性评价处", "经济性评价", /经济性评价|卫生技术评估|药物经济学/],
  ["nhsa_planning", "信息化处", "医保信息化", /病理云|医保信息化|医保信息平台|医保电子凭证|编码(?:规范|标准)|医保码|数据平台/],
  ["nhsa_planning", "法规标准处", "医保法规标准", /医疗保障法|医保标准|行政复议|行政应诉|规章/],
  ["nhsa_planning", "规划统计处", "医保规划统计", /医疗保障事业发展规划|医保规划|统计/],
  ["cdc_monitoring", "预警处", "疾控预警", /传染病疫情预警|疫情预警|预警管理/],
  ["cdc_monitoring", "传染病监测处", "传染病监测", /传染病监测|疫情监测|监测预警|法定传染病/],
  ["cdc_monitoring", "信息平台处", "疾控信息平台", /信息平台|信息化|数据平台|编码(?:规范|标准)/],
  ["cdc_monitoring", "风险评估处", "疾控风险评估", /风险评估|风险研判/],
  ["cdc_immunization", "免疫规划处", "免疫规划", /免疫规划|疫苗|接种|百白破|白破/],
  ["cdc_immunization", "环境卫生处", "环境卫生", /环境卫生|饮用水|公共场所卫生|健康危害因素/],
  ["cdc_immunization", "学校卫生处", "学校卫生", /学校卫生|学生健康|校园/],
  ["cdc_emergency", "应急处置处", "疾控应急处置", /疾控应急|疫情处置|突发急性传染病|应急处置/]
];

export function classifyTrustedPolicy(policy) {
  const sourceId = String(policy?.sourceId || "");
  const text = `${policy?.title || ""} ${policy?.summary || ""} ${policy?.keywords || ""}`;
  const allowedPrefix = sourceId === "nhsa" ? "nhsa_" : sourceId === "ndcpa" ? "cdc_" : "";
  if (!allowedPrefix) return null;
  const match = classificationRules.find(([topic, , , pattern]) => topic.startsWith(allowedPrefix) && pattern.test(text));
  if (!match) return null;
  return { topic: match[0], secondary: match[1], rule: match[2] };
}

export function evaluateCandidateForAutoPublication(item, evidence, { now = new Date() } = {}) {
  const errors = [];
  const policy = item?.policy || {};
  const sourceId = String(item?.collection?.sourceId || "");
  const source = policySources.find((entry) => entry.id === sourceId);
  let policyUrl;
  try {
    policyUrl = new URL(String(policy.url || ""));
  } catch {
    errors.push("政策链接无效");
  }
  if (!source) errors.push("来源不在自动发布白名单");
  if (source && policyUrl && (!policyUrl.protocol.startsWith("https") || !source.accepts(policyUrl))) errors.push("链接不属于已适配的官方政策栏目");
  if (normalizePolicyUrl(item?.collection?.sourceUrl) !== normalizePolicyUrl(policy.url)) errors.push("采集来源与政策链接不一致");
  if (item?.review?.status !== "pending") errors.push("候选状态不是 pending");
  if (policy.documentType !== "正式政策") errors.push("仅允许正式政策自动发布");
  if (String(policy.agency || "").trim() !== sourceAgencies[sourceId]) errors.push("发文机关与官方来源不一致");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(policy.date || ""))) errors.push("发布日期不完整");
  if (Number(policy.year) !== Number(String(policy.date || "").slice(0, 4))) errors.push("年份与发布日期不一致");
  if (normalizeDocumentNo(policy.documentNo) === "") errors.push("文号缺失或为占位值");
  if (!evidence?.ok) errors.push(...(evidence?.errors?.length ? evidence.errors : ["官方页面复核失败"]));
  if (evidence?.ok) {
    if (normalizePolicyTitle(evidence.pageTitle) !== normalizePolicyTitle(policy.title)) errors.push("标题与官方页面不一致");
    if (evidence.publishDate !== policy.date) errors.push("发布日期与官方页面不一致");
    if (normalizeDocumentNo(evidence.documentNo) !== normalizeDocumentNo(policy.documentNo)) errors.push("文号与官方页面不一致");
    if (String(evidence.summary || "").trim().length < 40) errors.push("官方正文摘要不足 40 字");
    try {
      const resolvedUrl = new URL(evidence.resolvedUrl || policy.url);
      if (!source?.accepts(resolvedUrl)) errors.push("官方页面跳转后离开可信栏目");
    } catch {
      errors.push("官方页面最终链接无效");
    }
  }
  const publishTime = Date.parse(`${policy.date}T23:59:59+08:00`);
  if (Number.isFinite(publishTime) && publishTime > now.getTime() + 24 * 60 * 60 * 1000) errors.push("发布日期超出允许的未来时间窗口");
  const classification = classifyTrustedPolicy({ ...policy, sourceId, summary: evidence?.summary || policy.summary });
  if (!classification) errors.push("未命中可信归口规则");
  return { eligible: errors.length === 0, errors: [...new Set(errors)], classification, source };
}

export function prepareAutoApprovedPolicy(item, evidence, classification, timestamp = new Date().toISOString()) {
  return enrichPolicySchema({
    ...item.policy,
    summary: evidence.summary,
    topic: classification.topic,
    secondary: classification.secondary
  }, { enrichedAt: timestamp, referenceDate: timestamp.slice(0, 10) });
}

export async function fetchOfficialPolicyEvidence(item, { fetchImpl = fetch, timeoutMs = 12000 } = {}) {
  const sourceId = String(item?.collection?.sourceId || "");
  const source = policySources.find((entry) => entry.id === sourceId);
  let sourceUrl;
  try {
    sourceUrl = new URL(String(item?.policy?.url || ""));
  } catch {
    return { ok: false, errors: ["政策链接无效"] };
  }
  if (!source || !source.accepts(sourceUrl)) return { ok: false, errors: ["链接不属于已适配的官方政策栏目"] };
  try {
    const page = await fetchText(sourceUrl.href, { fetchImpl, timeoutMs });
    const resolvedUrl = page.url || sourceUrl.href;
    const resolved = new URL(resolvedUrl);
    if (!source.accepts(resolved)) return { ok: false, errors: ["官方页面跳转后离开可信栏目"] };
    const pageTitle = extractMeta(page.text, "ArticleTitle")
      || extractTagText(page.text, "h1")
      || cleanPageTitle(extractTagText(page.text, "title"), source.name);
    const publishDate = normalizeDate(extractMeta(page.text, "PubDate") || page.text.match(/(?:日期|发布时间)[：:]?\s*(\d{4}[-年]\d{1,2}[-月]\d{1,2})/)?.[1]);
    const documentNo = extractStructuredDocumentNo({ summary: stripHtml(page.text) });
    let summaryText = summarizePolicyText(extractPageBody(page.text), pageTitle);
    let contentUrl = resolvedUrl;
    let summarySource = "official-page";
    const warnings = [];
    const downloadUrl = extractOfficialTextDownload(page.text, resolvedUrl);
    if (downloadUrl) {
      try {
        const download = await fetchText(downloadUrl, { fetchImpl, timeoutMs });
        const downloadedSummary = summarizePolicyText(download.text, pageTitle);
        if (downloadedSummary.length >= 40) {
          summaryText = downloadedSummary;
          contentUrl = download.url || downloadUrl;
          summarySource = "official-download";
        }
      } catch (error) {
        // The official HTML body remains an acceptable evidence source when its attachment is temporarily unavailable.
        warnings.push(`官方附件请求失败：${error.message}`);
      }
    }
    return {
      ok: true,
      sourceId,
      sourceUrl: sourceUrl.href,
      resolvedUrl,
      pageTitle: decodeHtml(pageTitle),
      publishDate,
      documentNo,
      summary: summaryText,
      summarySource,
      contentUrl,
      warnings,
      verifiedAt: new Date().toISOString()
    };
  } catch (error) {
    return { ok: false, errors: [`官方页面请求失败：${error.message}`] };
  }
}

export function summarizePolicyText(value, title = "", maxLength = 260) {
  let text = decodeHtml(stripHtml(String(value || "")))
    .replace(/^\uFEFF/, "")
    .replace(/中国医保，一生守护[\s\S]*?邮箱：[^。]+。?/g, "")
    .replace(/文件下载链接[：:]?[^。]+/g, "")
    .replace(/链接[：:]?[^。]+政策解读[^。]*/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (!text) return "";
  const compactTitle = normalizePolicyTitle(title);
  if (compactTitle && normalizePolicyTitle(text).startsWith(compactTitle)) {
    const markers = [/为深入/, /为推进/, /为贯彻/, /为落实/, /为进一步/, /为规范/, /为加强/, /根据/, /现将/, /本通知/, /本办法/, /本意见/];
    const indexes = markers.map((pattern) => text.search(pattern)).filter((index) => index >= 0);
    if (indexes.length) text = text.slice(Math.min(...indexes));
  }
  const window = text.slice(0, Math.max(maxLength + 80, 320));
  const sentenceEnd = window.indexOf("。", 60);
  if (sentenceEnd >= 0 && sentenceEnd + 1 <= maxLength) return window.slice(0, sentenceEnd + 1).trim();
  return window.slice(0, maxLength).replace(/[，、；：\s]+$/g, "").trim();
}

async function fetchText(url, { fetchImpl, timeoutMs }) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetchImpl(url, {
      headers: { "user-agent": "Mozilla/5.0 policy-auto-publisher" },
      redirect: "follow",
      signal: controller.signal
    });
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
    const data = await response.arrayBuffer();
    return { text: new TextDecoder("utf-8").decode(data), url: response.url || url };
  } finally {
    clearTimeout(timer);
  }
}

function extractMeta(html, name) {
  for (const tag of String(html || "").match(/<meta\b[^>]*>/gi) || []) {
    const attrs = Object.fromEntries([...tag.matchAll(/([:\w-]+)\s*=\s*["']([^"']*)["']/g)].map((match) => [match[1].toLowerCase(), match[2]]));
    if (String(attrs.name || attrs.property || "").toLowerCase() === name.toLowerCase()) return decodeHtml(attrs.content || "").trim();
  }
  return "";
}

function extractTagText(html, tag) {
  return stripHtml(String(html || "").match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"))?.[1] || "").trim();
}

function extractPageBody(html) {
  return String(html || "").match(/<meta\s+name=["']ContentStart["'][^>]*>([\s\S]*?)<meta\s+name=["']ContentEnd["'][^>]*>/i)?.[1]
    || String(html || "").match(/<div[^>]+id=["']zoom["'][^>]*>([\s\S]*?)<\/div>/i)?.[1]
    || extractMeta(html, "description")
    || "";
}

export function extractOfficialTextDownload(html, baseUrl) {
  for (const match of String(html || "").matchAll(/href=["']([^"']+)["']/gi)) {
    try {
      const rawUrl = decodeHtml(match[1]);
      if (!/(?:downfile\.jsp|\.txt(?:$|[?#]))/i.test(rawUrl)) continue;
      const url = new URL(rawUrl, baseUrl);
      if (url.protocol === "https:" && /(?:^|\.)gov\.cn$/i.test(url.hostname)) return url.href;
    } catch {
      // Ignore malformed attachment URLs.
    }
  }
  return "";
}

function cleanPageTitle(value, sourceName) {
  return String(value || "")
    .replace(new RegExp(`^${sourceName}\\s*(?:政策法规)?\\s*`), "")
    .replace(new RegExp(`[-_]${sourceName}$`), "")
    .trim();
}

function normalizeDate(value) {
  const match = String(value || "").match(/(\d{4})[-年](\d{1,2})[-月](\d{1,2})/);
  return match ? `${match[1]}-${match[2].padStart(2, "0")}-${match[3].padStart(2, "0")}` : "";
}

function stripHtml(value) {
  return String(value || "")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ");
}

function decodeHtml(value) {
  return String(value || "")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&quot;|&#34;/gi, '"')
    .replace(/&apos;|&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&amp;/gi, "&")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)));
}
