// 由 tools/build-policy-artifacts.mjs 生成，请勿直接编辑。
const policyGovernance = {
  "generatedAt": "2026-10-06T21:51:17.532Z",
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
      "generatedAt": "2026-10-06T21:50:42.285Z",
      "status": "no_new_policy",
      "attempted": 44,
      "succeeded": 6,
      "failed": 38,
      "candidatesAdded": 0,
      "successRate": 13.6
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
      "generatedAt": "2026-10-06T21:51:15.870Z",
      "mode": "unattended-high-confidence",
      "queuedBefore": 4,
      "evaluated": 4,
      "published": 0,
      "reclassified": 0,
      "classificationRefreshed": 0,
      "quarantined": 4,
      "deferred": 0,
      "remaining": 4
    },
    "linkHealth": {
      "generatedAt": "2026-10-06T21:51:17.532Z",
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
    "generatedAt": "2026-10-06T21:50:42.285Z",
    "overallStatus": "healthy",
    "sources": [
      {
        "id": "nhsa",
        "name": "国家医疗保障局",
        "homepage": "https://www.nhsa.gov.cn/",
        "policyList": "https://www.nhsa.gov.cn/col/col104/index.html",
        "status": "healthy",
        "checkedAt": "2026-10-06T21:50:42.285Z",
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
        "checkedAt": "2026-10-06T21:50:42.285Z",
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
