import { extractOfficialLinks } from "./source-utils.mjs";

export const nhsaSource = {
  id: "nhsa",
  name: "国家医疗保障局",
  homepage: "https://www.nhsa.gov.cn/",
  listUrls: ["https://www.nhsa.gov.cn/col/col104/index.html"],
  defaultTopic: "nhsa_services",
  defaultSecondary: "医保目录处",
  accepts(url) {
    return /(?:^|\.)nhsa\.gov\.cn$/i.test(url.hostname) && /\/art\/\d{4}\/\d{1,2}\/\d{1,2}\/art_104_\d+\.html$/i.test(url.pathname);
  },
  extractUrls(html, baseUrl) {
    return extractOfficialLinks(html, baseUrl, this.accepts);
  }
};
