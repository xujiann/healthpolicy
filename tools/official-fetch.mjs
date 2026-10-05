import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const curlFallbackHosts = new Set(["www.nhsa.gov.cn", "www.ndcpa.gov.cn"]);

export async function fetchOfficialText(url, { fetchImpl = fetch, timeoutMs = 8000, userAgent = "Mozilla/5.0 policy-updater" } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetchImpl(url, {
      headers: { "user-agent": userAgent },
      redirect: "follow",
      signal: controller.signal
    });
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
    return {
      text: new TextDecoder("utf-8").decode(await response.arrayBuffer()),
      url: response.url || url
    };
  } catch (error) {
    if (fetchImpl !== fetch || !canUseCurlFallback(url)) throw error;
    try {
      return await fetchWithCurl(url, { timeoutMs, userAgent });
    } catch (curlError) {
      throw new Error(`fetch: ${error.message}; curl: ${curlError.message}`);
    }
  } finally {
    clearTimeout(timer);
  }
}

function canUseCurlFallback(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && curlFallbackHosts.has(url.hostname.toLowerCase());
  } catch {
    return false;
  }
}

async function fetchWithCurl(url, { timeoutMs, userAgent }) {
  const marker = "\n__POLICY_EFFECTIVE_URL__";
  const { stdout } = await execFileAsync("curl", [
    "--fail", "--location", "--silent", "--show-error",
    "--max-time", String(Math.ceil(timeoutMs / 1000)),
    "--user-agent", userAgent,
    "--write-out", `${marker}%{url_effective}`,
    url
  ], { encoding: "utf8", maxBuffer: 8 * 1024 * 1024, timeout: timeoutMs + 1000 });
  const markerIndex = stdout.lastIndexOf(marker);
  if (markerIndex < 0) throw new Error("curl 未返回最终链接");
  const effectiveUrl = stdout.slice(markerIndex + marker.length).trim();
  if (!canUseCurlFallback(effectiveUrl)) throw new Error("curl 跳转至非白名单来源");
  return { text: stdout.slice(0, markerIndex), url: effectiveUrl };
}
