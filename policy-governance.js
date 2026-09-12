// 由 tools/build-policy-artifacts.mjs 生成，请勿直接编辑。
const policyGovernance = {
  "generatedAt": "2026-09-12T19:37:32.264Z",
  "dataThrough": "2026-09-08",
  "lastReviewedAt": "2026-09-08T20:10:18.524Z",
  "counts": {
    "candidates": 0,
    "reviewed": 359,
    "rejected": 0
  },
  "p2": {
    "coreFieldCompleteness": 95.2,
    "documentNumbersStructured": 272,
    "explicitEffectiveDates": 8,
    "jointDocuments": 172,
    "relations": 6,
    "resolvedRelations": 2,
    "validityStatuses": {
      "待核验": 350,
      "现行有效": 7,
      "已废止": 1,
      "尚未施行": 1
    },
    "documentTypes": {
      "正式政策": 359
    },
    "materialTypes": {
      "政策解读": 6
    }
  },
  "p3": {
    "collection": {
      "generatedAt": "2026-09-12T19:35:54.360Z",
      "status": "no_new_policy",
      "attempted": 46,
      "succeeded": 3,
      "failed": 43,
      "candidatesAdded": 0,
      "successRate": 6.5
    },
    "review": {
      "backlog": 0,
      "approved": 22,
      "automaticApprovals": 4,
      "rejected": 0,
      "decided": 22,
      "approvalRate": 100
    },
    "autoPublication": {
      "generatedAt": "2026-09-12T19:37:32.185Z",
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
      "generatedAt": "2026-09-12T19:37:32.264Z",
      "overallStatus": "partial",
      "total": 356,
      "checked": 355,
      "decisive": 352,
      "reachable": 352,
      "healthy": 351,
      "blocked": 1,
      "unavailable": 0,
      "inconclusive": 3,
      "unchecked": 1,
      "coverageRate": 99.7,
      "availabilityRate": 100
    }
  },
  "sourceHealth": {
    "schemaVersion": 1,
    "generatedAt": "2026-09-12T19:35:54.360Z",
    "overallStatus": "degraded",
    "sources": [
      {
        "id": "nhsa",
        "name": "国家医疗保障局",
        "homepage": "https://www.nhsa.gov.cn/",
        "policyList": "https://www.nhsa.gov.cn/col/col104/index.html",
        "status": "unavailable",
        "checkedAt": "2026-09-12T19:35:54.360Z",
        "requests": {
          "attempted": 1,
          "succeeded": 0,
          "failed": 1
        },
        "documentsDiscovered": 0,
        "newCandidates": 0,
        "latestKnownPolicyDate": "2026-09-08",
        "reviewedDocuments": 15
      },
      {
        "id": "ndcpa",
        "name": "国家疾病预防控制局",
        "homepage": "https://www.ndcpa.gov.cn/",
        "policyList": "https://www.ndcpa.gov.cn/jbkzzx/c100014/common/list.html",
        "status": "healthy",
        "checkedAt": "2026-09-12T19:35:54.360Z",
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
