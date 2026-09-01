# 自动发布隔离队列

生成时间：2026-08-31T02:13:46.887Z

未通过自动发布门禁：2 条

以下记录不会自动上线，可在补充证据后人工处理。

| 候选 ID | 日期 | 文号 | 标题 | 来源 | 自动门禁结果 |
|---|---|---|---|---|---|
| `candidate-26c4113e50d13e12` | 2026-08-26 | 医保发〔2026〕19号 | [《国家医疗保障局关于做好长期护理保险支付管理工作的指导意见》](https://www.nhsa.gov.cn/art/2026/8/26/art_104_21907.html) | nhsa | 等待下一轮自动复核 |
| `candidate-032ae206ecfa2a0f` | 2026-08-25 | 医保办发〔2026〕10号 | [《国家医疗保障局办公室关于印发《“医保病理云索引”编码规范》的通知》](https://www.nhsa.gov.cn/art/2026/8/25/art_104_21894.html) | nhsa | 等待下一轮自动复核 |

审核命令示例：

```powershell
node tools/review-candidates.mjs --approve=<候选ID> --reviewer=<姓名> --basis=<归口依据>
node tools/review-candidates.mjs --reject=<候选ID> --reviewer=<姓名> --reason=<驳回原因>
```

