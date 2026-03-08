# 导航栏重设计方案

**日期：** 2026-03-08
**状态：** 已批准
**设计者：** Claude Code

## 问题概述

当前前端应用存在以下三个主要问题：

1. **左侧导航栏自动右移**：Navigation 组件在 hover 时有 `x: 5` 的右移动画，导致布局抖动
2. **移动端菜单遮挡内容**：左侧固定导航栏和右侧批量重试按钮在手机端会遮挡卡片内容
3. **批量重试按钮不美观**：右侧竖排文字的批量重试按钮视觉效果不佳

## 设计目标

- 将左侧垂直导航改为顶部横向导航
- 批量重试按钮集成到导航栏
- 移动端使用汉堡菜单，避免遮挡内容
- 保持 Liquid Design 玻璃态美学风格

## 设计方案

### 方案选择

**选定方案：顶部固定导航栏 + 集成批量重试**

理由：
- 符合现代 Web 应用设计规范
- 手机端体验最好，汉堡菜单是成熟方案
- 批量重试集成到导航栏，既统一又不突兀
- 页面布局更合理，内容区域更宽

## 详细设计

### 1. 组件架构

#### 新的 Navigation 组件结构

**桌面端（≥768px）：**
- 顶部固定导航栏，高度 80px
- 左侧：Logo 或应用名称（可选）
- 中间：导航项（任务列表、新建下载），横向排列，带图标和文字
- 右侧：批量重试按钮（仅在失败任务页面且有失败任务时显示）
- 使用玻璃态效果：`backdrop-blur-xl bg-white/5 border-b border-white/10`

**移动端（<768px）：**
- 顶部固定导航栏，高度 64px
- 左侧：汉堡菜单图标（☰）
- 中间：应用标题
- 右侧：批量重试按钮（集成到汉堡菜单内，推荐）
- 点击汉堡菜单展开全屏/半屏菜单，显示导航项

#### 组件拆分

1. **Navigation.tsx** - 主导航组件
   - 负责桌面端和移动端的布局切换
   - 管理移动端菜单的展开/收起状态
   - 接收 `showBatchRetry` 和 `onBatchRetry` props

2. **MobileMenu.tsx**（新建）- 移动端菜单
   - 全屏或半屏覆盖层
   - 导航项垂直排列
   - 带进入/退出动画

#### 页面布局调整

- 移除 `HomePage` 和 `DownloadPage` 的 `md:pl-32` padding
- 改为 `pt-24 md:pt-28`（为顶部导航栏留出空间）
- 内容区域使用 `max-w-7xl mx-auto px-6`

### 2. 数据流与状态管理

#### 批量重试按钮的显示逻辑

**在 HomePage 中：**
1. 通过 `activeFilter` 状态判断当前是否在查看失败任务
2. 通过 `tasks` 数组判断当前页是否有失败任务
3. 将 `showBatchRetry`、`onBatchRetry`、`isBatchRetrying` 传递给 Navigation 组件

**条件显示：**
```typescript
showBatchRetry = activeFilter === 'failed' && tasks.length > 0
```

#### Navigation 组件的 Props 接口

```typescript
interface NavigationProps {
  showBatchRetry?: boolean;
  onBatchRetry?: () => void;
  isBatchRetrying?: boolean;
}
```

#### 移动端菜单状态

- 使用 `useState` 管理 `isMenuOpen` 状态
- 点击汉堡图标切换状态
- 点击菜单项或遮罩层自动关闭菜单
- 使用 `framer-motion` 的 `AnimatePresence` 处理进入/退出动画

#### 响应式断点

- 使用 Tailwind 的 `md:` 断点（768px）
- 桌面端：`hidden md:flex`（横向导航）
- 移动端：`md:hidden`（汉堡菜单## 3. 动画与交互效果

#### 导航栏动画

**初始加载：**
- 从顶部滑入：`initial={{ y: -100, opacity: 0 }}` → `animate={{ y: 0, opacity: 1 }}`
- 持续时间：0.6s，使用 `ease: [0.16, 1, 0.3, 1]` 缓动

**导航项 hover 效果：**
- 轻微缩放：`whileHover={{ scale: 1.05 }}`
- 背景变亮：`hover:bg-white/10`
- **移除之前的 `x: 5` 右移**，避免布局抖动

**活动状态指示器：**
- 使用 `layoutId="activeTab"` 实现流畅的滑动效果
- 渐变背景：`from-blue-500 to-purple-500`
- Spring 动画：`stiffness: 500, damping: 30`

