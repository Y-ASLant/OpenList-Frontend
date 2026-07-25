# ASLant 前端自定义改动清单

> 基于 `main` vs `ASLantCloud-Web` 分支对比，记录所有视觉/UI 相关自定义改动。
> 目标：基于官方 main 分支重新应用这些自定义。

---

## 一、纯样式/布局调整（13 项）

### 1. MiSans 字体
- **文件**: `src/app/theme.ts`
- **内容**: 字体栈首位加入 `"MiSans VF"`

### 2. 登录页气泡背景
- **文件**: `src/pages/login/LoginBg.tsx`
- **内容**: 删除 `CornerTop`/`CornerBottom` 组件，改为大气泡+小气泡的渐变装饰背景

### 3. 首页面包屑高亮
- **文件**: `src/pages/home/Nav.tsx`
- **内容**: 第一个面包屑项使用 `getMainColor()` 着色 + 半透明背景 `changeColor(getMainColor(), { alpha: 0.15 })`

### 4. Header logo 可点击
- **文件**: `src/pages/home/header/Header.tsx`
- **内容**:
  - 点击 logo 跳转：访客 → 登录页，已登录 → 管理页
  - 增加 `pt="$6"` 上间距
  - 添加 `cursor="pointer"`

### 5. Sidebar 拼写
- **文件**: `src/pages/home/Sidebar.tsx`
- **内容**: `SidebarPanel` → `SidebarPannel`（typo，但保持自定义一致性）

### 6. 管理页 Header 改版
- **文件**: `src/pages/manage/Header.tsx`
- **内容**:
  - 标题字号 `xl` → `2xl`
  - 语言/主题切换按钮改为独立 `IconButton`（不再嵌套在 `Center` 里）
  - 使用 `IoLanguageOutline` + `FiSun`/`FiMoon` 图标
  - 间距 `$1` → `$2`

### 7. 版本号只显示版本
- **文件**: `src/pages/manage/settings/SettingItem.tsx`
- **内容**: 版本信息截断 `(Commit: xxx)` 后缀，只保留版本号部分

### 8. 通知宽度修复移除
- **文件**: `src/app/index.css`
- **内容**: 删除 `.hope-notification__list { width: unset }` 修复样式

### 9. SwitchLanguage z-index
- **文件**: `src/components/SwitchLanguage.tsx`
- **内容**: z-index 从 `$notification` 改为硬编码 `9000`

### 10. 下载页重新设计
- **文件**: `src/pages/home/previews/download.tsx`
- **内容**:
  - QR 码改用 `objStore.raw_url`（302 链接）替代 `currentObjLink()`
  - 按钮布局从 `ButtonGroup attached` 改为独立按钮
  - 使用 `useUtil().copy` 替代 `useCopyLink`

### 11. 文件信息简化
- **文件**: `src/pages/home/previews/info.tsx`
- **内容**:
  - 移除驱动名称显示，只保留 `大小 · 日期`
  - 移除 `w="$full"`

### 12. 工具栏动画
- **文件**: `src/pages/home/toolbar/Center.tsx`
- **内容**: 从 `left: 50%` + `translateX(-50%)` 改为 `right: 50%` + `Motion.div` 入场动画（opacity/scale/x/y）

### 13. 本地设置抽屉改版
- **文件**: `src/pages/home/toolbar/LocalSettings.tsx`
- **内容**:
  - `DrawerCloseButton` 替换为自定义 `HStack`（语言+主题按钮）
  - `ButtonGroup` → `HStack`
  - 删除底部 `SwitchLanguageWhite` + `SwitchColorMode`
  - 使用 `IoLanguageOutline` + `FiSun`/`FiMoon` 独立图标按钮

---

## 二、功能入口删除（10 项）

### 14. 右键菜单 — "打开方式"
- **文件**: `src/pages/home/folder/context-menu.tsx`
- **内容**: 删除 "Open with" 子菜单（`openWithPreviews` 计算 + `Submenu` 渲染）

### 15. 右键菜单 — "分享"
- **文件**: `src/pages/home/folder/context-menu.tsx`
- **内容**: 删除分享菜单项（`userCan("share")` 条件的 `Item`）

### 16. 右键菜单 — "离线下载"
- **文件**: `src/pages/home/folder/context-menu.tsx`
- **内容**: 删除离线下载菜单项（`userCan("offline_download")` 条件的 `Item`）

### 17. 视频外部播放器精简
- **文件**: `src/pages/home/previews/video_box.tsx`
- **内容**: 删除 Android、PotPlayer、Vivid Player 三个外部播放器选项

### 18. 侧边栏 — "关于" 页面
- **文件**: `src/pages/manage/sidemenu_items.tsx`
- **内容**: 删除 "About" 侧边栏入口（`BsFront` 图标，`/@manage/about` 路由）

### 19. 侧边栏 — 索引页路由
- **文件**: `src/pages/manage/sidemenu_items.tsx`
- **内容**: 索引页从 `index_page` 改为直接指向 `indexes`

### 20. 分享 ID 自定义输入
- **文件**: `src/pages/manage/shares/AddOrEdit.tsx`
- **内容**: 删除分享 ID 输入框（`Item name="id"`）

### 21. 用户 LDAP 登录选项
- **文件**: `src/pages/manage/users/AddOrEdit.tsx`
- **内容**: 删除 `allow_ldap` 复选框

