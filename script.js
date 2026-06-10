const topics = [
  { id: "nhc_office", name: "卫健委-办公厅", color: "#6f7682", children: ["秘书处", "综合处", "研究室", "督查室", "政务公开处"] },
  { id: "nhc_hr", name: "卫健委-人事司", color: "#7d8797", children: ["综合处", "干部处", "监督教育处", "专业人才管理处", "劳动工资处"] },
  { id: "nhc_planning", name: "卫健委-规划发展与信息化司", color: "#1f8a84", children: ["综合处", "发展规划处", "建设装备处", "信息统计处", "爱国卫生工作办公室"] },
  { id: "nhc_finance", name: "卫健委-财务司", color: "#677f39", children: ["办公室", "经济管理处", "预算管理处", "资产管理处", "审计评价处", "乡村振兴处"] },
  { id: "nhc_legal", name: "卫健委-法规司", color: "#5b6ea6", children: ["综合处", "立法处", "法制审核处", "标准处"] },
  { id: "nhc_reform", name: "卫健委-体制改革司", color: "#7a5bb8", children: ["综合协调处", "政策研究处", "督导评价处", "公立医院改革处"] },
  { id: "nhc_medical", name: "卫健委-医政司", color: "#2f6fed", children: ["综合处", "医疗资源处", "医疗机构处", "医疗管理处", "心理健康与精神卫生处", "护理与康复处"] },
  { id: "nhc_primary", name: "卫健委-基层卫生健康司", color: "#4e8f55", children: ["综合处", "运行评价处", "家庭医生处", "基本公共卫生处"] },
  { id: "nhc_emergency", name: "卫健委-医疗应急司", color: "#c85757", children: ["综合处", "医疗应急管理处", "医疗应急指导处", "公共卫生医疗管理处", "血液管理处", "医疗监督和行风管理处", "安全生产处"] },
  { id: "nhc_science", name: "卫健委-科技教育司", color: "#2a91b8", children: ["综合处", "项目一处", "项目二处", "规划评估处", "生物安全一处", "生物安全二处", "医学教育处"] },
  { id: "nhc_drug", name: "卫健委-药物政策司", color: "#537f6a", children: ["综合处", "药物政策处", "药品目录管理处", "药品供应保障协调处"] },
  { id: "nhc_food", name: "卫健委-食品安全标准司", color: "#9b7040", children: ["综合处", "食品安全标准管理处", "食品安全风险监测与评估处", "食品营养处"] },
  { id: "nhc_ageing", name: "卫健委-老龄健康司", color: "#6d7f38", children: ["综合处", "健康服务处", "医养结合处"] },
  { id: "nhc_maternal", name: "卫健委-妇幼健康司", color: "#b85f86", children: ["综合处", "妇女卫生处", "儿童卫生处", "出生缺陷防治处"] },
  { id: "nhc_occupational", name: "卫健委-职业健康司", color: "#7d6a58", children: ["综合处", "预防处", "技术服务管理处", "职业病管理处"] },
  { id: "nhc_population", name: "卫健委-人口家庭司", color: "#b06470", children: ["综合处", "政策协调处", "监测评估处", "家庭发展指导处"] },
  { id: "nhc_publicity", name: "卫健委-宣传司", color: "#5f8a9b", children: ["综合处", "新闻网络处", "宣传处", "健康宣教处"] },
  { id: "nhc_international", name: "卫健委-国际合作司", color: "#4b7d88", children: ["综合处", "国际组织处", "欧美处", "亚太处", "非洲处", "港澳台处"] },
  { id: "cdc_monitoring", name: "疾控局-监测预警司", color: "#bf6a4a", children: ["传染病监测处", "预警处", "信息平台处", "风险评估处"] },
  { id: "cdc_emergency", name: "疾控局-应急处置司", color: "#a94e4e", children: ["应急综合处", "应急处置处", "队伍装备处", "演练评估处"] },
  { id: "cdc_immunization", name: "疾控局-卫生与免疫规划司", color: "#8f7a35", children: ["免疫规划处", "健康危害因素处", "学校卫生处", "环境卫生处"] },
  { id: "tcm_admin", name: "中医药局-医政管理", color: "#84624a", children: ["中医医院管理处", "中药管理处", "中医药服务处", "传承创新处"] },
  { id: "nhsa_benefits", name: "医保局-待遇保障司", color: "#b17c1a", children: ["筹资待遇处", "医疗救助处", "长期护理保险处", "生育保障处"] },
  { id: "nhsa_services", name: "医保局-医药服务管理司", color: "#8a6d3b", children: ["医保目录处", "支付方式改革处", "定点协议管理处", "异地就医结算处", "经济性评价处"] },
  { id: "nhsa_price", name: "医保局-价格招采司", color: "#b85f2a", children: ["药品耗材招采处", "医疗服务价格处", "价格监测处", "采购平台处"] },
  { id: "nhsa_fund", name: "医保局-基金监管司", color: "#4b6f9f", children: ["基金监管处", "飞行检查处", "信用管理处", "经办稽核处"] },
  { id: "nhsa_planning", name: "医保局-规划财务法规司", color: "#6b7999", children: ["规划统计处", "法规标准处", "基金预算处", "信息化处"] }
];

