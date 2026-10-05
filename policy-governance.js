// 由 tools/build-policy-artifacts.mjs 生成，请勿直接编辑。
const policyGovernance = {
  "generatedAt": "2026-10-05T23:19:59.846Z",
  "dataThrough": "2026-09-24",
  "lastReviewedAt": "2026-10-05T02:14:03.361Z",
  "counts": {
    "candidates": 4,
    "reviewed": 364,
    "rejected": 0
  },
  "p2": {
    "coreFieldCompleteness": 95.2,
    "documentNumbersStructured": 277,
    "explicitEffectiveDates": 8,
    "jointDocuments": 172,
    "relations": 6,
    "resolvedRelations": 2,
    "validityStatuses": {
      "待核验": 355,
      "现行有效": 7,
      "已废止": 1,
      "尚未施行": 1
    },
    "documentTypes": {
      "正式政策": 364
    },
    "materialTypes": {
      "政策解读": 6
    }
  },
  "p3": {
    "collection": {
      "generatedAt": "2026-10-05T23:18:39.915Z",
      "status": "no_new_policy",
      "attempted": 46,
      "succeeded": 3,
      "failed": 43,
      "candidatesAdded": 0,
      "successRate": 6.5
    },
    "review": {
      "backlog": 4,
      "approved": 27,
      "automaticApprovals": 9,
      "rejected": 0,
      "decided": 27,
      "approvalRate": 100
    },
    "autoPublication": {
      "generatedAt": "2026-10-05T23:19:57.963Z",
      "mode": "unattended-high-confidence",
      "queuedBefore": 4,
      "evaluated": 4,
      "published": 0,
      "reclassified": 0,
      "classificationRefreshed": 4,
      "quarantined": 4,
      "deferred": 0,
      "remaining": 4
    },
    "linkHealth": {
      "generatedAt": "2026-10-05T23:19:59.846Z",
      "overallStatus": "partial",
      "total": 361,
      "checked": 357,
      "decisive": 348,
      "reachable": 348,
      "healthy": 347,
      "blocked": 1,
      "unavailable": 0,
      "inconclusive": 9,
      "unchecked": 4,
      "coverageRate": 98.9,
      "availabilityRate": 100
    }
  },
  "sourceHealth": {
    "schemaVersion": 1,
    "generatedAt": "2026-10-05T23:18:39.915Z",
    "overallStatus": "degraded",
    "sources": [
      {
        "id": "nhsa",
        "name": "国家医疗保障局",
        "homepage": "https://www.nhsa.gov.cn/",
        "policyList": "https://www.nhsa.gov.cn/col/col104/index.html",
        "status": "unavailable",
        "checkedAt": "2026-10-05T23:18:39.915Z",
        "requests": {
          "attempted": 1,
          "succeeded": 0,
          "failed": 1
        },
        "documentsDiscovered": 0,
        "newCandidates": 0,
        "latestKnownPolicyDate": "2026-09-15",
        "reviewedDocuments": 16
      },
      {
        "id": "ndcpa",
        "name": "国家疾病预防控制局",
        "homepage": "https://www.ndcpa.gov.cn/",
        "policyList": "https://www.ndcpa.gov.cn/jbkzzx/c100014/common/list.html",
        "status": "healthy",
        "checkedAt": "2026-10-05T23:18:39.915Z",
        "requests": {
          "attempted": 1,
          "succeeded": 1,
          "failed": 0
        },
        "documentsDiscovered": 8,
        "newCandidates": 0,
        "latestKnownPolicyDate": "2026-09-24",
        "reviewedDocuments": 11
      }
    ]
  }
};
