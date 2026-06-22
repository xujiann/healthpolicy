# 近十年卫生健康政策脉络图

一个用于梳理 2016-2026 年卫生健康相关政策文件的静态可视化网站，已包装为“卫生健康信息平台模拟”中的政策知识库模块。

## 在线访问

[https://xujiann.github.io/healthpolicy/](https://xujiann.github.io/healthpolicy/)

## 功能

- 部委 → 司局 → 处室 → 政策文件四层导图
- 按关键词、司局、处室、年份、机关、文件类型筛选
- 关键词连续性分析，例如查看“护理”“医保目录”“医养结合”等政策变化
- 政策清单与官方链接
- 规则归口审核清单与自动补充候选流程
- GitHub Actions 每日自动抓取新增政策候选并更新网站
- 卫生健康信息平台模拟导航、数据治理状态和政策知识库模块入口

## 本地预览

直接打开：

```text
index.html
```

## GitHub Pages 部署

推送到 GitHub 仓库后，在仓库设置中启用 Pages：

1. Settings → Pages
2. Source 选择 `Deploy from a branch`
3. Branch 选择 `main`
4. Folder 选择 `/root`

启用后访问：

[https://xujiann.github.io/healthpolicy/](https://xujiann.github.io/healthpolicy/)

## 数据维护

仓库包含每日自动更新工作流：

```text
.github/workflows/daily-policy-update.yml
```

该工作流每天北京时间 01:30 运行，也可在 GitHub Actions 页面手动触发。

生成自动补充候选：

```powershell
node tools/update-policies.mjs --draft --max=8
```

生成规则归口审核清单：

```powershell
node tools/generate-assignment-audit.mjs
```
