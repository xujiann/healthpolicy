# 自动发布隔离队列

生成时间：2026-10-07T22:13:44.162Z

未通过自动发布门禁：4 条

以下记录不会自动上线，可在补充证据后人工处理。

| 候选 ID | 日期 | 文号 | 标题 | 来源 | 自动门禁结果 |
|---|---|---|---|---|---|
| `candidate-a6a2079ac9de89f4` | 2026-09-14 | 国疾控综传防函〔2026〕225号 | [《国家疾控局综合司关于组织开展2026年世界狂犬病日宣传活动的通知》](https://www.ndcpa.gov.cn/jbkzzx/c100014/common/content/content_2099421141589725184.html) | ndcpa | 活动或征集类通知不自动发布 |
| `candidate-cabc88c4f4966a41` | 2026-09-10 | 国卫办医政函〔2026〕297号 | [《关于开展2026年“服务百姓健康行动”全国大型义诊活动周的通知》](https://www.ndcpa.gov.cn/jbkzzx/c100014/common/content/content_2098003738939002880.html) | ndcpa | 活动或征集类通知不自动发布；发文机关与官方来源不一致；疾控局政策文号与来源不一致；文号与官方发布司局不一致 |
| `candidate-7a6f6ec79de1febb` | 2026-07-31 | 文号待核 | [《关于发布《感染性腹泻诊断标准》等4项法定传染病诊断标准的通告》](https://www.ndcpa.gov.cn/jbkzzx/c100014/common/content/content_2083089089290473472.html) | ndcpa | 疾控局政策文号与来源不一致；文号与官方发布司局不一致；文号缺失或为占位值 |
| `candidate-37a9cf2def70d619` | 2026-07-15 | 文号待核 | [《国家疾控局综合司疾控政策研究课题征集公告》](https://www.ndcpa.gov.cn/jbkzzx/c100014/common/content/content_2077188423837716480.html) | ndcpa | 活动或征集类通知不自动发布；疾控局政策文号与来源不一致；文号缺失或为占位值；未命中可信归口规则 |

审核命令示例：

```powershell
node tools/review-candidates.mjs --approve=<候选ID> --reviewer=<姓名> --basis=<归口依据>
node tools/review-candidates.mjs --reject=<候选ID> --reviewer=<姓名> --reason=<驳回原因>
```

