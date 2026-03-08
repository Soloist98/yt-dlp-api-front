# Navigation Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 将左侧垂直导航改为顶部横向导航，集成批量重试按钮，支持移动端汉堡菜单

**Architecture:** 重写 Navigation 组件为顶部固定横向布局，创建 MobileMenu 组件处理移动端菜单，将 BatchRetryButton 功能集成到 Navigation，调整页面布局适配新导航栏

**Tech Stack:** React 19, TypeScript, Framer Motion, TailwindCSS

---

## Task 1: Create MobileMenu Component

**Files:**
- Create: `src/components/MobileMenu.tsx`

**Step 1: Write the component structure**

创建移动端菜单组件，包含遮罩层和菜单面板：

```typescript
import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  currentPath: string;
  showBatchRetry?: boolean;
  onBatchRetry?: () => void;
  isBatchRetrying?: boolean;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  currentPath,
  showBatchRetry,
  onBatchRetry,
  isBatchRetrying,
}) => {
  const navItems = [
    { path: '/', label: '任务列表', icon: '📋' },
    { path: '/download', label: '新建下载', icon: '⬇️' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Menu Panel */}
          <motion.div
            className="fixed top-0 left-0 right-0 backdrop-blur-2xl bg-white/10 border-b border-white/20 z-50 p-6"
            initial={{ y: '-100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '-100%', opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {/* Close button */}
            <div className="flex justify-end mb-4">
              <button
                onClick={onClose}
                className="p-2 text-white hover:bg-white/10 rounded-xl transition-colors"
                aria-label="关闭菜单"
              >
                <span className="text-2xl">✕</span>
              </button>
            </div>

            {/* Navigation items */}
            <div className="flex flex-col gap-3">
              {navItems.map((item, index) => {
                const isActive = currentPath === item.path;

                return (
                  <Link key={item.path} to={item.path} onClick={onClose}>
                    <motion.div
                      className={`
                        px-6 py-4 rounded-2xl font-medium transition-all duration-300
                        flex items-center gap-3
                        ${isActive ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' : 'bg-white/5 hover:bg-white/10 text-white/80'}
                      `}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="text-2xl">{item.icon}</span>
                      <span>{item.label}</span>
                    </motion.div>
                  </Link>
                );
              })}

              {/* Batch retry button in mobile menu */}
              {showBatchRetry && (
                <motion.button
                  onClick={() => {
                    onBatchRetry?.();
                    onClose();
                  }}
                  disabled={isBatchRetrying}
                  className={`
                    px-6 py-4 rounded-2xl font-medium transition-all duration-300
                    flex items-center gap-3
                    ${isBatchRetrying ? 'bg-white/5 opacity-70 cursor-not-allowed' : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:opacity-90'}
                  `}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navItems.length * 0.1, duration: 0.3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.span
                    className="text-2xl"
                    animate={isBatchRetrying ? { rotate: 360 } : {}}
                    transition={isBatchRetrying ? { duration: 1, repeat: Infinity, ease: 'linear' } : {}}
                  >
                    🔄
                  </motion.span>
                  <span>{isBatchRetrying ? '正在重试...' : '批量重试失败任务'}</span>
                </motion.button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
```

**Step 2: Verify file creation**

Run: `ls -la src/components/MobileMenu.tsx`
Expected: File exists

**Step 3: Commit**

```bash
git add src/components/MobileMenu.tsx
git commit -m "[type]: feat [description]:创建移动端菜单组件

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 2: Rewrite Navigationomponent

**Files:**
- Modify: `src/components/Navigation.tsx` (complete rewrite)

**Step 1: Backup old Navigation**

Run: `cp src/components/Navigation.tsx src/components/Navigation.tsx.backup`

**Step 2: Write new horizontal Navigation component**

完全重写 Navigation 组件为顶部横向布局：

```typescript
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MobileMenu } from './MobileMenu';

interface NavigationProps {
  showBatchRetry?: boolean;
  onBatchRetry?: () => void;
  isBatchRetrying?: boolean;
}

/**
 * Top horizontal navigation with glassmorphism
 * Mobile: hamburger menu
 * Desktop: horizontal nav items with batch retry button
 */
export const Navigation: React.FC<NavigationProps> = ({
  showBatchRetry = false,
  onBatchRetry,
  isBatchRetrying = false,
}) => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: '任务列表', icon: '📋' },
    { path: '/download', label: '新建下载', icon: '⬇️' },
  ];

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 h-16 md:h-20 px-6 md:px-12 backdrop-blur-xl bg-white/5 border-b border-white/10 shadow-lg z-50"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="h-full max-w-7xl mx-auto flex items-center justify-between">
          {/* Mobile: Hamburger menu */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="md:hidden p-2 text-white hover:bg-white/10 rounded-xl transition-colors"
            aria-label="菜单"
            aria-expanded={isMenuOpen}
          >
            <span className="text-2xl">☰</span>
          </button>

          {/* Mobile: App title */}
          <div className="md:hidden text-white font-semibold text-lg">
            视频下载
          </div>

          {/* Desktop: Navigation items */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;

              return (
                <Link key={item.path} to={item.path}>
                  <motion.div
                    className={`
                      relative px-6 py-3 rounded-xl font-medium text-base transition-all duration-300
                      flex items-centn                      ${isActive ? 'text-white' : 'text-white/60 hover:text-white/80 hover:bg-white/10'}
                    `}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl"
                        layoutId="activeTab"
                        transition={{
                          type: 'spring',
                          stiffness: 500,
                          damping: 30,
                        }}
                  />
                    )}
                    <span className="relative z-10 text-xl">{item.icon}</span>
                    <span className="relative z-10">{item.label}</span>
                  </motion.div>
                </Link>
              );
            })}
          </div>

          {/* Desktop: Batch retry button */}
          {showBatchRetry && (
            <motion.button
              onClick={onBatchRetry}
              disabled={isBatchRetrying}
              className={`
                hidden md:flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300
                ${isBatchRetrying ? 'bg-white/5 opacity-70 cursor-not-allowed' : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:opacity-90 hover:scale-105'}
              `}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.span
                className="text-lg"
                animate={isBatchRetrying ? { rotate: 360 } : {}}
                transition={isBatchRetrying ? { duration: 1, repeat: Infinity, ease: 'linear' } : {}}
              >
                🔄
              </motion.span>
              <span>{isBatchRetrying ? '正在重试...' : '批量重试'}</span>
            </motion.button>
          )}

          {/* Mobile: Spacer for symmetry */}
          <div className="md:hidden w-10" />
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <MobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        currentPath={location.pathname}
        showBatchRetry={showBatchRetry}
        onBatchRetry={onBatchRetry}
        isBatchRetrying={isBatchRetrying}
      />
    </>
  );
};
```

**Step 3: Verify component compiles**

Run: `cd D:/workplace/ad/yt-dlp-api-front && npm run build`
Expected: Build succeeds without TypeScript errors

**Step 4: Commit**

```bash
git add src/components/Navigation.tsx
git commit -m "[type]: refactor [description]:重写导航组件为顶部横向布局

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 3: Update HomePage Layout and Props

