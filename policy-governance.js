// 由 tools/build-policy-artifacts.mjs 生成，请勿直接编辑。
const policyGovernance = {
  "generatedAt": "2026-08-31T02:08:14.849Z",
  "dataThrough": "2026-08-19",
  "lastReviewedAt": "2026-08-25T18:00:00+08:00",
  "counts": {
    "candidates": 0,
    "reviewed": 355,
    "rejected": 0
  },
  "p2": {
    "coreFieldCompleteness": 95.1,
    "documentNumbersStructured": 268,
    "explicitEffectiveDates": 8,
    "jointDocuments": 172,
    "relations": 6,
    "resolvedRelations": 2,
    "validityStatuses": {
      "待核验": 346,
      "现行有效": 7,
      "已废止": 1,
      "尚未施行": 1
    },
    "documentTypes": {
      "正式政策": 355
    },
    "materialTypes": {
      "政策解读": 6
    }
  },
  "p3": {
    "collection": {
      "generatedAt": "2026-08-18T17:55:49.882Z",
      "status": "unknown",
      "attempted": 26,
      "succeeded": 11,
      "failed": 15,
      "candidatesAdded": 0,
      "successRate": 42.3
    },
    "review": {
      "backlog": 0,
      "approved": 18,
      "rejected": 0,
      "decided": 18,
      "approvalRate": 100
    },
    "linkHealth": {
      "generatedAt": "2026-08-31T02:08:14.849Z",
      "overallStatus": "partial",
      "total": 352,
      "checked": 80,
      "decisive": 62,
      "reachable": 62,
      "healthy": 62,
      "blocked": 0,
      "unavailable": 0,
      "inconclusive": 18,
      "unchecked": 272,
      "coverageRate": 22.7,
      "availabilityRate": 100
    }
  },
  "sourceHealth": {
    "schemaVersion": 1,
    "generatedAt": "2026-08-25T18:00:00+08:00",
    "overallStatus": "verified",
    "sources": [
      {
        "id": "nhsa",
        "name": "国家医疗保障局",
        "homepage": "https://www.nhsa.gov.cn/",
        "policyList": "https://www.nhsa.gov.cn/col/col104/index.html",
        "status": "verified",
        "checkedAt": "2026-08-25T18:00:00+08:00",
        "latestKnownPolicyDate": "2026-08-19",
        "reviewedDocuments": 11,
        "note": "已人工复核政策栏目至2026-08-25；新增“十五五”全民医保规划，官方解读进入关联资料分库。"
      },
      {
        "id": "ndcpa",
        "name": "国家疾病预防控制局",
        "homepage": "https://www.ndcpa.gov.cn/",
        "policyList": "https://www.ndcpa.gov.cn/jbkzzx/c100014/common/list.html",
        "status": "verified",
        "checkedAt": "2026-08-25T18:00:00+08:00",
        "latestKnownPolicyDate": "2026-07-08",
        "reviewedDocuments": 7,
        "note": "已人工复核正式政策来源至2026-08-25；本轮未发现晚于2026-07-08的新正式政策。"
      }
    ]
  }
};
