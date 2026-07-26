# ASLant vs main 差异清单

> 基准：`main` → `ASLant`  
> 最后更新：2026-07-26  
> 用途：在最新 `main` 上按本文档重新应用定制，**不要**将上游 merge 进 `ASLant`。

---

## 变更文件列表

```
M  src/app/i18n.ts
M  src/components/Markdown.tsx
M  src/components/Paginator.tsx
M  src/lang/en/global.json
M  src/lang/en/home.json
M  src/lang/en/manage.json
A  src/lang/zh-CN/**                    # 17 个文件（完整中文语言包）
M  src/pages/home/Footer.tsx
M  src/pages/home/Layout.tsx
M  src/pages/home/header/Header.tsx
M  src/pages/home/previews/*.tsx        # 见 §11
M  src/pages/login/LoginBg.tsx
M  src/pages/login/index.tsx
M  src/pages/manage/Dashboard.tsx
M  src/pages/manage/Header.tsx
M  src/pages/manage/sidemenu_items.tsx
M  src/pages/manage/storages/AddOrEdit.tsx
A  src/utils/translate_error.ts
M  src/utils/handle_resp.ts
```

生成命令：`git diff main...ASLant --name-status`

---

## 一、UI / 交互

### 1. 登录页背景

- **文件**：`src/pages/login/LoginBg.tsx`
- **改动**：移除 `CornerTop` / `CornerBottom`，改为渐变气泡背景；`zIndex` 改为 `-1`

### 2. 登录页布局精简

- **文件**：`src/pages/login/index.tsx`
- **改动**：
  - 移除「登录到 xxx」，Logo 居中
  - 页面标题仅 `site_title`
  - 移除「忘记密码？」

### 3. 主站 Header Logo 跳转

- **文件**：`src/pages/home/header/Header.tsx`
- **改动**：点击 Logo → 访客 `/@login`，已登录 `/@manage`；`cursor="pointer"`、`pt="$6"`

### 4. 主界面底部 Footer（访问量 + ICP 备案）

- **文件**：`src/pages/home/Footer.tsx`、`src/pages/home/Layout.tsx`
- **改动**（来自 `ASLantCloud-Web`）：
  - 访问量统计改用 [Vercount](https://vercount.one)（`events.vercount.one/js`）
  - ICP 备案号从站点设置 `site_icp` 读取（管理 → 设置 → 站点）；留空则不显示
  - 需配合后端新增 `site_icp` 设置项（见 OpenList `internal/bootstrap/data/setting.go`）

### 5. 管理页侧栏精简

- **文件**：`src/pages/manage/sidemenu_items.tsx`
- **改动**：移除「关于信息」（`/@manage/about`）、「帮助文档」（`doc.oplist.org`）

### 6. 管理页标题跳转 API 文档

- **文件**：`src/pages/manage/Header.tsx`
- **改动**：点击标题在新标签打开 `https://api.oplist.org/`（含移动端抽屉标题）

---

## 二、国际化（i18n）

### 7. 默认语言

- **文件**：`src/app/i18n.ts`
- **改动**：回退语言 `"en"` → `"zh-CN"`

### 8. 简体中文语言包

- **目录**：`src/lang/zh-CN/`（`entry.ts` + 16 个 JSON）

### 9. 英文语言包补充

- **文件**：`src/lang/en/global.json`、`home.json`、`manage.json`
- **改动**：`errors.*`、`home.preview.*`、`manage.dashboard`

### 10. 后端错误翻译

- **文件**：`src/utils/translate_error.ts`（新增）、`src/utils/handle_resp.ts`、`src/utils/notify.tsx`
- **改动**：
  - `handleResp` / `notify.error` 错误经 `translateError()` 输出 i18n 文案
  - 映射表与 OpenList 后端（`internal/model/user.go`、`internal/errs/`、`server/handles/`）对齐

### 11. 硬编码英文 → i18n

| 文件                                       | 内容                     |
| ------------------------------------------ | ------------------------ |
| `src/components/Markdown.tsx`              | Mermaid 加载失败         |
| `src/components/Paginator.tsx`             | Previous / Next          |
| `src/pages/home/previews/aliyun_video.tsx` | 播放器 tooltip、转码错误 |
| `src/pages/home/previews/video.tsx`        | 播放器 tooltip           |
| `src/pages/home/previews/video_box.tsx`    | Show all players         |
| `src/pages/home/previews/doc.tsx`          | Zoom In/Out              |
| `src/pages/home/previews/ppt.tsx`          | Zoom In/Out              |
| `src/pages/home/previews/image.tsx`        | 图片查看器 tooltip       |
| `src/pages/home/previews/iframe.tsx`       | Open in new tab          |
| `src/pages/home/previews/download.tsx`     | QR Code                  |
| `src/pages/home/previews/text-editor.tsx`  | Search language          |
| `src/pages/manage/Dashboard.tsx`           | Dashboard 标题           |
| `src/pages/manage/storages/AddOrEdit.tsx`  | Invalid storage format   |

---

## 三、替换文件

| 文件                        | 说明                                            |
| --------------------------- | ----------------------------------------------- |
| `src/pages/home/Footer.tsx` | 由 OpenList 官方底栏替换为访问量 + ICP 备案底栏 |

---

## 四、应用时注意（高发改动文件）

在最新 `main` 上重做时，以下文件最易与上游改动重叠，需对照上游 diff 手动合并：

1. `src/lang/en/home.json`、`global.json`
2. `src/pages/login/index.tsx`
3. `src/pages/home/header/Header.tsx`
4. `src/pages/manage/sidemenu_items.tsx`、`Header.tsx`
5. `src/pages/home/previews/*.tsx`
6. `src/components/Markdown.tsx`

---

## 五、验证清单

- [ ] 登录页：Logo 居中、无「登录到」、无忘记密码、气泡背景
- [ ] 主界面：底部显示访问量与 ICP 备案，Logo 可跳转管理
- [ ] 管理页：无「关于」「帮助文档」，标题打开 `api.oplist.org`
- [ ] 默认语言中文（清除 `localStorage.lang` 后验证）
- [ ] 后端错误显示中文
- [ ] 预览器 tooltip 中文
- [ ] `pnpm lint` / `pnpm build` 通过
