export function extractOfficialLinks(html, baseUrl, accepts) {
  const urls = new Set();
  for (const match of String(html || "").matchAll(/href=["']([^"']+)["']/gi)) {
    try {
      const url = new URL(match[1].replace(/&amp;/g, "&"), baseUrl);
      url.hash = "";
      if (url.protocol === "https:" && accepts(url)) urls.add(url.href);
    } catch {
      // Ignore malformed links in official list pages.
    }
  }
  return [...urls];
}
