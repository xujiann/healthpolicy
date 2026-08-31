# 政策文件可审计更新工作流

## 1. 三层数据

P1 以 `policy-lifecycle` 目录作为更新链路的唯一审核账本：

- `candidates.json`：自动发现、尚未作出审核决定的候选。
- `reviewed.json`：已允许发布的记录，保留采集批次、来源、审核人、审核时间和归口依据。
- `rejected.json`：已驳回记录，保留审核人、时间和驳回原因，避免重复采集。
- `source-health.json`：官方来源最近检测时间、可用状态和最新已知政策日期。

`policy-reviewed.js` 和 `policy-governance.js` 是供静态页面加载的生成文件，不应直接编辑。历史 `policy-data.js`、`policy-supplement.js` 仅作为 P1 迁移输入保留。

P2 增加 `policy-lifecycle/materials.json`，用于保存政策解读、统计、公示和征求意见资料；这些资料由 `policy-materials.js` 单独加载，不计入正式政策数量。

## 2. 发现候选

```powershell
node tools/update-policies.mjs --draft --max=8
node tools/generate-review-queue.mjs
```

更新脚本优先使用国家医保局、国家疾控局来源适配器，同时保留国务院政策检索与主题种子作为补充。每个候选使用官方 URL、文号和标题生成稳定 ID，并按 ID、URL、文号、标题去重。

运行状态：

- `completed_with_candidates`：发现新候选并追加到候选层。
- `no_new_policy`：至少一个来源成功，但没有新候选；现有审核队列不会被清空。
- `source_failure`：所有来源失败；正式库与候选队列均保持不变。
- `deadline_reached`：达到时限；正式库与候选队列均保持不变。

## 3. 审核候选

审核前检查标题、文号、官方原文、发文机关、摘要、司局和处室归口。

通过：

```powershell
node tools/review-candidates.mjs --approve=<候选ID> --reviewer=<姓名> --basis=<归口依据>
```

如需调整建议归口，可附加：

```powershell
--topic=<司局ID> --secondary=<处室名称>
```

驳回：

```powershell
node tools/review-candidates.mjs --reject=<候选ID> --reviewer=<姓名> --reason=<驳回原因>
```

审核命令会在一次操作中把记录从 candidates 移动至 reviewed 或 rejected；缺少审核人、归口依据或驳回原因时拒绝执行。

## 4. 构建与发布校验

```powershell
node tools/build-policy-artifacts.mjs
node tools/generate-review-queue.mjs
node tools/test-policy-update.mjs
node tools/verify-policy-site.mjs
```

质量门禁检查三层结构、审核字段、官方 HTTPS 链接、重复 ID、待审核数据泄漏、空摘要、非法机关、列表页链接和无效归口。历史重复 URL 作为警告继续进入优先复核清单。

P2 还检查文号、联合发文机关、资料类型、效力对象和关系数组五组核心结构化字段，整体完整率不得低于 95%。效力状态分为现行有效、尚未施行、已废止、已失效、征求意见、待核验和不适用；机器提取结果必须保留依据与核验状态。

## 5. Pull Request 流程

每日 GitHub Actions 在 `automation/policy-candidates` 分支生成或更新候选审核 Pull Request，不再直接向主分支提交。Pull Request 触发独立的 `Policy quality gate`，重新生成页面数据并运行全部质量测试。

人工审核候选、执行构建并通过门禁后才能合并。页面展示“数据更新至”“最近人工核验”“待审核数量”和每个官方来源的健康状态。

## 6. 历史归口抽检

```powershell
node tools/generate-assignment-audit.mjs
node tools/generate-priority-review.mjs --max=50
```

P1 迁移时，原有人工核验记录标记为 `approved`；历史规则归口标记为 `legacy_imported`，明确表示其通过发布质量门禁但仍需按优先清单抽检，不冒充人工复核。

## 7. P2 结构化与资料分库

一次性迁移或规则升级后运行：

```powershell
node tools/enrich-p2-data.mjs
node tools/build-policy-artifacts.mjs
node tools/verify-policy-site.mjs
```

`enrich-p2-data.mjs` 会提取文号、拆分联合发文机关、识别明确施行日期，并从摘要中提取废止、修订和沿用关系。只有能够从库内唯一关联的废止关系才会交叉更新旧文件状态；其余效力状态保持“待核验”。

## 8. P3 链接轮检与运行指标

```powershell
node tools/check-policy-links.mjs --max=40 --concurrency=8 --timeout-ms=8000
node tools/build-policy-artifacts.mjs
```

链接检查按游标分批轮换，结果写入 `policy-lifecycle/link-health.json`。`healthy` 表示 HTTP 明确可达，`blocked` 表示官方站点返回访问限制但服务可达，`unavailable` 表示明确的无效响应，`inconclusive` 表示超时等暂时无法判断的结果；后两者不会自动修改正式政策记录。

治理页面展示链接可达率、最近采集成功率、候选审核通过率和审核积压。每日候选工作流同时更新链接报告，并通过 `automation/policy-candidates` 分支维护候选审核 Pull Request。
