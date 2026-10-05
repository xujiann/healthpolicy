import { extractOfficialLinks } from "./source-utils.mjs";

export const ndcpaSource = {
  id: "ndcpa",
  name: "国家疾病预防控制局",
  homepage: "https://www.ndcpa.gov.cn/",
  listUrls: ["https://www.ndcpa.gov.cn/jbkzzx/c100014/common/list.html"],
  defaultTopic: "cdc_monitoring",
  defaultSecondary: "传染病监测处",
  accepts(url) {
    return /(?:^|\.)ndcpa\.gov\.cn$/i.test(url.hostname) && /\/jbkzzx\/c100014\/common\/content\/content_\d+\.html$/i.test(url.pathname);
  },
  extractUrls(html, baseUrl) {
    const urls = new Set(extractOfficialLinks(html, baseUrl, this.accepts));
    // The official listing embeds entries in JavaScript data, not anchor tags.
    for (const match of String(html || "").matchAll(/\/jbkzzx\/c100014\/common\/content\/content_\d+\.html/g)) {
      const url = new URL(match[0], baseUrl);
      if (this.accepts(url)) urls.add(url.href);
    }
    return [...urls];
  }
};
