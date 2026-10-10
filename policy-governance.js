// 由 tools/build-policy-artifacts.mjs 生成，请勿直接编辑。
const policyGovernance = {
  "generatedAt": "2026-10-10T20:39:31.758Z",
  "dataThrough": "2026-09-24",
  "lastReviewedAt": "2026-10-05T02:14:03.361Z",
  "counts": {
    "candidates": 5,
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
      "generatedAt": "2026-10-10T20:38:58.878Z",
      "status": "no_new_policy",
      "attempted": 44,
      "succeeded": 6,
      "failed": 38,
      "candidatesAdded": 0,
      "successRate": 13.6
    },
    "review": {
      "backlog": 5,
      "approved": 27,
      "automaticApprovals": 9,
      "rejected": 0,
      "decided": 27,
      "approvalRate": 100
    },
    "autoPublication": {
      "generatedAt": "2026-10-10T20:39:29.882Z",
      "mode": "unattended-high-confidence",
      "queuedBefore": 5,
      "evaluated": 5,
      "published": 0,
      "reclassified": 0,
      "classificationRefreshed": 0,
      "quarantined": 5,
      "deferred": 0,
      "remaining": 5
    },
    "linkHealth": {
      "generatedAt": "2026-10-10T20:39:31.758Z",
      "overallStatus": "partial",
      "total": 361,
      "checked": 361,
      "decisive": 353,
      "reachable": 353,
      "healthy": 352,
      "blocked": 1,
      "unavailable": 0,
      "inconclusive": 8,
      "unchecked": 0,
      "coverageRate": 100,
      "availabilityRate": 100
    }
  },
  "sourceHealth": {
    "schemaVersion": 1,
    "generatedAt": "2026-10-10T20:38:58.878Z",
    "overallStatus": "healthy",
    "sources": [
      {
        "id": "nhsa",
        "name": "国家医疗保障局",
        "homepage": "https://www.nhsa.gov.cn/",
        "policyList": "https://www.nhsa.gov.cn/col/col104/index.html",
        "status": "healthy",
        "checkedAt": "2026-10-10T20:38:58.878Z",
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
        "checkedAt": "2026-10-10T20:38:58.878Z",
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