**Files:**
- Modify: `src/pages/HomePage.tsx:92-93,11-28`

**Step 1: Update padding and add Navigation props**

修改 HomePage 的布局和传递批量重试 props：

```typescript
// Line 92-93: Change padding
<div className="min-h-screen pt-24 md:pt-28 p-6 md:p-12">
```

```typescript
// Line 11-28: Add Navigation import and props
import { Navigation } from '../components/Navigation';

export const HomePage: React.FC = () => {
  const [filters, setFilters] = useState<TaskFilters>({
    page: 1,
    page_size: 20,
    order: 'desc',
  });
  const [activeFilter, setActiveFilter] = useState<TaskFilters['status'] | 'all'>('all');
  const {
    tasks,
    pagination,
    isLoading,
    isFetching,
    refetch,
    retryTask,
    isRetrying,
    batchRetryTasks,
    isBatchRetrying,
  } = useTasks(filters);

  const showBatchRetry = activeFilter === 'failed' && tasks.leng```

**Step 2: Add Navigation component with props**

在 return 语句开始处添加 Navigation：

```typescript
return (
  <>
    <Navigation
      showBatchRetry={showBatchRetry}
      onBatchRetry={() => handleBatchRetry(tasks)}
      isBatchRetrying={isBatchRetrying}
    />
    <div className="min-h-screen pt-24 md:pt-28 p-6 md:p-12">
      <Toaster />
      {/* rest of the component */}
    </div>
  </>
);
```

**Step 3: Remove BatchRetryButton from TaskList**

修改 TaskList 组件调用，移除 BatchRetryButton 相关逻辑（因为已集成到 Navigation）：

在 `src/components/TaskList.tsx` 中删除第 48-55 行的 BatchRetryButton 渲染。

**Stechanges**

Run: `cd D:/workplace/ad/yt-dlp-api-front && npm run build`
Expected: Build succeeds

**Step 5: Commit**

```bash
git add src/pages/HomePage.tsx src/components/TaskList.tsx
git commit -m "[type]: refactor [description]:更新 HomePage 布局并集成导航栏批量重试

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 4: Update DownloadPage Layout

**Files:**
- Modify: `src/pages/DownloadPage.tsx:10-26`

**Step 1: Update padding and add Navigation**

修改 DownloadPage 的布局：

```typescript
// Add Navigation import at top
import { Navigation } from '../components/Navin
// Update return statement
return (
  <>
    <Navigation />
    <div className="min-h-screen pt-24 md:pt-28 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        {/* rest of the component */}
      </div>
      {/* floating decorative elements */}
    </div>
  </>
);
```

**Step 2: Verify changes**

Run: `cd D:/workplace/ad/yt-dlp-api-front && npm run build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add src/pages/DownloadPage.tsx
git commit -m "[type]: refactor [description]:更新 DownloadPage 布局适配新导航栏

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---k 5: Update App.tsx

**Files:**
- Modify: `src/App.tsx:20-32`

**Step 1: Remove Navigation from App.tsx**

由于 Navigation 现在在各个页面中单独渲染（以便传递不同的 props），从 App.tsx 中移除：