const defaultChild = "综合处";
const categoryRules = [
  ["nhc_medical", "医疗管理处", /检查检验结果互认|合理医疗检查|医疗质量行动|医疗质量安全改进|质控指标/],
  ["nhc_population", "政策协调处", /优化生育政策|生育支持|生育友好|人口长期均衡|人口高质量发展|三孩/],
  ["nhc_population", "家庭发展指导处", /健康家庭|家庭健康|计划生育特殊家庭|家庭发展/],
  ["nhsa_fund", "飞行检查处", /飞行检查|专项检查|现场检查/],
  ["nhsa_fund", "信用管理处", /信用评价|信用管理|信息披露|黑名单|失信/],
  ["nhsa_fund", "经办稽核处", /稽核|经办内控|经办机构|内控管理/],
  ["nhsa_fund", "基金监管处", /基金监管|医保基金|欺诈骗保|违法违规|监督检查|常态化监管/],
  ["nhsa_price", "药品耗材招采处", /集采|集中带量采购|带量采购|药品采购|耗材|招标采购|挂网|中选|配送|结算/],
  ["nhsa_price", "医疗服务价格处", /医疗服务价格|价格项目|价格调整|价格治理|价格立项|收费标准/],
  ["nhsa_price", "价格监测处", /价格监测|价格信息|价格指数/],
  ["nhsa_price", "采购平台处", /采购平台|招采平台|平台建设/],
  ["nhsa_services", "支付方式改革处", /DRG|DIP|支付方式|按病种|病组|付费|总额预算/],
  ["nhsa_services", "医保目录处", /医保目录|药品目录|医用耗材目录|谈判药品|限定支付|国家基本医疗保险|商保创新药目录/],
  ["nhsa_services", "异地就医结算处", /异地就医|跨省直接结算|联网结算|转诊备案/],
  ["nhsa_services", "定点协议管理处", /定点医药机构|定点医疗机构|协议管理|医保服务协议/],
  ["nhsa_services", "经济性评价处", /经济性评价|卫生技术评估|药物经济学/],
  ["nhsa_benefits", "长期护理保险处", /长期护理|长护险/],
  ["nhsa_benefits", "医疗救助处", /医疗救助|困难群众|低收入|救助对象/],
  ["nhsa_benefits", "生育保障处", /生育保险|生育保障|生育津贴/],
  ["nhsa_benefits", "筹资待遇处", /基本医疗保险|居民医保|职工医保|待遇保障|参保|筹资|报销|门诊共济|大病保险/],
  ["nhsa_planning", "信息化处", /医保信息化|医保信息平台|医保电子凭证|编码标准|医保码/],
  ["nhsa_planning", "法规标准处", /医疗保障法|医保标准|行政复议|行政应诉|规章/],
  ["nhsa_planning", "规划统计处", /医疗保障事业发展规划|医保规划|统计/],
  ["nhc_primary", "家庭医生处", /家庭医生|签约服务|家庭病床/],
  ["nhc_primary", "运行评价处", /县域医共体|紧密型|医疗卫生共同体|基层医疗卫生机构医疗质量|基层运行|乡村医生|村卫生室|乡镇卫生院|社区卫生服务/],
  ["nhc_primary", "基本公共卫生处", /基本公共卫生|慢病管理|老年人健康管理|健康档案|两癌检查|地方病防治/],
  ["nhc_primary", "综合处", /基层|便民惠民|基层医疗卫生/],
  ["cdc_monitoring", "预警处", /传染病疫情预警|疫情预警|预警管理/],
  ["cdc_monitoring", "传染病监测处", /传染病监测|疫情监测|监测预警|法定传染病/],
  ["cdc_immunization", "免疫规划处", /免疫规划|疫苗|接种|百白破|白破/],
  ["cdc_immunization", "环境卫生处", /环境卫生|饮用水|公共场所卫生|健康危害因素/],
  ["cdc_immunization", "学校卫生处", /学校卫生|学生健康|校园/],
  ["cdc_emergency", "应急处置处", /疾控应急|疫情处置|突发急性传染病|应急处置/],
  ["nhc_emergency", "医疗应急管理处", /医疗应急|卫生应急|突发公共卫生|应急预案|重大疫情|紧急医学救援/],
  ["nhc_emergency", "医疗应急指导处", /医疗救治|应急救治|重症救治|救援队伍/],
  ["nhc_emergency", "公共卫生医疗管理处", /重大疾病|慢性病防控|艾滋|结核|传染病医疗|公共卫生医疗/],
  ["nhc_emergency", "血液管理处", /血液|采供血|献血/],
  ["nhc_emergency", "医疗监督和行风管理处", /行风|医疗监督|纠风|廉洁|投诉|依法执业|综合监管/],
  ["nhc_emergency", "安全生产处", /安全生产|消防安全|生产安全/],
  ["nhc_medical", "心理健康与精神卫生处", /精神卫生|心理健康|精神障碍/],
  ["nhc_medical", "护理与康复处", /护理|康复|安宁疗护/],
  ["nhc_medical", "医疗管理处", /医疗质量|质量安全|医院感染|医疗安全|临床路径|诊疗规范|医疗技术|病历|质控指标|检查检验结果互认|合理医疗检查/],
  ["nhc_medical", "医疗机构处", /医院|医疗机构|县医院|中医医院|专科|区域医疗中心|急救|诊所|门诊部|医疗服务体系/],
  ["nhc_medical", "医疗资源处", /医疗资源|床位|医学中心|区域医疗|资源扩容|医疗卫生服务体系/],
  ["nhc_reform", "公立医院改革处", /公立医院|现代医院管理|薪酬|绩效|公立医院高质量发展/],
  ["nhc_reform", "督导评价处", /督导|评价|考核|监测评价/],
  ["nhc_reform", "政策研究处", /三明医改|医改经验|政策研究/],
  ["nhc_reform", "综合协调处", /医改|医药卫生体制改革|改革重点任务|三医联动|分级诊疗|医联体|双向转诊|上下转诊/],
  ["nhc_science", "医学教育处", /继续医学教育|医学教育|住院医师规范化培训|专科医师|学分管理|人才培养/],
  ["nhc_science", "项目一处", /科技创新|医学科技|重点实验室|科研|科技计划|科技促进卫生健康/],
  ["nhc_science", "规划评估处", /科技规划|科技评估|规划评估/],
  ["nhc_science", "生物安全一处", /生物安全|实验室安全|病原微生物/],
  ["nhc_food", "食品安全标准管理处", /食品安全国家标准|食品标准|食品添加剂|食品接触材料|预包装食品标签|特殊膳食/],
  ["nhc_food", "食品安全风险监测与评估处", /食品安全风险监测|风险评估|食源性疾病|食品安全风险/],
  ["nhc_food", "食品营养处", /食品营养|营养健康|国民营养|特殊医学用途配方食品/],
  ["nhc_maternal", "出生缺陷防治处", /出生缺陷|产前筛查|新生儿疾病筛查|辅助生殖/],
  ["nhc_maternal", "儿童卫生处", /儿童健康|儿童医疗|儿童保健|婴幼儿|托育|早期发展/],
  ["nhc_maternal", "妇女卫生处", /妇幼|妇女|母婴|孕产妇|生育友好医院|母婴安全/],
  ["nhc_population", "家庭发展指导处", /健康家庭|家庭发展|计划生育特殊家庭|托育|婴幼儿照护|普惠托育/],
  ["nhc_population", "政策协调处", /优化生育|生育支持|生育友好|人口长期均衡|三孩/],
  ["nhc_population", "监测评估处", /人口监测|监测预警|人口预测|人口评估/],
  ["nhc_ageing", "医养结合处", /医养结合|养老|失能老人/],
  ["nhc_ageing", "健康服务处", /老龄|老年健康|老年人|老年医学|老年病|安宁疗护|临终关怀/],
  ["nhc_occupational", "职业病管理处", /职业病|尘肺|职业病诊断|职业病防治/],
  ["nhc_occupational", "技术服务管理处", /职业卫生技术服务|职业健康检查|放射卫生|技术服务/],
  ["nhc_occupational", "预防处", /职业病危害|危害监测|职业健康风险|健康企业|职业健康保护/],
  ["tcm_admin", "中医医院管理处", /中医医院|中西医协同|中医医疗机构|中医医院评审/],
  ["tcm_admin", "中药管理处", /中药|中药饮片|中成药/],
  ["tcm_admin", "中医药服务处", /中医药|中医|中医药服务|基层中医药/],
  ["nhc_drug", "药品供应保障协调处", /短缺药|短缺药品|药品供应|药品保障/],
  ["nhc_drug", "药物政策处", /合理用药|处方管理|外配处方|药物政策|基本药物/],
  ["nhc_drug", "药品目录管理处", /基本药物目录|罕见病目录|药品目录/],
  ["nhc_publicity", "健康宣教处", /健康教育|健康促进|科普|健康宣教|健康知识/],
  ["nhc_publicity", "新闻网络处", /新闻发布|网络宣传|舆情|信息发布/],
  ["nhc_international", "国际组织处", /世界卫生组织|国际组织|全球卫生/],
  ["nhc_international", "港澳台处", /港澳台|台湾|香港|澳门/],
  ["nhc_legal", "立法处", /法律|条例|办法|规章|传染病防治法|基本医疗卫生与健康促进法/],
  ["nhc_legal", "标准处", /卫生标准|国家标准|行业标准|标准化/],
  ["nhc_legal", "法制审核处", /合法性审查|行政复议|行政应诉|规范性文件/],
  ["nhc_finance", "预算管理处", /预算|财政补助|资金管理|基本公共卫生服务经费/],
  ["nhc_finance", "资产管理处", /设备更新|资产|医疗设备|配置许可/],
  ["nhc_finance", "乡村振兴处", /乡村振兴|健康扶贫|脱贫地区/],
  ["nhc_hr", "专业人才管理处", /卫生健康人才|专业技术人员|医师资格|护士执业|人才队伍/],
  ["nhc_hr", "劳动工资处", /薪酬|工资|绩效工资/],
  ["nhc_planning", "信息统计处", /信息化|互联网|智慧医院|电子健康|数据|互联互通|远程医疗|统计|检查检验结果互认|全民健康信息平台/],
  ["nhc_planning", "爱国卫生工作办公室", /爱国卫生|健康城市|健康乡村|健康环境|控烟|烟草控制/],
  ["nhc_planning", "发展规划处", /规划|纲要|实施方案|健康中国|健康行动|体系建设|资源配置|十四五|十五五/],
  ["nhc_planning", "建设装备处", /建设项目|基础设施|装备|设备配置|能力建设/]
];

