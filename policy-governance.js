// 由 tools/build-policy-artifacts.mjs 生成，请勿直接编辑。
const policyGovernance = {
  "generatedAt": "2026-11-28T00:40:18.398Z",
  "dataThrough": "2026-11-23",
  "lastReviewedAt": "2026-11-24T03:26:35.276Z",
  "counts": {
    "candidates": 12,
    "reviewed": 369,
    "rejected": 0
  },
  "p2": {
    "coreFieldCompleteness": 95.3,
    "documentNumbersStructured": 282,
    "explicitEffectiveDates": 8,
    "jointDocuments": 172,
    "relations": 6,
    "resolvedRelations": 2,
    "validityStatuses": {
      "待核验": 360,
      "现行有效": 7,
      "已废止": 1,
      "尚未施行": 1
    },
    "documentTypes": {
      "正式政策": 369
    },
    "materialTypes": {
      "政策解读": 6
    }
  },
  "p3": {
    "collection": {
      "generatedAt": "2026-11-28T00:39:16.633Z",
      "status": "no_new_policy",
      "attempted": 44,
      "succeeded": 6,
      "failed": 38,
      "candidatesAdded": 0,
      "successRate": 13.6
    },
    "review": {
      "backlog": 12,
      "approved": 32,
      "automaticApprovals": 14,
      "rejected": 0,
      "decided": 32,
      "approvalRate": 100
    },
    "autoPublication": {
      "generatedAt": "2026-11-28T00:39:56.696Z",
      "mode": "unattended-high-confidence",
      "queuedBefore": 12,
      "evaluated": 12,
      "published": 0,
      "reclassified": 0,
      "classificationRefreshed": 0,
      "quarantined": 12,
      "deferred": 0,
      "remaining": 12
    },
    "linkHealth": {
      "generatedAt": "2026-11-28T00:40:18.398Z",
      "overallStatus": "degraded",
      "total": 366,
      "checked": 366,
      "decisive": 366,
      "reachable": 364,
      "healthy": 363,
      "blocked": 1,
      "unavailable": 2,
      "inconclusive": 0,
      "unchecked": 0,
      "coverageRate": 100,
      "availabilityRate": 99.5
    }
  },
  "sourceHealth": {
    "schemaVersion": 1,
    "generatedAt": "2026-11-28T00:39:16.633Z",
    "overallStatus": "healthy",
    "sources": [
      {
        "id": "nhsa",
        "name": "国家医疗保障局",
        "homepage": "https://www.nhsa.gov.cn/",
        "policyList": "https://www.nhsa.gov.cn/col/col104/index.html",
        "status": "healthy",
        "checkedAt": "2026-11-28T00:39:16.633Z",
        "requests": {
          "attempted": 1,
          "succeeded": 1,
          "failed": 0
        },
        "documentsDiscovered": 8,
        "newCandidates": 0,
        "latestKnownPolicyDate": "2026-11-14",
        "reviewedDocuments": 17
      },
      {
        "id": "ndcpa",
        "name": "国家疾病预防控制局",
        "homepage": "https://www.ndcpa.gov.cn/",
        "policyList": "https://www.ndcpa.gov.cn/jbkzzx/c100014/common/list.html",
        "status": "healthy",
        "checkedAt": "2026-11-28T00:39:16.633Z",
        "requests": {
          "attempted": 1,
          "succeeded": 1,
          "failed": 0
        },
        "documentsDiscovered": 8,
        "newCandidates": 0,
        "latestKnownPolicyDate": "2026-11-23",
        "reviewedDocuments": 15
      }
    ]
  }
};
