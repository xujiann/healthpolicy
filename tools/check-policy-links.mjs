import fs from "node:fs/promises";
import path from "node:path";
import { normalizePolicyUrl } from "./policy-quality.mjs";
import { classifyLinkResult, summarizeLinkHealth } from "./link-health.mjs";

const root = path.resolve(import.meta.dirname, "..");
const lifecycleDir = path.join(root, "policy-lifecycle");
const outputPath = path.join(lifecycleDir, "link-health.json");
const options = parseArgs(process.argv.slice(2));
const checkedAt = new Date().toISOString();
const reviewed = JSON.parse(await fs.readFile(path.join(lifecycleDir, "reviewed.json"), "utf8"));
const materials = JSON.parse(await fs.readFile(path.join(lifecycleDir, "materials.json"), "utf8"));
const records = [
  ...reviewed.items.map((item) => item.policy),
  ...materials.items.map((item) => item.material)
].filter((record) => record.url);

let previous = { nextCursor: 0, items: [] };
try {
  previous = JSON.parse(await fs.readFile(outputPath, "utf8"));
} catch {
  // The first run starts with an empty report.
}

const previousByUrl = new Map((previous.items || []).map((item) => [normalizePolicyUrl(item.url), item]));
const linksByUrl = new Map();
for (const record of records) {
  const url = normalizePolicyUrl(record.url);
  if (!url) continue;
  const current = linksByUrl.get(url) || {
    url,
    recordIds: [],
    titles: [],
    latestDate: record.date || ""
  };
  current.recordIds.push(record.id);
  current.titles.push(record.title);
  if (String(record.date || "") > current.latestDate) current.latestDate = record.date;
  linksByUrl.set(url, current);
}

const links = [...linksByUrl.values()]
  .map((link) => ({
    ...link,
    recordIds: [...new Set(link.recordIds)],
    titles: [...new Set(link.titles)]
  }))
  .sort((a, b) => b.latestDate.localeCompare(a.latestDate) || a.url.localeCompare(b.url));
const checkCount = options.all ? links.length : Math.min(options.max, links.length);
const start = options.all || !links.length ? 0 : Number(previous.nextCursor || 0) % links.length;
const selected = new Set(Array.from({ length: checkCount }, (_, offset) => links[(start + offset) % links.length].url));
const results = new Map();

await runWithConcurrency(links.filter((link) => selected.has(link.url)), options.concurrency, async (link) => {
  results.set(link.url, await checkLink(link.url, options.timeoutMs));
});

const items = links.map((link) => {
  const current = results.get(link.url);
  const prior = previousByUrl.get(link.url);
  const priorStatus = prior?.error ? classifyLinkResult({ error: prior.error }) : prior?.status;
  return {
    url: link.url,
    recordIds: link.recordIds,
    titles: link.titles,
    latestDate: link.latestDate || null,
    status: current?.status || priorStatus || "not_checked",
    httpStatus: current?.httpStatus ?? prior?.httpStatus ?? null,
    checkedAt: current ? checkedAt : prior?.checkedAt || null,
    responseMs: current?.responseMs ?? prior?.responseMs ?? null,
    error: current?.error || (current ? "" : prior?.error || "")
  };
});
const summary = summarizeLinkHealth(items);
const report = {
  schemaVersion: 1,
  generatedAt: checkedAt,
  checkedThisRun: results.size,
  nextCursor: links.length ? (start + checkCount) % links.length : 0,
  overallStatus: summary.checked === 0 ? "unknown" : summary.unavailable > 0 ? "degraded" : summary.inconclusive > 0 ? "partial" : "healthy",
  summary,
  items
};
await fs.writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
console.log(`Checked ${results.size}/${links.length} unique official links: ${summary.reachable} reachable, ${summary.unavailable} unavailable, ${summary.unchecked} pending.`);

async function checkLink(url, timeoutMs) {
  const startedAt = Date.now();
  try {
    let response = await request(url, "HEAD", timeoutMs);
    if (response.status === 405) response = await request(url, "GET", timeoutMs);
    const httpStatus = response.status;
    await response.body?.cancel();
    return {
      status: classifyLinkResult({ httpStatus }),
      httpStatus,
      responseMs: Date.now() - startedAt,
      error: ""
    };
  } catch (error) {
    return {
      status: classifyLinkResult({ error: error?.name || "request_failed" }),
      httpStatus: null,
      responseMs: Date.now() - startedAt,
      error: compactError(error)
    };
  }
}

function request(url, method, timeoutMs) {
  return fetch(url, {
    method,
    redirect: "follow",
    signal: AbortSignal.timeout(timeoutMs),
    headers: {
      "user-agent": "healthpolicy-link-monitor/1.0 (+https://github.com/xujiann/healthpolicy)",
      accept: "text/html,application/xhtml+xml"
    }
  });
}

async function runWithConcurrency(items, concurrency, worker) {
  let next = 0;
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (next < items.length) {
      const item = items[next++];
      await worker(item);
    }
  }));
}

function compactError(error) {
  const message = error?.cause?.code || error?.name || error?.message || "request_failed";
  return String(message).slice(0, 160);
}

function parseArgs(args) {
  const getNumber = (name, fallback) => {
    const value = args.find((arg) => arg.startsWith(`--${name}=`))?.split("=")[1];
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback;
  };
  return {
    all: args.includes("--all"),
    max: getNumber("max", 40),
    concurrency: getNumber("concurrency", 8),
    timeoutMs: getNumber("timeout-ms", 8000)
  };
}