function classifyPolicy(policy) {
  const explicitTopic = topics.find((topic) => topic.id === policy.topic);
  if (explicitTopic && explicitTopic.children.includes(policy.secondary)) {
    return { topic: policy.topic, secondary: policy.secondary, assignment: "人工归口" };
  }
  const text = `${policy.title} ${policy.summary} ${policy.agency} ${policy.level} ${policy.keywords}`;
  const match = categoryRules.find(([, , pattern]) => pattern.test(text));
  const topic = match ? match[0] : "nhc_planning";
  const secondary = match ? match[1] : defaultChild;
  return { topic, secondary, assignment: "规则归口" };
}

function extractDocumentNo(policy) {
  const text = `${policy.documentNo || ""} ${policy.keywords || ""} ${policy.summary || ""} ${policy.title || ""}`;
  const patterns = [
    /(?:国卫|国中医药|医保|国疾控|国办|国发|财社|人社部发|卫办|发改社会|药监)[^，。；;\s（）()《》]{0,18}[〔\[]\d{4}[〕\]][^，。；;\s（）()《》]{0,8}号/g,
    /[A-Z]{1,4}\s?\d{3,5}[—-]\d{4}/g,
    /GB\s?\d{3,5}(?:\.\d+)?[—-]\d{4}/gi,
    /WS\/T\s?\d{3,5}[—-]\d{4}/gi
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[0]) return match[0].replace(/\s+/g, "");
  }
  return "文号待核";
}

const rawPolicyDocuments = [
  ...policyDocuments,
  ...(typeof policySupplementDocuments === "undefined" ? [] : policySupplementDocuments)
].filter((policy, index, items) => {
  const key = `${policy.url || ""}::${policy.title}`;
  return items.findIndex((item) => `${item.url || ""}::${item.title}` === key) === index;
});

const policies = rawPolicyDocuments.map((policy, index) => ({
  ...policy,
  ...classifyPolicy(policy),
  id: policy.id || `doc-${String(index + 1).padStart(3, "0")}`,
  sourceType: "具体文件",
  documentNo: policy.documentNo || extractDocumentNo(policy)
}));

const years = [...new Set(policies.map((policy) => policy.year))].sort((a, b) => a - b);
const levelOrder = ["通知", "意见", "方案", "规划", "公告", "办法", "条例", "规定", "决定", "批复", "工作要点", "指南", "标准", "目录", "函", "政策文件"];
const levels = [...new Set(policies.map((policy) => policy.level || "政策文件"))].sort((a, b) => {
  const ai = levelOrder.indexOf(a);
  const bi = levelOrder.indexOf(b);
  if (ai !== -1 || bi !== -1) return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
  return a.localeCompare(b, "zh-Hans-CN");
});

const els = {
  svg: document.querySelector("#policyMap"),
  topicFilter: document.querySelector("#topicFilter"),
  secondaryFilter: document.querySelector("#secondaryFilter"),
  yearFilter: document.querySelector("#yearFilter"),
  agencyFilter: document.querySelector("#agencyFilter"),
  levelFilter: document.querySelector("#levelFilter"),
  sortFilter: document.querySelector("#sortFilter"),
  searchInput: document.querySelector("#searchInput"),
  legend: document.querySelector("#legend"),
  statDocs: document.querySelector("#statDocs"),
  statFiltered: document.querySelector("#statFiltered"),
  statTopics: document.querySelector("#statTopics"),
  statYears: document.querySelector("#statYears"),
  filterCount: document.querySelector("#filterCount"),
  mapStatus: document.querySelector("#mapStatus"),
  matrix: document.querySelector("#matrix"),
  secondaryChips: document.querySelector("#secondaryChips"),
  detailTopic: document.querySelector("#detailTopic"),
  detailTitle: document.querySelector("#detailTitle"),
  detailDate: document.querySelector("#detailDate"),
  detailSummary: document.querySelector("#detailSummary"),
  detailMeta: document.querySelector("#detailMeta"),
  detailUrl: document.querySelector("#detailUrl"),
  continuityInput: document.querySelector("#continuityInput"),
  applyContinuity: document.querySelector("#applyContinuity"),
  continuityChart: document.querySelector("#continuityChart"),
  continuityTitle: document.querySelector("#continuityTitle"),
  continuitySummary: document.querySelector("#continuitySummary"),
  continuityTags: document.querySelector("#continuityTags"),
  continuityList: document.querySelector("#continuityList"),
  taxonomyList: document.querySelector("#taxonomyList"),
  timeline: document.querySelector("#timeline"),
  sourceList: document.querySelector("#sourceList"),
  sourceCount: document.querySelector("#sourceCount"),
  exportCsv: document.querySelector("#exportCsv"),
  toggleSources: document.querySelector("#toggleSources"),
  resetView: document.querySelector("#resetView")
};

