// 由 tools/build-policy-artifacts.mjs 生成，请勿直接编辑。
const policyGovernance = {
  "generatedAt": "2026-09-21T21:12:51.045Z",
  "dataThrough": "2026-09-15",
  "lastReviewedAt": "2026-09-15T20:24:31.728Z",
  "counts": {
    "candidates": 0,
    "reviewed": 360,
    "rejected": 0
  },
  "p2": {
    "coreFieldCompleteness": 95.2,
    "documentNumbersStructured": 273,
    "explicitEffectiveDates": 8,
    "jointDocuments": 172,
    "relations": 6,
    "resolvedRelations": 2,
    "validityStatuses": {
      "待核验": 351,
      "现行有效": 7,
      "已废止": 1,
      "尚未施行": 1
    },
    "documentTypes": {
      "正式政策": 360
    },
    "materialTypes": {
      "政策解读": 6
    }
  },
  "p3": {
    "collection": {
      "generatedAt": "2026-09-21T21:12:21.287Z",
      "status": "no_new_policy",
      "attempted": 44,
      "succeeded": 6,
      "failed": 38,
      "candidatesAdded": 0,
      "successRate": 13.6
    },
    "review": {
      "backlog": 0,
      "approved": 23,
      "automaticApprovals": 5,
      "rejected": 0,
      "decided": 23,
      "approvalRate": 100
    },
    "autoPublication": {
      "generatedAt": "2026-09-21T21:12:50.984Z",
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
      "generatedAt": "2026-09-21T21:12:51.045Z",
      "overallStatus": "partial",
      "total": 357,
      "checked": 356,
      "decisive": 353,
      "reachable": 353,
      "healthy": 352,
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
    "generatedAt": "2026-09-21T21:12:21.287Z",
    "overallStatus": "healthy",
    "sources": [
      {
        "id": "nhsa",
        "name": "国家医疗保障局",
        "homepage": "https://www.nhsa.gov.cn/",
        "policyList": "https://www.nhsa.gov.cn/col/col104/index.html",
        "status": "healthy",
        "checkedAt": "2026-09-21T21:12:21.287Z",
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
        "checkedAt": "2026-09-21T21:12:21.287Z",
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
