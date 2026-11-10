// 由 tools/build-policy-artifacts.mjs 生成，请勿直接编辑。
const policyGovernance = {
  "generatedAt": "2026-11-10T00:49:52.551Z",
  "dataThrough": "2026-11-09",
  "lastReviewedAt": "2026-11-10T00:49:50.403Z",
  "counts": {
    "candidates": 9,
    "reviewed": 365,
    "rejected": 0
  },
  "p2": {
    "coreFieldCompleteness": 95.2,
    "documentNumbersStructured": 278,
    "explicitEffectiveDates": 8,
    "jointDocuments": 172,
    "relations": 6,
    "resolvedRelations": 2,
    "validityStatuses": {
      "待核验": 356,
      "现行有效": 7,
      "已废止": 1,
      "尚未施行": 1
    },
    "documentTypes": {
      "正式政策": 365
    },
    "materialTypes": {
      "政策解读": 6
    }
  },
  "p3": {
    "collection": {
      "generatedAt": "2026-11-10T00:49:20.571Z",
      "status": "completed_with_candidates",
      "attempted": 44,
      "succeeded": 6,
      "failed": 38,
      "candidatesAdded": 1,
      "successRate": 13.6
    },
    "review": {
      "backlog": 9,
      "approved": 28,
      "automaticApprovals": 10,
      "rejected": 0,
      "decided": 28,
      "approvalRate": 100
    },
    "autoPublication": {
      "generatedAt": "2026-11-10T00:49:50.403Z",
      "mode": "unattended-high-confidence",
      "queuedBefore": 10,
      "evaluated": 10,
      "published": 1,
      "reclassified": 0,
      "classificationRefreshed": 0,
      "quarantined": 9,
      "deferred": 0,
      "remaining": 9
    },
    "linkHealth": {
      "generatedAt": "2026-11-10T00:49:52.551Z",
      "overallStatus": "healthy",
      "total": 362,
      "checked": 361,
      "decisive": 361,
      "reachable": 361,
      "healthy": 360,
      "blocked": 1,
      "unavailable": 0,
      "inconclusive": 0,
      "unchecked": 1,
      "coverageRate": 99.7,
      "availabilityRate": 100
    }
  },
  "sourceHealth": {
    "schemaVersion": 1,
    "generatedAt": "2026-11-10T00:49:20.571Z",
    "overallStatus": "healthy",
    "sources": [
      {
        "id": "nhsa",
        "name": "国家医疗保障局",
        "homepage": "https://www.nhsa.gov.cn/",
        "policyList": "https://www.nhsa.gov.cn/col/col104/index.html",
        "status": "healthy",
        "checkedAt": "2026-11-10T00:49:20.571Z",
        "requests": {
          "attempted": 1,
          "succeeded": 1,
          "failed": 0
        },
        "documentsDiscovered": 8,
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
        "checkedAt": "2026-11-10T00:49:20.571Z",
        "requests": {
          "attempted": 1,
          "succeeded": 1,
          "failed": 0
        },
        "documentsDiscovered": 8,
        "newCandidates": 1,
        "latestKnownPolicyDate": "2026-11-09",
        "reviewedDocuments": 12
      }
    ]
  }
};