const topicById = new Map(topics.map((topic) => [topic.id, topic]));
const ministries = [
  { id: "nhc", name: "国家卫生健康委", agencyId: "国家卫生健康委员会", color: "#1f8a84", topicPrefix: "nhc_" },
  { id: "nhsa", name: "国家医保局", agencyId: "国家医疗保障局", color: "#b17c1a", topicPrefix: "nhsa_" },
  { id: "cdc", name: "国家疾控局", agencyId: "国家疾病预防控制局", color: "#bf6a4a", topicPrefix: "cdc_" },
  { id: "tcm", name: "国家中医药局", agencyId: "国家中医药管理局", color: "#84624a", topicPrefix: "tcm_" }
];
const ministryByTopic = new Map(topics.map((topic) => {
  const ministry = ministries.find((item) => topic.id.startsWith(item.topicPrefix)) || ministries[0];
  return [topic.id, ministry];
}));
const taxonomyReferences = [
  {
    scope: "国家卫生健康委",
    source: "国家卫生健康委员会机构设置",
    url: "https://www.nhc.gov.cn/wjw/jgsz/jgsz.shtml",
    note: "用于卫健委办公厅、人事司、规划发展与信息化司、财务司、法规司、体改司、医政司、基层司、医疗应急司、科教司、药政司、食品安全标准司、老龄司、妇幼司、职业健康司、人口家庭司、宣传司、国际合作司等司局及处室口径。"
  },
  {
    scope: "国家医保局",
    source: "国家医疗保障局内设机构",
    url: "https://www.nhsa.gov.cn/art/2018/9/25/art_35_298.html",
    note: "用于医保局规划财务法规、待遇保障、医药服务管理、医药价格和招标采购、基金监管等司局口径。"
  },
  {
    scope: "国家医保局",
    source: "国家医疗保障局职能配置、内设机构和人员编制规定",
    url: "https://www.gov.cn/zhengce/202203/content_3635328.htm",
    note: "用于医保待遇、目录支付、价格招采、基金监管、经办信息化等职责边界校核。"
  },
  {
    scope: "国家疾控局",
    source: "国家疾病预防控制局职能配置、内设机构和人员编制规定",
    url: "https://www.gov.cn/zhengce/2022-02/16/content_5674041.htm",
    note: "用于监测预警、应急处置、传染病防控、卫生与免疫规划、综合监督、科技教育与国际合作等疾控业务司局口径。"
  },
  {
    scope: "国家中医药局",
    source: "国务院办公厅关于印发国家中医药管理局职能配置内设机构和人员编制规定的通知",
    url: "https://www.gov.cn/zhengce/zhengceku/2010-11/18/content_7729.htm",
    note: "用于中医医政、中药管理、中医药服务、传承创新及相关业务归口校核。"
  }
];
const agencyGroups = [
  { id: "国家卫生健康委员会", name: "国家卫生健康委" },
  { id: "国家医疗保障局", name: "国家医保局" },
  { id: "国家中医药管理局", name: "国家中医药局" },
  { id: "国家疾病预防控制局", name: "国家疾控局" },
  { id: "国家发展和改革委员会", name: "国家发展改革委" },
  { id: "财政部", name: "财政部" },
  { id: "人力资源和社会保障部", name: "人社部" },
  { id: "民政部", name: "民政部" },
  { id: "教育部", name: "教育部" },
  { id: "国家药品监督管理局", name: "国家药监局" }
];
let activeId = null;
let graph = { nodes: [], links: [], nodeEls: new Map(), linkEls: [], labelEls: new Map() };
let transform = { x: 0, y: 0, k: 1 };
let targetTransform = null;
let animationId = null;
let showAllSources = false;

function initControls() {
  els.statDocs.textContent = policies.length;
  els.statTopics.textContent = topics.length;
  els.statYears.textContent = years.length;
  els.topicFilter.innerHTML = ['<option value="all">全部司局</option>', ...topics.map((topic) => `<option value="${topic.id}">${topic.name}</option>`)].join("");
  updateSecondaryOptions();
  els.yearFilter.innerHTML = ['<option value="all">全部年份</option>', ...years.map((year) => `<option value="${year}">${year}</option>`)].join("");
  els.agencyFilter.innerHTML = ['<option value="all">全部重点机关</option>', ...agencyGroups.map((agency) => `<option value="${escapeAttr(agency.id)}">${agency.name}</option>`)].join("");
  els.levelFilter.innerHTML = ['<option value="all">全部文件类型</option>', ...levels.map((level) => `<option value="${escapeAttr(level)}">${level}</option>`)].join("");
  renderLegend();
  renderTaxonomyList();
}

function updateSecondaryOptions() {
  const selectedTopic = els.topicFilter.value;
  const children = selectedTopic === "all"
    ? [...new Set(topics.flatMap((topic) => topic.children))]
    : topicById.get(selectedTopic).children;
  const previous = els.secondaryFilter.value;
  els.secondaryFilter.innerHTML = ['<option value="all">全部处室</option>', ...children.map((child) => `<option value="${child}">${child}</option>`)].join("");
  els.secondaryFilter.value = children.includes(previous) ? previous : "all";
}

function renderLegend() {
  els.legend.innerHTML = topics.map((topic) => {
    const count = policies.filter((policy) => policy.topic === topic.id).length;
    return `<button class="legend-row" type="button" data-topic="${topic.id}"><span><i class="swatch" style="background:${topic.color}"></i>${topic.name}</span><strong>${count}</strong></button>`;
  }).join("");
  els.legend.querySelectorAll(".legend-row").forEach((button) => {
    button.addEventListener("click", () => {
      els.topicFilter.value = button.dataset.topic;
      updateSecondaryOptions();
      els.secondaryFilter.value = "all";
      activeId = null;
      update();
    });
  });
}

function getFilteredPolicies() {
  const topic = els.topicFilter.value;
  const secondary = els.secondaryFilter.value;
  const year = els.yearFilter.value;
  const agency = els.agencyFilter.value;
  const level = els.levelFilter.value;
  const term = els.searchInput.value.trim().toLowerCase();
  return policies.filter((policy) => {
    const byTopic = topic === "all" || policy.topic === topic;
    const bySecondary = secondary === "all" || policy.secondary === secondary;
    const byYear = year === "all" || String(policy.year) === year;
    const byAgency = agency === "all" || policy.agency.includes(agency);
    const byLevel = level === "all" || policy.level === level;
    const haystack = `${policy.title} ${policy.summary} ${policy.agency} ${policy.level} ${policy.keywords} ${policy.sourceType}`.toLowerCase();
    return byTopic && bySecondary && byYear && byAgency && byLevel && (!term || haystack.includes(term));
  });
}

function getKeywordPolicies() {
  const term = els.searchInput.value.trim().toLowerCase();
  return policies.filter((policy) => {
    const haystack = `${policy.title} ${policy.summary} ${policy.agency} ${policy.level} ${policy.keywords} ${policy.sourceType}`.toLowerCase();
    return !term || haystack.includes(term);
  });
}

function sortPolicies(items) {
  const mode = els.sortFilter.value;
  return [...items].sort((a, b) => {
    if (mode === "date-asc") return a.date.localeCompare(b.date) || a.title.localeCompare(b.title, "zh-Hans-CN");
    if (mode === "category") return topicById.get(a.topic).name.localeCompare(topicById.get(b.topic).name, "zh-Hans-CN") || a.secondary.localeCompare(b.secondary, "zh-Hans-CN") || b.date.localeCompare(a.date);
    if (mode === "agency") return a.agency.localeCompare(b.agency, "zh-Hans-CN") || b.date.localeCompare(a.date);
    return b.date.localeCompare(a.date) || a.title.localeCompare(b.title, "zh-Hans-CN");
  });
}

