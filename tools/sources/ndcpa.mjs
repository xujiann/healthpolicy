import { extractOfficialLinks } from "./source-utils.mjs";

export const ndcpaSource = {
  id: "ndcpa",
  name: "国家疾病预防控制局",
  homepage: "https://www.ndcpa.gov.cn/",
  listUrls: ["https://www.ndcpa.gov.cn/jbkzzx/c100014/common/list.html"],
  defaultTopic: "cdc_monitoring",
  defaultSecondary: "传染病监测处",
  accepts(url) {
    return /(?:^|\.)ndcpa\.gov\.cn$/i.test(url.hostname) && /\/common\/content\/content_\d+\.html$/i.test(url.pathname);
  },
  extractUrls(html, baseUrl) {
    return extractOfficialLinks(html, baseUrl, this.accepts);
  }
};