#### 移动端菜单动画

**遮罩层：**
- 淡入淡出：`initial={{ opacity: 0 }}` → `animate={{ opacity: 1 }}`
- 背景：`bg-black/60 backdrop-blur-sm`

**菜单面板：**
- 从顶部滑入：`initial={{ y: -100%, opacity: 0 }}` → `animate={{ y: 0, opacity: 1 }}`
- 持续时间：0.3s

**菜单项：**
- 依次出现：使用 `delay: index * 0.1`
- 点击时缩放反馈：`whileTap={{ scale: 0.95 }}`

#### 批量重试按钮

**桌面端：**
- 位置：导航栏右侧，与导航项对齐
- 样式：玻璃态按钮，带图标和文字
- 加载状态：图标旋转动画 `animate={{ rotate: 360 }}`

**移动端：**
- 集成到汉堡菜单内（推荐）

### 4. 样式规范与细节

#### 导航栏样式

**桌面端：**
- 高度：`h-20`（80px）
- 内边距：`px-6 md:px-12`
- 玻璃态：`backdrop-blur-xl bg-white/5 border-b border-white/10`
- 阴影：`shadow-lg`
- z-index：`z-50`

**导航项：**
- 间距：`gap-2`（导航项之间）
- 内边距：`px-6 py-3`
- 圆角：`rounded-xl`
- 字体：`font-medium text-base`
- 图标大小：`text-xl`

**批量重试按钮：**
- 内边距：`px-5 py-2.5`
- 圆角：`rounded-xl`
- 渐变背景：`bg-gradient-to-r from-orange-500 to-red-500`
- 文字：`text-white font-medium text-sm`
- 图标：`text-lg`

#### 移动端菜单样式

**汉堡图标：**
- 大小：`w-6 h-6`
- 颜色：`text-white`
- 点击区域：`p-2`（增大可点击区域）

**菜单面板：**
- 背景：`backdrop-blur-2xl bg-white/10 border-b border-white/20`
- 内边距：`p-6`
- 导航项垂直排列：`flex-col gap-3`

**菜单项：**
- 内边距：`px-6 py-4`
- 圆角：`rounded-2xl`
- 图标和文字横向排列：`flex items-center gap-3`

#### 响应式调整

**断点策略：**
- `< 768px`：移动端布局（汉堡菜单）
- `≥ 768px`：桌面端布局（横向导航）

**批量重试按钮在移动端：**
- 集成到汉堡菜单内（推荐）

#### 可访问性

- 汉堡菜单按钮添加 `aria-label="菜单"`
- 菜单展开时添加 `aria-expanded="true"`
- 使用语义化标签：`<nav>`、`<button>`
- 支持键盘导航（Tab、Enter、Escape）

## 实现清单

### 需要修改的文件

1. **src/components/Navigation.tsx** - 重写为顶部横向导航
2. **src/components/MobileMenu.tsx** - 新建移动端菜单组件
3. **src/components/BatchRetryButton.tsx** - 删除（功能集成到 Navigation）
4. **src/pages/HomePage.tsx** - 调整布局和传递 props
5. **src/pages/DownloadPage.tsx** - 调整布局
6. **src/App.tsx** - 移除独立的 Navigation 组件调用

### 实现步骤

1. 创建新的 Navigation 组件（顶部横向布局）
2. 创建 MobileMenu 组件
3. 修改 HomePage 传递批量重试相关 props
4. 修改 DownloadPage 和 HomePage 的 padding
5. 删除旧的 BatchRetryButton 组件
6. 测试桌面端和移动端响应式效果
7. 测试批量重试功能

## 预期效果

- ✅ 解决导航栏右移抖动问题
- ✅ 移动端不再遮挡内容
- ✅ 批量重试按钮更美观、更统一
- ✅ 保持 Liquid Design 美学风格
- ✅ 提升整体用户体验

## 风险与注意事项

1. **布局调整影响范围**：需要同时修改多个页面组件的 padding
2. **移动端测试**：需要在真实移动设备或模拟器上测试汉堡菜单
3. **动画性能**：确保动画在低端设备上流畅运行
4. **可访问性**：确保键盘导航和屏幕阅读器支持

## 后续优化

- 考虑添加应用 Logo
- 考虑添加用户头像/设置入口
- 考虑添加主题切换功能