function buildGraphData() {
  const width = els.svg.clientWidth || 900;
  const height = els.svg.clientHeight || 640;
  const center = { id: "center", type: "center", label: "健康中国", x: width / 2, y: height / 2, fx: width / 2, fy: height / 2 };
  const visible = getFilteredPolicies();
  const maxNodes = visible.slice(0, 320);
  const visibleTopics = topics.filter((topic) => visible.some((policy) => policy.topic === topic.id));
  const visibleMinistries = ministries.filter((ministry) => visibleTopics.some((topic) => ministryByTopic.get(topic.id).id === ministry.id));
  const nodes = [center];
  const links = [];
  const ministryNodes = visibleMinistries.map((ministry, index) => {
    const angle = -Math.PI / 2 + (index / Math.max(visibleMinistries.length, 1)) * Math.PI * 2;
    const node = {
      ...ministry,
      id: `ministry-${ministry.id}`,
      ministryId: ministry.id,
      type: "ministry",
      label: ministry.name,
      x: center.x + Math.cos(angle) * 135,
      y: center.y + Math.sin(angle) * 115,
      anchorX: center.x + Math.cos(angle) * 150,
      anchorY: center.y + Math.sin(angle) * 125
    };
    links.push({ source: center, target: node, color: ministry.color, type: "ministry-link", strength: 0.055 });
    nodes.push(node);
    return node;
  });
  const ministryNodeById = new Map(ministryNodes.map((node) => [node.ministryId, node]));
  const topicNodes = visibleTopics.map((topic, index) => {
    const ministry = ministryByTopic.get(topic.id);
    const ministryNode = ministryNodeById.get(ministry.id);
    const siblings = visibleTopics.filter((item) => ministryByTopic.get(item.id).id === ministry.id);
    const siblingIndex = siblings.findIndex((item) => item.id === topic.id);
    const baseAngle = Math.atan2(ministryNode.y - center.y, ministryNode.x - center.x);
    const spread = siblings.length === 1 ? 0 : (siblingIndex - (siblings.length - 1) / 2) * 0.23;
    const angle = baseAngle + spread;
    return {
      id: `topic-${topic.id}`,
      type: "topic",
      topic: topic.id,
      ministryId: ministry.id,
      label: topic.name,
      color: topic.color,
      x: ministryNode.x + Math.cos(angle) * 110,
      y: ministryNode.y + Math.sin(angle) * 92,
      anchorX: ministryNode.anchorX + Math.cos(angle) * 130,
      anchorY: ministryNode.anchorY + Math.sin(angle) * 108
    };
  });
  const topicNodeById = new Map(topicNodes.map((node) => [node.topic, node]));
  topicNodes.forEach((node) => {
    links.push({ source: ministryNodeById.get(node.ministryId), target: node, topic: node.topic, color: node.color, type: "topic-link", strength: 0.04 });
    nodes.push(node);
  });

  const officeBuckets = new Map();
  for (const policy of visible) {
    const key = `${policy.topic}::${policy.secondary}`;
    if (!officeBuckets.has(key)) officeBuckets.set(key, []);
    officeBuckets.get(key).push(policy);
  }
  const officeNodes = [...officeBuckets.entries()].map(([key, items], index) => {
    const [topicId, secondary] = key.split("::");
    const topic = topicById.get(topicId);
    const topicNode = topicNodeById.get(topicId);
    const siblings = [...officeBuckets.keys()].filter((item) => item.startsWith(`${topicId}::`));
    const siblingIndex = siblings.indexOf(key);
    const baseAngle = Math.atan2(topicNode.y - center.y, topicNode.x - center.x);
    const spread = siblings.length === 1 ? 0 : (siblingIndex - (siblings.length - 1) / 2) * 0.16;
    const angle = baseAngle + spread;
    return {
      id: `office-${topicId}-${secondary}`,
      type: "office",
      topic: topicId,
      secondary,
      label: secondary,
      color: topic.color,
      count: items.length,
      x: topicNode.x + Math.cos(angle) * 86,
      y: topicNode.y + Math.sin(angle) * 72,
      anchorX: topicNode.anchorX + Math.cos(angle) * 104,
      anchorY: topicNode.anchorY + Math.sin(angle) * 88
    };
  });
  const officeNodeByKey = new Map(officeNodes.map((node) => [`${node.topic}::${node.secondary}`, node]));
  officeNodes.forEach((node) => {
    links.push({ source: topicNodeById.get(node.topic), target: node, topic: node.topic, color: node.color, type: "office-link", strength: 0.035 });
    nodes.push(node);
  });

  const policyNodes = [];
  maxNodes.forEach((policy, index) => {
    const topic = topicById.get(policy.topic);
    const officeNode = officeNodeByKey.get(`${policy.topic}::${policy.secondary}`);
    const bucket = officeBuckets.get(`${policy.topic}::${policy.secondary}`) || [];
    const bucketIndex = bucket.findIndex((item) => item.id === policy.id);
    const baseAngle = Math.atan2(officeNode.y - center.y, officeNode.x - center.x);
    const angle = baseAngle + ((bucketIndex % 15) - 7) * 0.07;
    const radius = 56 + Math.floor(bucketIndex / 15) * 16;
    const node = {
      ...policy,
      type: "policy",
      label: policy.title.replace(/[《》]/g, ""),
      color: topic.color,
      x: officeNode.x + Math.cos(angle) * radius + (Math.random() - 0.5) * 18,
      y: officeNode.y + Math.sin(angle) * radius + (Math.random() - 0.5) * 18,
      vx: 0,
      vy: 0,
      anchorX: officeNode.anchorX + Math.cos(angle) * (radius + 18),
      anchorY: officeNode.anchorY + Math.sin(angle) * (radius + 18)
    };
    nodes.push(node);
    policyNodes.push(node);
    links.push({ source: officeNode, target: node, topic: policy.topic, color: topic.color, type: "policy-link", strength: 0.018 });
  });
  addPolicyRelationLinks(policyNodes, links);

  return { nodes, links, visibleCount: visible.length, renderedCount: maxNodes.length, officeCount: officeNodes.length, topicCount: topicNodes.length, ministryCount: ministryNodes.length };
}

function addPolicyRelationLinks(policyNodes, links) {
  const byOffice = new Map();
  for (const node of policyNodes) {
    const key = `${node.topic}::${node.secondary}`;
    if (!byOffice.has(key)) byOffice.set(key, []);
    byOffice.get(key).push(node);
  }
  for (const items of byOffice.values()) {
    const sorted = items.sort((a, b) => a.date.localeCompare(b.date) || a.title.localeCompare(b.title, "zh-Hans-CN"));
    for (let index = 1; index < sorted.length; index += 1) {
      const source = sorted[index - 1];
      const target = sorted[index];
      links.push({
        source,
        target,
        topic: target.topic,
        color: topicById.get(target.topic)?.color || "#7d8797",
        type: "policy-relation",
        strength: 0.004,
        relation: "同处室政策连续"
      });
    }
  }
}

