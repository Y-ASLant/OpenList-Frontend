# ASLant 定制文档

本目录**仅记录 `ASLant` 分支相对 `main` 的差异**，作为定制清单使用。

完整改动见 **[diff-from-main.md](./diff-from-main.md)**。

## 维护原则

| 做法      | 说明                                                                   |
| --------- | ---------------------------------------------------------------------- |
| ✅ 推荐   | 在最新的 `main` 上，按 `diff-from-main.md` 逐项重新应用定制            |
| ❌ 不推荐 | 将上游 `main` merge/rebase 进 `ASLant`（冲突多，且难以融入上游新功能） |

`ASLant` 分支用于**开发与归档当前定制**；上游更新时，以 `main` 为基准重做，而不是在 `ASLant` 上同步。

## 上游更新时的流程

```bash
# 1. 更新 main 到最新上游
git checkout main
git fetch upstream
git merge upstream/main   # 或 rebase，按团队习惯

# 2. 对照 diff-from-main.md，在 main 上逐项应用定制
#    （可新开分支如 aslant-custom，完成后合并回 main）

# 3. 验证
pnpm install && pnpm lint && pnpm build

# 4. 同步更新文档
git diff main...ASLant --name-status   # 若仍在 ASLant 开发，用于核对
# 手动更新 diff-from-main.md
```

## 新增定制时

1. 在 `ASLant`（或基于 `main` 的功能分支）完成开发
2. 将改动摘要追加到 `diff-from-main.md`
3. 更新文档中的「变更文件列表」小节

## 快速对比命令

```bash
git diff main...ASLant --stat
git diff main...ASLant --name-status
```
