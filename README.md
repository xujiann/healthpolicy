# 近十年卫生健康政策脉络图

一个用于进入卫生健康政策汇总、数据可视化和健康平台的静态总入口。其中政策智能分析系统用于梳理 2016-2026 年卫生健康相关政策文件，已包装为“卫生健康信息平台模拟”中的政策知识库模块。

## 在线访问

- 总入口：[https://xujiann.github.io/healthpolicy/](https://xujiann.github.io/healthpolicy/)
- 政策智能分析：[https://xujiann.github.io/healthpolicy/policy.html](https://xujiann.github.io/healthpolicy/policy.html)

## 功能

- 部委 → 司局 → 处室 → 政策文件四层导图
- 页面顶部全库搜索，并可联动司局、处室、年份、机关、文件类型等筛选
- 关键词连续性分析，例如查看“护理”“医保目录”“医养结合”等政策变化
- 政策清单与官方链接
- candidates / reviewed / rejected 三层发布账本和逐条追溯信息
- 国家医保局、国家疾控局来源健康状态与自动补充候选流程
- GitHub Actions 每日自动采集；高置信官方政策通过质量门禁后直接发布，异常候选自动隔离
- 文号、效力状态、施行日期、联合发文机关和废止/修订关系筛选
- 正式政策与政策解读资料分库展示
- “十五五”任务政策证据覆盖率、缺口及最近更新时间
- 官方链接分批轮检、采集成功率、候选审核通过率和审核积压指标
- 卫生健康信息平台模拟导航、数据治理状态和政策知识库模块入口
- 手机优先的三项目总入口，连接政策汇总、数据可视化和健康平台

## 本地预览

直接打开：

```text
index.html
```

## GitHub Pages 部署

仓库使用 GitHub Actions 自定义工作流发布 Pages：

1. Settings → Pages
2. Source 选择 `GitHub Actions`
3. 每日政策工作流通过全部质量门后上传静态站点制品并执行部署

工作流在同一次运行中直接部署 Pages，因为 GitHub 的内置 `GITHUB_TOKEN` 推送不会再次触发分支式 Pages 构建。

启用后访问：

[https://xujiann.github.io/healthpolicy/](https://xujiann.github.io/healthpolicy/)

## 数据维护

仓库包含每日自动更新工作流：

```text
.github/workflows/daily-policy-update.yml
```

该工作流计划每天北京时间 01:30 运行（GitHub 托管队列可能延迟），也可在 GitHub Actions 页面手动触发。它会依次采集、复核官方证据、自动归口、构建正式数据、运行质量门禁并推送 `main`；GitHub Pages 随后自动发布。

生成自动补充候选：

```powershell
node tools/update-policies.mjs --draft --max=8
```

自动发布仅接受国家医保局、国家疾控局已适配的 HTTPS 正式政策页面，并同时校验标题、发布日期、文号、发文机关、官方正文摘要、重复项和归口规则。全部通过后写入正式库；任一条件不确定时保留在 `policy-lifecycle/candidates.json`，原因记录在 `policy-review-queue.md` 和 `policy-lifecycle/auto-publication.json`，不会误发。

本地执行同一自动发布门禁：

```powershell
node tools/auto-publish-candidates.mjs --max=20 --timeout-ms=12000
node tools/build-policy-artifacts.mjs
node tools/verify-policy-site.mjs
```

隔离候选仍可人工复核后通过：

```powershell
node tools/review-candidates.mjs --approve=<候选ID> --reviewer=<姓名> --basis=<归口依据>
node tools/build-policy-artifacts.mjs
```

驳回候选：

```powershell
node tools/review-candidates.mjs --reject=<候选ID> --reviewer=<姓名> --reason=<驳回原因>
```

运行质量测试与发布校验：

```powershell
node tools/test-policy-update.mjs
node tools/build-policy-artifacts.mjs
node tools/verify-policy-site.mjs
```

分批检查官方链接并刷新治理指标：

```powershell
node tools/check-policy-links.mjs --max=40 --concurrency=8 --timeout-ms=8000
node tools/build-policy-artifacts.mjs
```

轮检报告位于 `policy-lifecycle/link-health.json`。超时或站点拦截会单列为待复测，不会直接判定为失效链接。

P2 结构化字段由 `tools/policy-schema.mjs` 统一生成和校验。当前机器提取无法确认效力状态的历史文件显示为“待核验”，不会自动标记为现行有效。

生成规则归口审核清单：

```powershell
node tools/generate-assignment-audit.mjs
```

生成优先复核的 50 条高影响历史记录：

```powershell
node tools/generate-priority-review.mjs --max=50
```

## 下一步开发

按数据可信、可审计更新链路、检索分析和工程化四个阶段推进，详见 [`NEXT_DEVELOPMENT_PLAN.md`](NEXT_DEVELOPMENT_PLAN.md)。
