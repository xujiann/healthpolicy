# 近十年卫生健康政策脉络图

一个用于梳理 2016-2026 年卫生健康相关政策文件的静态可视化网站。

## 在线访问

[https://xujiann.github.io/healthpolicy/](https://xujiann.github.io/healthpolicy/)

## 功能

- 部委 → 司局 → 处室 → 政策文件四层导图
- 按关键词、司局、处室、年份、机关、文件类型筛选
- 关键词连续性分析，例如查看“护理”“医保目录”“医养结合”等政策变化
- 政策清单与官方链接
- 规则归口审核清单与自动补充候选流程

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

生成自动补充候选：

```powershell
node tools/update-policies.mjs --draft --max=8
```

生成规则归口审核清单：

```powershell
node tools/generate-assignment-audit.mjs
```