function renderMap() {
  cancelAnimationFrame(animationId);
  const width = els.svg.clientWidth || 900;
  const height = els.svg.clientHeight || 640;
  els.svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  els.svg.innerHTML = "";
  transform = { x: 0, y: 0, k: 1 };
  targetTransform = null;

  const viewport = svgEl("g", "viewport");
  const linkLayer = svgEl("g", "links");
  const nodeLayer = svgEl("g", "nodes");
  viewport.append(linkLayer, nodeLayer);
  els.svg.appendChild(viewport);
  graph = { ...buildGraphData(), nodeEls: new Map(), linkEls: [], labelEls: new Map(), viewport };
  els.mapStatus.textContent = `部委 ${graph.ministryCount} / 司局 ${graph.topicCount} / 处室 ${graph.officeCount} / 政策 ${graph.renderedCount}/${graph.visibleCount}`;

  graph.links.forEach((link) => {
    const line = svgEl("line", `link ${link.type || ""}`);
    line.setAttribute("stroke", link.color || topicById.get(link.topic)?.color || "#b9c3cf");
    if (link.relation) {
      const title = svgEl("title");
      title.textContent = link.relation;
      line.appendChild(title);
    }
    linkLayer.appendChild(line);
    graph.linkEls.push({ link, line });
  });

  graph.nodes.forEach((node) => {
    const group = svgEl("g", `node ${node.type} ${node.visible === false ? "is-muted" : ""} ${activeId === node.id ? "is-active" : ""}`);
    const radius = node.type === "center" ? 44
      : node.type === "ministry" ? 34
      : node.type === "topic" ? 22
      : node.type === "office" ? 12
      : 5.5;
    group.appendChild(svgEl("circle", "", { r: radius, fill: node.color || "#fff" }));
    if (node.type !== "policy" || activeId === node.id) {
      const y = node.type === "center" ? 5 : node.type === "policy" ? -12 : 4;
      const text = svgEl("text", "", { "text-anchor": "middle", y });
      const length = node.type === "center" ? 8 : node.type === "ministry" ? 8 : node.type === "topic" ? 10 : node.type === "office" ? 7 : 16;
      text.textContent = node.type === "policy" ? shortLabel(node.label, length) : shortLabel(node.label, length);
      group.appendChild(text);
      graph.labelEls.set(node.id, text);
    }
    if (node.type === "office") {
      const badge = svgEl("text", "office-count", { "text-anchor": "middle", y: 27 });
      badge.textContent = `${node.count}份`;
      group.appendChild(badge);
    }
    if (node.type === "policy") {
      const title = svgEl("title");
      title.textContent = `${node.title}\n${node.date} / ${node.agency}\n${topicById.get(node.topic).name} / ${node.secondary}`;
      group.appendChild(title);
      group.addEventListener("click", () => selectPolicy(node));
    }
    if (node.type === "center") {
      group.addEventListener("click", reset);
    }
    if (node.type === "ministry") {
      group.addEventListener("click", () => {
        const nodeId = node.id;
        els.agencyFilter.value = node.agencyId;
        activeId = null;
        update();
        centerOnGraphNode(nodeId, 1.2);
      });
    }
    if (node.type === "topic") {
      group.addEventListener("click", () => {
        const nodeId = node.id;
        els.topicFilter.value = node.topic;
        updateSecondaryOptions();
        els.secondaryFilter.value = "all";
        activeId = null;
        update();
        centerOnGraphNode(nodeId, 1.25);
      });
    }
    if (node.type === "office") {
      group.addEventListener("click", () => {
        const nodeId = node.id;
        els.topicFilter.value = node.topic;
        updateSecondaryOptions();
        els.secondaryFilter.value = node.secondary;
        activeId = null;
        update();
        centerOnGraphNode(nodeId, 1.45);
      });
    }
    nodeLayer.appendChild(group);
    graph.nodeEls.set(node.id, group);
  });

  startSimulation();
}

function startSimulation() {
  let frame = 0;
  const step = () => {
    frame += 1;
    tickGraph();
    drawGraph();
    easeTransform();
    if (frame < 520) animationId = requestAnimationFrame(step);
  };
  step();
}

function tickGraph() {
  const nodes = graph.nodes;
  for (const node of nodes) {
    if (node.fx != null) {
      node.x = node.fx;
      node.y = node.fy;
      continue;
    }
    node.vx = (node.vx || 0) + (node.anchorX - node.x) * 0.006;
    node.vy = (node.vy || 0) + (node.anchorY - node.y) * 0.006;
  }
  for (let i = 0; i < nodes.length; i += 1) {
    for (let j = i + 1; j < nodes.length; j += 1) {
      const a = nodes[i];
      const b = nodes[j];
      const dx = b.x - a.x || 0.01;
      const dy = b.y - a.y || 0.01;
      const dist2 = dx * dx + dy * dy;
      const min = collisionDistance(a, b);
      if (dist2 < min * min) {
        const dist = Math.sqrt(dist2);
        const push = (min - dist) * 0.008;
        const px = (dx / dist) * push;
        const py = (dy / dist) * push;
        if (a.fx == null) {
          a.vx -= px;
          a.vy -= py;
        }
        if (b.fx == null) {
          b.vx += px;
          b.vy += py;
        }
      }
    }
  }
  for (const link of graph.links) {
    const dx = link.target.x - link.source.x;
    const dy = link.target.y - link.source.y;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    const ideal = linkDistance(link.target.type);
    const pull = (dist - ideal) * link.strength;
    const px = (dx / dist) * pull;
    const py = (dy / dist) * pull;
    if (link.target.fx == null) {
      link.target.vx -= px;
      link.target.vy -= py;
    }
  }
  for (const node of nodes) {
    if (node.fx != null) continue;
    node.vx *= 0.86;
    node.vy *= 0.86;
    node.x += node.vx;
    node.y += node.vy;
  }
}

function collisionDistance(a, b) {
  if (a.type === "policy" && b.type === "policy") return 20;
  if (a.type === "office" || b.type === "office") return 42;
  if (a.type === "topic" || b.type === "topic") return 60;
  if (a.type === "ministry" || b.type === "ministry") return 78;
  return 58;
}

function linkDistance(type) {
  if (type === "ministry") return 145;
  if (type === "topic") return 118;
  if (type === "office") return 84;
  return 58;
}

function drawGraph() {
  graph.linkEls.forEach(({ link, line }) => {
    line.setAttribute("x1", link.source.x);
    line.setAttribute("y1", link.source.y);
    line.setAttribute("x2", link.target.x);
    line.setAttribute("y2", link.target.y);
  });
  graph.nodes.forEach((node) => {
    graph.nodeEls.get(node.id)?.setAttribute("transform", `translate(${node.x},${node.y})`);
  });
}

function easeTransform() {
  if (!targetTransform) return;
  transform.x += (targetTransform.x - transform.x) * 0.16;
  transform.y += (targetTransform.y - transform.y) * 0.16;
  transform.k += (targetTransform.k - transform.k) * 0.16;
  graph.viewport.setAttribute("transform", `translate(${transform.x},${transform.y}) scale(${transform.k})`);
  if (Math.abs(targetTransform.x - transform.x) < 0.2 && Math.abs(targetTransform.y - transform.y) < 0.2 && Math.abs(targetTransform.k - transform.k) < 0.002) {
    transform = { ...targetTransform };
    targetTransform = null;
  }
}

function centerOn(node, scale = 1.55) {
  const width = els.svg.clientWidth || 900;
  const height = els.svg.clientHeight || 640;
  targetTransform = {
    k: scale,
    x: width / 2 - node.x * scale,
    y: height / 2 - node.y * scale
  };
}