### 22. 123 盘临时目录设置
- **文件**: `src/pages/manage/settings/Other.tsx`
- **内容**: 删除 123 盘临时目录设置项（`123_pan_temp_dir`）

### 23. 备份恢复 — 分享备份
- **文件**: `src/pages/manage/backup-restore.tsx`
- **内容**: 删除分享的备份/恢复功能（`ShareInfo` 类型、`getShares`/`addShare`/`updateShare` 请求）

---

## 三、组件简化/重写（8 项）

### 24. 音频封面图标
- **文件**: `src/pages/home/previews/audio.tsx`
- **内容**: 默认封面从 `https://res.oplist.org/logo/logo.svg` 改为 `https://aslant.top/favicon.ico`

### 25. Flash 预览重新设计
- **文件**: `src/pages/home/previews/flash.tsx`
- **内容**:
  - 移除 `BoxWithFullScreen` 全屏包装
  - Ruffle 加载改为自定义脚本注入（先检查 `window.RufflePlayer` 是否已加载）
  - 使用 `ruffleJSPath` 替代 `rufflePath`

### 26. iframe 预览简化
- **文件**: `src/pages/home/previews/iframe.tsx`
- **内容**: 移除 `IconButton` + `Tooltip` 的"新标签打开"按钮，改为纯图标链接 + `hoverColor`

### 27. 右侧工具栏精简
- **文件**: `src/pages/home/toolbar/Right.tsx`
- **内容**:
  - 删除 `z-index="calc($modal - 1)"`
  - 刷新按钮移到顶部
  - 简化权限检查：`userCan("move")`/`"delete"`/`"rename"` 合并为 `userCan("write")`
  - 离线下载权限：移除 `objStore.write` 条件

### 28. 批量重命名精简
- **文件**: `src/pages/home/toolbar/BatchRename.tsx`
- **内容**:
  - 删除类型 3（查找替换模式）
  - 删除补零（padding zeros）选项
  - 删除正则验证 + `validateFilename` 校验和错误提示 UI

### 29. 复制/移动精简
- **文件**: `src/pages/home/toolbar/CopyMove.tsx`
- **内容**:
  - 删除 "跳过已存在"（`skipExisting`）、"合并"（`merge`）复选框
  - 删除 `CreateFolderButton`（`headerSlot`）
  - API 参数精简（移除 `skip_existing`/`merge`）

### 30. 存储管理表单简化
- **文件**: `src/pages/manage/storages/AddOrEdit.tsx`
- **内容**: 按钮布局从多按钮 `HStack`（添加/编辑/删除/导出/导入）简化为单 `Button`

### 31. Meta 编辑简化
- **文件**: `src/pages/manage/metas/AddOrEdit.tsx`
- **内容**:
  - 删除 `read_users`/`write_users` 用户权限选择器
  - `Select` 组件从 Hope-UI Select 简化为原生 HTML select
  - 删除用户列表 API 调用

---

## 四、其他 UI 相关（非纯视觉但影响显示）

| # | 改动 | 文件 | 内容 |
|---|---|---|---|
| 32 | 默认语言中文 | `src/app/i18n.ts` | `"en"` → `"zh-CN"` |
| 33 | 中文本地化 | `src/lang/zh-CN/*` | 完整 20+ JSON 翻译文件 |
| 34 | 错误消息翻译 | `src/utils/translate_error.ts` | 后端英文错误 → i18n key 映射 |
| 35 | 分享模板翻译 | `src/pages/home/toolbar/Share.tsx`, `shares/Share.tsx` | 分享摘要用翻译模板替代后端英文 |
| 36 | 索引页标题 | `indexes.tsx` | 标题从 `indexes.index_header` 改为 `manage.sidemenu.settings` |
| 37 | 设置按钮文字 | `settings/Other.tsx` | 按钮从 "保存" 改为具体操作名（"设置 Aria2"/"设置 qBittorrent"等） |
| 38 | 打包下载路径 | `PackageDownload.tsx` | `streamSaver.mitm` 从 `joinBase(...)` 改为硬编码 `/streamer/mitm.html` |
| 39 | HEIC 图片预览 | `previews/heic.tsx` | 新增 187 行 HEIC 格式预览组件 |
| 40 | 上传降级 + 密码 | `uploads/direct.ts` | 直连失败自动 fallback Stream；传递 `Password` 头 |
| 41 | hashing 状态 | `uploads/types.ts` | 新增 `"hashing"` 状态 + `warning` badge 颜色 |

---

## 迁移优先级

### 高优先（用户直接可见的核心样式）
1. MiSans 字体 (#1)
2. 登录页气泡背景 (#2)
3. 首页面包屑高亮 (#3)
4. Header logo 可点击 (#4)
5. 管理页 Header 改版 (#6)
6. 默认语言中文 (#32) + zh-CN 翻译文件 (#33)

### 中优先（功能入口和组件调整）
7. 右键菜单精简 (#14-16)
8. 右侧工具栏精简 (#27)
9. 本地设置抽屉改版 (#13)
10. 下载页重新设计 (#10)
11. 视频播放器精简 (#17)
12. 批量重命名精简 (#28)
13. 复制/移动精简 (#29)

### 低优先（可选或后续处理）
14. 版本号截断 (#7)
15. 文件信息简化 (#11)
16. 音频封面 (#24)
17. Flash 预览 (#25)
18. 其他管理页简化 (#20-23, #30-31)
