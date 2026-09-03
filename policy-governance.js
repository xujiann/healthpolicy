// 由 tools/build-policy-artifacts.mjs 生成，请勿直接编辑。
const policyGovernance = {
  "generatedAt": "2026-09-03T20:04:49.735Z",
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
      "generatedAt": "2026-09-03T20:04:20.965Z",
      "status": "no_new_policy",
      "attempted": 44,
      "succeeded": 6,
      "failed": 38,
      "candidatesAdded": 0,
      "successRate": 13.6
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
      "generatedAt": "2026-09-03T20:04:49.664Z",
      "mode": "unattended-high-confidence",
      "queuedBefore": 0,
      "evaluated": 0,
      "published": 0,
      "reclassified": 0,
      "classificationRefreshed": 1,
      "quarantined": 0,
      "deferred": 0,
      "remaining": 0
    },
    "linkHealth": {
      "generatedAt": "2026-09-03T20:04:49.735Z",
      "overallStatus": "partial",
      "total": 355,
      "checked": 317,
      "decisive": 299,
      "reachable": 299,
      "healthy": 299,
      "blocked": 0,
      "unavailable": 0,
      "inconclusive": 18,
      "unchecked": 38,
      "coverageRate": 89.3,
      "availabilityRate": 100
    }
  },
  "sourceHealth": {
    "schemaVersion": 1,
    "generatedAt": "2026-09-03T20:04:20.965Z",
    "overallStatus": "healthy",
    "sources": [
      {
        "id": "nhsa",
        "name": "国家医疗保障局",
        "homepage": "https://www.nhsa.gov.cn/",
        "policyList": "https://www.nhsa.gov.cn/col/col104/index.html",
        "status": "healthy",
        "checkedAt": "2026-09-03T20:04:20.965Z",
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
        "status": "healthy",
        "checkedAt": "2026-09-03T20:04:20.965Z",
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