function centerOnGraphNode(nodeId, scale = 1.55) {
  const nextNode = graph.nodes.find((node) => node.id === nodeId);
  if (nextNode) centerOn(nextNode, scale);
}

function selectPolicy(policy) {
  activeId = policy.id;
  setDetail(policy);
  graph.nodeEls.forEach((el) => el.classList.remove("is-active"));
  graph.nodeEls.get(policy.id)?.classList.add("is-active");
  centerOn(policy);
}

function setDetail(policy) {
  const topic = topicById.get(policy.topic);
  els.detailTopic.textContent = topic.name;
  els.detailTitle.textContent = policy.title;
  els.detailDate.textContent = `${policy.date} / ${policy.agency}`;
  els.detailSummary.textContent = policy.summary;
  els.detailMeta.innerHTML = `
    <dt>文号</dt><dd>${policy.documentNo}</dd>
    <dt>层级</dt><dd>${policy.level}</dd>
    <dt>司局</dt><dd>${topic.name}</dd>
    <dt>处室</dt><dd>${policy.secondary}</dd>
    <dt>归口</dt><dd>${policy.assignment}</dd>
    <dt>关键词</dt><dd>${policy.keywords}</dd>
  `;
  els.detailUrl.href = policy.url;
  els.detailUrl.textContent = "打开官方全文";
}

function renderTimeline() {
  const filtered = sortPolicies(getFilteredPolicies());
  const byYear = new Map();
  filtered.forEach((policy) => {
    if (!byYear.has(policy.year)) byYear.set(policy.year, []);
    byYear.get(policy.year).push(policy);
  });
  els.timeline.innerHTML = years.map((year) => {
    const items = byYear.get(year) || [];
    const preview = items.slice(0, 20);
    const more = items.length > preview.length ? `<div class="year-more">另有 ${items.length - preview.length} 条，见下方清单</div>` : "";
    return `
      <div class="year-column">
        <div class="year-head">${year}<span>${items.length}</span></div>
        ${preview.map((policy) => miniPolicy(policy)).join("")}
        ${more}
      </div>
    `;
  }).join("");
}

function renderContinuity() {
  const term = (els.continuityInput?.value || "护理").trim();
  const query = term || "护理";
  const matched = sortPolicies(policies.filter((policy) => matchPolicyKeyword(policy, query)));
  const byYear = new Map(years.map((year) => [year, []]));
  matched.forEach((policy) => {
    if (!byYear.has(policy.year)) byYear.set(policy.year, []);
    byYear.get(policy.year).push(policy);
  });
  const max = Math.max(1, ...[...byYear.values()].map((items) => items.length));
  const touchedTopics = new Map();
  matched.forEach((policy) => {
    const topic = topicById.get(policy.topic);
    const key = `${topic.name} / ${policy.secondary}`;
    touchedTopics.set(key, (touchedTopics.get(key) || 0) + 1);
  });
  els.continuityTitle.textContent = `“${query}”政策连续性`;
  els.continuitySummary.textContent = matched.length
    ? `共命中 ${matched.length} 份文件，覆盖 ${touchedTopics.size} 个司局/处室组合；柱形越高表示该年份相关文件越集中。`
    : "当前政策库未命中该关键词，可换用同义词或扩大关键词。";
  els.continuityChart.innerHTML = years.map((year) => {
    const count = byYear.get(year)?.length || 0;
    const height = Math.max(6, Math.round((count / max) * 132));
    return `<button class="continuity-bar" type="button" data-year="${year}" title="${year}年：${count}份"><span style="height:${height}px"></span><strong>${count}</strong><em>${year}</em></button>`;
  }).join("");
  els.continuityTags.innerHTML = [...touchedTopics.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "zh-Hans-CN"))
    .slice(0, 14)
    .map(([label, count]) => `<span>${label}<strong>${count}</strong></span>`)
    .join("");
  els.continuityList.innerHTML = matched.slice(0, 80).map((policy) => {
    const topic = topicById.get(policy.topic);
    return `
      <a class="continuity-item" href="${policy.url}" target="_blank" rel="noreferrer" style="border-left:4px solid ${topic.color}">
        <strong>${policy.date} ${policy.title}</strong>
        <span>${topic.name} / ${policy.secondary} / ${policy.agency}</span>
      </a>
    `;
  }).join("") || '<p class="empty-note">没有匹配文件。</p>';
  els.continuityChart.querySelectorAll(".continuity-bar").forEach((button) => {
    button.addEventListener("click", () => {
      els.searchInput.value = query;
      els.yearFilter.value = button.dataset.year;
      activeId = null;
      update();
      document.querySelector("#sources").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function renderTaxonomyList() {
  els.taxonomyList.innerHTML = topics.map((topic) => {
    const count = policies.filter((policy) => policy.topic === topic.id).length;
    const reference = taxonomyReferences.find((item) => topic.name.startsWith(item.scope.replace("国家", "").replace("卫生健康委", "卫健委").replace("医疗保障局", "医保局")));
    const fallback = topic.name.startsWith("卫健委") ? taxonomyReferences[0]
      : topic.name.startsWith("医保局") ? taxonomyReferences[1]
      : topic.name.startsWith("疾控局") ? taxonomyReferences[3]
      : topic.name.startsWith("中医药局") ? taxonomyReferences[4]
      : taxonomyReferences[0];
    const basis = reference || fallback;
    return `
      <article class="taxonomy-card">
        <div>
          <h3><i class="swatch" style="background:${topic.color}"></i>${topic.name}</h3>
          <p>${topic.children.join("、")}</p>
        </div>
        <dl>
          <dt>文件数</dt><dd>${count}</dd>
          <dt>依据</dt><dd><a href="${basis.url}" target="_blank" rel="noreferrer">${basis.source}</a></dd>
          <dt>说明</dt><dd>${basis.note}</dd>
        </dl>
      </article>
    `;
  }).join("");
}

function matchPolicyKeyword(policy, term) {
  const normalized = term.trim().toLowerCase();
  if (!normalized) return true;
  const haystack = `${policy.title} ${policy.summary} ${policy.keywords} ${policy.agency} ${policy.level} ${topicById.get(policy.topic)?.name || ""} ${policy.secondary}`.toLowerCase();
  return normalized.split(/\s+/).every((piece) => haystack.includes(piece));
}

function renderMatrix() {
  const filtered = getKeywordPolicies();
  const matrixCounts = new Map();
  for (const policy of filtered) {
    matrixCounts.set(`${policy.topic}-${policy.year}`, (matrixCounts.get(`${policy.topic}-${policy.year}`) || 0) + 1);
  }
  const max = Math.max(1, ...matrixCounts.values());
  const yearHeads = years.map((year) => `<div class="matrix-head">${year}</div>`).join("");
  const rows = topics.map((topic) => {
    const cells = years.map((year) => {
      const count = matrixCounts.get(`${topic.id}-${year}`) || 0;
      const intensity = count ? 0.18 + (count / max) * 0.72 : 0;
      return `<button class="matrix-cell" type="button" data-topic="${topic.id}" data-year="${year}" title="${topic.name} / ${year}: ${count}份" style="--cell-color:${topic.color};--cell-alpha:${intensity}">${count || ""}</button>`;
    }).join("");
    return `<div class="matrix-topic"><i class="swatch" style="background:${topic.color}"></i>${topic.name}</div>${cells}`;
  }).join("");
  els.matrix.innerHTML = `<div class="matrix-corner">司局</div>${yearHeads}${rows}`;
  els.matrix.querySelectorAll(".matrix-cell").forEach((cell) => {
    cell.addEventListener("click", () => {
      els.topicFilter.value = cell.dataset.topic;
      updateSecondaryOptions();
      els.secondaryFilter.value = "all";
      els.yearFilter.value = cell.dataset.year;
      activeId = null;
      update();
    });
  });
}

function renderSecondaryChips() {
  const selectedTopic = els.topicFilter.value;
  const candidates = selectedTopic === "all"
    ? [...new Set(topics.flatMap((topic) => topic.children))]
    : topicById.get(selectedTopic).children;
  const keywordItems = getKeywordPolicies();
  const counts = new Map();
  for (const policy of keywordItems) {
    if (selectedTopic !== "all" && policy.topic !== selectedTopic) continue;
    counts.set(policy.secondary, (counts.get(policy.secondary) || 0) + 1);
  }
  els.secondaryChips.innerHTML = candidates
    .filter((child) => counts.has(child))
    .sort((a, b) => (counts.get(b) || 0) - (counts.get(a) || 0))
    .map((child) => `<button type="button" class="${els.secondaryFilter.value === child ? "is-selected" : ""}" data-secondary="${child}">${child}<strong>${counts.get(child)}</strong></button>`)
    .join("");
  els.secondaryChips.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      els.secondaryFilter.value = els.secondaryFilter.value === button.dataset.secondary ? "all" : button.dataset.secondary;
      activeId = null;
      update();
    });
  });
}

