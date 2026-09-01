// 由 tools/build-policy-artifacts.mjs 生成，请勿直接编辑。
const policyGovernance = {
  "generatedAt": "2026-09-01T20:06:53.349Z",
  "dataThrough": "2026-08-26",
  "lastReviewedAt": "2026-09-01T03:54:32.630Z",
  "counts": {
    "candidates": 0,
    "reviewed": 357,
    "rejected": 0
  },
  "p2": {
    "coreFieldCompleteness": 95.1,
    "documentNumbersStructured": 270,
    "explicitEffectiveDates": 8,
    "jointDocuments": 172,
    "relations": 6,
    "resolvedRelations": 2,
    "validityStatuses": {
      "待核验": 348,
      "现行有效": 7,
      "已废止": 1,
      "尚未施行": 1
    },
    "documentTypes": {
      "正式政策": 357
    },
    "materialTypes": {
      "政策解读": 6
    }
  },
  "p3": {
    "collection": {
      "generatedAt": "2026-09-01T20:06:23.518Z",
      "status": "no_new_policy",
      "attempted": 44,
      "succeeded": 6,
      "failed": 38,
      "candidatesAdded": 0,
      "successRate": 13.6
    },
    "review": {
      "backlog": 0,
      "approved": 20,
      "automaticApprovals": 2,
      "rejected": 0,
      "decided": 20,
      "approvalRate": 100
    },
    "autoPublication": {
      "generatedAt": "2026-09-01T20:06:53.281Z",
      "mode": "unattended-high-confidence",
      "queuedBefore": 0,
      "evaluated": 0,
      "published": 0,
      "reclassified": 0,
      "classificationRefreshed": 0,
      "quarantined": 0,
      "deferred": 0,
      "remaining": 0
    },
    "linkHealth": {
      "generatedAt": "2026-09-01T20:06:53.349Z",
      "overallStatus": "partial",
      "total": 354,
      "checked": 238,
      "decisive": 220,
      "reachable": 220,
      "healthy": 220,
      "blocked": 0,
      "unavailable": 0,
      "inconclusive": 18,
      "unchecked": 116,
      "coverageRate": 67.2,
      "availabilityRate": 100
    }
  },
  "sourceHealth": {
    "schemaVersion": 1,
    "generatedAt": "2026-09-01T20:06:23.518Z",
    "overallStatus": "healthy",
    "sources": [
      {
        "id": "nhsa",
        "name": "国家医疗保障局",
        "homepage": "https://www.nhsa.gov.cn/",
        "policyList": "https://www.nhsa.gov.cn/col/col104/index.html",
        "status": "healthy",
        "checkedAt": "2026-09-01T20:06:23.518Z",
        "requests": {
          "attempted": 1,
          "succeeded": 1,
          "failed": 0
        },
        "documentsDiscovered": 8,
        "newCandidates": 0,
        "latestKnownPolicyDate": "2026-08-26",
        "reviewedDocuments": 13
      },
      {
        "id": "ndcpa",
        "name": "国家疾病预防控制局",
        "homepage": "https://www.ndcpa.gov.cn/",
        "policyList": "https://www.ndcpa.gov.cn/jbkzzx/c100014/common/list.html",
        "status": "healthy",
        "checkedAt": "2026-09-01T20:06:23.518Z",
        "requests": {
          "attempted": 1,
          "succeeded": 1,
          "failed": 0
        },
        "documentsDiscovered": 1,
        "newCandidates": 0,
        "latestKnownPolicyDate": "2026-07-08",
        "reviewedDocuments": 7
      }
    ]
  }
};
