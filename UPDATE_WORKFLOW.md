# 政策文件自动补充工作流

这个静态网站的数据分三层：

- `policy-data.js`：基础政策库，保留原始采集结果。
- `policy-supplement.js`：人工审核后的补充政策，页面会自动加载。
- `policy-auto-draft.js`：自动更新脚本生成的候选草稿，不会被页面自动加载。

## 1. 生成候选草稿

```powershell
node tools/update-policies.mjs --draft --max=8
```

脚本会读取 `policy-update-seeds.json` 中的主题种子，到中国政府网相关搜索页抓取候选政策链接，抽取标题、日期、发文机关、摘要和链接，并按种子给出候选司局/处室。

生成结果写入：

```text
policy-auto-draft.js
```

同时会生成运行日志：

```text
policy-update-log.json
```

日志会记录每个种子词访问了哪些搜索页和栏目页、命中多少链接、去重多少条，以及网络或解析失败原因。如果日志里出现 `fetch failed`，通常表示当前运行环境无法访问外网；换到可联网环境运行同一命令即可。

## 2. 人工审核归口

逐条检查 `policy-auto-draft.js`。只有审核通过的候选才应复制或合并到 `policy-supplement.js`：

- `title` 是否为具体政策文件。
- `url` 是否为国务院政策库、部委官网或官方 PDF。
- `topic` 是否对应正确司局。
- `secondary` 是否对应正确处室或业务处室。
- `agency` 是否与发文机关一致。
- `reviewStatus` 审核后可改为 `已审核`。

司局处室口径以页面“机构分类依据”中的官方链接为准。

## 3. 审核旧数据规则归口

旧基础库中仍有一批政策由规则自动归口。可运行：

```powershell
node tools/generate-assignment-audit.mjs
```

生成：

```text
policy-assignment-audit.csv
```

该表列出所有 `规则归口` 文件，并预留“审核状态、建议司局、建议处室”字段。审核后可把确认无误的归口补写到 `policy-supplement.js` 或后续拆分出的人工归口表中。

## 4. 合并进补充库

审核无误后，可手工复制到 `policy-supplement.js`，或运行：

```powershell
node tools/update-policies.mjs --apply --max=8
```

建议先使用 `--draft`，确认无误后再合并。合并后刷新 `index.html`，页面会自动去重并重新归口。

## 5. 关键词连续性研究

页面中的“关键词连续性”模块会在完整政策库中搜索标题、摘要、关键词、发文机关、司局和处室。

例如输入：

- `护理`
- `医保目录`
- `医养结合`
- `基层`
- `飞行检查`

即可看到对应文件在 2016-2026 年之间的数量变化、归口处室分布和具体政策清单。