function miniPolicy(policy) {
  const topic = topicById.get(policy.topic);
  return `<a class="mini-policy" href="${policy.url}" target="_blank" rel="noreferrer" style="border-left:4px solid ${topic.color}"><strong>${policy.title}</strong><span>${topic.name} / ${policy.secondary} / ${policy.date}</span></a>`;
}

function renderSourceList() {
  const filtered = sortPolicies(getFilteredPolicies());
  const visible = showAllSources ? filtered : filtered.slice(0, 60);
  els.sourceCount.textContent = `当前筛选命中 ${filtered.length} 份政策文件${showAllSources || filtered.length <= 60 ? "，已全部显示。" : "，下方先显示前60份。"}`;
  els.toggleSources.hidden = filtered.length <= 60;
  els.toggleSources.textContent = showAllSources ? "收起清单" : "显示全部";
  els.sourceList.innerHTML = visible.map((policy) => {
    const topic = topicById.get(policy.topic);
    return `
      <a class="source-item" href="${policy.url}" target="_blank" rel="noreferrer" style="border-top:4px solid ${topic.color}">
        <span class="source-title">${policy.title}</span>
        <span class="source-no">${policy.documentNo}</span>
        <span class="source-meta">${policy.date} / ${topic.name} / ${policy.secondary} / ${policy.agency}</span>
        <p class="source-summary">${policy.summary}</p>
      </a>
    `;
  }).join("");
}

function update() {
  const filtered = getFilteredPolicies();
  els.statFiltered.textContent = filtered.length;
  els.filterCount.textContent = describeFilters(filtered.length);
  showAllSources = false;
  renderSecondaryChips();
  renderMap();
  renderMatrix();
  renderContinuity();
  renderTimeline();
  renderSourceList();
}

function describeFilters(count) {
  const topic = els.topicFilter.value === "all" ? "全部司局" : topicById.get(els.topicFilter.value).name;
  const secondary = els.secondaryFilter.value === "all" ? "全部处室" : els.secondaryFilter.value;
  const year = els.yearFilter.value === "all" ? "全部年份" : `${els.yearFilter.value}年`;
  const agency = els.agencyFilter.value === "all" ? "全部重点机关" : agencyGroups.find((item) => item.id === els.agencyFilter.value)?.name || els.agencyFilter.value;
  const level = els.levelFilter.value === "all" ? "全部文件类型" : els.levelFilter.value;
  const term = els.searchInput.value.trim();
  return term ? `${topic} / ${secondary} / ${year} / ${agency} / ${level} / “${term}”：${count}份` : `${topic} / ${secondary} / ${year} / ${agency} / ${level}：${count}份`;
}

function reset() {
  els.topicFilter.value = "all";
  updateSecondaryOptions();
  els.secondaryFilter.value = "all";
  els.yearFilter.value = "all";
  els.agencyFilter.value = "all";
  els.levelFilter.value = "all";
  els.sortFilter.value = "date-desc";
  els.searchInput.value = "";
  activeId = null;
  els.detailTopic.textContent = "点击一个节点";
  els.detailTitle.textContent = "查看政策详情";
  els.detailDate.textContent = "节点会轻微漂移；点击后自动置中。";
  els.detailSummary.textContent = "当前政策库包含具体政策文件，可按类别、年份和关键词筛选；点击节点会自动置中。";
  els.detailMeta.innerHTML = "";
  els.detailUrl.href = "#sources";
  els.detailUrl.textContent = "查看官方来源";
  update();
}

function shortLabel(text, length) {
  return text.length > length ? `${text.slice(0, length)}...` : text;
}

function svgEl(name, className = "", attrs = {}) {
  const el = document.createElementNS("http://www.w3.org/2000/svg", name);
  if (className) el.setAttribute("class", className);
  Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
  return el;
}

function escapeAttr(value) {
  return String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function exportCurrentCsv() {
  const rows = sortPolicies(getFilteredPolicies());
  const header = ["年份", "日期", "文号", "司局", "处室", "归口方式", "发文机关", "文件层级", "标题", "摘要", "链接"];
  const lines = [header, ...rows.map((policy) => {
    const topic = topicById.get(policy.topic);
    return [policy.year, policy.date, policy.documentNo, topic.name, policy.secondary, policy.assignment, policy.agency, policy.level, policy.title, policy.summary, policy.url];
  })].map((row) => row.map(csvCell).join(","));
  const blob = new Blob([`\uFEFF${lines.join("\n")}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `卫生健康政策_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function csvCell(value) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

initControls();
reset();

els.topicFilter.addEventListener("change", () => {
  updateSecondaryOptions();
  activeId = null;
  update();
});
els.secondaryFilter.addEventListener("change", update);
els.yearFilter.addEventListener("change", update);
els.agencyFilter.addEventListener("change", update);
els.levelFilter.addEventListener("change", update);
els.sortFilter.addEventListener("change", update);
els.searchInput.addEventListener("input", update);
els.applyContinuity.addEventListener("click", renderContinuity);
els.continuityInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") renderContinuity();
});
els.resetView.addEventListener("click", reset);
els.exportCsv.addEventListener("click", exportCurrentCsv);
els.toggleSources.addEventListener("click", () => {
  showAllSources = !showAllSources;
  renderSourceList();
});
window.addEventListener("resize", renderMap);