```typescript
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/download" element={<DownloadPage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
```

**Step 2: Remove Navigation import**

删除第 4 行的 Navigation 导入：

```typescript
// Rthis line:
// import { Navigation } components/Navigation';
```

**Step 3: Verify changes**

Run: `cd D:/workplace/ad/yt-dlp-api-front && npm run build`
Expected: Build succeeds

**Step 4: Commit**

```bash
git add src/App.tsx
git commit -m "[type]: refactor [description]:从 App.tsx 移除全局导航组件

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 6: Delete BatchRetryButton Component

**Files:**
- Delete: `src/components/BatchRetryButton.tsx`

**Step 1: Remove BatchRetryButton import from TaskList**

在 `src/components/TaskList.tsx` 中删除第 6 行的导入：

```typescript
// Remove this line:
// import { BatchRetryButton } from './tryButton';
```

**Step 2: Delete the file**

Run: `rm src/components/BatchRetryButton.tsx`

**Step 3: Verify no references remain**

Run: `cd D:/workplace/ad/yt-dlp-api-front && grep -r "BatchRetryButton" src/`
Expected: No results (all references removed)

**Step 4: Verify build**

Run: `cd D:/workplace/ad/yt-dlp-api-front && npm run build`
Expected: Build succeeds

**Step 5: Commit**

```bash
git add src/components/BatchRetryButton.tsx src/components/TaskList.tsx
git commit -m "[type]: refactor [description]:删除独立的 BatchRetryButton 组件

Co-Authored-By: Clapus 4.6 <noreply@anthropic.com>"
```

---

## Task 7: Test Responsive Behavior

**Files:**
- Test: All modified components

**Step 1: Start development server**

Run: `cd D:/workplace/ad/yt-dlp-api-front && npm start`
Expected: Server starts on http://localhost:8002

**Step 2: Test desktop layout (≥768px)**

Manual test checklist:
- [ ] 顶部导航栏显示正确（横向布局）
- [ ] 导航项 hover 效果正常（缩放，无右移）
- [ ] 活动状态指示器滑动流畅
- [ ] 在失败任务页面显示批量重试按钮
- [ ] 批量重试按钮功能正常
- [ ] 页面内容不被导航栏遮挡

**Step 3: Test mobile layout (<768px)**

Manual test checklist:
- [ ] 汉堡菜单图标显示
- [ ] 点击汉堡菜单展开菜单面板
- [ ] 菜单项垂直排列
- [ ] 点击菜单项导航正常并自动关闭菜单
- [ ] 点击遮罩层关闭菜单
- [ ] 在失败任务页面菜单中显示批量重试按钮
- [ ] 批量重试功能正常
- [ ] 页面内容不被导航栏遮挡

**Step 4: Test animations**

Manual test checklist:
- [ ] 导航栏初始加载动画流畅
- [ ] 移动端菜单展开/收起动画流畅
- [ ] 菜单项依次出现动画正常
- [ ] 批量重试按钮加载状态旋转动画正常

**Step 5: Test accessibility**

Manual test checklist:
- [ ] 键盘导航正常（Tab、Enter）
- [ ] Escape 键关闭移动端菜单
- [ ] aria-label 和 aria-expanded 属性正确
- [ ] 语义化标签使用正确

**Step 6: Document test results**

Create test report if any issues found, otherwise proceed to final commit.

---

## Task 8: Final Verification and Cleanup

**Files:**
- Verify: All modified files
- Delete: `src/compoNavigation.tsx.backup`

**Step 1: Run full build**

Run: `cd D:/workplace/ad/yt-dlp-api-front && npm run build`
Expected: Build succeeds with no errors or warnings

**Step 2: Run tests (if available)**

Run: `cd D:/workplace/ad/yt-dlp-api-front && npm test -- --watchAll=false`
Expected: All tests pass

**Step 3: Delete backup file**

Run: `rm src/components/Navigation.tsx.backup`

**Step 4: Final commit**

```bash
git add -A
git commit -m "[type]: feat [description]:完成导航栏重设计，支持顶部横向布局和移动端汉堡菜单

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

**Step 5: Verify git status**

Run: `git status`
Expected: Wore clean

---

## Summary

**Modified Files:**
- ✅ Created: `src/components/MobileMenu.tsx`
- ✅ Rewritten: `src/components/Navigation.tsx`
- ✅ Updated: `src/pages/HomePage.tsx`
- ✅ Updated: `src/pages/DownloadPage.tsx`
- ✅ Updated: `src/App.tsx`
- ✅ Updated: `src/components/TaskList.tsx`
- ✅ Deleted: `src/components/BatchRetryButton.tsx`

**Key Changes:**
1. 导航栏从左侧垂直改为顶部横向
2. 移动端使用汉堡菜单
3. 批量重试按钮集成到导航栏
4. 页面布局调整适配新导航栏
5. 移除布局抖动问题
6. 保持 Liquid Design 美学风格

**Testing:**
- 桌面端响应式测试
- 移动端响应式测试
- 动画流畅性测试
- 可访问性测试
- 功能完整性测试
