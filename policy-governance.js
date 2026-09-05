// 由 tools/build-policy-artifacts.mjs 生成，请勿直接编辑。
const policyGovernance = {
  "generatedAt": "2026-09-05T19:21:03.082Z",
  "dataThrough": "2026-09-02",
  "lastReviewedAt": "2026-09-02T20:03:00.441Z",
  "counts": {
    "candidates": 0,
    "reviewed": 358,
    "rejected": 0
  },
  "p2": {
    "coreFieldCompleteness": 95.1,
    "documentNumbersStructured": 271,
    "explicitEffectiveDates": 8,
    "jointDocuments": 172,
    "relations": 6,
    "resolvedRelations": 2,
    "validityStatuses": {
      "待核验": 349,
      "现行有效": 7,
      "已废止": 1,
      "尚未施行": 1
    },
    "documentTypes": {
      "正式政策": 358
    },
    "materialTypes": {
      "政策解读": 6
    }
  },
  "p3": {
    "collection": {
      "generatedAt": "2026-09-05T19:20:32.499Z",
      "status": "no_new_policy",
      "attempted": 44,
      "succeeded": 4,
      "failed": 40,
      "candidatesAdded": 0,
      "successRate": 9.1
    },
    "review": {
      "backlog": 0,
      "approved": 21,
      "automaticApprovals": 3,
      "rejected": 0,
      "decided": 21,
      "approvalRate": 100
    },
    "autoPublication": {
      "generatedAt": "2026-09-05T19:21:03.020Z",
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
      "generatedAt": "2026-09-05T19:21:03.082Z",
      "overallStatus": "partial",
      "total": 355,
      "checked": 355,
      "decisive": 351,
      "reachable": 351,
      "healthy": 351,
      "blocked": 0,
      "unavailable": 0,
      "inconclusive": 4,
      "unchecked": 0,
      "coverageRate": 100,
      "availabilityRate": 100
    }
  },
  "sourceHealth": {
    "schemaVersion": 1,
    "generatedAt": "2026-09-05T19:20:32.499Z",
    "overallStatus": "degraded",
    "sources": [
      {
        "id": "nhsa",
        "name": "国家医疗保障局",
        "homepage": "https://www.nhsa.gov.cn/",
        "policyList": "https://www.nhsa.gov.cn/col/col104/index.html",
        "status": "healthy",
        "checkedAt": "2026-09-05T19:20:32.499Z",
        "requests": {
          "attempted": 1,
          "succeeded": 1,
          "failed": 0
        },
        "documentsDiscovered": 8,
        "newCandidates": 0,
        "latestKnownPolicyDate": "2026-09-02",
        "reviewedDocuments": 14
      },
      {
        "id": "ndcpa",
        "name": "国家疾病预防控制局",
        "homepage": "https://www.ndcpa.gov.cn/",
        "policyList": "https://www.ndcpa.gov.cn/jbkzzx/c100014/common/list.html",
        "status": "unavailable",
        "checkedAt": "2026-09-05T19:20:32.499Z",
        "requests": {
          "attempted": 1,
          "succeeded": 0,
          "failed": 1
        },
        "documentsDiscovered": 0,
        "newCandidates": 0,
        "latestKnownPolicyDate": "2026-07-08",
        "reviewedDocuments": 7
      }
    ]
  }
};
